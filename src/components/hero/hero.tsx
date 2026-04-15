"use client";

import { heroGradientTextClasses } from "@/components/hero/hero-gradient-text";
import { HeroScrollToNext } from "@/components/hero/hero-scroll-to-next";
import { RotatingHeadline } from "@/components/hero/rotating-headline";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { ConicBorderButton } from "@/components/ui/conic-border-button";
import { cn } from "@/lib/utils";
import { openJoinApplicationModal } from "@/lib/join-application-modal";

const rotatingLines = [
  "accelerate builders.",
  "back founders.",
  "connect talent.",
  "showcase Australia.",
  "grow the ecosystem.",
  "bridge institutions.",
];

export function Hero() {
  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col overflow-x-clip overflow-y-visible bg-surface-base">
      <HeroScrollToNext />
      <section
        aria-labelledby="hero-heading"
        className="relative flex min-h-dvh flex-1 flex-col justify-center overflow-x-clip overflow-y-visible"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-surface-card"
        />
        <AuroraBackground className="pointer-events-none absolute inset-0 z-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-52 bg-gradient-to-b from-transparent via-surface-base/40 to-surface-base/75 md:h-72"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-10 md:px-8 md:pb-20 md:pt-14">
          <h1
            className={cn(
              heroGradientTextClasses,
              "text-center font-display text-[clamp(3.5rem,16vw,10.5rem)] font-black leading-[0.80] tracking-[-0.04em]",
            )}
          >
            Superteam Australia
          </h1>

          <div className="mt-10 space-y-1 text-center md:mt-14 md:space-y-1.5">
            <h2
              id="hero-heading"
              className="font-display text-3xl font-black leading-none tracking-tight text-text-primary md:text-5xl"
            >
              We&apos;re here to
            </h2>
            <RotatingHeadline lines={rotatingLines} intervalMs={2400} />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:mt-12">
            <ConicBorderButton onClick={openJoinApplicationModal}>Get Involved</ConicBorderButton>
            <Button
              variant="secondary"
              className="min-h-12 min-w-44 rounded-full px-8 text-xs font-black uppercase tracking-wide"
            >
              Explore Opportunities
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
