
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserFromLocalStorage, type User } from '@/lib/authUtils';
import { useEffect, useState } from 'react';
import { AlertCircle, BarChart, Settings, ShoppingBag, DollarSign, Camera, TrendingUp, List, AlertTriangle } from 'lucide-react'; // Changed PackageWarning to AlertTriangle
import { Button } from '@/components/ui/button';
import { getAllProducts } from '@/data/mock-products'; 
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface SaleEntry {
  salePrice: number;
  quantity: number;
}

const LOW_STOCK_THRESHOLD_DASHBOARD = 5;

export default function DashboardHomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProductsCount, setActiveProductsCount] = useState<number>(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState<number>(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const router = useRouter(); 

  useEffect(() => {
    const currentUser = getUserFromLocalStorage();
    setUser(currentUser);

    let productsForCount: Product[] = [];
    let salesTotal = 0;
    let productsWithLowStock: Product[] = [];

    try {
      const masterProductListString = localStorage.getItem('masterProductList');
      if (masterProductListString) {
        const masterProductList = JSON.parse(masterProductListString) as Product[];
        productsForCount = masterProductList;
        productsWithLowStock = masterProductList.filter(p => p.stock <= LOW_STOCK_THRESHOLD_DASHBOARD);
      } else {
        productsForCount = getAllProducts();
        productsWithLowStock = productsForCount.filter(p => p.stock <= LOW_STOCK_THRESHOLD_DASHBOARD);
      }
      setActiveProductsCount(productsForCount.length);
      setLowStockProducts(productsWithLowStock);
    } catch (error) {
      console.error("Error loading masterProductList from localStorage:", error);
      const fallbackProducts = getAllProducts();
      setActiveProductsCount(fallbackProducts.length);
      setLowStockProducts(fallbackProducts.filter(p => p.stock <= LOW_STOCK_THRESHOLD_DASHBOARD));
    }

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
             <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas de Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" /> {/* Changed PackageWarning to AlertTriangle */}
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
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" /> {/* Changed PackageWarning to AlertTriangle */}
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <>
                  <div className="text-2xl font-bold text-orange-500">{lowStockProducts.length}</div>
                  <p className="text-xs text-muted-foreground">Productos con stock bajo o nulo.</p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">OK</div>
                  <p className="text-xs text-muted-foreground">Todo el stock en orden.</p>
                </>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {user?.userType === 'vendedora' && lowStockProducts.length > 0 && (
        <Card className="shadow-md border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> {/* Changed PackageWarning to AlertTriangle */}
              Productos con Stock Crítico
            </CardTitle>
            <CardDescription>
              Los siguientes productos tienen stock igual o menor a {LOW_STOCK_THRESHOLD_DASHBOARD} unidades. Considera reponerlos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {lowStockProducts.map(product => (
                <li key={product.id}>
                  {product.name} - <span className="font-semibold">Stock: {product.stock}</span>
                  {product.stock === 0 && <Badge variant="destructive" className="ml-2">SIN STOCK</Badge>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

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
             {/* General Settings/Config Button - Placeholder */}
            <Button variant="ghost" onClick={() => alert('Configuración no implementada aún.')}>
                <Settings className="mr-2 h-4 w-4" /> Configuración
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    