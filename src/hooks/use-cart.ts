"use client";

import {
  selectMoqValidation,
  selectOrderTotals,
  selectOrderTotalsLabels,
  selectSubtotalInInr,
  selectSubtotalLabel,
  selectTotalQuantity,
  useCartStore,
} from "@/lib/store/useCartStore";
import type { CartContextValue } from "@/types/cart";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export function useCart(): CartContextValue {
  const {
    items: cartItems,
    isOpen,
    shippingConfig,
    addItem,
    removeItem,
    updateQuantity,
    openCart,
    closeCart,
    toggleCart,
    clearCart,
  } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      isOpen: state.isOpen,
      shippingConfig: state.shippingConfig,
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      openCart: state.openCart,
      closeCart: state.closeCart,
      toggleCart: state.toggleCart,
      clearCart: state.clearCart,
    })),
  );

  const totalQuantity = useMemo(
    () => selectTotalQuantity(cartItems),
    [cartItems],
  );

  const subtotalInInr = useMemo(
    () => selectSubtotalInInr(cartItems),
    [cartItems],
  );

  const subtotalLabel = useMemo(
    () => selectSubtotalLabel(cartItems),
    [cartItems],
  );

  const moqValidation = useMemo(
    () => selectMoqValidation(cartItems),
    [cartItems],
  );

  const orderTotals = useMemo(
    () => selectOrderTotals(cartItems, shippingConfig),
    [cartItems, shippingConfig],
  );

  const orderTotalsLabels = useMemo(
    () => selectOrderTotalsLabels(cartItems, shippingConfig),
    [cartItems, shippingConfig],
  );

  return {
    isOpen,
    cartItems,
    openCart,
    closeCart,
    toggleCart,
    clearCart,
    addItem,
    removeItem,
    updateQuantity,
    totalQuantity,
    subtotalLabel,
    subtotalInInr,
    orderTotals,
    orderTotalsLabels,
    estimatedTotalInInr: orderTotals.grandTotalInInr,
    estimatedTotalLabel: orderTotalsLabels.grandTotalLabel,
    meetsMoqForCheckout: moqValidation.meetsMoqForCheckout,
    moqMessage: moqValidation.moqMessage,
  };
}

export type {
  AddCartItemInput,
  CartContextValue,
  CartItem,
  CartPremiumAddon,
} from "@/types/cart";
