
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';

export default function VentasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Ventas"
        description="Analiza el rendimiento de tus ventas y gestiona los pedidos."
      />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5 text-primary" />
            Panel de Ventas
          </CardTitle>
          <CardDescription>
            Métricas, reportes y gestión de transacciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            El contenido específico para la gestión de ventas se implementará aquí.
            Esto incluiría gráficos de ventas, listado de pedidos, detalles de transacciones,
            filtros por fecha, cliente, producto, y herramientas para la generación de reportes.
          </p>
          <div className="mt-6 p-8 border rounded-lg bg-muted/50 text-center">
            <p className="text-lg font-semibold">Próximamente: Analíticas de Ventas</p>
            <p className="text-sm text-muted-foreground">Gráficos y tablas para el seguimiento de ventas.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
