
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card
import { StockStatusBadge } from '@/components/products/StockStatusBadge';

const FINAL_CONSUMER_MARGIN_KEY = 'shopvision_finalConsumerMargin';
const MASTER_PRODUCT_LIST_KEY = 'masterProductList';
const DEFAULT_MARGIN = 0; // Default margin if not found in localStorage (0 means show base price)

export default function CatalogoPublicoPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedMargin, setAppliedMargin] = useState<number>(DEFAULT_MARGIN);

  useEffect(() => {
    setIsLoading(true);
    const storedMargin = localStorage.getItem(FINAL_CONSUMER_MARGIN_KEY);
    if (storedMargin) {
      const parsedMargin = parseFloat(storedMargin);
      if (!isNaN(parsedMargin)) {
        setAppliedMargin(parsedMargin);
      }
    }

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
    setProductos(productData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="app-container text-center py-10">
        <div className="catalogo-header mb-8">
            <div className="mx-auto bg-muted rounded-md animate-pulse w-48 h-20 mb-5"></div>
            <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
        <div className="catalogo">
            {Array.from({length: 8}).map((_, i) => (
                <Card key={i} className="producto animate-pulse">
                    <div className="producto-img bg-muted h-[180px] rounded-t-lg"></div>
                    <CardContent className="producto-body p-4">
                        <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-muted rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="catalogo-header">
        <Image
          src="https://placehold.co/200x80.png?text=AB+Mayorista+Logo"
          alt="AB Mayorista Logo"
          width={200}
          height={80}
          className="logo"
          data-ai-hint="company logo"
        />
        <h1>Catálogo de Productos</h1>
        <p>Conocé nuestros productos disponibles {appliedMargin > 0 ? `(precios con ${appliedMargin}% de recargo)` : '(precios base)'}</p>
      </header>

      <div className="catalogo">
        {productos.map((p) => {
          const imageSrc = p.images && p.images.length > 0 ? p.images[0] : 'https://placehold.co/300x300.png?text=No+Imagen';
          const imageHint = imageSrc.includes('placehold.co') ? p.category.toLowerCase() + " " + p.name.split(" ")[0].toLowerCase() : undefined;
          const displayPrice = p.price * (1 + appliedMargin / 100);

          return (
            <Card className="producto relative" key={p.id}> {/* Added relative positioning */}
              <StockStatusBadge stock={p.stock} />
              <div className="producto-img">
                <Image
                  src={imageSrc}
                  alt={p.name}
                  width={250}
                  height={250}
                  style={{ objectFit: 'contain', maxWidth: "100%", maxHeight: "180px" }}
                  data-ai-hint={imageHint}
                />
              </div>
              <CardContent className="producto-body">
                <h4>{p.name}</h4>
                <p>$ {displayPrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <span style={{ fontSize: 12, color: "#555" }}>
                  {p.category}
                </span>
                 {appliedMargin > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Precio base: ${p.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-8">
        <Button asChild variant="outline" className="login-btn" style={{margin: 0}}>
          <Link href="/login">
            Iniciar sesión para ver precios mayoristas
          </Link>
        </Button>
      </div>

      <footer className="mt-12">
        © {new Date().getFullYear()} - AB Mayorista | Tu Tienda Online
      </footer>
    </div>
  );
}
