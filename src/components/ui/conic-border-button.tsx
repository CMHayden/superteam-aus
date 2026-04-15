import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ConicBorderButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  children: ReactNode;
};

/**
 * Spinning conic-gradient border (inset -1000% trick) with solid inner pill.
 * Brand green ↔ yellow (logo gradient), loop-closed at #1b8a3d.
 */
export function ConicBorderButton({
  className,
  children,
  type = "button",
  ...props
}: ConicBorderButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "group relative inline-flex h-12 min-w-44 cursor-pointer overflow-hidden rounded-full p-px",
        "transition-[transform,box-shadow] duration-300 ease-out will-change-transform",
        "hover:scale-[1.02] active:scale-[0.99]",
        "hover:shadow-[0_0_28px_rgb(249_215_28_/0.22)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1b8a3d_0%,#2ea85a_18%,#f9d71c_42%,#d4bc18_68%,#145a2e_88%,#1b8a3d_100%)]"
      />
      <span className="inline-flex h-full w-full min-w-44 items-center justify-center rounded-full bg-surface-card px-8 py-1 text-xs font-black uppercase tracking-wide text-text-primary backdrop-blur-3xl transition-colors duration-300 ease-out group-hover:text-brand-yellow">
        {children}
      </span>
    </button>
  );
}
