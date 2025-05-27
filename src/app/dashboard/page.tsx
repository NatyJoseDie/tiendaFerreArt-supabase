
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserFromLocalStorage, type User } from '@/lib/authUtils';
import { useEffect, useState } from 'react';
import { AlertCircle, BarChart, Settings, ShoppingBag, DollarSign, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardHomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUserFromLocalStorage());
  }, []);

  const welcomeMessage = user ? `Bienvenido de nuevo, ${user.username}!` : 'Bienvenido al Dashboard';
  const roleSpecificMessage = user?.userType === 'vendedora' 
    ? 'Aquí puedes administrar costos, catálogos y ventas.'
    : 'Consulta tus precios y catálogos asignados.';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={welcomeMessage}
        description={roleSpecificMessage}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Resumen Rápido</CardTitle>
          <CardDescription>Un vistazo general a tu actividad.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,345</div>
              <p className="text-xs text-muted-foreground">+5.2% desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">Listos para la venta</p>
            </CardContent>
          </Card>
          <Card className="bg-card md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Nuevas alertas pendientes</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

       <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
            {/* Example actions, content would be different based on role */}
            {user?.userType === 'vendedora' && (
              <>
                <Button variant="outline"><ShoppingBag className="mr-2 h-4 w-4" /> Ver Productos</Button>
                <Button variant="outline"><BarChart className="mr-2 h-4 w-4" /> Analíticas de Ventas</Button>
              </>
            )}
             {user?.userType === 'cliente' && (
              <>
                <Button variant="outline"><DollarSign className="mr-2 h-4 w-4" /> Ver Mis Precios</Button>
                <Button variant="outline"><Camera className="mr-2 h-4 w-4" /> Explorar Catálogo</Button>
              </>
            )}
            <Button variant="ghost"><Settings className="mr-2 h-4 w-4" /> Configuración</Button>
        </CardContent>
      </Card>
    </div>
  );
}
