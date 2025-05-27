
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function ListaClientePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [margen, setMargen] = useState(30); // Default margin 30%

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  const handleMargenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMargen = parseInt(e.target.value, 10);
    if (!isNaN(newMargen) && newMargen >= 0 && newMargen <= 200) {
      setMargen(newMargen);
    } else if (e.target.value === "") {
        setMargen(0);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Precios (Cliente/Comercio)"
        description="Consulta los precios especiales asignados a tu cuenta y ajusta tu margen de ganancia."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Tu Lista de Precios
          </CardTitle>
          <CardDescription>
            Ajusta tu margen y visualiza tus precios finales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-700">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-semibold text-green-800">Calcula tu Ganancia</AlertTitle>
            <AlertDescription>
              Ajusta tu margen de ganancia y los precios se actualizarán automáticamente en la tabla de abajo.
            </AlertDescription>
          </Alert>

          <div className="mb-6 max-w-xs">
            <Label htmlFor="margen" className="text-sm font-medium">Tu margen de ganancia (%):</Label>
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

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Base</TableHead>
                  <TableHead className="text-right">Tu Precio Final</TableHead>
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
                        ${product.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ${(product.price * (1 + margen / 100)).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
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
