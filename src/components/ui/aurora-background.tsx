"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuroraBackgroundProps = {
  children?: ReactNode;
  className?: string;
  showRadialGradient?: boolean;
};

/** Animated aurora stripes (greens → yellows); stripe bands match `bg-surface-card` (#111a0f). */
export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  const stripe =
    "repeating-linear-gradient(100deg,rgb(17 26 15) 0%,rgb(17 26 15) 7%,transparent 10%,transparent 12%,rgb(17 26 15) 16%)";
  const aurora =
    "repeating-linear-gradient(100deg,#00833D 10%,#1a8c2a 13%,#5AA83A 16%,#7dc21e 20%,#C4B300 24%,#f5c200 28%,#c9a800 32%)";

  const layerStyle = {
    "--aurora": aurora,
    "--stripe": stripe,
  } as CSSProperties;

  return (
    <div className={cn("overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "after:animate-aurora pointer-events-none absolute -inset-[10px]",
            "[background-image:var(--stripe),var(--aurora)]",
            "[background-size:300%,200%] [background-position:50%_50%,50%_50%]",
            "opacity-[0.42] blur-[10px] will-change-transform",
            "after:absolute after:inset-0 after:[background-image:var(--stripe),var(--aurora)] after:[background-size:200%,100%] after:[background-attachment:fixed] after:mix-blend-soft-light after:content-['']",
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_72%)]",
          )}
          style={layerStyle}
        />
      </div>
      {children}
    </div>
  );
}
