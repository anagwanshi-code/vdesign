"use client";

import {
  getQuantityValidationMessage,
  isQuantityValidForSaleType,
  normalizeMoq,
} from "@/lib/commerce/moq";
import { normalizeSaleType } from "@/lib/commerce/sale-type";
import type {
  AddCartItemInput,
  CartContextValue,
  CartItem,
} from "@/types/cart";
import { OPEN_CART_EVENT } from "@/lib/cart/events";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const CartContext = createContext<CartContextValue | null>(null);

function createCartItemId(productId: string, variantKey?: string): string {
  return variantKey ? `cart-${productId}-${variantKey}` : `cart-${productId}`;
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

  useEffect(() => {
    const handleOpenCart = () => openCart();
    window.addEventListener(OPEN_CART_EVENT, handleOpenCart);
    return () => window.removeEventListener(OPEN_CART_EVENT, handleOpenCart);
  }, [openCart]);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setCartItems((current) => current.filter((entry) => entry.id !== lineId));
  }, []);

  const addItem = useCallback((item: AddCartItemInput) => {
    const minOrderQuantity = normalizeMoq(item.minOrderQuantity);
    const saleType = normalizeSaleType(item.saleType);
    const quantity = item.quantity ?? minOrderQuantity;

    setCartItems((current) => {
      const lineId = createCartItemId(item.productId, item.variantKey);
      const existingIndex = current.findIndex((entry) => entry.id === lineId);

      if (existingIndex === -1) {
        return [
          ...current,
          {
            id: lineId,
            productId: item.productId,
            variantKey: item.variantKey,
            title: item.title,
            subtitle: item.subtitle,
            priceLabel: item.priceLabel,
            priceInInr: item.priceInInr,
            quantity,
            saleType,
            minOrderQuantity,
            sku: item.sku,
            sizeLabel: item.sizeLabel,
            frameLabel: item.frameLabel,
            logoFileName: item.logoFileName,
            uploadInstructions: item.uploadInstructions,
            image: item.image,
          },
        ];
      }

      return current.map((entry, index) =>
        index === existingIndex
          ? {
              ...entry,
              quantity: entry.quantity + quantity,
              logoFileName: item.logoFileName ?? entry.logoFileName,
              uploadInstructions:
                item.uploadInstructions ?? entry.uploadInstructions,
            }
          : entry,
      );
    });
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

  const moqValidation = useMemo(() => {
    const failingItem = cartItems.find(
      (item) =>
        !isQuantityValidForSaleType(
          item.quantity,
          item.minOrderQuantity,
          item.saleType,
        ),
    );

    if (!failingItem) {
      return { meetsMoqForCheckout: cartItems.length > 0, moqMessage: null };
    }

    return {
      meetsMoqForCheckout: false,
      moqMessage: `${failingItem.title}: ${getQuantityValidationMessage(
        failingItem.minOrderQuantity,
        failingItem.saleType,
      )}`,
    };
  }, [cartItems]);

  const value = useMemo<CartContextValue>(
    () => ({
      isOpen,
      cartItems,
      openCart,
      closeCart,
      clearCart,
      addItem,
      removeItem,
      totalQuantity,
      subtotalLabel,
      subtotalInInr,
      meetsMoqForCheckout: moqValidation.meetsMoqForCheckout,
      moqMessage: moqValidation.moqMessage,
    }),
    [
      isOpen,
      cartItems,
      openCart,
      closeCart,
      clearCart,
      addItem,
      removeItem,
      totalQuantity,
      subtotalLabel,
      subtotalInInr,
      moqValidation,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
