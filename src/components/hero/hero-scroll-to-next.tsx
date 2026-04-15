"use client";

import { useEffect, useRef } from "react";

const SCROLL_MS = 340;

function docY(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.top + window.scrollY;
}

/**
 * While the hero is on screen, a downward wheel/trackpad gesture runs a short
 * eased scroll to the next section (#post-hero). Uses document coordinates (not
 * offsetTop) so nested offset parents don't break the target position.
 */
export function HeroScrollToNext() {
  const animatingRef = useRef(false);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      return;
    }

    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) {
        return;
      }

      const hero = document.getElementById("hero");
      const next = document.getElementById("post-hero");
      if (!hero || !next) {
        return;
      }

      if (cooldownRef.current) {
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const heroOverlapsViewport =
        heroRect.bottom > 0 && heroRect.top < window.innerHeight;
      if (!heroOverlapsViewport) {
        return;
      }

      const targetY = docY(next);
      const scrollY = window.scrollY;
      if (scrollY >= targetY - 4) {
        return;
      }

      if (animatingRef.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      animatingRef.current = true;
      const startY = scrollY;
      const delta = targetY - startY;
      if (delta < 12) {
        animatingRef.current = false;
        return;
      }

      const t0 = performance.now();

      const frame = (now: number) => {
        const t = Math.min((now - t0) / SCROLL_MS, 1);
        const eased = easeOutCubic(t);
        window.scrollTo(0, startY + delta * eased);
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          animatingRef.current = false;
          cooldownRef.current = true;
          window.setTimeout(() => {
            cooldownRef.current = false;
          }, 200);
        }
      };

      requestAnimationFrame(frame);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  return null;
}
