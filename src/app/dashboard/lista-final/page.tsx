'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { ListChecks, Info, Percent } from 'lucide-react';

const FINAL_CONSUMER_MARGIN_KEY = 'shopvision_finalConsumerMargin';

export default function ListaFinalPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [margenFinal, setMargenFinal] = useState<number>(50); // Default margin 50%
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedMargin = localStorage.getItem(FINAL_CONSUMER_MARGIN_KEY);
    if (storedMargin) {
      const parsedMargin = parseFloat(storedMargin);
      if (!isNaN(parsedMargin)) {
        setMargenFinal(parsedMargin);
      }
    }

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
  }, []);

  useEffect(() => {
    // Save margin to localStorage whenever it changes
    localStorage.setItem(FINAL_CONSUMER_MARGIN_KEY, margenFinal.toString());
  }, [margenFinal]);

  const handleMargenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMargen = parseFloat(e.target.value);
    if (!isNaN(newMargen) && newMargen >= 0 && newMargen <= 500) { // Allow up to 500%
      setMargenFinal(newMargen);
    } else if (e.target.value === "") {
      setMargenFinal(0);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lista de Precios para Consumidor Final"
          description="Cargando precios..."
        />
        <Card className="shadow-md animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-24 bg-muted rounded"></div> {/* Placeholder for table */}
          </CardContent>
        </Card>
      </div>
    )
  }

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
            Ajusta el margen de ganancia para esta lista. Este margen se usará también en el Catálogo Público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-sky-50 border-sky-200 text-sky-700">
            <Info className="h-5 w-5 text-sky-600" />
            <AlertTitle className="font-semibold text-sky-800">Precios Sugeridos</AlertTitle>
            <AlertDescription>
              Esta lista muestra los precios de venta al público. Ajusta el margen según tus necesidades.
            </AlertDescription>
          </Alert>

          <div className="mb-6 max-w-xs">
            <Label htmlFor="margen-final" className="text-sm font-medium">Margen de ganancia (%):</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="margen-final"
                type="number"
                value={margenFinal}
                min={0}
                max={500}
                onChange={handleMargenChange}
                className="w-24"
              />
              <Percent className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Base</TableHead>
                  <TableHead className="text-right">Precio Final (con margen)</TableHead>
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
                        ${product.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ${(product.price * (1 + margenFinal / 100)).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-muted-foreground text-xs italic">
                        {/* Placeholder para notas */}
                        Ej: Oferta especial
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24"> {/* Updated colSpan */}
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
