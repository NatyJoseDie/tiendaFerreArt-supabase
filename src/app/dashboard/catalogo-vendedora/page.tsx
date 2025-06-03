
'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { Camera, Edit, Percent } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StockStatusBadge } from '@/components/products/StockStatusBadge';
import { usePathname } from 'next/navigation'; // Import usePathname

const FINAL_CONSUMER_MARGIN_KEY = 'shopvision_finalConsumerMargin';
const MASTER_PRODUCT_LIST_KEY = 'masterProductList';
const PRODUCT_OVERRIDDEN_FINAL_PRICES_KEY = 'shopvision_overridden_final_prices';
const DEFAULT_MARGIN = 45;

export default function CatalogoVendedoraPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [margenFinal, setMargenFinal] = useState<number>(DEFAULT_MARGIN);
  const [overriddenFinalPrices, setOverriddenFinalPrices] = useState<{ [productId: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    setIsLoading(true);
    
    // Load global margin
    const storedMargin = localStorage.getItem(FINAL_CONSUMER_MARGIN_KEY);
    if (storedMargin) {
      const parsedMargin = parseFloat(storedMargin);
      if (!isNaN(parsedMargin)) {
        setMargenFinal(parsedMargin);
      } else {
        setMargenFinal(DEFAULT_MARGIN);
      }
    } else {
      setMargenFinal(DEFAULT_MARGIN);
    }

    // Load master product list
    const masterProductList = localStorage.getItem(MASTER_PRODUCT_LIST_KEY);
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

    // Load overridden prices
    const storedOverriddenPrices = localStorage.getItem(PRODUCT_OVERRIDDEN_FINAL_PRICES_KEY);
    const loadedOverriddenPrices = storedOverriddenPrices ? JSON.parse(storedOverriddenPrices) : {};
    setOverriddenFinalPrices(loadedOverriddenPrices);

    setIsLoading(false);
  }, [pathname]); // Add pathname to dependency array

  useEffect(() => {
    // Save margin to localStorage whenever it changes, if not loading
    if(!isLoading) {
      localStorage.setItem(FINAL_CONSUMER_MARGIN_KEY, margenFinal.toString());
    }
  }, [margenFinal, isLoading]);

  const handleMargenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMargen = parseFloat(e.target.value);
    if (!isNaN(newMargen) && newMargen >= 0 && newMargen <= 500) {
      setMargenFinal(newMargen);
    } else if (e.target.value === "") {
      setMargenFinal(0);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={<Skeleton className="h-8 w-3/4" />}
          description={<Skeleton className="h-5 w-1/2 mt-1" />}
        />
        <Card className="shadow-md animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-2/5"></div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 border rounded-lg bg-muted/30 max-w-md">
                <Skeleton className="h-4 w-1/3 mb-1" />
                <div className="flex items-center space-x-2 mt-1">
                  <Skeleton className="h-10 w-28 rounded" />
                  <Percent className="h-5 w-5 text-muted-foreground" />
                </div>
                <Skeleton className="h-3 w-full mt-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="w-full aspect-square rounded-t-lg" />
                  <CardHeader className="p-4">
                    <Skeleton className="h-5 bg-muted rounded w-3/4" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-6 bg-muted rounded w-1/2 mb-2" />
                    <Skeleton className="h-4 bg-muted rounded w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Catálogo (Precios al Público)"
        description="Define tu margen y visualiza tus productos con el precio final para el consumidor. Este margen afectará al Catálogo Público."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5 text-primary" />
            Catálogo con Precios de Venta al Público
          </CardTitle>
           <CardDescription>
            Define tu margen de ganancia para el consumidor final. Este margen afectará a este catálogo y al Catálogo Público. El ajuste se realiza en la sección &quot;Consumidor Final&quot; o aquí mismo para el margen global.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="mb-6 p-4 border rounded-lg bg-muted/30 max-w-md">
            <Label htmlFor="margen-final-catalogo" className="text-sm font-medium block mb-1">
              <Edit className="inline-block mr-1 h-4 w-4" />
              Tu margen de ganancia GLOBAL para Consumidor Final (%):
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="margen-final-catalogo"
                type="number"
                value={margenFinal}
                min={0}
                max={500}
                onChange={handleMargenChange}
                className="w-28 text-base"
              />
              <Percent className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Este margen global se aplicará si no hay un precio individual definido en "Lista de Precios para Consumidor Final".
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const overriddenPrice = overriddenFinalPrices[product.id];
                const finalPrice = overriddenPrice !== undefined
                                    ? overriddenPrice
                                    : product.price * (1 + margenFinal / 100);
                const isManuallyOverridden = overriddenPrice !== undefined;

                const imageSrc = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x300.png?text=No+Imagen';
                const imageHint = imageSrc.includes('placehold.co') ? product.category.toLowerCase() + " " + product.name.split(" ")[0].toLowerCase() : undefined;
                
                return (
                  <Card key={product.id} className="catalog-item overflow-hidden transition-shadow hover:shadow-md relative">
                    <StockStatusBadge stock={product.stock} />
                    <div className="relative w-full aspect-square bg-muted">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                        data-ai-hint={imageHint}
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base catalog-title">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-lg font-semibold text-primary catalog-price">
                        ${finalPrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      {(isManuallyOverridden || margenFinal > 0) && ( 
                        <p className="text-xs text-muted-foreground mt-1">
                          Precio base: ${product.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {isManuallyOverridden && <span className="italic"> (precio individual)</span>}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground catalog-category mt-1">{product.category}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay productos para mostrar. Intenta agregar algunos en la sección 'Costos Privados'.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
