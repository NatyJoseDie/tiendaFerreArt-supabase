
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { ArrowLeftCircle, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CartItem {
  product: Product;
  quantity: number;
  appliedMargin: number; // Store the margin applied at the time of adding to cart
}

const CLIENT_MARGIN_KEY = 'shopvision_clientOwnMargin';
const DEFAULT_CLIENT_MARGIN = 30; // Default margin if not explicitly set by client

export default function RealizarPedidoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clientMargin, setClientMargin] = useState<number>(DEFAULT_CLIENT_MARGIN);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedMargin = localStorage.getItem(CLIENT_MARGIN_KEY);
    if (storedMargin) {
      const parsedMargin = parseFloat(storedMargin);
      if (!isNaN(parsedMargin)) {
        setClientMargin(parsedMargin);
      }
    }

    const masterProductList = localStorage.getItem('masterProductList');
    let productData;
    if (masterProductList) {
      try {
        productData = JSON.parse(masterProductList);
      } catch (error) {
        console.error("Error parsing masterProductList from localStorage", error);
        productData = getAllProducts();
      }
    } else {
      productData = getAllProducts();
    }
    setProducts(productData);
    setIsLoading(false);
  }, []);

  const getPriceWithMargin = (price: number, margin: number): number => {
    return price * (1 + margin / 100);
  };

  const handleAddToCart = (productToAdd: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product: productToAdd, quantity: 1, appliedMargin: clientMargin }];
    });
    toast({
      title: `${productToAdd.name} añadido al carrito!`,
      description: `Cantidad: 1 (Puedes ajustar en el carrito)`,
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast({
      title: 'Producto eliminado del carrito',
      variant: 'destructive'
    });
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const priceWithMargin = getPriceWithMargin(item.product.price, item.appliedMargin);
      return total + priceWithMargin * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleSubmitOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Carrito vacío',
        description: 'Añade productos antes de enviar el pedido.',
        variant: 'destructive',
      });
      return;
    }
    console.log('Pedido Enviado (simulado):', cartItems);
    toast({
      title: 'Pedido Enviado (Simulación)',
      description: `Total: $${cartTotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Gracias por tu pedido!`,
    });
    // Aquí iría la lógica para enviar el pedido al backend
    // Por ahora, solo limpiamos el carrito
    setCartItems([]);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Realizar Pedido" description="Selecciona los productos que deseas pedir." />
        <Button variant="outline" asChild className="mb-6">
            <Link href="/dashboard/vista-cliente"><ArrowLeftCircle className="mr-2 h-4 w-4"/>Volver al Portal Cliente</Link>
        </Button>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Productos Disponibles</h2>
            {Array.from({length: 6}).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-24 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="md:col-span-1 space-y-4">
             <h2 className="text-xl font-semibold">Tu Carrito</h2>
            <Card className="animate-pulse">
              <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-9 w-28 rounded-md" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Realizar Pedido" description="Selecciona los productos que deseas pedir." />
      
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vista-cliente"><ArrowLeftCircle className="mr-2 h-4 w-4"/>Volver al Portal Cliente</Link>
      </Button>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Product Listing */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Productos Disponibles</h2>
          {products.length > 0 ? (
            products.map(product => {
              const displayPrice = getPriceWithMargin(product.price, clientMargin);
              const imageSrc = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100x100.png?text=No+Img';
              const imageHint = imageSrc.includes('placehold.co') ? product.category.toLowerCase() + " " + product.name.split(" ")[0].toLowerCase() : undefined;
              return (
                <Card key={product.id} className="shadow">
                  <CardContent className="flex items-center justify-between p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-md border object-cover aspect-square"
                        data-ai-hint={imageHint}
                      />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
                        <p className="text-primary font-medium text-sm sm:text-base">
                          ${displayPrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Precio base: ${product.price.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleAddToCart(product)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-muted-foreground">No hay productos disponibles para cargar.</p>
          )}
        </div>

        {/* Cart Summary */}
        <div className="md:col-span-1 space-y-4 sticky top-24">
          <h2 className="text-xl font-semibold">Tu Carrito</h2>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[50vh] overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Tu carrito está vacío.</p>
              ) : (
                cartItems.map(item => {
                  const itemPriceWithMargin = getPriceWithMargin(item.product.price, item.appliedMargin);
                  return (
                    <div key={item.product.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${itemPriceWithMargin.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u (Margen: {item.appliedMargin}%)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value, 10))}
                          className="w-16 h-8 text-sm p-1"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveFromCart(item.product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
            {cartItems.length > 0 && (
              <>
                <Separator />
                <CardFooter className="flex flex-col gap-3 pt-4">
                  <div className="flex justify-between w-full font-semibold text-lg">
                    <span>Total:</span>
                    <span>${cartTotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Button className="w-full" onClick={handleSubmitOrder} size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Enviar Pedido
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
