"use client";

import { useCart } from "@/hooks/use-cart";
import { formatInr } from "@/lib/product/variants";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const drawerSpring = { type: "spring" as const, damping: 28, stiffness: 220 };

export function CartDrawer() {
  const router = useRouter();
  const {
    isOpen,
    cartItems,
    closeCart,
    removeItem,
    updateQuantity,
    orderTotalsLabels,
    estimatedTotalLabel,
    totalQuantity,
    meetsMoqForCheckout,
    moqMessage,
  } = useCart();

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

  const handleGoToCheckout = () => {
    if (cartItems.length === 0 || !meetsMoqForCheckout) return;
    closeCart();
    router.push("/checkout");
  };

  const adjustQuantity = (lineId: string, delta: number, item: (typeof cartItems)[number]) => {
    const step = item.saleType === "bulk" ? item.minOrderQuantity : 1;
    updateQuantity(lineId, item.quantity + delta * step);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart overlay"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={drawerSpring}
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-5 md:px-8">
              <div>
                <h2 className="font-serif text-xl font-medium text-gray-950">
                  Your Bag
                </h2>
                <p className="mt-1 font-sans text-xs uppercase tracking-widest text-gray-500">
                  {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={closeCart}
                className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-950"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  <p className="font-serif text-lg text-gray-900">Your bag is empty</p>
                  <p className="max-w-xs font-sans text-sm text-gray-500">
                    Explore our curated collections of premium print and packaging.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-2 font-sans text-xs font-semibold uppercase tracking-widest text-pink-700 hover:text-pink-600"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-4 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-gray-200 bg-gray-50">
                        {item.image ? (
                          <Image
                            src={item.image.src}
                            alt={item.image.alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            VDL
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-serif text-base text-gray-950">
                              {item.title}
                            </p>
                            {item.subtitle ? (
                              <p className="mt-0.5 truncate font-sans text-xs text-gray-500">
                                {item.subtitle}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${item.title}`}
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 font-sans text-[10px] font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-pink-700"
                          >
                            Remove
                          </button>
                        </div>

                        {item.premiumAddons?.length ? (
                          <ul className="flex flex-col gap-0.5">
                            {item.premiumAddons.map((addon) => (
                              <li
                                key={addon.addonName}
                                className="font-sans text-xs text-pink-700"
                              >
                                + {addon.addonName}
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        {item.volumeDiscountPercent ? (
                          <p className="font-sans text-[11px] uppercase tracking-wider text-gray-500">
                            {item.volumeDiscountPercent}% volume savings applied
                          </p>
                        ) : null}

                        <div className="mt-1 flex items-end justify-between gap-4">
                          <div className="inline-flex items-stretch border border-gray-200">
                            <button
                              type="button"
                              onClick={() => adjustQuantity(item.id, -1, item)}
                              className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-950"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="flex w-10 items-center justify-center font-sans text-sm font-medium tabular-nums text-gray-950">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => adjustQuantity(item.id, 1, item)}
                              className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-gray-950"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-sans text-sm font-semibold tabular-nums text-gray-950">
                              {formatInr(item.priceInInr * item.quantity)}
                            </p>
                            <p className="font-sans text-[11px] text-gray-500">
                              {item.priceLabel} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-gray-200 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-8">
              <div className="mb-5 flex flex-col gap-2 font-sans">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{orderTotalsLabels.subtotalLabel}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>GST (18%)</span>
                  <span className="tabular-nums">{orderTotalsLabels.gstLabel}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span
                    className={cn(
                      "tabular-nums",
                      orderTotalsLabels.shippingInInr === 0
                        ? "font-medium text-green-600"
                        : "text-gray-500",
                    )}
                  >
                    {orderTotalsLabels.shippingLabel}
                  </span>
                </div>
                <div className="my-2 border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Estimated total
                  </span>
                  <span className="text-lg font-bold tabular-nums text-gray-900">
                    {estimatedTotalLabel}
                  </span>
                </div>
              </div>

              {moqMessage ? (
                <p className="mb-4 font-sans text-xs text-pink-700">{moqMessage}</p>
              ) : null}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  disabled={cartItems.length === 0 || !meetsMoqForCheckout}
                  onClick={handleGoToCheckout}
                  className={cn(
                    "w-full rounded-xl bg-pink-600 bg-gradient-to-r from-rose-600 to-pink-600 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 ease-out",
                    "hover:-translate-y-0.5 hover:from-pink-500 hover:to-rose-400 hover:shadow-[0_8px_25px_rgb(225,29,72,0.4)]",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
                  )}
                >
                  Proceed to Checkout
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    router.push("/shop");
                  }}
                  className="w-full rounded-xl border-2 border-pink-600 bg-white py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-pink-600 transition-all hover:bg-pink-50"
                >
                  Continue Shopping
                </button>
              </div>

              <p className="mt-3 text-center font-sans text-[11px] text-gray-500">
                Secure checkout · UPI · Cards · Netbanking
              </p>
            </footer>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
