'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialTerm?: string;
}

export function SearchBar({ onSearch, initialTerm = '' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder="Search products by name or keyword..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
        aria-label="Search products"
      />
      <Button type="submit" aria-label="Search">
        <Search className="h-4 w-4 mr-2 sm:mr-0" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
