// services/templates/buildOrderHtml.ts

type Pedido = {
  cliente: {
    nombre: string;
    email: string;
  };
  productos: {
    nombre: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  total: number;
};

export function buildOrderHtml(pedido: Pedido): string {
  const itemsHtml = pedido.productos
    .map(
      (p) => `
      <tr>
        <td>${p.nombre}</td>
        <td style="text-align:center;">${p.cantidad}</td>
        <td style="text-align:right;">$${p.precioUnitario}</td>
        <td style="text-align:right;">$${p.cantidad * p.precioUnitario}</td>
      </tr>`
    )
    .join('');

  return `
    <div style="font-family:sans-serif; padding:20px;">
      <h2>¡Hola ${pedido.cliente.nombre}!</h2>
      <p>Gracias por tu pedido. A continuación, el detalle:</p>

      <table style="width:100%; border-collapse:collapse; margin-top:15px;">
        <thead>
          <tr>
            <th style="text-align:left;">Producto</th>
            <th>Cant.</th>
            <th style="text-align:right;">Precio</th>
            <th style="text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align:right; font-weight:bold;">Total:</td>
            <td style="text-align:right; font-weight:bold;">$${pedido.total}</td>
          </tr>
        </tfoot>
      </table>

      <p style="margin-top:20px;">Nos pondremos en contacto contigo para coordinar el envío.</p>

      <hr style="margin:30px 0;">
      <p style="font-size:12px; color:#777;">FerreArt - Tu tienda de confianza</p>
    </div>
  `;
}
