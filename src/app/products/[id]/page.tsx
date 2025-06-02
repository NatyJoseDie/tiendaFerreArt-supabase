import { getProductById } from '@/data/mock-products';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { StockIndicator } from '@/components/products/stock-indicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ShoppingCart, Tag, ListChecks, MessageSquare } from 'lucide-react';
import type { ProductSpecification, ProductReview as ReviewType } from '@/lib/types';

export async function generateStaticParams() {
  const { mockProducts } = await import('@/data/mock-products');
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const renderStars = (rating: number) => {
    return Array(5).fill(null).map((_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
    ));
  };

  return (
    <div className="space-y-10">
      <PageHeader title={product.name} description={`Categoría: ${product.category}`} />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <ProductImageGallery images={product.images} altText={product.name} productNameHint={product.name} />
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold text-foreground">
                {product.currency || '$'}{product.price.toFixed(2)}
              </p>
              <StockIndicator stock={product.stock} />
              <p className="text-muted-foreground">{product.description}</p>
              
              {product.brand && (
                <p className="text-sm">
                  <span className="font-semibold">Marca:</span> {product.brand}
                </p>
              )}
              {product.sku && (
                <p className="text-sm">
                  <span className="font-semibold">SKU:</span> {product.sku}
                </p>
              )}

              <Button size="lg" className="w-full mt-4" disabled={product.stock === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
              </Button>
              
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-1">Etiquetas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                       <span key={tag} className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md flex items-center">
                        <Tag className="h-3 w-3 mr-1" /> {tag}
                       </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="description"><ListChecks className="mr-2 h-4 w-4"/>Descripción</TabsTrigger>
          <TabsTrigger value="specifications"><ListChecks className="mr-2 h-4 w-4"/>Especificaciones</TabsTrigger>
          <TabsTrigger value="reviews"><MessageSquare className="mr-2 h-4 w-4"/>Reseñas ({product.reviews?.length || 0})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Producto</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert text-foreground">
              {product.longDescription || product.description}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications">
          <Card>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {product.specifications && product.specifications.length > 0 ? (
                <ul className="space-y-2">
                  {product.specifications.map((spec: ProductSpecification) => (
                    <li key={spec.key} className="flex justify-between border-b pb-2">
                      <span className="font-medium text-muted-foreground">{spec.key}:</span>
                      <span className="text-foreground">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No hay especificaciones disponibles para este producto.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reseñas de Clientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: ReviewType) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={review.avatarUrl || `https://placehold.co/40x40.png?text=${review.author.charAt(0)}`} alt={review.author} data-ai-hint="avatar person" />
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{review.author}</p>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No hay reseñas para este producto todavía.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
