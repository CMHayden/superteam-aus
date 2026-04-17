"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image_url: string;
};

const rotatePresets = [-7, -4, 3, 6];

export function CommunityMembersCarousel({
  autoplay = true,
  testimonials,
}: {
  autoplay?: boolean;
  testimonials: Testimonial[];
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!autoplay || testimonials.length === 0) return;
    const interval = window.setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const handlePrev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const handleNext = () => setActive((prev) => (prev + 1) % testimonials.length);

  if (testimonials.length === 0) return null;
  const activeMember = testimonials[active];

  return (
    <div className="mx-auto w-full max-w-7xl rounded-2xl border border-brand-green/30 bg-surface-card p-5 md:p-8">
      <p className="mb-4 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
        Testimonials
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative h-72 w-full shrink-0 md:h-[22rem]">
          <AnimatePresence>
            {testimonials.map((member, index) => {
              const isActive = index === active;
              return (
                <motion.div
                  key={`${member.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9, z: -100, rotate: rotatePresets[index % 4] }}
                  animate={{
                    opacity: isActive ? 1 : 0.56,
                    scale: isActive ? 1 : 0.95,
                    z: isActive ? 0 : -100,
                    rotate: isActive ? 0 : rotatePresets[index % 4],
                    zIndex: isActive ? 40 : testimonials.length + 2 - index,
                    y: isActive ? [0, -10, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9, z: 100, rotate: -rotatePresets[index % 4] }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border-yellowmd">
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                      className="object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-surface-base/75 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.22),transparent_58%)]" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex min-h-[22rem] flex-col justify-between py-1 md:min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeInOut" }}
              className="flex min-h-0 flex-1 flex-col md:block"
            >
              <h3 className="font-display text-3xl font-black text-text-primary">{activeMember.name}</h3>
              <p className="mt-1 font-body text-sm font-bold uppercase tracking-wide text-text-muted">
                {activeMember.role}
              </p>

              <motion.p className="mt-6 h-[14rem] overflow-y-auto font-body text-lg leading-relaxed text-text-secondary md:h-auto md:min-h-0 md:overflow-visible">
                {activeMember.quote.split(" ").map((word, index) => (
                  <motion.span
                    key={`${activeMember.name}-${index}`}
                    initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut", delay: 0.018 * index }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="group inline-flex size-9 items-center justify-center rounded-full border border-border-yellowmd bg-surface-base/55 text-text-primary transition-colors hover:border-border-yellowhi hover:bg-surface-hover"
              aria-label="Show previous member"
            >
              <svg
                viewBox="0 0 20 20"
                className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M12.5 4.5L7 10l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="group inline-flex size-9 items-center justify-center rounded-full border border-border-yellowmd bg-surface-base/55 text-text-primary transition-colors hover:border-border-yellowhi hover:bg-surface-hover"
              aria-label="Show next member"
            >
              <svg
                viewBox="0 0 20 20"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M7.5 4.5L13 10l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
