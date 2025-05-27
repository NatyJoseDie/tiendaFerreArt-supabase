
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  const [wantsOfficialInvoice, setWantsOfficialInvoice] = useState(false);
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
            ? { ...item, quantity: Math.min(item.quantity + 1, productToAdd.stock) } // Prevent adding more than stock
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
    const productInCart = cartItems.find(item => item.product.id === productId)?.product;
    if (!productInCart) return;

    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    // Prevent setting quantity higher than stock
    const quantity = Math.min(newQuantity, productInCart.stock);

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
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

    const orderDetails = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.priceAtAddition,
        totalPrice: item.priceAtAddition * item.quantity,
      })),
      totalAmount: cartTotal,
      invoiceOption: wantsOfficialInvoice ? "Factura Oficial" : "Remito X",
      timestamp: new Date().toISOString(),
    };

    console.log('Pedido Enviado (simulado):', orderDetails);
    toast({
      title: 'Pedido Enviado (Simulación)',
      description: `Total: $${cartTotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Opción de comprobante: ${orderDetails.invoiceOption}. (Esto es una simulación, el pedido no se ha procesado realmente).`,
      duration: 5000,
    });
    setCartItems([]);
    setWantsOfficialInvoice(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Realizar Pedido" description="Selecciona los productos que deseas pedir." />
        <Button variant="outline" asChild className="mb-6">
          <Link href="/dashboard/vista-cliente"><ArrowLeftCircle className="mr-2 h-4 w-4" />Volver al Portal Cliente</Link>
        </Button>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Productos Disponibles</h2>
            {Array.from({ length: 6 }).map((_, i) => (
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
      <PageHeader title="Realizar Pedido" description="Selecciona los productos que deseas pedir. Los precios mostrados son tus precios de compra." />

      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard/vista-cliente"><ArrowLeftCircle className="mr-2 h-4 w-4" />Volver al Portal Cliente</Link>
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
                        {/* No mostrar tu costo base aquí */}
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
            <CardContent className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                          max={item.product.stock} // Max quantity is stock
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
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="officialInvoice"
                      checked={wantsOfficialInvoice}
                      onCheckedChange={(checked) => setWantsOfficialInvoice(checked as boolean)}
                    />
                    <Label htmlFor="officialInvoice" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Solicitar Factura Oficial
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Si no se marca, se generará un Remito X como comprobante de entrega.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-4">
                  <div className="flex justify-between w-full font-semibold text-lg">
                    <span>Total:</span>
                    <span>${cartTotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Button className="w-full" onClick={handleSubmitOrder} size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Enviar Pedido
                  </Button>
                   <p className="text-xs text-muted-foreground text-center mt-2">
                    Nota: El envío del pedido es una simulación. En una aplicación real, se conectaría a un sistema de gestión.
                  </p>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

