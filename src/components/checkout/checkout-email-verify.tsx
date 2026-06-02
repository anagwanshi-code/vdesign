"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type {
  AuthOtpErrorResponse,
  SendOtpSuccessResponse,
  VerifyOtpSuccessResponse,
} from "@/types/auth-otp";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type CheckoutEmailVerifyProps = {
  email: string;
  isEmailValid: boolean;
  onVerified: (profile: VerifyOtpSuccessResponse["profile"]) => void;
};

export function CheckoutEmailVerify({
  email,
  isEmailValid,
  onVerified,
}: CheckoutEmailVerifyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const resetModal = useCallback(() => {
    setOtp("");
    setIsOpen(false);
    setIsSending(false);
    setIsVerifying(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") resetModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, resetModal]);

  const handleSendOtp = async () => {
    if (!isEmailValid || isSending) return;

    setIsSending(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const payload = (await response.json()) as
        | SendOtpSuccessResponse
        | AuthOtpErrorResponse;

      if (!response.ok) {
        toast.error(
          "error" in payload ? payload.error : "Could not send security code",
        );
        return;
      }

      setIsOpen(true);
      toast.success("Security code sent to your email");
    } catch {
      toast.error("Could not send security code. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4 || isVerifying) return;

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp }),
      });

      const payload = (await response.json()) as
        | VerifyOtpSuccessResponse
        | AuthOtpErrorResponse;

      if (!response.ok) {
        toast.error(
          "error" in payload ? payload.error : "Verification failed",
        );
        return;
      }

      if (payload.profile) {
        onVerified(payload.profile);
        toast.success("Details loaded from your previous order");
      } else {
        toast.success("Email verified — no previous orders found");
      }

      resetModal();
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSendOtp}
        disabled={!isEmailValid || isSending}
        className={cn(
          "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-caption font-medium text-peacock transition-colors duration-base ease-luxury",
          "hover:border-peacock hover:bg-peacock/5 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {isSending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        Verify email to auto-fill
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-text-primary/20 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={resetModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="otp-dialog-title"
            className="relative w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lift"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={resetModal}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="text-overline uppercase text-saffron">Secure checkout</p>
            <h3
              id="otp-dialog-title"
              className="mt-2 font-serif text-heading text-text-primary"
            >
              Enter your 4-digit code
            </h3>
            <p className="mt-2 text-caption leading-relaxed text-text-muted">
              We sent a security code to{" "}
              <span className="font-medium text-text-primary">{email}</span>
            </p>

            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="••••"
              className="mt-5 w-full rounded-md border border-border bg-surface px-4 py-3 text-center font-serif text-2xl tracking-[0.4em] text-text-primary outline-none focus:border-peacock focus:ring-1 focus:ring-peacock"
            />

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="accent"
                className="flex-1 text-white"
                disabled={otp.length !== 4 || isVerifying}
                onClick={handleVerifyOtp}
              >
                {isVerifying ? (
                  <span className="inline-flex items-center gap-2 text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  "Confirm code"
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                disabled={isSending}
                onClick={handleSendOtp}
              >
                Resend code
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
