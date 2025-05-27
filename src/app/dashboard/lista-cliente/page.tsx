
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { DollarSign, TrendingUp, ArrowLeftCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CLIENT_MARGIN_KEY = 'shopvision_clientOwnMargin';
const DEFAULT_CLIENT_MARGIN = 30;
const WHOLESALE_MARKUP_PERCENTAGE = 20; // Vendedora's markup for wholesale clients

export default function ListaClientePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [margen, setMargen] = useState(DEFAULT_CLIENT_MARGIN);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedMargin = localStorage.getItem(CLIENT_MARGIN_KEY);
    if (storedMargin) {
      const parsedMargin = parseFloat(storedMargin);
      if (!isNaN(parsedMargin)) {
        setMargen(parsedMargin);
      }
    }
    
    const masterProductList = localStorage.getItem('masterProductList');
    let productData;
    if (masterProductList) {
      try {
        productData = JSON.parse(masterProductList);
      } catch (error) {
        console.error("Error parsing masterProductList from localStorage", error);
        productData = getAllProducts();
      }
    } else {
      productData = getAllProducts();
    }
    setProducts(productData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(CLIENT_MARGIN_KEY, margen.toString());
  }, [margen]);

  const handleMargenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMargen = parseInt(e.target.value, 10);
    if (!isNaN(newMargen) && newMargen >= 0 && newMargen <= 200) {
      setMargen(newMargen);
    } else if (e.target.value === "") {
        setMargen(0);
    }
  };

  const getClientPurchasePrice = (baseVendorPrice: number): number => {
    return baseVendorPrice * (1 + WHOLESALE_MARKUP_PERCENTAGE / 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={<Skeleton className="h-8 w-3/4" />}
          description={<Skeleton className="h-5 w-1/2 mt-1" />}
        />
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              <Skeleton className="h-6 w-2/5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 max-w-xs">
                <Skeleton className="h-4 w-1/3 mb-1" />
                <div className="flex items-center space-x-2 mt-1">
                  <Skeleton className="h-10 w-24 rounded" />
                </div>
            </div>
            <div className="mb-8">
               <Skeleton className="h-10 w-48 rounded" /> {/* Placeholder for button */}
            </div>
            <Skeleton className="h-40 w-full rounded" /> {/* Placeholder for table */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Precios (Cliente/Comercio)"
        description="Consulta los precios a los que nos compras y ajusta tu margen de ganancia para tu reventa."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Tu Lista de Precios
          </CardTitle>
          <CardDescription>
            Ajusta tu margen de ganancia sobre el precio de compra y visualiza tus precios finales de venta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-700">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-semibold text-green-800">Calcula tu Ganancia de Reventa</AlertTitle>
            <AlertDescription>
              Ajusta tu margen de ganancia y los precios de "Tu Precio de Venta" se actualizarán automáticamente.
            </AlertDescription>
          </Alert>

          <div className="mb-6 max-w-xs">
            <Label htmlFor="margen" className="text-sm font-medium">Tu margen de ganancia para reventa (%):</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="margen"
                type="number"
                value={margen}
                min={0}
                max={200}
                onChange={handleMargenChange}
                className="w-24"
              />
              <span className="font-semibold text-muted-foreground">%</span>
            </div>
          </div>

          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link href="/dashboard/vista-cliente">
                <ArrowLeftCircle className="mr-2 h-4 w-4" />
                Volver al Portal Cliente
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Compra (Costo + 20%)</TableHead>
                  <TableHead className="text-right">Tu Precio de Venta</TableHead>
                  <TableHead>Categoría</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => {
                    const clientPurchasePrice = getClientPurchasePrice(product.price);
                    const clientSellingPrice = clientPurchasePrice * (1 + margen / 100);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">
                          ${clientPurchasePrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ${clientSellingPrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No hay productos para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
