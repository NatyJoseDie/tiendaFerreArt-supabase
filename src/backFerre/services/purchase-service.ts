import { supabase } from '@/backFerre/config/supabase';

export class PurchaseService {
  async registrarCompra({ fecha, proveedor, productos, observaciones }: any) {
    const { data: compra, error: compraError } = await supabase
      .from('purchases')
      .insert([{ fecha, proveedor, observaciones }])
      .select()
      .single();
    if (compraError) throw compraError;
    let total = 0;
    for (const item of productos) {
      const { codigo, cantidad, costo_unitario } = item;
      const { data: producto, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('codigo', codigo)
        .single();
      if (!producto) continue;
      const nuevoStock = (producto.stock || 0) + cantidad;
      await supabase
        .from('products')
        .update({ stock: nuevoStock, precio_compra: costo_unitario })
        .eq('id', producto.id);
      await supabase
        .from('purchase_items')
        .insert([{ purchase_id: compra.id, product_id: producto.id, cantidad, costo_unitario }]);
      total += cantidad * costo_unitario;
    }
    await supabase.from('purchases').update({ total }).eq('id', compra.id);
    return compra;
  }
}

export const purchaseService = new PurchaseService();
