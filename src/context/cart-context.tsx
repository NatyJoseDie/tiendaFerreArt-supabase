
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
      toast({
        title: 'Producto Agotado',
        description: `${product.name} no está disponible actualmente.`,
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
        const newQuantity = existingItem.quantity + quantityToAdd;

        if (newQuantity > product.stock) {
          toast({
            title: 'Stock Insuficiente',
            description: `Solo quedan ${product.stock} unidades de ${product.name}. No se pudo añadir la cantidad solicitada. Cantidad actual en carrito: ${existingItem.quantity}.`,
            variant: 'destructive',
          });
          // Optionally, set quantity to max available stock instead of doing nothing
          // updatedItems[existingItemIndex] = {
          //   ...existingItem,
          //   quantity: product.stock,
          // };
          // return updatedItems;
          return prevItems; // Or do not change if not enough stock for additional quantity
        }
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        toast({
          title: 'Cantidad Actualizada',
          description: `${product.name} (x${newQuantity}) en tu carrito.`,
        });
        return updatedItems;
      } else {
        if (quantityToAdd > product.stock) {
           toast({
            title: 'Stock Insuficiente',
            description: `Solo quedan ${product.stock} unidades de ${product.name}. No se pudo añadir la cantidad solicitada.`,
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
            // This case should ideally be handled by removeItem or a separate flow
            // For now, let's prevent quantity from going below 1 via direct update here.
            // Or, alternatively, remove if quantity is 0.
            // Let's remove if quantity becomes 0 or less.
            toast({
              title: 'Producto Eliminado',
              description: `${item.product.name} ha sido eliminado de tu carrito.`,
              variant: 'destructive'
            });
            return null; // This will be filtered out
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
      }).filter(item => item !== null) as CartItem[] // Filter out null items
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

