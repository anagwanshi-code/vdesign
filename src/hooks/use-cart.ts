"use client";

import { CartContext } from "@/components/providers/cart-provider";
import type { CartContextValue } from "@/types/cart";
import { useContext } from "react";

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

export type {
  AddCartItemInput,
  CartContextValue,
  CartItem,
} from "@/types/cart";
