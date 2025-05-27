
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserFromLocalStorage, type User } from '@/lib/authUtils';
import { useEffect, useState } from 'react';
import { AlertCircle, BarChart, Settings, ShoppingBag, DollarSign, Camera, TrendingUp, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllProducts, type Product } from '@/data/mock-products'; // For fallback
import { Skeleton } from '@/components/ui/skeleton';

// Define a minimal type for the sales data we expect from localStorage
interface SaleEntry {
  salePrice: number;
  quantity: number;
  // We might need other fields if we were to filter by date for "Ventas del Mes"
  // saleDate: string; 
}

export default function DashboardHomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProductsCount, setActiveProductsCount] = useState<number>(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState<number>(0);

  useEffect(() => {
    const currentUser = getUserFromLocalStorage();
    setUser(currentUser);

    // Load product count
    try {
      const masterProductListString = localStorage.getItem('masterProductList');
      if (masterProductListString) {
        const masterProductList = JSON.parse(masterProductListString) as Product[];
        setActiveProductsCount(masterProductList.length);
      } else {
        // Fallback if no list in localStorage yet
        setActiveProductsCount(getAllProducts().length); 
      }
    } catch (error) {
      console.error("Error loading masterProductList from localStorage:", error);
      setActiveProductsCount(getAllProducts().length); // Fallback on error
    }

    // Load total sales amount
    let salesTotal = 0;
    try {
      const consumerSalesString = localStorage.getItem('shopvision_sales_consumer_final');
      if (consumerSalesString) {
        const consumerSales = JSON.parse(consumerSalesString) as SaleEntry[];
        consumerSales.forEach(sale => {
          salesTotal += (sale.salePrice || 0) * (sale.quantity || 0);
        });
      }

      const wholesaleSalesString = localStorage.getItem('shopvision_sales_wholesale');
      if (wholesaleSalesString) {
        const wholesaleSales = JSON.parse(wholesaleSalesString) as SaleEntry[];
        wholesaleSales.forEach(sale => {
          salesTotal += (sale.salePrice || 0) * (sale.quantity || 0);
        });
      }
      setTotalSalesAmount(salesTotal);
    } catch (error) {
      console.error("Error loading sales data from localStorage:", error);
      // Keep salesTotal as is or set to 0
    }
    
    setIsLoading(false);
  }, []);

  const welcomeMessage = user ? `Bienvenido de nuevo, ${user.username}!` : 'Bienvenido al Dashboard';
  const roleSpecificMessage = user?.userType === 'vendedora' 
    ? 'Aquí puedes administrar costos, catálogos y ventas.'
    : 'Consulta tus precios y catálogos asignados.';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title={<Skeleton className="h-9 w-1/2" />}
          description={<Skeleton className="h-5 w-3/4 mt-1" />}
        />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle><Skeleton className="h-7 w-1/3" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales por Ventas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
                <List className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <Card className="bg-card md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/5 mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-1/4" /></CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-44 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <CardTitle className="text-sm font-medium">Ingresos Totales por Ventas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalSalesAmount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Suma de todas las ventas registradas.</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProductsCount}</div>
              <p className="text-xs text-muted-foreground">Productos en tu lista de costos.</p>
            </CardContent>
          </Card>
          <Card className="bg-card md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div> {/* Placeholder */}
              <p className="text-xs text-muted-foreground">Nuevas alertas pendientes</p> {/* Placeholder */}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

       <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
            {user?.userType === 'vendedora' && (
              <>
                <Button variant="outline" onClick={() => router.push('/dashboard/lista-costos')}><List className="mr-2 h-4 w-4" /> Ver Productos</Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/ventas')}><TrendingUp className="mr-2 h-4 w-4" /> Registrar Venta C.Final</Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/ventas-mayoristas')}><BarChart className="mr-2 h-4 w-4" /> Registrar Venta Mayorista</Button>
              </>
            )}
             {user?.userType === 'cliente' && (
              <>
                <Button variant="outline" onClick={() => router.push('/dashboard/lista-cliente')}><DollarSign className="mr-2 h-4 w-4" /> Ver Mis Precios</Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/catalogo-cliente')}><Camera className="mr-2 h-4 w-4" /> Explorar Catálogo</Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/realizar-pedido')}><ShoppingBag className="mr-2 h-4 w-4" /> Realizar Pedido</Button>
              </>
            )}
            {/* El botón de configuración general puede quedar como placeholder o eliminarse si no hay config específica */}
            {/* <Button variant="ghost"><Settings className="mr-2 h-4 w-4" /> Configuración</Button> */}
        </CardContent>
      </Card>
    </div>
  );
}

    