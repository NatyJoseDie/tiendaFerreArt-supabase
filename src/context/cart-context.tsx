
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
        // Basic validation for parsedCart structure
        if (Array.isArray(parsedCart) && parsedCart.every(item => item.product && typeof item.quantity === 'number')) {
          setCartItems(parsedCart);
          console.log("CartProvider: Cart loaded from localStorage:", parsedCart);
        } else {
          console.error("CartProvider: Parsed cart from localStorage is not valid. Resetting cart.", parsedCart);
          localStorage.removeItem(CART_STORAGE_KEY); // Remove invalid cart
          setCartItems([]);
        }
      } catch (error) {
        console.error("CartProvider: Error parsing cart from localStorage", error);
        localStorage.removeItem(CART_STORAGE_KEY); // Remove corrupted cart
        setCartItems([]);
      }
    } else {
        console.log("CartProvider: No cart found in localStorage.");
    }
  }, []); // Empty dependency array, runs once on mount

  useEffect(() => {
    console.log("CartProvider: useEffect - Cart items changed (or initial load), saving to localStorage:", cartItems);
    if (cartItems.length > 0 || localStorage.getItem(CART_STORAGE_KEY) !== null) { // Avoid writing empty array if it was never there
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]); // Runs whenever cartItems changes

  const addItem = (product: Product, quantityToAdd: number = 1) => {
    console.log(`CartContext: addItem called with product ID ${product?.id}, name ${product?.name}, quantity ${quantityToAdd}, stock ${product?.stock}`);
    
    if (!product || typeof product.id === 'undefined' || typeof product.name === 'undefined' || typeof product.price === 'undefined' || typeof product.stock === 'undefined') {
        console.error("CartContext: addItem - Product data is incomplete or invalid.", JSON.stringify(product));
        toast({
            title: 'Error de Producto',
            description: 'No se puede añadir un producto con datos incompletos al carrito.',
            variant: 'destructive',
        });
        return;
    }

    if (product.stock <= 0) {
      console.error(`CartContext: Attempted to add ${product.name} but it's out of stock (stock: ${product.stock}).`);
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
      console.log("CartContext: addItem - Inside setCartItems. Current cartItems (prevItems):", JSON.stringify(prevItems));
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );
      console.log(`CartContext: addItem - Existing item index for product ID ${product.id}: ${existingItemIndex}`);

      let updatedItems;

      if (existingItemIndex > -1) {
        const tempUpdatedItems = [...prevItems];
        const existingItem = tempUpdatedItems[existingItemIndex];
        const newQuantityInCart = existingItem.quantity + quantityToAdd;
        console.log(`CartContext: addItem - Product exists. Current quantity: ${existingItem.quantity}, Adding: ${quantityToAdd}, Proposed new quantity: ${newQuantityInCart}, Stock: ${product.stock}`);

        if (newQuantityInCart > product.stock) {
          console.error(`CartContext: Cannot add ${quantityToAdd} more of ${product.name}. Stock: ${product.stock}, In cart: ${existingItem.quantity}, Requested total: ${newQuantityInCart}. Stock limit reached.`);
          toast({
            title: 'Stock Insuficiente',
            description: `Solo quedan ${product.stock} unidades de ${product.name}. Ya tienes ${existingItem.quantity} en el carrito. No se pueden añadir ${quantityToAdd} más.`,
            variant: 'destructive',
          });
          updatedItems = prevItems; // Return previous items if stock limit exceeded
        } else {
          tempUpdatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantityInCart,
            // priceAtAddition remains the same as when first added
          };
          console.log("CartContext: addItem - Updated existing item:", JSON.stringify(tempUpdatedItems[existingItemIndex]));
          toast({
            title: 'Cantidad Actualizada',
            description: `${product.name} (x${newQuantityInCart}) en tu carrito.`,
          });
          updatedItems = tempUpdatedItems;
        }
      } else {
        console.log(`CartContext: addItem - Product ${product.name} is new. Adding quantity: ${quantityToAdd}, Stock: ${product.stock}`);
        if (quantityToAdd > product.stock) {
           console.error(`CartContext: Cannot add ${quantityToAdd} of ${product.name}. Stock: ${product.stock}. Insufficient stock for new item.`);
           toast({
            title: 'Stock Insuficiente',
            description: `Solo quedan ${product.stock} unidades de ${product.name}. No se pudo añadir la cantidad solicitada de ${quantityToAdd}.`,
            variant: 'destructive',
          });
          updatedItems = prevItems; // Return previous items if stock limit exceeded
        } else {
          const newItem = { product, quantity: quantityToAdd, priceAtAddition: product.price };
          console.log("CartContext: addItem - Adding new item:", JSON.stringify(newItem));
          toast({
            title: 'Producto Añadido',
            description: `${product.name} (x${quantityToAdd}) fue añadido al carrito.`,
          });
          updatedItems = [...prevItems, newItem];
        }
      }
      console.log("CartContext: addItem - setCartItems will be called with:", JSON.stringify(updatedItems));
      return updatedItems;
    });
    console.log("CartContext: addItem - After setCartItems call (note: state update is async).");
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    console.log(`CartContext: updateItemQuantity called for productId ${productId} with quantity ${quantity}`);
    setCartItems((prevItems) => {
      let itemUpdated = false;
      const updatedItems = prevItems.map((item) => {
        if (item.product.id === productId) {
          itemUpdated = true;
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
              description: `Solo quedan ${item.product.stock} unidades de ${item.product.name}. Cantidad ajustada.`,
              variant: 'destructive',
            });
            return { ...item, quantity: item.product.stock };
          }
          console.log(`CartContext: updateItemQuantity - Updating ${item.product.name} to quantity ${quantity}.`);
          return { ...item, quantity };
        }
        return item;
      }).filter(item => item !== null) as CartItem[];

      if (itemUpdated && updatedItems.find(i => i.product.id === productId)?.quantity === quantity) {
         toast({
            title: 'Cantidad Actualizada',
            description: `La cantidad para ${prevItems.find(i => i.product.id === productId)?.product.name} es ahora ${quantity}.`,
        });
      }
      return updatedItems;
    });
  };

  const removeItem = (productId: string) => {
    console.log(`CartContext: removeItem called for productId ${productId}`);
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.product.id === productId);
      const newItems = prevItems.filter((item) => item.product.id !== productId);
      if (itemToRemove) {
        toast({
          title: 'Producto Eliminado',
          description: `${itemToRemove.product.name} ha sido eliminado de tu carrito.`,
          variant: 'destructive'
        });
      }
      return newItems;
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
    // console.log("CartContext: getCartTotal calculated:", total); // Frequent log, can be noisy
    return total;
  };

  const getItemCount = () => {
    const count = cartItems.reduce((count, item) => count + item.quantity, 0);
    // console.log("CartContext: getItemCount calculated:", count); // Frequent log, can be noisy
    return count;
  };

  const toggleCart = () => {
    console.log("CartContext: toggleCart called. Current state:", isCartOpen, "New state:", !isCartOpen);
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

