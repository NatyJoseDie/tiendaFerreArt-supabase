
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function ListaClientePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Precios (Cliente/Comercio)"
        description="Consulta los precios especiales asignados a tu cuenta."
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Tu Lista de Precios
          </CardTitle>
          <CardDescription>
            Estos son los precios de los productos disponibles para ti.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El contenido específico para la lista de precios del cliente/comercio se implementará aquí.
            Esto mostraría una lista de productos con los precios que han sido configurados
            específicamente para este tipo de usuario o para este usuario en particular.
          </p>
          <div className="mt-6 p-8 border rounded-lg bg-muted/50 text-center">
            <p className="text-lg font-semibold">Próximamente: Tabla de Mis Precios</p>
            <p className="text-sm text-muted-foreground">Listado de productos con tus precios asignados.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
