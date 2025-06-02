import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailsLoading() {
  return (
    <div className="space-y-10">
      <PageHeader title={<Skeleton className="h-10 w-3/4" />} description={<Skeleton className="h-6 w-1/2" />} />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Card className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
          </Card>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-4">
            {Array.from({length: 4}).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/5" /> {/* Nombre del Producto */}
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-1/3" /> {/* Precio */}
              <Skeleton className="h-6 w-1/4" /> {/* Indicador de Stock */}
              <Skeleton className="h-4 w-full" /> {/* Descripción Corta Línea 1 */}
              <Skeleton className="h-4 w-5/6" /> {/* Descripción Corta Línea 2 */}
              <Skeleton className="h-12 w-full mt-4" /> {/* Botón Añadir al Carrito */}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
