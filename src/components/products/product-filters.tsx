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
  products: Product[]; // Pass products to determine min/max price
}

export function ProductFilters({ categories, onFilterChange, products }: ProductFiltersProps) {
  const [category, setCategory] = useState<string>('all');
  
  // Determine min and max price from products for slider initialization
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000); // Default max
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const currentMin = Math.min(...prices);
      const currentMax = Math.max(...prices);
      setMinPrice(currentMin);
      setMaxPrice(currentMax);
      setPriceRange([currentMin, currentMax]);
    }
  }, [products]);
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    // TODO: Implement actual filtering: onFilterChange({ category: value, priceRange, searchTerm });
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
     // TODO: Implement actual filtering
  };
  
  const applyFilters = () => {
    // This function would be called to trigger the actual filtering logic
    // For now, it's a placeholder.
    console.log("Applying filters:", { category, priceRange });
    // onFilterChange({ category, priceRange, searchTerm }); // Assuming searchTerm comes from elsewhere
  };


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Filter Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="category-select" className="mb-2 block font-medium">Category</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category-select" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block font-medium">Price Range</Label>
          <Slider
            min={minPrice}
            max={maxPrice}
            step={1}
            value={priceRange}
            onValueChange={(value) => handlePriceChange(value as [number, number])}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        
        {/* In a real app, you'd call onFilterChange here or have an Apply button */}
        {/* <Button onClick={applyFilters} className="w-full">Apply Filters</Button> */}
        <p className="text-xs text-muted-foreground text-center">
          Note: Filter application logic is a placeholder.
        </p>
      </CardContent>
    </Card>
  );
}
