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
        placeholder="Buscar productos por nombre o palabra clave..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
        aria-label="Buscar productos"
      />
      <Button type="submit" aria-label="Buscar">
        <Search className="h-4 w-4 mr-2 sm:mr-0" />
        <span className="hidden sm:inline">Buscar</span>
      </Button>
    </form>
  );
}
