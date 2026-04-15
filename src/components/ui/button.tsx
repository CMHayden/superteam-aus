import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-yellow text-on-yellow shadow-sm hover:bg-brand-gold focus-visible:ring-brand-yellow/60 active:scale-95",
  secondary:
    "border border-border-yellowmd bg-surface-card/40 text-text-primary backdrop-blur-sm hover:border-border-yellowhi hover:bg-surface-hover/60 focus-visible:ring-border-yellowhi",
  ghost:
    "text-text-muted hover:text-text-primary hover:bg-white/8 focus-visible:ring-border-yellow",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-medium transition-[color,background-color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}
