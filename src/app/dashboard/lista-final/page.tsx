
'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { DollarSign, Percent, Edit, FileSpreadsheet, FileText, FileImage } from 'lucide-react';

const FINAL_CONSUMER_MARGIN_KEY = 'shopvision_finalConsumerMargin';
const DEFAULT_MARGIN = 50; // Default margin if not found or invalid

export default function ListaFinalPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [margenFinal, setMargenFinal] = useState<number>(DEFAULT_MARGIN);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const handleMargenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMargen = parseFloat(e.target.value);
    if (!isNaN(newMargen) && newMargen >= 0 && newMargen <= 500) { // Max margin 500%
      setMargenFinal(newMargen);
    } else if (e.target.value === "") {
      setMargenFinal(0); // Set to 0 if input is cleared
    }
  };
  
  const handleExportPlaceholder = (format: string) => {
    toast({
      title: "Funcionalidad Pendiente",
      description: `La exportación a ${format} aún no está implementada.`,
    });
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lista de Precios para Consumidor Final"
          description="Ajusta el margen de ganancia y consulta los precios finales."
        />
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 max-w-xs">
              <div className="h-4 bg-muted rounded w-1/3 mb-1"></div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="h-10 w-24 bg-muted rounded"></div>
                <div className="h-5 w-5 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><div className="h-4 bg-muted rounded w-full"></div></TableHead>
                    <TableHead><div className="h-4 bg-muted rounded w-full"></div></TableHead>
                    <TableHead className="text-right"><div className="h-4 bg-muted rounded w-full"></div></TableHead>
                    <TableHead className="text-right"><div className="h-4 bg-muted rounded w-full"></div></TableHead>
                    <TableHead><div className="h-4 bg-muted rounded w-full"></div></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 bg-muted rounded w-full"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-full"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-full"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-full"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-full"></div></TableCell>
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
        title="Lista de Precios para Consumidor Final"
        description="Ajusta el margen de ganancia y consulta los precios finales. Este margen también afectará al Catálogo Público."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Definir Precios al Público
          </CardTitle>
          <CardDescription>
            Ingresa el margen de ganancia que se aplicará sobre el precio base para la venta al consumidor final.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="mb-8 p-6 border-blue-200 bg-blue-50 dark:bg-blue-900/30 max-w-lg shadow">
            <div className="space-y-3">
                <div>
                    <Label htmlFor="margen-final" className="text-sm font-medium block mb-1 text-blue-700 dark:text-blue-300">
                    <Edit className="inline-block mr-1 h-4 w-4" />
                    Ajustar Margen de Ganancia para Consumidor Final (%):
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                    <Input
                        id="margen-final"
                        type="number"
                        value={margenFinal}
                        min={0}
                        max={500}
                        onChange={handleMargenChange}
                        className="w-28 text-base border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Percent className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Este margen se aplicará a los precios base para calcular los precios de venta al público y se reflejará en el Catálogo Público y "Mi Catálogo (Vendedora)".
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                    <Button variant="outline" size="sm" onClick={() => handleExportPlaceholder('Excel (Lista)')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> Descargar Excel (Lista)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportPlaceholder('PDF (Lista)')}>
                        <FileText className="mr-2 h-4 w-4" /> Descargar PDF (Lista)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportPlaceholder('PDF (Catálogo)')}>
                        <FileImage className="mr-2 h-4 w-4" /> Descargar Catálogo PDF
                    </Button>
                </div>
            </div>
          </Card>

          <Alert className="mb-6 bg-green-50 border-green-200 text-green-700">
            <DollarSign className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-semibold text-green-800">Precios Calculados</AlertTitle>
            <AlertDescription>
              Visualiza cómo quedan los precios finales con el margen aplicado. Puedes usar esta tabla para imprimir o compartir.
            </AlertDescription>
          </Alert>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Base</TableHead>
                  <TableHead className="text-right">Precio Final (con {margenFinal}%)</TableHead>
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
                        ${(product.price * (1 + margenFinal / 100)).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
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
