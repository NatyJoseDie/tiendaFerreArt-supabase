
'use client';

import type { Product } from '@/lib/types';
import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  product: Product;
  quantity: number;
  priceAtAddition: number;
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
  const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false);

  useEffect(() => {
    // Check for localStorage availability on mount
    try {
      localStorage.setItem('__test_localstorage__', 'test');
      localStorage.removeItem('__test_localstorage__');
      setIsLocalStorageAvailable(true);
      console.log("CartProvider: localStorage is available.");
    } catch (e) {
      setIsLocalStorageAvailable(false);
      console.warn("CartProvider: localStorage is not available. Cart will not persist.", e);
      toast({
        title: "Advertencia de Almacenamiento",
        description: "El carrito no se guardará entre sesiones porque el almacenamiento local no está disponible.",
        variant: "destructive",
        duration: 7000,
      });
    }
  }, []);

  useEffect(() => {
    if (!isLocalStorageAvailable) {
      console.log("CartProvider: Skipping load from localStorage as it's unavailable.");
      setCartItems([]); // Ensure cart is empty if localStorage isn't working
      return;
    }
    console.log("CartProvider: useEffect - Attempting to load cart from localStorage.");
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        if (Array.isArray(parsedCart) && parsedCart.every(item => item.product && typeof item.product.id === 'string' && typeof item.quantity === 'number' && typeof item.priceAtAddition === 'number')) {
          setCartItems(parsedCart);
          console.log("CartProvider: Cart loaded successfully from localStorage:", JSON.stringify(parsedCart, null, 2));
        } else {
          console.error("CartProvider: Parsed cart from localStorage is not a valid CartItem array. Resetting cart.", parsedCart);
          localStorage.removeItem(CART_STORAGE_KEY);
          setCartItems([]);
        }
      } catch (error) {
        console.error("CartProvider: Error parsing cart from localStorage. Resetting cart.", error);
        localStorage.removeItem(CART_STORAGE_KEY);
        setCartItems([]);
      }
    } else {
        console.log("CartProvider: No cart found in localStorage. Initializing empty cart.");
        setCartItems([]);
    }
  }, [isLocalStorageAvailable]);

  useEffect(() => {
    if (!isLocalStorageAvailable) {
      console.log("CartProvider: Skipping save to localStorage as it's unavailable.");
      return;
    }
    console.log("CartProvider: useEffect - Cart items changed (or initial load complete), current cartItems:", JSON.stringify(cartItems, null, 2));
    if (cartItems) { // cartItems is always defined due to useState initialization
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        console.log("CartProvider: Cart saved to localStorage.");
    }
  }, [cartItems, isLocalStorageAvailable]);

  const addItem = (product: Product, quantityToAdd: number = 1) => {
    console.log("CartContext: ===== addItem CALLED =====");
    console.log("CartContext: Received product:", JSON.stringify(product, null, 2));
    console.log("CartContext: Received quantityToAdd:", quantityToAdd);
    
    if (!product || typeof product.id === 'undefined' || typeof product.name === 'undefined' || typeof product.price === 'undefined' || typeof product.stock === 'undefined') {
        console.error("CartContext: addItem - Product data is incomplete or invalid. ABORTING.", JSON.stringify(product, null, 2));
        toast({
            title: 'Error de Producto',
            description: 'No se puede añadir un producto con datos incompletos al carrito.',
            variant: 'destructive',
        });
        return;
    }

    if (product.stock <= 0) {
      console.error(`CartContext: Attempted to add ${product.name} but it's out of stock (stock: ${product.stock}). ABORTING.`);
      toast({
        title: 'Producto Agotado',
        description: `${product.name} no está disponible actualmente.`,
        variant: 'destructive',
      });
      return;
    }

    if (quantityToAdd <= 0) {
        console.error(`CartContext: Attempted to add ${product.name} with invalid quantity: ${quantityToAdd}. ABORTING.`);
        toast({
            title: 'Cantidad Inválida',
            description: `Por favor, introduce una cantidad válida para ${product.name}.`,
            variant: 'destructive',
        });
        return;
    }

    setCartItems((prevItems) => {
      console.log("CartContext: addItem - Inside setCartItems. Current cartItems (prevItems):", JSON.stringify(prevItems, null, 2));
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );
      console.log(`CartContext: addItem - Existing item index for product ID ${product.id}: ${existingItemIndex}`);

      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        const tempUpdatedItems = [...prevItems]; // Create a new array
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
          updatedItems = prevItems; 
        } else {
          tempUpdatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantityInCart,
          };
          console.log("CartContext: addItem - Updated existing item:", JSON.stringify(tempUpdatedItems[existingItemIndex], null, 2));
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
          updatedItems = prevItems;
        } else {
          const newItem = { product, quantity: quantityToAdd, priceAtAddition: product.price };
          console.log("CartContext: addItem - Adding new item:", JSON.stringify(newItem, null, 2));
          toast({
            title: 'Producto Añadido',
            description: `${product.name} (x${quantityToAdd}) fue añadido al carrito.`,
          });
          updatedItems = [...prevItems, newItem];
        }
      }
      console.log("CartContext: addItem - setCartItems will be called with (updatedItems):", JSON.stringify(updatedItems, null, 2));
      return updatedItems;
    });
    console.log("CartContext: addItem - After setCartItems call (note: state update is async).");
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    console.log(`CartContext: updateItemQuantity called for productId ${productId} with quantity ${quantity}`);
    setCartItems((prevItems) => {
      let itemUpdated = false;
      const productToUpdate = prevItems.find(item => item.product.id === productId)?.product;

      if (!productToUpdate) {
        console.error(`CartContext: updateItemQuantity - Product with ID ${productId} not found in cart.`);
        return prevItems;
      }

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

      if (itemUpdated && updatedItems.find(i => i.product.id === productId)?.quantity === quantity && quantity > 0) {
         toast({
            title: 'Cantidad Actualizada',
            description: `La cantidad para ${productToUpdate.name} es ahora ${quantity}.`,
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
    return total;
  };

  const getItemCount = () => {
    const count = cartItems.reduce((count, item) => count + item.quantity, 0);
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

    