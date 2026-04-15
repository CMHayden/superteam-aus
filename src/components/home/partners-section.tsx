"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";

const partners = [
  {
    name: "Alchemy",
    src: "/partners/alchemy.svg",
    description: "Developer platform for building, scaling, and monitoring high-performance web3 apps.",
    link: "https://www.alchemy.com/",
  },
  {
    name: "Helius",
    src: "/partners/helius.svg",
    description: "Solana infrastructure and APIs powering wallets, analytics, and real-time blockchain apps.",
    link: "https://www.helius.dev/",
  },
  {
    name: "Jupiter",
    src: "/partners/jupiter.svg",
    description: "Best-price routing and liquidity aggregation that powers swaps across Solana markets.",
    link: "https://jup.ag/",
  },
  {
    name: "Raydium",
    src: "/partners/raydium.svg",
    description: "On-chain liquidity and trading venue enabling token discovery and capital-efficient markets.",
    link: "https://raydium.io/",
  },
  {
    name: "Solana",
    src: "/partners/solana.svg",
    description: "High-throughput blockchain ecosystem for consumer apps, payments, and global internet-scale products.",
    link: "https://solana.com/",
  },
];

const PARTNER_STEP_PX = 148; // w-32 (128px) + gap-5 (20px)
const MARQUEE_SPEED_PX_PER_SEC = 44;

type MarqueeItem = {
  id: number;
  partner: (typeof partners)[number];
};

function PartnerLogo({
  name,
  src,
  onClick,
  layoutId,
}: {
  name: string;
  src: string;
  onClick: () => void;
  layoutId: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layoutId={layoutId}
      className="inline-flex h-12 w-32 cursor-pointer items-center justify-center rounded-lg border border-brand-green/20 bg-surface-card/40 px-3 transition-[border-color,box-shadow,background-color] duration-200 hover:border-brand-yellow/55 hover:bg-surface-card/60 hover:shadow-[0_0_0_1px_rgb(249_215_28/0.25),0_0_18px_rgb(27_138_61/0.28)]"
    >
      <Image
        src={src}
        alt={name}
        width={112}
        height={28}
        className="h-7 w-auto object-contain"
      />
    </motion.button>
  );
}

export function PartnersSection() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activePartner, setActivePartner] = useState<(typeof partners)[number] | null>(null);
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>(() =>
    [...partners, ...partners].map((partner, index) => ({ id: index, partner })),
  );
  const id = useId();
  const nextIdRef = useRef(marqueeItems.length);
  const offsetRef = useRef(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(modalRef, () => setActivePartner(null));

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePartner(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = activePartner ? "hidden" : "auto";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [activePartner]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (!isPaused && !activePartner && trackRef.current) {
        offsetRef.current -= MARQUEE_SPEED_PX_PER_SEC * dt;

        if (offsetRef.current <= -PARTNER_STEP_PX) {
          offsetRef.current += PARTNER_STEP_PX;
          setMarqueeItems((prev) => {
            const [first, ...rest] = prev;
            if (!first) {
              return prev;
            }
            const next: MarqueeItem = {
              id: nextIdRef.current++,
              partner: first.partner,
            };
            return [...rest, next];
          });
        }

        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }

      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [activePartner, isPaused, prefersReducedMotion]);

  return (
    <div aria-label="Partners" className="relative border-t border-brand-green/35 px-4 pb-8 pt-6 md:px-8 md:pb-10">
      <AnimatePresence>
        {activePartner ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {activePartner ? (
          <div className="fixed inset-0 z-50 grid place-items-center px-4">
            <motion.div
              ref={modalRef}
              layoutId={`partner-${activePartner.name}-${id}`}
              className="w-full max-w-lg rounded-3xl border border-brand-green/30 bg-surface-card p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
                  Partner
                </p>
                <button
                  type="button"
                  onClick={() => setActivePartner(null)}
                  className="rounded-full border border-border-yellowmd px-3 py-1.5 font-body text-xs font-bold text-text-secondary transition-colors hover:border-border-yellowhi hover:text-text-primary"
                >
                  Close
                </button>
              </div>
              <Image
                src={activePartner.src}
                alt={activePartner.name}
                width={180}
                height={52}
                className="mt-5 h-8 w-auto object-contain"
              />
              <p className="mt-4 font-body text-sm leading-relaxed text-text-secondary">{activePartner.description}</p>
              <a
                href={activePartner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center rounded-full bg-brand-yellow px-4 py-2 font-body text-sm font-bold text-on-yellow transition-colors hover:bg-brand-gold"
              >
                Visit partner
              </a>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {prefersReducedMotion ? (
          <div className="flex flex-wrap gap-x-4 gap-y-3 py-1">
            {partners.map((partner) => (
              <PartnerLogo
                key={partner.name}
                name={partner.name}
                src={partner.src}
                layoutId={`partner-${partner.name}-${id}`}
                onClick={() => setActivePartner(partner)}
              />
            ))}
          </div>
        ) : (
          <div ref={trackRef} className="flex w-max gap-5 py-1">
            {marqueeItems.map(({ id, partner }) => (
              <PartnerLogo
                key={id}
                name={partner.name}
                src={partner.src}
                layoutId={`partner-${partner.name}-${id}`}
                onClick={() => setActivePartner(partner)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
