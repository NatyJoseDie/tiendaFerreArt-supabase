
'use client';

import type { Product } from '@/lib/types';
import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  product: Product;
  quantity: number;
  priceAtAddition: number; // Store the price at the time of addition
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: Dispatch<SetStateAction<boolean>>;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopvision_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage", error);
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product: Product, quantityToAdd: number = 1) => {
    if (product.stock <= 0) {
      console.error(`Attempted to add ${product.name} but it's out of stock.`);
      toast({
        title: 'Producto Agotado',
        description: `${product.name} no está disponible actualmente.`,
        variant: 'destructive',
      });
      return;
    }

    if (quantityToAdd <= 0) {
        console.error(`Attempted to add ${product.name} with invalid quantity: ${quantityToAdd}.`);
        toast({
            title: 'Cantidad Inválida',
            description: `Por favor, introduce una cantidad válida para ${product.name}.`,
            variant: 'destructive',
        });
        return;
    }

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantityInCart = existingItem.quantity + quantityToAdd;

        if (newQuantityInCart > product.stock) {
          console.error(`Cannot add ${quantityToAdd} more of ${product.name}. Stock: ${product.stock}, In cart: ${existingItem.quantity}, Requested total: ${newQuantityInCart}`);
          toast({
            title: 'Stock Insuficiente',
            description: `Solo quedan ${product.stock} unidades de ${product.name}. Ya tienes ${existingItem.quantity} en el carrito. No se pueden añadir ${quantityToAdd} más.`,
            variant: 'destructive',
          });
          return prevItems; 
        }
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantityInCart,
        };
        toast({
          title: 'Cantidad Actualizada',
          description: `${product.name} (x${newQuantityInCart}) en tu carrito.`,
        });
        return updatedItems;
      } else {
        if (quantityToAdd > product.stock) {
           console.error(`Cannot add ${quantityToAdd} of ${product.name}. Stock: ${product.stock}`);
           toast({
            title: 'Stock Insuficiente',
            description: `Solo quedan ${product.stock} unidades de ${product.name}. No se pudo añadir la cantidad solicitada de ${quantityToAdd}.`,
            variant: 'destructive',
          });
          return prevItems;
        }
        toast({
          title: 'Producto Añadido',
          description: `${product.name} (x${quantityToAdd}) fue añadido al carrito.`,
        });
        return [...prevItems, { product, quantity: quantityToAdd, priceAtAddition: product.price }];
      }
    });
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          if (quantity <= 0) {
            toast({
              title: 'Producto Eliminado',
              description: `${item.product.name} ha sido eliminado de tu carrito.`,
              variant: 'destructive'
            });
            return null; 
          }
          if (quantity > item.product.stock) {
            toast({
              title: 'Stock Insuficiente',
              description: `Solo quedan ${item.product.stock} unidades de ${item.product.name}.`,
              variant: 'destructive',
            });
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity };
        }
        return item;
      }).filter(item => item !== null) as CartItem[] 
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast({
          title: 'Producto Eliminado',
          description: `${itemToRemove.product.name} ha sido eliminado de tu carrito.`,
          variant: 'destructive'
        });
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: 'Carrito Vacío',
      description: 'Todos los productos han sido eliminados del carrito.',
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.priceAtAddition * item.quantity,
      0
    );
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        getCartTotal,
        getItemCount,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
