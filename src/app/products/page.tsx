
'use client'; // For managing filter state and search

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { SearchBar } from '@/components/products/search-bar';
import { getAllProducts, getCategories as fetchCategories } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Added import
import { Frown } from 'lucide-react';

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // Default, will be updated

  useEffect(() => {
    const loadData = () => {
      const products = getAllProducts();
      const fetchedCategories = fetchCategories();
      setAllProducts(products);
      setFilteredProducts(products); // Initially show all
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

    // Filter by search term
    if (searchTerm) {
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      currentProducts = currentProducts.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    currentProducts = currentProducts.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    setFilteredProducts(currentProducts);
  }, [searchTerm, selectedCategory, priceRange, allProducts]);


  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters: { category: string; priceRange: [number, number]; searchTerm: string }) => {
    setSelectedCategory(filters.category);
    setPriceRange(filters.priceRange);
    // setSearchTerm(filters.searchTerm); // Search term handled by SearchBar directly
  };

  const ProductListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Product Catalog"
        description="Browse our wide selection of products. Use the filters and search to find exactly what you need."
      />

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          {!isLoading ? (
            <ProductFilters 
              categories={categories} 
              onFilterChange={handleFilterChange} 
              products={allProducts} // Pass all products to determine min/max price
            />
          ) : (
            <Card>
              <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          )}
        </aside>

        <main className="lg:col-span-3">
          {isLoading ? (
            <ProductListSkeleton />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Alert variant="default" className="bg-card border-border shadow-sm">
              <Frown className="h-5 w-5 text-muted-foreground" />
              <AlertTitle className="font-semibold">No Products Found</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Sorry, we couldn't find any products matching your criteria. Try adjusting your filters or search term.
              </AlertDescription>
            </Alert>
          )}
        </main>
      </div>
    </div>
  );
}
