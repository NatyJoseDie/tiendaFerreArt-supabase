
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // No se usa pero lo dejo por si acaso en el futuro
import { Label } from '@/components/ui/label'; // No se usa pero lo dejo
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { Camera, Percent, Edit } from 'lucide-react';

const FINAL_CONSUMER_MARGIN_KEY = 'shopvision_finalConsumerMargin';
const DEFAULT_MARGIN = 50; // Default margin if not found or invalid

export default function CatalogoVendedoraPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [margenFinal, setMargenFinal] = useState<number>(DEFAULT_MARGIN); // Este margen se lee de localStorage
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

  // No hay handleMargenChange aquí, el margen se define en ListaFinalPage

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mi Catálogo (Precios al Público)"
          description="Visualiza tus productos con el precio final para el consumidor."
        />
        <Card className="shadow-md animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                  <CardHeader className="p-4">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
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
        description={`Visualiza cómo se ven tus productos con el precio final para el consumidor (margen actual: ${margenFinal}%). Este margen se ajusta en "Consumidor Final".`}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5 text-primary" />
            Catálogo con Precios de Venta al Público
          </CardTitle>
          <CardDescription>
            Los precios mostrados incluyen el margen de ganancia del {margenFinal}% definido en la sección "Consumidor Final".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const finalPrice = product.price * (1 + margenFinal / 100);
                const imageSrc = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x300.png?text=No+Imagen';
                const imageHint = imageSrc.includes('placehold.co') ? product.category.toLowerCase() + " " + product.name.split(" ")[0].toLowerCase() : undefined;
                
                return (
                  <Card key={product.id} className="catalog-item overflow-hidden transition-shadow hover:shadow-md">
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
                      {margenFinal > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Precio base: ${product.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

    