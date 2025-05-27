
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getAllProducts } from '@/data/mock-products';
import type { Product } from '@/lib/types';
import { ArrowLeftCircle, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StockStatusBadge } from '@/components/products/StockStatusBadge';

interface CartItem {
  product: Product;
  quantity: number;
  priceAtAddition: number; 
}

const COMMERCE_MARGIN_PERCENTAGE = 20; 
const MASTER_PRODUCT_LIST_KEY = 'masterProductList';


export default function RealizarPedidoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const masterProductList = localStorage.getItem(MASTER_PRODUCT_LIST_KEY);
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

  const getCommercePrice = (basePrice: number): number => {
    return basePrice * (1 + COMMERCE_MARGIN_PERCENTAGE / 100);
  };

  const handleAddToCart = (productToAdd: Product) => {
    if (productToAdd.stock <= 0) {
        toast({
            title: 'Producto sin stock',
            description: `${productToAdd.name} no está disponible actualmente.`,
            variant: 'destructive',
        });
        return;
    }
    const commercePrice = getCommercePrice(productToAdd.price);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product: productToAdd, quantity: 1, priceAtAddition: commercePrice }];
    });
    toast({
      title: `${productToAdd.name} añadido al carrito!`,
      description: `Precio unitario: $${commercePrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
      return total + item.priceAtAddition * item.quantity;
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
    
    console.log('Pedido Enviado (simulado):', cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.priceAtAddition,
      totalPrice: item.priceAtAddition * item.quantity,
      stockOriginal: item.product.stock 
    })));
    toast({
      title: 'Pedido Enviado (Simulación)',
      description: `Total: $${cartTotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Gracias por tu pedido! (Esto es una simulación, el pedido no se ha procesado realmente).`,
    });
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
      <PageHeader title="Realizar Pedido" description="Selecciona los productos que deseas pedir. Los precios mostrados son tus precios de compra (costo + 20%)." />
      
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vista-cliente"><ArrowLeftCircle className="mr-2 h-4 w-4"/>Volver al Portal Cliente</Link>
      </Button>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Productos Disponibles</h2>
          {products.length > 0 ? (
            products.map(product => {
              const commercePrice = getCommercePrice(product.price);
              const imageSrc = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100x100.png?text=No+Img';
              const imageHint = imageSrc.includes('placehold.co') ? product.category.toLowerCase() + " " + product.name.split(" ")[0].toLowerCase() : undefined;
              return (
                <Card key={product.id} className="shadow">
                  <CardContent className="flex items-center justify-between p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="rounded-md border object-cover aspect-square"
                          data-ai-hint={imageHint}
                        />
                        <StockStatusBadge stock={product.stock} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
                        <p className="text-primary font-medium text-sm sm:text-base">
                          ${commercePrice.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleAddToCart(product)} disabled={product.stock <= 0}>
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
                  return (
                    <div key={item.product.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${item.priceAtAddition.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
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
