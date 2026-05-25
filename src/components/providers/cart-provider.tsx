"use client";

import type {
  AddCartItemInput,
  CartContextValue,
  CartItem,
} from "@/types/cart";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const CartContext = createContext<CartContextValue | null>(null);

function createCartItemId(productId: string): string {
  return `cart-${productId}`;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const addItem = useCallback((item: AddCartItemInput) => {
    const quantity = item.quantity ?? 1;

    setCartItems((current) => {
      const existingIndex = current.findIndex(
        (entry) => entry.productId === item.productId,
      );

      if (existingIndex === -1) {
        return [
          ...current,
          {
            id: createCartItemId(item.productId),
            productId: item.productId,
            title: item.title,
            subtitle: item.subtitle,
            priceLabel: item.priceLabel,
            priceInInr: item.priceInInr,
            quantity,
            image: item.image,
          },
        ];
      }

      return current.map((entry, index) =>
        index === existingIndex
          ? { ...entry, quantity: entry.quantity + quantity }
          : entry,
      );
    });

    setIsOpen(true);
  }, []);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const subtotalInInr = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.priceInInr * item.quantity,
        0,
      ),
    [cartItems],
  );

  const subtotalLabel = useMemo(
    () => formatInr(subtotalInInr),
    [subtotalInInr],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      isOpen,
      cartItems,
      openCart,
      closeCart,
      clearCart,
      addItem,
      totalQuantity,
      subtotalLabel,
      subtotalInInr,
    }),
    [
      isOpen,
      cartItems,
      openCart,
      closeCart,
      clearCart,
      addItem,
      totalQuantity,
      subtotalLabel,
      subtotalInInr,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
