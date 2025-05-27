
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';

export default function CatalogoClientePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Catálogo (Cliente/Comercio)"
        description="Explora los productos disponibles para ti con tus precios asignados."
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5 text-primary" />
            Catálogo de Productos
          </CardTitle>
          <CardDescription>
            Navega por los productos disponibles y sus detalles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El contenido específico para la vista del catálogo del cliente/comercio se implementará aquí.
            Sería similar al catálogo público pero mostraría los precios específicos para este usuario
            y posiblemente un inventario filtrado o productos exclusivos.
          </p>
          <div className="mt-6 p-8 border rounded-lg bg-muted/50 text-center">
            <p className="text-lg font-semibold">Próximamente: Explorador de Catálogo</p>
            <p className="text-sm text-muted-foreground">Interfaz para visualizar los productos disponibles.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
