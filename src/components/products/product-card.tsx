
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  minimalDisplay?: boolean; 
}

export function ProductCard({ product, minimalDisplay = false }: ProductCardProps) {
  // Usar una imagen placeholder local en lugar de servicios externos
  const firstImage = product.images[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZTVlN2ViIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmaWxsPSIjNmI3MjgwIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Qcm9kdWN0bzwvdGV4dD4KPC9zdmc+';
  const imageHint = firstImage.includes('placeholder') || firstImage.includes('placehold') || firstImage.includes('data:image') ? product.category.toLowerCase() + " " + product.name.split(" ")[0].toLowerCase() : undefined;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} aria-label={`Ver detalles de ${product.name}`}>
          <Image
            src={firstImage}
            alt={product.name}
            width={400}
            height={400}
            className="aspect-square object-cover w-full"
            data-ai-hint={imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className={cn("p-4 flex-grow", minimalDisplay ? 'pb-3' : '')}>
        <Link href={`/products/${product.id}`}>
            <CardTitle className={cn(
                "font-semibold hover:text-primary transition-colors text-base", // text-base for all
                minimalDisplay ? 'text-center' : '' // Centered for minimal display
            )}>
            {product.name}
            </CardTitle>
        </Link>
        {!minimalDisplay && (
          <>
            <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden text-ellipsis">
              {product.description}
            </p>
            <div className="mt-2">
              <Badge variant="secondary">{product.category}</Badge>
            </div>
          </>
        )}
        {minimalDisplay && product.category && (
           <div className="mt-1.5 text-center"> 
             <Badge variant="outline" className="text-xs">{product.category}</Badge>
           </div>
        )}
      </CardContent>
      {!minimalDisplay && (
        <CardFooter className="p-4 flex justify-between items-center">
          <p className="text-xl font-bold text-primary">
            {product.currency || '$'}{product.price.toFixed(2)}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/products/${product.id}`}>
              Detalles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
