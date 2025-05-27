
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export default function ListaComerciosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Precios para Comercios"
        description="Define y revisa los precios especiales para tus clientes comerciales."
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
            Precios para Comercios
          </CardTitle>
          <CardDescription>
            Aquí se configuran los precios que verán los clientes tipo 'comercio'.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El contenido específico para la lista de precios de comercios se implementará aquí.
            Esto podría incluir una tabla de productos con precios mayoristas, descuentos por volumen,
            o la capacidad de asignar listas de precios específicas a diferentes grupos de comercios.
          </p>
          <div className="mt-6 p-8 border rounded-lg bg-muted/50 text-center">
            <p className="text-lg font-semibold">Próximamente: Tabla de Precios para Comercios</p>
            <p className="text-sm text-muted-foreground">Listado de productos con precios especiales para comercios.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
