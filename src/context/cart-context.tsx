
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
    console.log("CartProvider: useEffect - Loading cart from localStorage.");
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        console.log("CartProvider: Cart loaded from localStorage:", parsedCart);
      } catch (error) {
        console.error("CartProvider: Error parsing cart from localStorage", error);
        setCartItems([]);
      }
    } else {
        console.log("CartProvider: No cart found in localStorage.");
    }
  }, []);

  useEffect(() => {
    console.log("CartProvider: useEffect - Cart items changed, saving to localStorage:", cartItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product: Product, quantityToAdd: number = 1) => {
    console.log(`CartContext: addItem called with product ID ${product?.id} and quantity ${quantityToAdd}`);
    
    if (!product || !product.id) {
        console.error("CartContext: addItem - Product or product ID is undefined.", product);
        toast({
            title: 'Error de Producto',
            description: 'No se puede añadir un producto inválido al carrito.',
            variant: 'destructive',
        });
        return;
    }

    if (product.stock <= 0) {
      console.error(`CartContext: Attempted to add ${product.name} but it's out of stock.`);
      toast({
        title: 'Producto Agotado',
        description: `${product.name} no está disponible actualmente.`,
        variant: 'destructive',
      });
      return;
    }

    if (quantityToAdd <= 0) {
        console.error(`CartContext: Attempted to add ${product.name} with invalid quantity: ${quantityToAdd}.`);
        toast({
            title: 'Cantidad Inválida',
            description: `Por favor, introduce una cantidad válida para ${product.name}.`,
            variant: 'destructive',
        });
        return;
    }

    setCartItems((prevItems) => {
      console.log("CartContext: addItem - Current cartItems (prevItems):", prevItems);
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );
      console.log(`CartContext: addItem - Existing item index for product ID ${product.id}: ${existingItemIndex}`);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantityInCart = existingItem.quantity + quantityToAdd;
        console.log(`CartContext: addItem - Product exists. Current quantity: ${existingItem.quantity}, Adding: ${quantityToAdd}, New quantity: ${newQuantityInCart}, Stock: ${product.stock}`);

        if (newQuantityInCart > product.stock) {
          console.error(`CartContext: Cannot add ${quantityToAdd} more of ${product.name}. Stock: ${product.stock}, In cart: ${existingItem.quantity}, Requested total: ${newQuantityInCart}`);
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
        console.log("CartContext: addItem - Updated existing item:", updatedItems[existingItemIndex]);
        toast({
          title: 'Cantidad Actualizada',
          description: `${product.name} (x${newQuantityInCart}) en tu carrito.`,
        });
        return updatedItems;
      } else {
        console.log(`CartContext: addItem - Product is new. Adding: ${quantityToAdd}, Stock: ${product.stock}`);
        if (quantityToAdd > product.stock) {
           console.error(`CartContext: Cannot add ${quantityToAdd} of ${product.name}. Stock: ${product.stock}`);
           toast({
            title: 'Stock Insuficiente',
            description: `Solo quedan ${product.stock} unidades de ${product.name}. No se pudo añadir la cantidad solicitada de ${quantityToAdd}.`,
            variant: 'destructive',
          });
          return prevItems;
        }
        const newItem = { product, quantity: quantityToAdd, priceAtAddition: product.price };
        console.log("CartContext: addItem - Adding new item:", newItem);
        toast({
          title: 'Producto Añadido',
          description: `${product.name} (x${quantityToAdd}) fue añadido al carrito.`,
        });
        return [...prevItems, newItem];
      }
    });
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    console.log(`CartContext: updateItemQuantity called for productId ${productId} with quantity ${quantity}`);
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          if (quantity <= 0) {
            console.log(`CartContext: updateItemQuantity - Removing product ${item.product.name} due to quantity <= 0.`);
            toast({
              title: 'Producto Eliminado',
              description: `${item.product.name} ha sido eliminado de tu carrito.`,
              variant: 'destructive'
            });
            return null; 
          }
          if (quantity > item.product.stock) {
            console.warn(`CartContext: updateItemQuantity - Quantity ${quantity} for ${item.product.name} exceeds stock ${item.product.stock}. Setting to max stock.`);
            toast({
              title: 'Stock Insuficiente',
              description: `Solo quedan ${item.product.stock} unidades de ${item.product.name}.`,
              variant: 'destructive',
            });
            return { ...item, quantity: item.product.stock };
          }
          console.log(`CartContext: updateItemQuantity - Updating ${item.product.name} to quantity ${quantity}.`);
          return { ...item, quantity };
        }
        return item;
      }).filter(item => item !== null) as CartItem[] 
    );
  };

  const removeItem = (productId: string) => {
    console.log(`CartContext: removeItem called for productId ${productId}`);
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
    console.log("CartContext: clearCart called.");
    setCartItems([]);
    toast({
      title: 'Carrito Vacío',
      description: 'Todos los productos han sido eliminados del carrito.',
    });
  };

  const getCartTotal = () => {
    const total = cartItems.reduce(
      (total, item) => total + item.priceAtAddition * item.quantity,
      0
    );
    // console.log("CartContext: getCartTotal calculated:", total);
    return total;
  };

  const getItemCount = () => {
    const count = cartItems.reduce((count, item) => count + item.quantity, 0);
    // console.log("CartContext: getItemCount calculated:", count);
    return count;
  };

  const toggleCart = () => {
    console.log("CartContext: toggleCart called.");
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
