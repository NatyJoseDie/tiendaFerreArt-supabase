
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { getAllProducts } from '@/data/mock-products';
import { ProductCard } from '@/components/products/product-card';
// Removed Input, Label, useToast as newsletter is now in footer

const mainBannerImages = [
  { src: 'https://placehold.co/1200x500.png?text=Super+Oferta+Invierno', alt: 'Oferta de Invierno', hint: 'winter sale', title: 'GRAN LIQUIDACIÓN DE INVIERNO', description: 'Descuentos increíbles en toda la colección.' },
  { src: 'https://placehold.co/1200x500.png?text=Nuevos+Ingresos+Tecno', alt: 'Nuevos Productos Tecnológicos', hint: 'new tech', title: 'LO ÚLTIMO EN TECNOLOGÍA', description: 'Descubre los gadgets más novedosos.' },
  { src: 'https://placehold.co/1200x500.png?text=Decoracion+Hogar', alt: 'Decoración para el Hogar', hint: 'home decor', title: 'RENUEVA TU HOGAR', description: 'Ideas y productos para cada rincón.' },
];

const categories = [
  'INVIERNO', 'BEAUTY', 'HOME', 'BAZAR', 'LUCES',
  'TECNO', 'LIBRERIA', 'VERANO', 'SOQUETES', 'MODA'
];

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  // Removed newsletter state as it's now in footer
  
  useEffect(() => {
    const products = getAllProducts(); 
    setAllProducts(products);
  }, []);

  const featuredProducts = useMemo(() => {
    // Show up to 8 featured products
    return allProducts.filter(p => p.featured).slice(0, 8);
  }, [allProducts]);

  const newArrivalProducts = useMemo(() => {
    // Show up to 4 new arrival products
    return allProducts.slice(0, 4);
  }, [allProducts]);

  // Removed handleNewsletterSubmit as it's now in footer

  return (
    <div className="space-y-12">
      {/* Hero Section - Carousel */}
      <section className="w-full">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[ Autoplay({ delay: 5000, stopOnInteraction: true }) ]}
          className="w-full shadow-lg rounded-lg overflow-hidden"
        >
          <CarouselContent>
            {mainBannerImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[12/5] w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                    className="object-cover"
                    data-ai-hint={image.hint}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                      {image.title}
                    </h2>
                    {image.description && (
                      <p className="mt-2 text-md sm:text-lg text-white/90 max-w-xl" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                        {image.description}
                      </p>
                    )}
                     <Button asChild size="lg" className="mt-6">
                        <Link href="/products">
                          Ver Productos <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {mainBannerImages.map((_, index) => (
                <span key={`dot-${index}`} className={`h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-primary' : 'bg-white/70'}`}></span>
            ))}
          </div>
        </Carousel>
      </section>

      {/* Main Categories Section */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">
          CATEGORÍAS PRINCIPALES
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button key={category} variant="default" size="lg" className="rounded-md" asChild>
              <Link href={`/products?category=${category.toLowerCase()}`}>
                {category}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-8 mt-12">
            DESTACADOS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={`featured-home-${product.id}`} product={product} minimalDisplay={true} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">
                VER TODOS LOS PRODUCTOS <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivalProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-8 mt-12">
            NUEVOS INGRESOS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivalProducts.map(product => (
              <ProductCard key={`new-arrival-${product.id}`} product={product} minimalDisplay={true} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section Removed - Now in Footer */}

      {/* Placeholder for other sections from original app if needed */}
      <section className="bg-secondary/50 p-8 rounded-lg shadow mt-12">
         <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Herramientas de IA</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            También puedes probar nuestro redactor de descripciones de productos potenciado por IA.
          </p>
          <Button asChild size="lg">
            <Link href="/ai-copywriter">
              Probar Redactor IA <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
