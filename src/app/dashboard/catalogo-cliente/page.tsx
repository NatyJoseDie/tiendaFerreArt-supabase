
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { Camera, Percent, FileImage, ArrowLeftCircle } from 'lucide-react';

// Idealmente, este margen debería guardarse en localStorage asociado al cliente
const CLIENT_MARGIN_KEY = 'shopvision_clientOwnMargin'; 
const DEFAULT_CLIENT_MARGIN = 30;

export default function CatalogoClientePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [margen, setMargen] = useState(DEFAULT_CLIENT_MARGIN);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedMargin = localStorage.getItem(CLIENT_MARGIN_KEY);
    if (storedMargin) {
      const parsedMargin = parseFloat(storedMargin);
      if (!isNaN(parsedMargin)) {
        setMargen(parsedMargin);
      }
    }

    const masterProductList = localStorage.getItem('masterProductList');
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
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(CLIENT_MARGIN_KEY, margen.toString());
  }, [margen]);
  
  const handleMargenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMargen = parseInt(e.target.value, 10);
    if (!isNaN(newMargen) && newMargen >= 0 && newMargen <= 500) {
      setMargen(newMargen);
    } else if (e.target.value === "") {
        setMargen(0);
    }
  };

  const handleDownloadCatalog = () => {
    toast({
      title: "Funcionalidad Pendiente",
      description: "La descarga del catálogo PDF para clientes aún no está implementada.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mi Catálogo (Cliente/Comercio)"
          description="Explora los productos disponibles para ti con tus precios asignados."
        />
        <Card className="shadow-md">
          <CardHeader>
             <CardTitle className="flex items-center">
                <Camera className="mr-2 h-5 w-5 text-primary" />
                Cargando Tu Catálogo Personalizado...
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 max-w-xs">
              <Label htmlFor="margen-cliente" className="text-sm font-medium">Tu margen de ganancia (%):</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input id="margen-cliente" type="number" value={margen} className="w-24" disabled />
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
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
             <div className="mt-8">
              <Button variant="outline" disabled>
                <ArrowLeftCircle className="mr-2 h-4 w-4" />
                Volver al Portal Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Catálogo (Cliente/Comercio)"
        description="Explora los productos con tu margen de ganancia aplicado. Puedes descargar este catálogo."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5 text-primary" />
            Tu Catálogo Personalizado
          </CardTitle>
           <CardDescription>
            Ajusta tu margen y visualiza los precios finales de los productos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8 p-4 border rounded-lg bg-muted/30 max-w-md">
            <Label htmlFor="margen-cliente" className="text-sm font-medium block mb-1">Tu margen de ganancia (%):</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="margen-cliente"
                type="number"
                value={margen}
                min={0}
                max={500}
                onChange={handleMargenChange}
                className="w-28 text-base"
              />
              <Percent className="h-5 w-5 text-muted-foreground" />
            </div>
             <p className="text-xs text-muted-foreground mt-2">Este margen se aplicará a los precios base para calcular tus precios de venta.</p>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const finalPrice = product.price * (1 + margen / 100);
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
                        ${finalPrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground catalog-category">{product.category}</p>
                      {/* Precio base oculto para el cliente 
                       <p className="text-xs text-muted-foreground mt-1">
                        Precio base: ${product.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p> 
                      */}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
             <p className="text-muted-foreground text-center">No hay productos para mostrar.</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="outline" onClick={handleDownloadCatalog}>
                <FileImage className="mr-2 h-4 w-4" /> Descargar Catálogo PDF
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/vista-cliente">
                <ArrowLeftCircle className="mr-2 h-4 w-4" />
                Volver al Portal Cliente
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
