"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  duration_ms?: number;
  hidden_on_mobile?: boolean;
};

function easeInOutCubic(progress: number) {
  if (progress < 0.5) {
    return 4 * progress * progress * progress;
  }
  return 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function CountUpStat({
  label,
  value,
  suffix = "",
  duration_ms = 1600,
  start,
  className,
}: {
  label: string;
  value: number;
  suffix?: string;
  duration_ms?: number;
  start: boolean;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!start) return;

    if (prefersReducedMotion) {
      setCurrent(value);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration_ms, 1);
      const eased = easeInOutCubic(progress);
      setCurrent(Math.round(value * eased));
      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [duration_ms, prefersReducedMotion, start, value]);

  return (
    <div className={`relative px-4 py-6 text-center md:after:absolute md:after:right-0 md:after:top-1/2 md:after:h-8 md:after:w-px md:after:-translate-y-1/2 md:after:bg-brand-green/35 md:last:after:hidden ${className ?? ""}`}>
      <p className="mb-1 font-mono text-3xl font-black leading-none text-brand-green">
        {current}
        {suffix && <span className="text-brand-yellow">{suffix}</span>}
      </p>
      <p className="font-body text-xs font-extrabold uppercase tracking-widest text-text-muted">
        {label}
      </p>
    </div>
  );
}

export function StatsStrip({
  stats,
  headline,
  subtext,
}: {
  stats: Stat[];
  headline?: string;
  subtext?: string;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        setStart(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const defaultHeadline = 'Built by the <span class="text-brand-yellow">community</span>. Backed by the <span class="text-brand-yellow">ecosystem</span>.';
  const defaultSubtext = "From meetups across Australia to projects shipped by our members, these numbers reflect real momentum - supported by partners helping push it forward.";

  return (
    <div
      id="stats"
      ref={sectionRef}
      aria-label="Stats"
      data-beam-collision-target
      className="relative mx-auto w-full max-w-7xl px-6 pb-2 pt-8 md:px-8 md:pt-10"
    >
      <p
        className="text-center font-display text-2xl font-black text-brand-green md:text-3xl"
        dangerouslySetInnerHTML={{ __html: headline || defaultHeadline }}
      />
      <p className="mx-auto mt-3 max-w-3xl text-center font-body text-sm font-bold leading-relaxed text-text-secondary">
        {subtext || defaultSubtext}
      </p>

      <div className="mt-7 grid grid-cols-2 md:grid-cols-5">
        {stats.map((stat) => (
          <CountUpStat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            duration_ms={stat.duration_ms}
            start={start}
            className={stat.hidden_on_mobile ? "hidden md:block" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
