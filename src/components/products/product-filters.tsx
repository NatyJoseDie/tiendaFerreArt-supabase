'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';

interface ProductFiltersProps {
  categories: string[];
  onFilterChange: (filters: { category: string; priceRange: [number, number]; searchTerm: string }) => void;
  products: Product[]; 
}

export function ProductFilters({ categories, onFilterChange, products }: ProductFiltersProps) {
  const [category, setCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
      setCurrentPriceRange([min, max]); // Initialize slider with actual product price range
    }
  }, [products]);
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ category: value, priceRange: currentPriceRange, searchTerm: '' });
  };

  const handlePriceChangeCommit = (newRange: [number, number]) => {
    setCurrentPriceRange(newRange);
    onFilterChange({ category, priceRange: newRange, searchTerm: '' });
  };


  return (
    <Card className="shadow-md sticky top-24">
      <CardHeader>
        <CardTitle>Filtrar Productos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="category-select" className="mb-2 block font-medium">Categoría</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category-select" className="w-full">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block font-medium">Rango de Precio</Label>
          <Slider
            min={minPrice}
            max={maxPrice}
            step={1}
            value={currentPriceRange}
            onValueChange={(value) => setCurrentPriceRange(value as [number, number])} // Update value on drag
            onValueCommit={handlePriceChangeCommit} // Apply filter on release
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${currentPriceRange[0]}</span>
            <span>${currentPriceRange[1]}</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center pt-2">
          Los filtros se aplican automáticamente al cambiar.
        </p>
      </CardContent>
    </Card>
  );
}
