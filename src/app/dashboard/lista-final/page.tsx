
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { ListChecks, Info } from 'lucide-react';

export default function ListaFinalPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  // Simulación de un margen para el precio final, por ejemplo, costo + 50%
  const PRECIO_FINAL_MARGIN = 1.5; 

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Precios para Consumidor Final"
        description="Consulta y gestiona los precios de venta al público de tus productos."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary" />
            Precios Consumidor Final
          </CardTitle>
          <CardDescription>
            Estos son los precios sugeridos para tus clientes minoristas o para el catálogo público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-sky-50 border-sky-200 text-sky-700">
            <Info className="h-5 w-5 text-sky-600" />
            <AlertTitle className="font-semibold text-sky-800">Precios Sugeridos</AlertTitle>
            <AlertDescription>
              Esta lista muestra los precios de venta al público. Actualmente se calculan con un margen del 50% sobre el costo base.
              Puedes ajustar esta lógica según tus necesidades.
            </AlertDescription>
          </Alert>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Final</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">
                        ${(product.price * PRECIO_FINAL_MARGIN).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-muted-foreground text-xs italic">
                        {/* Placeholder para notas, podrías añadir un campo 'notes' al objeto Product si es necesario */}
                        Ej: Oferta especial
                      </TableCell>
                    </TableRow>
                  ))
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
