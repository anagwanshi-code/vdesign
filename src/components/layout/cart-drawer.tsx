"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/use-cart";
import { initiateRazorpayCheckout } from "@/lib/checkout/initiate-checkout";
import { calculateOrderTotals, labelOrderTotals } from "@/lib/checkout/totals";
import { formatInr } from "@/lib/product/variants";
import type { RazorpayHandlerResponse } from "@/types/razorpay";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const panelVariants = {
  closed: { x: "100%" },
  open: {
    x: 0,
    transition: { duration: 0.45, ease: CINEMATIC_EASE },
  },
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: { duration: 0.35, ease: CINEMATIC_EASE },
  },
};

export function CartDrawer() {
  const {
    isOpen,
    cartItems,
    closeCart,
    clearCart,
    removeItem,
    subtotalLabel,
    subtotalInInr,
    totalQuantity,
    meetsMoqForCheckout,
    moqMessage,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const estimatedTotals = labelOrderTotals(
    calculateOrderTotals(subtotalInInr),
  );

  const resetCheckoutState = useCallback(() => {
    setIsCheckingOut(false);
  }, []);

  const handlePaymentSuccess = useCallback(
    (_response: RazorpayHandlerResponse) => {
      clearCart();
      closeCart();
      resetCheckoutState();
      setCheckoutError(null);
    },
    [clearCart, closeCart, resetCheckoutState],
  );

  const handleModalDismiss = useCallback(() => {
    resetCheckoutState();
  }, [resetCheckoutState]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!isOpen) {
      setCheckoutError(null);
      resetCheckoutState();
    }
  }, [isOpen, resetCheckoutState]);

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isCheckingOut || !meetsMoqForCheckout) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      await initiateRazorpayCheckout({
        items: cartItems.map((item) => ({
          productId: item.productId,
          title: item.title,
          quantity: item.quantity,
          priceInInr: item.priceInInr,
          sku: item.sku,
          saleType: item.saleType,
          minOrderQuantity: item.minOrderQuantity,
          logoFileName: item.logoFileName,
          uploadInstructions: item.uploadInstructions,
        })),
        description: "V Design Luxury · Bag checkout",
        onSuccess: handlePaymentSuccess,
        onDismiss: handleModalDismiss,
        onError: (message) => setCheckoutError(message),
      });
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Checkout unavailable. Please try again.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart overlay"
            className="fixed inset-0 z-[60] bg-text-primary/10 backdrop-blur-[2px]"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-border bg-surface shadow-lift"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  className="h-5 w-5 text-text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-serif text-body-lg text-text-primary">
                    Your Bag
                  </p>
                  <p className="text-caption text-text-muted">
                    {totalQuantity}{" "}
                    {totalQuantity === 1 ? "piece" : "pieces"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={closeCart}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-primary transition-colors duration-base ease-luxury hover:border-peacock hover:text-peacock focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peacock focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag
                    className="h-8 w-8 text-text-muted"
                    aria-hidden="true"
                  />
                  <p className="font-serif text-body-lg text-text-primary">
                    Your bag is empty
                  </p>
                  <p className="max-w-xs text-body text-text-muted">
                    Discover the signature edit—curated in Sanity, settled
                    natively via UPI through Razorpay.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-4 border-b border-border pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-border">
                        {item.image ? (
                          <Image
                            src={item.image.src}
                            alt={item.image.alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center text-caption text-text-muted"
                            aria-hidden="true"
                          >
                            VDL
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-serif text-body text-text-primary">
                            {item.title}
                          </p>
                          <button
                            type="button"
                            aria-label={`Remove ${item.title} from bag`}
                            onClick={() => removeItem(item.id)}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-muted transition-colors duration-base ease-luxury hover:border-magenta hover:text-magenta"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        {item.subtitle ? (
                          <p className="text-caption text-text-muted">
                            {item.subtitle}
                          </p>
                        ) : null}
                        {item.sku ? (
                          <p className="text-caption uppercase tracking-widest text-text-muted">
                            SKU {item.sku}
                          </p>
                        ) : null}
                        {item.logoFileName ? (
                          <p className="text-caption text-text-muted">
                            Artwork: {item.logoFileName}
                          </p>
                        ) : null}
                        {item.uploadInstructions ? (
                          <p className="line-clamp-2 text-caption text-text-muted">
                            {item.uploadInstructions}
                          </p>
                        ) : null}
                        <div className="mt-2 flex items-center justify-between gap-4">
                          <p className="text-caption uppercase tracking-widest text-text-muted">
                            Qty {item.quantity}
                            {item.quantity > 1 ? (
                              <span className="ml-2 normal-case tracking-normal text-text-muted/80">
                                · {item.priceLabel} each
                              </span>
                            ) : null}
                          </p>
                          <p className="text-body tabular-nums text-text-primary">
                            {formatInr(item.priceInInr * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-border px-6 py-6">
              <div className="mb-4 space-y-2 text-caption text-text-muted">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-text-primary">
                    {estimatedTotals.subtotalLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST (18%)</span>
                  <span className="tabular-nums text-text-primary">
                    {estimatedTotals.gstLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums text-text-primary">
                    {estimatedTotals.shippingLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2 font-serif text-body text-text-primary">
                  <span>Estimated total</span>
                  <span className="tabular-nums">
                    {estimatedTotals.grandTotalLabel}
                  </span>
                </div>
              </div>
              {moqMessage ? (
                <p className="mb-4 text-center text-caption text-magenta">
                  {moqMessage}
                </p>
              ) : null}
              {checkoutError ? (
                <p className="mb-4 text-center text-caption text-magenta">
                  {checkoutError}
                </p>
              ) : null}
              <Button
                variant="accent"
                className="w-full"
                disabled={
                  cartItems.length === 0 ||
                  isCheckingOut ||
                  !meetsMoqForCheckout
                }
                onClick={handleCheckout}
              >
                {isCheckingOut ? "Preparing Checkout…" : "Continue to Checkout"}
              </Button>
              <p className="mt-3 text-center text-caption text-text-muted">
                Secure UPI · Cards · Netbanking via Razorpay
              </p>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
