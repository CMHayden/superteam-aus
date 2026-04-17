"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/hooks/use-outside-click";

type Partner = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  benefits?: string;
  link: string;
};

function PartnerLogo({
  name,
  src,
  onClick,
}: {
  name: string;
  src: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
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

export function PartnersSection({ partners }: { partners: Partner[] }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activePartner, setActivePartner] = useState<Partner | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const marqueePartners = [...partners, ...partners, ...partners, ...partners, ...partners, ...partners];

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

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

  const partnerModal = activePartner && portalTarget ? createPortal(
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[2px]"
        />
      </AnimatePresence>
      <div className="fixed inset-0 z-[120] grid place-items-center px-4">
        <motion.div
          ref={modalRef}
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
            src={activePartner.image_url}
            alt={activePartner.name}
            width={180}
            height={52}
            className="mt-5 h-8 w-auto object-contain"
          />
          <p className="mt-4 font-body text-sm leading-relaxed text-text-secondary">{activePartner.description}</p>
          {activePartner.benefits ? (
            <div className="mt-4">
              <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-green">
                Benefits
              </p>
              <p className="mt-1 font-body text-sm leading-relaxed text-text-secondary">{activePartner.benefits}</p>
            </div>
          ) : null}
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
    </>,
    portalTarget,
  ) : null;

  return (
    <div aria-label="Partners" className="relative border-t border-brand-green/35 px-4 pb-8 pt-6 md:px-8 md:pb-10">
      {partnerModal}
      <div
        className="partners-marquee-hover group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {prefersReducedMotion ? (
          <div className="flex flex-wrap gap-x-4 gap-y-3 py-1">
            {partners.map((partner) => (
              <PartnerLogo
                key={partner.name}
                name={partner.name}
                src={partner.image_url}
                onClick={() => setActivePartner(partner)}
              />
            ))}
          </div>
        ) : (
          <div
            className="partners-marquee-track flex w-max gap-5 py-1"
            style={
              activePartner
                ? { animationPlayState: "paused" }
                : undefined
            }
          >
            {marqueePartners.map((partner, index) => (
              <PartnerLogo
                key={`${partner.name}-${index}`}
                name={partner.name}
                src={partner.image_url}
                onClick={() => setActivePartner(partner)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
