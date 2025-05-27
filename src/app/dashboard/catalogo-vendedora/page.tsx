
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';

export default function CatalogoVendedoraPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Catálogo (Vendedora)"
        description="Visualiza y gestiona la presentación de tus productos como vendedora."
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5 text-primary" />
            Vista Previa del Catálogo (Interno)
          </CardTitle>
          <CardDescription>
            Así se ve el catálogo con información relevante para la gestión interna.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El contenido específico para la vista del catálogo de la vendedora se implementará aquí.
            Esto podría incluir herramientas de edición rápida, visualización de stock,
            precios de costo junto a precios de venta, y opciones para destacar productos.
          </p>
           <div className="mt-6 p-8 border rounded-lg bg-muted/50 text-center">
            <p className="text-lg font-semibold">Próximamente: Interfaz de Gestión de Catálogo</p>
            <p className="text-sm text-muted-foreground">Herramientas para organizar y editar el catálogo.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
