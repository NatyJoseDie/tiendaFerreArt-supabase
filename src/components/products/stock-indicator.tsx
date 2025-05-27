import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface StockIndicatorProps {
  stock: number;
}

export function StockIndicator({ stock }: StockIndicatorProps) {
  if (stock > 10) {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
        <CheckCircle className="mr-1 h-4 w-4" />
        In Stock ({stock})
      </Badge>
    );
  } else if (stock > 0) {
    return (
      <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-black">
        <AlertTriangle className="mr-1 h-4 w-4" />
        Low Stock ({stock})
      </Badge>
    );
  } else {
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-4 w-4" />
        Out of Stock
      </Badge>
    );
  }
}
