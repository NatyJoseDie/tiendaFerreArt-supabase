
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';

export default function ListaFinalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Precios para Consumidor Final"
        description="Administra los precios de venta al público de tus productos."
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary" />
            Precios Consumidor Final
          </CardTitle>
          <CardDescription>
            Estos son los precios que se mostrarán en el catálogo público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El contenido específico para la lista de precios para el consumidor final se implementará aquí.
            Esto generalmente incluirá el precio de venta estándar de cada producto,
            manejo de ofertas, promociones y la visualización de cómo aparecerán en la tienda.
          </p>
           <div className="mt-6 p-8 border rounded-lg bg-muted/50 text-center">
            <p className="text-lg font-semibold">Próximamente: Tabla de Precios Minoristas</p>
            <p className="text-sm text-muted-foreground">Aquí se gestionarán los precios para el público general.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
