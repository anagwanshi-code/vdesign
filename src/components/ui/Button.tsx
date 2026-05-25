import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "accent";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-text-primary text-surface hover:bg-peacock focus-visible:ring-peacock",
  secondary:
    "border border-border bg-transparent text-text-primary hover:border-peacock hover:text-peacock focus-visible:ring-peacock",
  accent: "bg-magenta text-surface hover:opacity-90 focus-visible:ring-magenta",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-md px-6 text-body font-sans transition-colors duration-base ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

export type { ButtonProps, ButtonVariant };
