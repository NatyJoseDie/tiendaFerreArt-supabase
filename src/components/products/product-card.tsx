
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

interface ProductCardProps {
  product: Product;
  minimalDisplay?: boolean; // Nueva prop
}

export function ProductCard({ product, minimalDisplay = false }: ProductCardProps) {
  const firstImage = product.images[0] || 'https://placehold.co/400x400.png';
  const imageHint = firstImage.includes('placehold.co') ? product.category.toLowerCase() + " " + product.name.split(" ")[0].toLowerCase() : undefined;


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
      <CardContent className={`p-4 flex-grow ${minimalDisplay ? 'pb-3' : ''}`}> {/* Ajustado pb para minimalDisplay */}
        <Link href={`/products/${product.id}`}>
            <CardTitle className={`font-semibold hover:text-primary transition-colors ${minimalDisplay ? 'text-center text-base' : 'text-base'}`}> {/* Cambiado a text-base para ambas vistas */}
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
           <div className="mt-1.5 text-center"> {/* Ajustado mt */}
             <Badge variant="outline" className="text-xs">{product.category}</Badge> {/* Hecho Badge más pequeño */}
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
