
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { ShoppingBag, Info, FileSpreadsheet, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname

export default function ListaComerciosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    setIsLoading(true);
    const masterProductList = localStorage.getItem('masterProductList');
    if (masterProductList) {
      try {
        setProducts(JSON.parse(masterProductList));
      } catch (error) {
        console.error("Error parsing masterProductList from localStorage", error);
        setProducts(getAllProducts());
      }
    } else {
      setProducts(getAllProducts());
    }
    setIsLoading(false);
  }, [pathname]); // Re-fetch data if pathname changes (e.g., navigation)

  const handleExportPlaceholder = (format: string) => {
    toast({
      title: "Funcionalidad Pendiente",
      description: `La exportación a ${format} aún no está implementada.`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <PageHeader
          title={<div className="h-8 bg-muted rounded w-3/5"></div>}
          description={<div className="h-5 bg-muted rounded w-4/5 mt-1"></div>}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
              <div className="h-6 bg-muted rounded w-2/5"></div>
            </CardTitle>
            <CardDescription>
              <div className="h-4 bg-muted rounded w-3/5"></div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Info className="h-5 w-5" />
              <AlertTitle><div className="h-5 bg-muted rounded w-1/4"></div></AlertTitle>
              <AlertDescription>
                <div className="h-4 bg-muted rounded w-full"></div>
              </AlertDescription>
            </Alert>
            <div className="space-y-2 mb-6">
                <div className="h-9 bg-muted rounded w-40"></div>
                <div className="h-9 bg-muted rounded w-36"></div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><div className="h-4 bg-muted rounded"></div></TableHead>
                    <TableHead><div className="h-4 bg-muted rounded w-3/4"></div></TableHead>
                    <TableHead className="text-right"><div className="h-4 bg-muted rounded w-1/2"></div></TableHead>
                    <TableHead><div className="h-4 bg-muted rounded w-1/2"></div></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                      <TableCell className="text-right"><div className="h-4 bg-muted rounded w-1/2"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-1/2"></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Precios para Comercios"
        description="Define y revisa los precios especiales para tus clientes comerciales."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
            Precios para Comercios (Costo + 20%)
          </CardTitle>
          <CardDescription>
            Estos son los precios sugeridos para tus clientes mayoristas. El precio base se toma de la lista de "Costos Privados".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="font-semibold text-blue-800 dark:text-blue-200">Información</AlertTitle>
            <AlertDescription>
              Esta lista la puedes compartir con comercios mayoristas. Los precios se calculan con un 20% sobre el costo definido en "Costos Privados".
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={() => handleExportPlaceholder('Excel (Lista Comercios)')}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Descargar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExportPlaceholder('PDF (Lista Comercios)')}>
                <FileText className="mr-2 h-4 w-4" /> Descargar PDF
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Mayorista</TableHead>
                  <TableHead>Categoría</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">
                        ${(product.price * 1.2).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No hay productos para mostrar. Intenta agregar algunos en "Costos Privados".
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
