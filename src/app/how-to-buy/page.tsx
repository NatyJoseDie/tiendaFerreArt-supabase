
import Link from 'next/link'; // Added this line
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, ListItem } from '@/components/shared/list-utils';
import { AlertCircle, Info, Mail, Phone, ShoppingCart, Truck, PackageCheck, RotateCcw } from 'lucide-react';

export default function HowToBuyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Cómo Comprar en AB Mayorista"
        description="Sigue estos simples pasos para realizar tu compra de forma exitosa."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <ShoppingCart className="mr-3 h-6 w-6 text-primary" />
            Pasos para Realizar tu Primera Compra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <List>
            <ListItem>
              <strong>Regístrate:</strong> Haz clic en "CREAR CUENTA" (o el equivalente en nuestra web, ej: "REGISTRO MAYORISTA"), completa tus datos y genera una contraseña.
            </ListItem>
            <ListItem>
              <strong>Arma tu Carrito:</strong> Agrega todos los productos que deseas al carrito.
            </ListItem>
            <ListItem>
              <strong>Inicia la Compra:</strong> Una vez listo, haz clic en "INICIAR COMPRA" desde el carrito.
            </ListItem>
            <ListItem>
              <strong>Envío:</strong> Coloca tu código postal para ver las opciones de envío disponibles. Si tienes un CÓDIGO DE DESCUENTO, podrás colocarlo después de elegir la forma de envío.
            </ListItem>
            <ListItem>
              <strong>Datos y Pago:</strong> Completa todos los datos de envío y elige el método de pago.
            </ListItem>
            <ListItem>
              <strong>Notas Adicionales:</strong> Si tienes alguna aclaración para tu pedido, podrás agregarla en la sección "NOTAS DE PEDIDO" al finalizar.
            </ListItem>
            <ListItem>
              <strong>Confirmación:</strong> Al finalizar, recibirás un mail de confirmación. Si elegiste envío por correo, te llegará el código de seguimiento por mail.
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <PackageCheck className="mr-3 h-6 w-6 text-primary" />
            Métodos de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <List>
            <ListItem>
              <strong>Efectivo en nuestro Showroom (Florencio Varela):</strong> 10% de descuento.
            </ListItem>
            <ListItem>
              <strong>Transferencia o Depósito bancario:</strong> Sin descuento adicional. (Enviar comprobante vía WhatsApp al <a href="https://wa.me/5491139587201" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">1139587201</a> o mail a <a href="mailto:distriferreart@gmail.com" className="text-primary hover:underline">distriferreart@gmail.com</a> indicando n° de pedido).
            </ListItem>
            <ListItem>
              <strong>Mercado Pago:</strong> Hasta 3 cuotas sin interés (según promociones vigentes de Mercado Pago).
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Truck className="mr-3 h-6 w-6 text-primary" />
            Métodos de Envío
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-semibold text-foreground">REALIZAMOS ENVÍOS A TODO EL PAÍS.</p>
          <List>
            <ListItem>
              <strong>Retiro sin cargo:</strong> Puedes retirar tu pedido en nuestro showroom ubicado en Florencio Varela (coordinar previamente).
            </ListItem>
            <ListItem>
              <strong>Correo Argentino:</strong> Puede ser envío a domicilio o retiro en sucursal. El costo dependerá de la opción elegida y el domicilio.
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card className="border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-yellow-700 dark:text-yellow-400">
            <Info className="mr-3 h-6 w-6" />
            Aclaraciones Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-yellow-800 dark:text-yellow-300">
          <List variant="warning">
            <ListItem>
              Los pedidos se despachan de 24 a 72hs hábiles luego de acreditado el pago.
            </ListItem>
            <ListItem>
              Los tiempos de envío que informa el correo son estimativos. Al tercerizar los envíos, no podemos responder en el caso de que no se cumpla ese plazo.
            </ListItem>
            <ListItem>
              Una vez que el paquete llega a la sucursal o luego de una visita en el domicilio, permanece UNA SEMANA en la sucursal y luego vuelve al remitente.
            </ListItem>
            <ListItem className="font-semibold">
              EN EL CASO QUE EL PAQUETE NOS VUELVA, SE DEBE VOLVER A ABONAR EL ENVÍO.
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <RotateCcw className="mr-3 h-6 w-6 text-primary" />
            Cambios y Devoluciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            Realizamos cambios de talles o productos, siempre y cuando el producto esté en las mismas condiciones en las que fue recibido. En este caso, el envío de ida y vuelta corre a cuenta del cliente.
          </p>
          <p>
            Para más información sobre el "Botón de Arrepentimiento" y políticas de devoluciones, por favor visita nuestra sección de <Link href="/refund-policy" className="text-primary hover:underline">Políticas de Reembolso</Link>.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <AlertCircle className="mr-3 h-5 w-5 text-primary" />
            ¿Más Consultas?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Para saber más información sobre condiciones de compra, formas de pago y entregas, podés escribirnos a:</p>
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <a href="mailto:distriferreart@gmail.com" className="text-primary hover:underline">distriferreart@gmail.com</a>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <a href="https://wa.me/5491139587201" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              WhatsApp: 1139587201
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
