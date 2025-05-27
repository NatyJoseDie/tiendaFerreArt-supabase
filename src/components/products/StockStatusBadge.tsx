
'use client';

import { Badge } from '@/components/ui/badge';

interface StockStatusBadgeProps {
  stock: number;
}

export function StockStatusBadge({ stock }: StockStatusBadgeProps) {
  if (stock <= 0) {
    return (
      <Badge
        variant="destructive"
        className="absolute top-2 left-2 z-10 bg-pink-500 text-white border-pink-500 text-xs px-2 py-1 shadow-lg"
      >
        SIN STOCK
      </Badge>
    );
  }
  return null;
}
