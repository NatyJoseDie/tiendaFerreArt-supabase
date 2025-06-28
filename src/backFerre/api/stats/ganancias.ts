import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

// Endpoint para consultar ganancias totales y por producto
export async function GET(req: NextRequest) {
  // Solo admin
  // (puedes agregar requireAuth si lo necesitas)
  // Ganancia total
  const { data: orders, error } = await supabase
    .from('orders')
    .select('ganancia, items');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  let total_ganancias = 0;
  const productos: Record<string, { codigo: string, nombre: string, ganancia: number, vendidos: number }> = {};
  for (const order of orders) {
    total_ganancias += order.ganancia || 0;
    // Sumar por producto
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        if (!item.product_id) continue;
        const key = String(item.product_id);
        if (!productos[key]) {
          // Buscar nombre y código del producto
          const { data: prod } = await supabase.from('products').select('codigo,nombre').eq('id', item.product_id).single();
          productos[key] = { codigo: prod?.codigo || '', nombre: prod?.nombre || '', ganancia: 0, vendidos: 0 };
        }
        // Ganancia por ítem = (precio de venta - precio_compra) * cantidad
        productos[key].ganancia += (item.price - (item.precio_compra || 0)) * item.quantity;
        productos[key].vendidos += item.quantity;
      }
    }
  }
  return NextResponse.json({ total_ganancias, productos: Object.values(productos) });
}
