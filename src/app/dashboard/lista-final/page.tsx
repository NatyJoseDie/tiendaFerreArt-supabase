
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
import { DollarSign, Percent, Edit, FileSpreadsheet, FileText, FileImage, Loader2, RefreshCcw, Info } from 'lucide-react';

const FINAL_CONSUMER_MARGIN_KEY = 'shopvision_finalConsumerMargin';
const PRODUCT_OVERRIDDEN_FINAL_PRICES_KEY = 'shopvision_overridden_final_prices'; // Stores the final price
const PRODUCT_OVERRIDDEN_MARGINS_KEY = 'shopvision_overridden_margins'; // New: Stores the overridden margin percentage

const DEFAULT_MARGIN = 45;

export default function ListaFinalPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalMargin, setGlobalMargin] = useState<number>(DEFAULT_MARGIN);
  const [overriddenFinalPrices, setOverriddenFinalPrices] = useState<{ [productId: string]: number }>({});
  const [overriddenMargins, setOverriddenMargins] = useState<{ [productId: string]: number }>({});
  const [marginInputValues, setMarginInputValues] = useState<{ [productId: string]: string }>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const masterProductList = localStorage.getItem('masterProductList');
    let loadedProducts: Product[];
    if (masterProductList) {
      try {
        loadedProducts = JSON.parse(masterProductList);
      } catch (error) {
        console.error("Error parsing masterProductList from localStorage", error);
        loadedProducts = getAllProducts();
      }
    } else {
      loadedProducts = getAllProducts();
    }
    setProducts(loadedProducts);

    const storedGlobalMargin = localStorage.getItem(FINAL_CONSUMER_MARGIN_KEY);
    const parsedGlobalMargin = storedGlobalMargin ? parseFloat(storedGlobalMargin) : DEFAULT_MARGIN;
    setGlobalMargin(parsedGlobalMargin);

    const storedOverriddenPrices = localStorage.getItem(PRODUCT_OVERRIDDEN_FINAL_PRICES_KEY);
    const loadedOverriddenPrices = storedOverriddenPrices ? JSON.parse(storedOverriddenPrices) : {};
    setOverriddenFinalPrices(loadedOverriddenPrices);
    
    const storedOverriddenMargins = localStorage.getItem(PRODUCT_OVERRIDDEN_MARGINS_KEY);
    const loadedOverriddenMargins = storedOverriddenMargins ? JSON.parse(storedOverriddenMargins) : {};
    setOverriddenMargins(loadedOverriddenMargins);

    const initialMarginInputValues: { [productId: string]: string } = {};
    loadedProducts.forEach(p => {
      const manualMargin = loadedOverriddenMargins[p.id];
      const effectiveMargin = manualMargin !== undefined ? manualMargin : parsedGlobalMargin;
      initialMarginInputValues[p.id] = effectiveMargin.toFixed(1);
    });
    setMarginInputValues(initialMarginInputValues);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(FINAL_CONSUMER_MARGIN_KEY, globalMargin.toString());
    }
  }, [globalMargin, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(PRODUCT_OVERRIDDEN_FINAL_PRICES_KEY, JSON.stringify(overriddenFinalPrices));
    }
  }, [overriddenFinalPrices, isLoading]);
  
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(PRODUCT_OVERRIDDEN_MARGINS_KEY, JSON.stringify(overriddenMargins));
    }
  }, [overriddenMargins, isLoading]);


  const handleGlobalMarginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newGlobalMarginValue = e.target.value;
    const newGlobalMargin = parseFloat(newGlobalMarginValue);

    if (newGlobalMarginValue === "") {
      setGlobalMargin(0);
       // Update all non-overridden products
      const newMarginInputs = { ...marginInputValues };
      const newPrices = { ...overriddenFinalPrices };
      products.forEach(p => {
        if (overriddenMargins[p.id] === undefined) { // Only update if not manually overridden by margin
          newMarginInputs[p.id] = (0).toFixed(1);
          newPrices[p.id] = p.price * (1 + 0 / 100);
        }
      });
      setMarginInputValues(newMarginInputs);
      setOverriddenFinalPrices(newPrices); // This might override individual price edits, which is the new behavior
      return;
    }

    if (!isNaN(newGlobalMargin) && newGlobalMargin >= 0 && newGlobalMargin <= 500) {
      setGlobalMargin(newGlobalMargin);
      // Update all non-overridden products
      const newMarginInputs = { ...marginInputValues };
      const newPrices = { ...overriddenFinalPrices };
      products.forEach(p => {
        if (overriddenMargins[p.id] === undefined) { // Only update if not manually overridden by margin
          newMarginInputs[p.id] = newGlobalMargin.toFixed(1);
          newPrices[p.id] = p.price * (1 + newGlobalMargin / 100);
        }
      });
      setMarginInputValues(newMarginInputs);
      setOverriddenFinalPrices(newPrices); 
    }
  };


  const handleIndividualMarginInputChange = (productId: string, value: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setMarginInputValues(prev => ({ ...prev, [productId]: value }));

    const newMargin = parseFloat(value);
    if (!isNaN(newMargin) && newMargin >= 0 && newMargin <= 500) {
      const newFinalPrice = product.price * (1 + newMargin / 100);
      setOverriddenMargins(prev => ({ ...prev, [productId]: newMargin }));
      setOverriddenFinalPrices(prev => ({ ...prev, [productId]: newFinalPrice }));
    } else if (value === "") { // If input is cleared, revert to global margin
      handleResetIndividualOverride(productId);
    }
  };

  const handleIndividualMarginInputBlur = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const inputValue = marginInputValues[productId];
    const parsedMargin = parseFloat(inputValue);

    if (!isNaN(parsedMargin) && parsedMargin >= 0 && parsedMargin <= 500) {
      setMarginInputValues(prev => ({ ...prev, [productId]: parsedMargin.toFixed(1) }));
      // The actual update of overriddenMargins & overriddenFinalPrices already happened in onChange
    } else { // Invalid input, reset to global margin or last valid
      const currentGlobalMargin = globalMargin;
      const lastValidOverrideMargin = overriddenMargins[productId];
      
      if(lastValidOverrideMargin !== undefined) {
        setMarginInputValues(prev => ({...prev, [productId]: lastValidOverrideMargin.toFixed(1)}));
      } else {
        setMarginInputValues(prev => ({...prev, [productId]: currentGlobalMargin.toFixed(1)}));
        const newFinalPrice = product.price * (1 + currentGlobalMargin / 100);
        setOverriddenMargins(prev => {
          const copy = { ...prev };
          delete copy[productId];
          return copy;
        });
        setOverriddenFinalPrices(prev => {
          const copy = { ...prev };
          // If it was previously overridden by price, delete that too, or recalculate from global margin.
          // For simplicity, we just recalculate from global margin here, assuming margin takes precedence.
          copy[productId] = newFinalPrice; 
          // Or, if we want to truly remove the price override if the margin was invalid:
          // delete copy[productId] // This would make it fall back to default calculation.
          // Let's ensure it sets the price based on global margin if margin input becomes invalid
          return {...copy, [productId]: newFinalPrice};
        });
      }
    }
  };
  
  const handleResetIndividualOverride = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setOverriddenMargins(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
    setOverriddenFinalPrices(prev => {
        const copy = {...prev};
        delete copy[productId]; // Remove price override too, so global margin applies
        return copy;
    });

    // Update input to reflect global margin
    setMarginInputValues(prev => ({
      ...prev,
      [productId]: globalMargin.toFixed(1)
    }));
    toast({ title: "Precio/Margen restablecido", description: `"${product.name}" ahora usará el margen global de ${globalMargin}%.` });
  };


  const handleExportPlaceholder = (format: string) => {
    toast({
      title: "Funcionalidad Pendiente",
      description: `La exportación a ${format} aún no está implementada.`,
    });
  };

  if (isLoading) {
    // Skeleton loading state remains the same
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lista de Precios para Consumidor Final"
          description="Ajusta el margen de ganancia y consulta los precios finales."
        />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
              Cargando Precios...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8 p-6 border-blue-200 bg-blue-50 dark:bg-blue-900/30 max-w-lg shadow animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="h-10 w-28 bg-muted rounded"></div>
                <div className="h-5 w-5 bg-muted rounded-full"></div>
              </div>
              <div className="h-3 bg-muted rounded w-full mt-2"></div>
              <div className="flex flex-wrap gap-2 pt-3 mt-2">
                <div className="h-9 w-36 bg-muted rounded"></div>
                <div className="h-9 w-36 bg-muted rounded"></div>
                <div className="h-9 w-40 bg-muted rounded"></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><div className="h-4 bg-muted rounded"></div></TableHead>
                    <TableHead><div className="h-4 bg-muted rounded w-3/4"></div></TableHead>
                    <TableHead className="text-right"><div className="h-4 bg-muted rounded w-1/2"></div></TableHead>
                    <TableHead className="text-right"><div className="h-4 bg-muted rounded w-1/2"></div></TableHead>
                    <TableHead className="text-right"><div className="h-4 bg-muted rounded w-1/2"></div></TableHead>
                    <TableHead><div className="h-4 bg-muted rounded w-1/2"></div></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded w-3/4"></div></TableCell>
                      <TableCell className="text-right"><div className="h-4 bg-muted rounded w-1/2"></div></TableCell>
                      <TableCell className="text-right"><div className="h-8 w-full bg-muted rounded"></div></TableCell>
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
        title="Lista de Precios para Consumidor Final"
        description="Ajusta el margen de ganancia global o define márgenes individuales. Estos precios afectarán al Catálogo Público y 'Mi Catálogo (Vendedora)'."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Definir Precios al Público
          </CardTitle>
          <CardDescription>
            Ingresa el margen de ganancia global o ajusta los márgenes directamente en la tabla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="mb-8 p-6 border-blue-200 bg-blue-50 dark:bg-blue-900/30 max-w-lg shadow">
            <div className="space-y-3">
                <div>
                    <Label htmlFor="margen-final" className="text-sm font-medium block mb-1 text-blue-700 dark:text-blue-300">
                    <Edit className="inline-block mr-1 h-4 w-4" />
                    Ajustar Margen de Ganancia Global (%):
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                    <Input
                        id="margen-final"
                        type="number"
                        value={globalMargin}
                        min={0}
                        max={500}
                        onChange={handleGlobalMarginChange}
                        className="w-28 text-base border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Percent className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Este margen se aplicará por defecto. Los márgenes ajustados manualmente en la tabla tendrán prioridad.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                    <Button variant="outline" size="sm" onClick={() => handleExportPlaceholder('Excel (Lista Consumidor Final)')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> Descargar Excel (Lista)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportPlaceholder('PDF (Lista Consumidor Final)')}>
                        <FileText className="mr-2 h-4 w-4" /> Descargar PDF (Lista)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportPlaceholder('PDF (Catálogo Consumidor Final)')}>
                        <FileImage className="mr-2 h-4 w-4" /> Descargar Catálogo PDF
                    </Button>
                </div>
            </div>
          </Card>

          <Alert className="mb-6 bg-green-50 border-green-200 text-green-700">
            <Info className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-semibold text-green-800">Precios Calculados y Ajustables</AlertTitle>
            <AlertDescription>
              Ajusta los márgenes en la tabla. El margen global actual es {globalMargin}%. Los márgenes editados manualmente se guardarán.
            </AlertDescription>
          </Alert>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio Base ($)</TableHead>
                  <TableHead className="text-right w-[200px]">Precio Final Calculado ($)</TableHead>
                  <TableHead className="text-right w-[180px]">Margen Resultante (%)</TableHead>
                  <TableHead>Categoría</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => {
                    const manualMargin = overriddenMargins[product.id];
                    const effectiveMargin = manualMargin !== undefined ? manualMargin : globalMargin;
                    
                    const finalPrice = overriddenFinalPrices[product.id] !== undefined 
                                       ? overriddenFinalPrices[product.id]
                                       : product.price * (1 + effectiveMargin / 100);

                    const isManuallyOverridden = manualMargin !== undefined;

                    return (
                      <TableRow key={product.id} className={isManuallyOverridden ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">
                          {product.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                           {finalPrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Input
                              type="number"
                              value={marginInputValues[product.id] || ''}
                              onChange={(e) => handleIndividualMarginInputChange(product.id, e.target.value)}
                              onBlur={() => handleIndividualMarginInputBlur(product.id)}
                              min="0"
                              max="500"
                              step="0.1"
                              className="w-20 h-9 text-right"
                              placeholder={globalMargin.toFixed(1)}
                            />
                             <span className="text-muted-foreground">%</span>
                            {isManuallyOverridden && (
                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleResetIndividualOverride(product.id)} title="Restablecer a margen global">
                                <RefreshCcw className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
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
    
