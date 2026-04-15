import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LUMA_CALENDAR_URL,
  type LumaEvent,
  getLumaEvents,
  lumaEventDedupeKey,
} from "@/lib/luma-events";

const cardShellClass =
  "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-brand-green/35 bg-surface-card transition-colors duration-200 hover:bg-surface-hover";

const topAccentClass =
  "pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 bg-linear-to-r from-brand-sage to-brand-green opacity-0 transition-opacity duration-200 group-hover:opacity-100";

function EventCard({ title, location, dateLabel, timeLabel, url, imageUrl }: LumaEvent) {
  const body = (
    <div
      className={cn(
        "flex flex-1 flex-col p-6",
        imageUrl && "pt-4",
      )}
    >
      <p className="mb-1 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-green">
        {timeLabel}
      </p>
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-text-muted">
        {dateLabel}
      </p>
      <h3 className="font-display text-xl font-black leading-tight text-text-primary">
        {title}
      </h3>
      <p className="mt-auto pt-3 font-body text-sm font-bold text-text-muted">{location}</p>
    </div>
  );

  const imageBlock =
    imageUrl ? (
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-surface-hover">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    ) : null;

  if (url) {
    return (
      <Link href={url} target="_blank" rel="noreferrer" className={cardShellClass}>
        {imageBlock}
        {body}
        <div aria-hidden className={topAccentClass} />
      </Link>
    );
  }

  return (
    <article className={cardShellClass}>
      {imageBlock}
      {body}
      <div aria-hidden className={topAccentClass} />
    </article>
  );
}

const fallbackEvents: LumaEvent[] = [
  {
    title: "Saturday Build Sessions - National (Colosseum Frontier Hackathon)",
    location: "Australia Wide",
    dateLabel: "Date TBA",
    timeLabel: "Time TBA",
  },
  {
    title: "Developer Office Hours (Colosseum Frontier Hackathon)",
    location: "Australia Wide",
    dateLabel: "Date TBA",
    timeLabel: "Time TBA",
  },
  {
    title: "Sydney Launch",
    location: "Sydney, New South Wales",
    dateLabel: "Date TBA",
    timeLabel: "Time TBA",
  }
];

export async function EventsSection() {
  const events = await getLumaEvents(3);
  const list = (events.length > 0 ? events : fallbackEvents).slice(0, 3);

  return (
    <section
      className="relative overflow-hidden px-4 pb-20 pt-16 md:px-8 md:pt-20"
      aria-labelledby="events-heading"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="mb-2 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
          what&apos;s on
        </p>
        <h2
          id="events-heading"
          className="mb-10 font-display text-4xl font-black leading-tight text-text-primary md:text-5xl"
        >
          <span className="text-brand-green">Events</span>{" "}
          <span className="text-brand-yellow">&amp; meetups</span>
        </h2>

        <div data-beam-collision-target className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {list.map((event) => (
            <EventCard key={lumaEventDedupeKey(event)} {...event} />
          ))}
        </div>

        <div className="mt-8">
          <a href={LUMA_CALENDAR_URL} target="_blank" rel="noreferrer">
            <Button
              className={cn(
                "rounded-lg px-6 py-3 text-xs font-black uppercase tracking-wide",
                "cursor-pointer bg-brand-green text-white shadow-sm hover:bg-[#166f32] focus-visible:ring-brand-green/60 active:bg-[#145f2b]",
              )}
            >
              View all events on Luma
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
