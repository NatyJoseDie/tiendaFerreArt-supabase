import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { supabase } from '@/lib/supabase-client';

// Registrar una compra de inventario (entrada de stock)
export async function POST(req: NextRequest) {
  const user = await requireAuth(req, ['admin']);
  if (user instanceof Response) return user;
  try {
    const body = await req.json();
    const { fecha, proveedor, productos, observaciones } = body;
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json({ error: 'Debe incluir al menos un producto' }, { status: 400 });
    }

    // Crear registro de compra
    const { data: compra, error: compraError } = await supabase
      .from('purchases')
      .insert([{ fecha, proveedor, observaciones }])
      .select()
      .single();
    if (compraError) throw compraError;

    let total = 0;
    const itemsResults = [];
    for (const item of productos) {
      const { codigo, cantidad, costo_unitario } = item;
      // Buscar producto
      const { data: producto, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('codigo', codigo)
        .single();
      if (prodError || !producto) {
        itemsResults.push({ codigo, error: 'Producto no encontrado' });
        continue;
      }
      // Sumar stock y actualizar precio_compra
      const nuevoStock = (producto.stock || 0) + cantidad;
      await supabase
        .from('products')
        .update({ stock: nuevoStock, precio_compra: costo_unitario })
        .eq('id', producto.id);
      // Registrar item de compra
      await supabase
        .from('purchase_items')
        .insert([{ purchase_id: compra.id, product_id: producto.id, cantidad, costo_unitario }]);
      total += cantidad * costo_unitario;
      itemsResults.push({ codigo, cantidad, costo_unitario, nuevoStock });
    }
    // Actualiza total gastado en la compra
    await supabase.from('purchases').update({ total }).eq('id', compra.id);
    return NextResponse.json({ success: true, compra_id: compra.id, total, items: itemsResults });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error inesperado' }, { status: 500 });
  }
}

// Consultar historial de compras
export async function GET(req: NextRequest) {
  const user = await requireAuth(req, ['admin']);
  if (user instanceof Response) return user;
  const { data, error } = await supabase
    .from('purchases')
    .select('*, purchase_items(*, products(*))')
    .order('fecha', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ compras: data });
}
