
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, LayoutGrid, ShoppingCart, Info } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function VistaClientePage() {
  const { toast } = useToast();

  // Realizar Pedido ahora enlaza a la nueva página
  // const handleRealizarPedidoClick = () => {
  //   toast({
  //     title: 'Funcionalidad Pendiente',
  //     description: 'La sección para realizar pedidos aún no está implementada.',
  //   });
  // };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portal Cliente"
        description="Accede a las vistas y funcionalidades como si fueras un cliente/comercio."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Acciones del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2 text-center">
            <Link href="/dashboard/lista-cliente">
              <DollarSign className="h-8 w-8 mb-2 text-primary" />
              <span className="font-semibold">Mis Precios</span>
              <span className="text-xs text-muted-foreground">Consultar lista de precios asignada</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2 text-center">
            <Link href="/dashboard/catalogo-cliente">
              <LayoutGrid className="h-8 w-8 mb-2 text-primary" />
              <span className="font-semibold">Mi Catálogo</span>
              <span className="text-xs text-muted-foreground">Explorar productos con mi margen</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2 text-center">
            <Link href="/dashboard/realizar-pedido">
              <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
              <span className="font-semibold">Realizar Pedido</span>
              <span className="text-xs text-muted-foreground">Arma tu pedido de productos</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

       <Alert variant="default" className="mt-6">
        <Info className="h-5 w-5"/>
        <AlertTitle>Nota de Simulación</AlertTitle>
        <AlertDescription>
          Estas secciones te permiten ver cómo un cliente interactuaría con el sistema. Los datos y márgenes que configures en &quot;Mis Precios&quot; y &quot;Mi Catálogo&quot; aquí son específicos de la vista del cliente.
        </AlertDescription>
      </Alert>
    </div>
  );
}
