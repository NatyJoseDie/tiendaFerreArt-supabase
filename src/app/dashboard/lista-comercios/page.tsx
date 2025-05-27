
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { ShoppingBag, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ListaComerciosPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

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
            Estos son los precios sugeridos para tus clientes mayoristas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-700">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="font-semibold text-blue-800">Información</AlertTitle>
            <AlertDescription>
              Esta lista la puedes compartir con comercios mayoristas. Los precios se calculan con un 20% sobre el costo.
            </AlertDescription>
          </Alert>

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
