import { NextRequest, NextResponse } from 'next/server';
import { OrderSchema } from '@/backFerre/types/zod-schemas';
import { orderService } from '@/backFerre/services/order-service';
import { sendOrderEmail } from '@/backFerre/services/email-service';

// Cambia este mail por el tuyo real si quieres
const ADMIN_EMAIL = 'tu-email@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = OrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    // Normalizar user_id: si no existe, poner null (para cumplir con CreateOrderDTO)
    const orderData = {
      ...parsed.data,
      user_id: parsed.data.user_id ?? null,
    };
    // Descontar stock y calcular ganancias
    const stockErrors: any[] = [];
    let totalGanancia = 0;
    for (const item of parsed.data.items) {
      // Buscar producto
      const { data: producto, error: prodError } = await orderService.supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();
      if (prodError || !producto) {
        stockErrors.push({ product_id: item.product_id, error: 'Producto no encontrado' });
        continue;
      }
      if ((producto.stock ?? 0) < item.quantity) {
        stockErrors.push({ product_id: item.product_id, error: 'Stock insuficiente', stock: producto.stock });
      }
    }
    if (stockErrors.length > 0) {
      return NextResponse.json({ error: 'Stock insuficiente en uno o más productos', stockErrors }, { status: 400 });
    }
    // Descontar stock y calcular ganancia
    for (const item of parsed.data.items) {
      const { data: producto } = await orderService.supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();
      const nuevoStock = (producto.stock ?? 0) - item.quantity;
      await orderService.supabase
        .from('products')
        .update({ stock: nuevoStock })
        .eq('id', producto.id);
      // Ganancia = (precio venta - precio_compra) * cantidad
      const precioCompra = producto.precio_compra ?? 0;
      totalGanancia += (item.price - precioCompra) * item.quantity;
    }
    // Registrar la orden incluyendo la ganancia
    const order = await orderService.createOrder({ ...orderData, ganancia: totalGanancia });

    // Plantilla HTML mejorada para el mail
    const html = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color:#1a73e8;">Nuevo pedido recibido</h2>
        <table style="border-collapse:collapse; width:100%; max-width:500px;">
          <tr><td><b>Nombre:</b></td><td>${parsed.data.nombre}</td></tr>
          <tr><td><b>Email:</b></td><td>${parsed.data.email}</td></tr>
          <tr><td><b>Teléfono:</b></td><td>${parsed.data.telefono || '-'}</td></tr>
          <tr><td><b>Dirección:</b></td><td>${parsed.data.shipping_address || '-'}</td></tr>
          <tr><td><b>Método de pago:</b></td><td>${parsed.data.payment_method}</td></tr>
          <tr><td><b>Observaciones:</b></td><td>${parsed.data.observaciones || '-'}</td></tr>
          <tr><td><b>Total:</b></td><td><b style="color:#388e3c;">$${parsed.data.total}</b></td></tr>
        </table>
        <h3 style="margin-top:24px;">Productos:</h3>
        <table style="border-collapse:collapse; width:100%; max-width:600px;">
          <thead>
            <tr style="background:#f1f1f1;">
              <th style="padding:8px; border:1px solid #ccc;">ID</th>
              <th style="padding:8px; border:1px solid #ccc;">Cantidad</th>
              <th style="padding:8px; border:1px solid #ccc;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${parsed.data.items.map((item: any) => `
              <tr>
                <td style="padding:8px; border:1px solid #ccc;">${item.product_id}</td>
                <td style="padding:8px; border:1px solid #ccc;">${item.quantity}</td>
                <td style="padding:8px; border:1px solid #ccc;">$${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top:32px; font-size:12px; color:#888;">Este es un mensaje automático generado por la tienda online.</p>
      </div>
    `;

    // Enviar mail al admin
    await sendOrderEmail({
      to: ADMIN_EMAIL,
      subject: 'Nuevo pedido recibido',
      html,
    });

    // Enviar mail de confirmación al cliente
    const clienteHtml = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color:#1a73e8;">¡Gracias por tu pedido, ${parsed.data.nombre}!</h2>
        <p>Hemos recibido tu pedido y comenzaremos a prepararlo. El proceso puede demorar hasta <b>48hs</b> dependiendo de la demanda.</p>
        <p>Te avisaremos por este mismo correo cuando tu pedido esté listo para retirar o enviar.</p>
        <h3>Resumen de tu pedido:</h3>
        <table style="border-collapse:collapse; width:100%; max-width:500px;">
          <tr><td><b>Total:</b></td><td><b style="color:#388e3c;">$${parsed.data.total}</b></td></tr>
          <tr><td><b>Método de pago:</b></td><td>${parsed.data.payment_method}</td></tr>
          <tr><td><b>Dirección:</b></td><td>${parsed.data.shipping_address || '-'}</td></tr>
        </table>
        <h4 style="margin-top:24px;">Productos:</h4>
        <ul>
          ${parsed.data.items.map((item: any) => `<li>ID: ${item.product_id} | Cantidad: ${item.quantity} | Precio: $${item.price}</li>`).join('')}
        </ul>
        <p style="margin-top:32px; font-size:12px; color:#888;">Este es un mensaje automático. Si tienes dudas, responde a este correo.</p>
      </div>
    `;
    await sendOrderEmail({
      to: parsed.data.email,
      subject: '¡Tu pedido fue recibido! | FerreArt',
      html: clienteHtml,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Listar pedidos (solo admin/reseller)
import { requireAuth } from '@/middleware/auth';
export async function GET(req: NextRequest) {
  const user = await requireAuth(req, ['admin', 'reseller']);
  if (user instanceof NextResponse) return user;
  try {
    const orders = await orderService.getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
