import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChartLine,
  faGlobe,
  faLandmark,
  faRocket,
  faSignal,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const iconMap: Record<string, IconDefinition> = {
  rocket: faRocket,
  "chart-line": faChartLine,
  signal: faSignal,
  users: faUsers,
  globe: faGlobe,
  landmark: faLandmark,
};

type CardData = {
  id: string;
  title: string;
  icon_name: string;
  bullets: string[];
};

function MissionCard({ title, icon_name, bullets }: CardData) {
  const icon = iconMap[icon_name] || faRocket;
  return (
    <article className="group relative bg-surface-card p-8 transition-colors duration-200 hover:bg-surface-hover">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-brand-green to-brand-yellow opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      <div className="mb-4 flex items-center gap-3">
        <div className="inline-flex size-11 items-center justify-center rounded-xl border border-border-yellowmd bg-brand-yellow/10 text-brand-yellow transition duration-300 ease-out group-hover:-rotate-6 group-hover:border-border-yellowhi group-hover:bg-brand-yellow/15">
          <FontAwesomeIcon icon={icon} />
        </div>
        <h3 className="font-display text-lg font-black text-brand-green">{title}</h3>
      </div>
      <ul className="space-y-2">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2 font-body text-sm font-bold leading-relaxed text-text-muted"
          >
            <span className="mt-2 size-1 rounded-full bg-brand-yellow/70" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function WhatWeDoSection({ cards }: { cards: CardData[] }) {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 md:px-8 md:py-20"
      aria-labelledby="what-we-do-heading"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="mb-2 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
          What we do
        </p>
        <h2
          id="what-we-do-heading"
          className="mb-10 font-display text-4xl font-black leading-tight text-text-primary md:text-5xl"
        >
          <span className="text-brand-green">End-to-end</span>{" "}
          <span className="text-brand-yellow">support.</span>
          <br />
        </h2>

        <div
          data-beam-collision-target
          className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-brand-green/45 bg-brand-green/35 md:grid-cols-3"
        >
          {cards.map((card) => (
            <MissionCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
