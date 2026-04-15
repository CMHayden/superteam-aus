"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { heroGradientTextClasses } from "@/components/hero/hero-gradient-text";
import { cn } from "@/lib/utils";

type RotatingHeadlineProps = {
  lines: string[];
  intervalMs?: number;
};

const headlineClassName = cn(
  heroGradientTextClasses,
  "font-display text-3xl font-black leading-none tracking-tight underline decoration-brand-yellow decoration-2 underline-offset-4 md:text-5xl",
);

/** Line: blur lives here only so `bg-clip-text` stays valid (never put filter on nested letter spans). */
const lineVariants = {
  initial: {
    opacity: 0,
    y: 22,
    scale: 0.94,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 11,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    y: -36,
    x: 44,
    scale: 1.32,
    filter: "blur(11px)",
    position: "absolute" as const,
    transition: {
      duration: 0.42,
      ease: [0.22, 0.61, 0.36, 1] as const,
    },
  },
};

export function RotatingHeadline({
  lines,
  intervalMs = 3000,
}: RotatingHeadlineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const currentWord = lines[currentIndex] ?? "";

  const startAnimation = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % lines.length);
    setIsAnimating(true);
  }, [lines.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || lines.length <= 1) {
      return;
    }
    if (!isAnimating) {
      const t = window.setTimeout(() => {
        startAnimation();
      }, intervalMs);
      return () => window.clearTimeout(t);
    }
  }, [isAnimating, intervalMs, lines.length, prefersReducedMotion, startAnimation]);

  useEffect(() => {
    if (!prefersReducedMotion || lines.length <= 1) {
      return;
    }
    const t = window.setInterval(() => {
      setCurrentIndex((i) => (i + 1) % lines.length);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs, lines.length, prefersReducedMotion]);

  if (lines.length === 0) {
    return null;
  }

  const words = currentWord.split(" ");

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative min-h-[2.75rem] w-full overflow-visible pb-1 md:min-h-14">
        {prefersReducedMotion ? (
          <p
            className={cn(
              "flex min-h-[2.75rem] items-start justify-center text-center md:min-h-14",
              headlineClassName,
            )}
          >
            {currentWord}
          </p>
        ) : (
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              setIsAnimating(false);
            }}
          >
            <motion.div
              key={currentIndex}
              variants={lineVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ transformOrigin: "50% 50%" }}
              className={cn(
                "absolute left-1/2 top-0 z-10 inline-block max-w-full -translate-x-1/2 text-center will-change-transform",
                headlineClassName,
              )}
            >
              {words.map((word, wordIndex) => (
                <motion.span
                  key={`${currentIndex}-${word}-${wordIndex}`}
                  initial={{ opacity: 0, y: 18, scale: 0.92, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  transition={{
                    delay: wordIndex * 0.28,
                    type: "spring",
                    stiffness: 120,
                    damping: 16,
                  }}
                  className="inline-block whitespace-nowrap"
                >
                  {word.split("").map((letter, letterIndex) => {
                    const twist = ((letterIndex % 3) - 1) * 4;
                    return (
                      <motion.span
                        key={`${currentIndex}-${word}-${letterIndex}`}
                        initial={{
                          opacity: 0,
                          y: 14,
                          rotate: twist,
                        }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{
                          delay: wordIndex * 0.28 + letterIndex * 0.045,
                          type: "spring",
                          stiffness: 140,
                          damping: 18,
                        }}
                        className="inline-block"
                      >
                        {letter}
                      </motion.span>
                    );
                  })}
                  <span className="inline-block">&nbsp;</span>
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
