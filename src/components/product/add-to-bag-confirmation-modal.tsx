"use client";

import { dispatchOpenCart } from "@/lib/cart/events";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

type AddToBagConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  quantity: number;
  variant?: string;
};

export function AddToBagConfirmationModal({
  isOpen,
  onClose,
  productTitle,
  quantity,
  variant,
}: AddToBagConfirmationModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleViewCart = () => {
    onClose();
    dispatchOpenCart();
  };

  const handleContinueShopping = () => {
    onClose();
    router.push("/collections");
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-to-bag-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
            className="flex w-full max-w-md flex-col items-center border border-border/50 bg-background p-8 text-center shadow-lift md:p-12"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10">
              <CheckCircle2 className="h-8 w-8 text-emerald" aria-hidden="true" />
            </div>

            <h3
              id="add-to-bag-title"
              className="mb-2 font-serif text-3xl text-foreground"
            >
              Added to Bag
            </h3>

            <p className="mb-8 font-sans text-muted">
              {quantity}× {productTitle}
              <span className="mt-2 block text-xs uppercase tracking-widest text-foreground/70">
                Variant: {variant || "Standard"}
              </span>
            </p>

            <div className="flex w-full flex-col gap-4">
              <button
                type="button"
                onClick={handleViewCart}
                className="w-full bg-foreground py-4 font-sans text-xs uppercase tracking-widest text-background transition-colors duration-500 hover:bg-saffron hover:text-foreground"
              >
                View Cart & Checkout
              </button>
              <button
                type="button"
                onClick={handleContinueShopping}
                className="w-full border border-border bg-transparent py-4 font-sans text-xs uppercase tracking-widest text-foreground transition-colors duration-500 hover:border-foreground"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
