
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { Camera } from 'lucide-react';

export default function CatalogoVendedoraPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProducts(getAllProducts());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // You can add a more sophisticated loading skeleton here
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mi Catálogo (Vendedora)"
          description="Visualiza y gestiona la presentación de tus productos como vendedora."
        />
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5 text-primary" />
              Cargando Catálogo Completo...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
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
        title="Mi Catálogo (Vendedora)"
        description="Visualiza la presentación de tus productos con precios base."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5 text-primary" />
            Catálogo Completo (Precios Base)
          </CardTitle>
          <CardDescription>
            Así se ve el catálogo con los precios de costo/base para tu referencia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const imageSrc = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/300x300.png?text=No+Imagen';
                 const imageHint = imageSrc.includes('placehold.co') ? product.category.toLowerCase() + " " + product.name.split(" ")[0].toLowerCase() : undefined;
                return (
                  <Card key={product.id} className="catalog-item overflow-hidden">
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
                        ${product.price.toLocaleString("es-AR")}
                      </p>
                      <p className="text-xs text-muted-foreground catalog-category">{product.category}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No hay productos para mostrar.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
