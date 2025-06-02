
'use client'; 

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { SearchBar } from '@/components/products/search-bar';
import { getAllProducts, getCategories as fetchCategories } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Frown } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); 

  useEffect(() => {
    const loadData = () => {
      const products = getAllProducts();
      const fetchedCategories = fetchCategories();
      setAllProducts(products);
      setFilteredProducts(products); 
      setCategories(fetchedCategories);

      if (products.length > 0) {
        const prices = products.map(p => p.price);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    let currentProducts = [...allProducts];

    if (searchTerm) {
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedCategory !== 'all') {
      currentProducts = currentProducts.filter(product => product.category === selectedCategory);
    }
    
    currentProducts = currentProducts.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    setFilteredProducts(currentProducts);
  }, [searchTerm, selectedCategory, priceRange, allProducts]);

  const newProducts = useMemo(() => {
    // Tomar los primeros 6 productos como "nuevos"
    return allProducts.slice(0, 6);
  }, [allProducts]);

  const featuredProducts = useMemo(() => {
    return allProducts.filter(p => p.featured);
  }, [allProducts]);


  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters: { category: string; priceRange: [number, number]; searchTerm: string }) => {
    setSelectedCategory(filters.category);
    setPriceRange(filters.priceRange);
  };

  const ProductListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Catálogo de Productos"
          description="Cargando nuestra amplia selección de productos..."
        />
        <div className="mb-6"><Skeleton className="h-10 w-full" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          </aside>
          <main className="lg:col-span-3"><ProductListSkeleton /></main>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <PageHeader
        title="Catálogo de Productos"
        description="Explora nuestra amplia selección de productos. Usa los filtros y la búsqueda para encontrar lo que necesitas."
      />

      {newProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6 text-center">Novedades</h2>
          <Carousel 
            opts={{ align: "start", loop: true }} 
            plugins={[ Autoplay({ delay: 3000, stopOnInteraction: true }) ]} // Aumenté el delay y permito stop on interaction
            className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-1">
              {newProducts.map(product => (
                <CarouselItem key={`new-${product.id}`} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <ProductCard product={product} minimalDisplay={true} /> {/* Usar visualización mínima */}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex left-[-50px]" /> {/* Ajustar posición de botones */}
            <CarouselNext className="hidden sm:flex right-[-50px]" />
          </Carousel>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6 mt-12 text-center">Productos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={`featured-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}
      
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-6 mt-12 text-center">Todos los Productos</h2>
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters 
              categories={categories} 
              onFilterChange={handleFilterChange} 
              products={allProducts}
            />
          </aside>
          <main className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Alert variant="default" className="bg-card border-border shadow-sm">
                <Frown className="h-5 w-5 text-muted-foreground" />
                <AlertTitle className="font-semibold">No se encontraron productos</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Lo sentimos, no pudimos encontrar ningún producto que coincida con tus criterios. Intenta ajustar los filtros o el término de búsqueda.
                </AlertDescription>
              </Alert>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
