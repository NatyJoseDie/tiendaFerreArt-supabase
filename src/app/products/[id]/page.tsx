
'use client'; 

import { getProductById } from '@/data/mock-products';
import { notFound, useParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
// import { StockIndicator } from '@/components/products/stock-indicator'; // Replaced by direct stock display
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ShoppingCart, Tag, ListChecks, MessageSquare, Minus, Plus, Package } from 'lucide-react';
import type { ProductSpecification, ProductReview as ReviewType, Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function ProductDetailsPage() {
  const { addItem } = useCart();
  const params = useParams();
  const productId = params.id as string;
  const { toast } = useToast(); // Initialize toast

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(`ProductDetailsPage: useEffect triggered for productId: ${productId}`);
    setIsLoading(true);
    const fetchedProduct = getProductById(productId);
    console.log("ProductDetailsPage: Fetched product from mock data:", fetchedProduct);
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      if (fetchedProduct.stock <= 0) {
        setQuantity(0); // Product is out of stock
        console.log("ProductDetailsPage: Product out of stock, setting quantity to 0.");
      } else {
        setQuantity(1); // Default to 1 if in stock
        console.log("ProductDetailsPage: Product in stock, setting quantity to 1.");
      }
    } else {
      console.warn("ProductDetailsPage: Product not found for ID:", productId);
      // Consider calling notFound() here if product is truly not found after initial load attempt
      // For now, product will remain null, and UI should reflect that.
    }
    setIsLoading(false);
  }, [productId]);

  const handleAddToCart = () => {
    console.log("ProductDetailsPage: handleAddToCart triggered.");
    console.log("ProductDetailsPage: Current product state:", JSON.stringify(product)); // Log product state
    console.log("ProductDetailsPage: Current quantity state:", quantity);
    console.log("ProductDetailsPage: Current isLoading state:", isLoading);

    if (isLoading) {
      console.warn("ProductDetailsPage: Add to cart called while product details are loading.");
      toast({ title: "Cargando...", description: "Espere a que carguen los detalles del producto.", variant: "default" });
      return;
    }

    if (!product || typeof product.id === 'undefined' || typeof product.stock === 'undefined' || typeof product.price === 'undefined' || typeof product.name === 'undefined') {
      console.error("ProductDetailsPage: Product data is not available, incomplete, or invalid.", product);
      toast({ title: "Error de Producto", description: "Datos del producto no disponibles o incompletos. Intente recargar la página.", variant: "destructive" });
      return;
    }
    
    if (product.stock <= 0) {
       console.warn(`ProductDetailsPage: Product ${product.name} is out of stock (stock: ${product.stock}).`);
       toast({ title: "Producto Agotado", description: `${product.name} no tiene stock disponible.`, variant: "destructive" });
       return;
    }

    if (quantity <= 0) {
      console.warn("ProductDetailsPage: Quantity is zero or less. Cannot add to cart.");
      toast({ title: "Cantidad Inválida", description: "Por favor, seleccione una cantidad mayor a cero.", variant: "destructive" });
      return;
    }

    if (quantity > product.stock) {
      console.warn(`ProductDetailsPage: Requested quantity ${quantity} exceeds available stock ${product.stock}.`);
      toast({ title: "Stock Insuficiente", description: `No puede añadir más de ${product.stock} unidades de ${product.name}.`, variant: "destructive" });
      return;
    }
    
    console.log(`ProductDetailsPage: All checks passed. Proceeding to call addItem with product ID ${product.id}, name ${product.name}, quantity ${quantity}`);
    addItem(product, quantity);
    console.log("ProductDetailsPage: addItem function call has been invoked.");
  };

  const handleQuantityChange = (amount: number) => {
    if (!product) return; // Should not happen if UI is correct
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + amount;
      if (newQuantity < 1) return 1;
      if (newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  const handleManualQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return; // Should not happen
    let value = parseInt(e.target.value, 10);

    if (isNaN(value)) { // Handle empty input or non-numeric
        setQuantity(product.stock > 0 ? 1 : 0); // Default to 1 if in stock, else 0
        return;
    }
    if (value < 1 && product.stock > 0) { // If user types 0 or less, but stock exists
        value = 1;
    } else if (value < 0 && product.stock === 0) { // If stock is 0, quantity cannot be < 0
        value = 0;
    } else if (value > product.stock) { // Cap at available stock
        value = product.stock;
    }
    setQuantity(value);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(null).map((_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-muted-foreground">Cargando detalles del producto...</div>
      </div>
    );
  }

  if (!product) {
    console.error("ProductDetailsPage: Product is null after loading, rendering notFound.");
    // It's possible getProductById returned undefined and product state remained null
    return notFound(); 
  }
  
  const isAddToCartDisabled = isLoading || !product || product.stock <= 0 || quantity <= 0 || quantity > product.stock;

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
              
              <div className="font-medium text-sm flex items-center mt-4">
                <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                Stock disponible: <span className="font-bold ml-1">{product.stock} unidades</span>
              </div>

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

              {product.stock > 0 ? (
                <>
                  <div className="flex items-center space-x-3 mt-2">
                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={quantity.toString()} // Ensure value is string for controlled input
                      onChange={handleManualQuantityInput}
                      onBlur={() => { 
                          // Ensure quantity is valid on blur
                          if (!product) return;
                          if (quantity < 1 && product.stock > 0) setQuantity(1);
                          else if (product.stock === 0) setQuantity(0); // If stock is 0, quantity must be 0
                          else if (quantity < 1 && product.stock === 0 ) setQuantity(0);
                          else if (quantity > product.stock) setQuantity(product.stock);
                      }}
                      min={product.stock > 0 ? 1: 0}
                      max={product.stock}
                      className="w-16 text-center h-10"
                      disabled={product.stock === 0} // Disable if no stock
                    />
                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="lg" className="w-full mt-4" onClick={handleAddToCart} disabled={isAddToCartDisabled}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Añadir al Carrito
                  </Button>
                </>
              ) : (
                <p className="mt-4 p-3 bg-muted text-muted-foreground rounded-md text-center">Este producto está agotado.</p>
              )}
              
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
                        <AvatarImage src={review.avatarUrl || `https://placehold.co/40x40.png?text=${review.author.charAt(0)}`} alt={review.author} data-ai-hint="avatar person"/>
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

