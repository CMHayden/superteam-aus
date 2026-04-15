"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CommunityMembersCarousel } from "@/components/home/community-members-carousel";
import { CommunityTweetsFeed } from "@/components/home/community-tweets-feed";
import { JoinApplicationModal } from "@/components/home/join-application-modal";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { OPEN_JOIN_APPLICATION_MODAL_EVENT } from "@/lib/join-application-modal";
import { cn } from "@/lib/utils";

const communityMembers = [
  {
    name: "Hayden Ross",
    title: "Founder",
    role: "Builder Lead",
    location: "Sydney, NSW",
    avatar: "https://i.pravatar.cc/160?img=12",
    bio:
      "Hayden leads founder onboarding and helps new builders plug into projects quickly. He runs weekly founder circles focused on shipping and accountability.",
    skills: ["BizDev", "Content", "Community", "Ops"],
    contributions: ["Hackathon wins", "Projects built", "DAO contributions"],
    twitterUrl: "https://x.com/SuperteamAU",
    profileLink: "https://superteamau.com/join",
  },
  {
    name: "Priya Menon",
    title: "Community Ops",
    role: "Operations Manager",
    location: "Brisbane, QLD",
    avatar: "https://i.pravatar.cc/160?img=5",
    bio:
      "Priya coordinates events and keeps member support running smoothly. She is the go-to for introductions, role matching, and collaboration opportunities.",
    skills: ["Ops", "Content", "BizDev"],
    contributions: ["Projects built", "Grants received", "Bounties completed"],
    twitterUrl: "https://x.com/SuperteamAU",
    profileLink: "https://superteamau.com/join",
  },
  {
    name: "Luca Tan",
    title: "Product Builder",
    role: "Full-stack Dev",
    location: "Melbourne, VIC",
    avatar: "https://i.pravatar.cc/160?img=11",
    bio:
      "Luca prototypes product ideas with teams across the network. His focus is taking ideas from concept to clickable product in days, not months.",
    skills: ["Dev", "Design", "Product"],
    contributions: ["Hackathon wins", "Projects built", "Bounties completed"],
    twitterUrl: "https://x.com/SuperteamAU",
    profileLink: "https://superteamau.com/join",
  },
  {
    name: "Mia Chen",
    title: "Designer",
    role: "Product Design",
    location: "Perth, WA",
    avatar: "https://i.pravatar.cc/160?img=32",
    bio:
      "Mia helps teams with brand systems and product UX. She mentors early designers in the community and runs regular design critiques.",
    skills: ["Design", "Content", "Brand"],
    contributions: ["Projects built", "DAO contributions"],
    twitterUrl: "https://x.com/SuperteamAU",
    profileLink: "https://superteamau.com/join",
  },
  {
    name: "Nate Walker",
    title: "Growth Lead",
    role: "Growth Strategist",
    location: "Adelaide, SA",
    avatar: "https://i.pravatar.cc/160?img=51",
    bio:
      "Nate works on growth experiments for ecosystem projects. He shares acquisition playbooks and supports teams with distribution and messaging.",
    skills: ["BizDev", "Content", "Growth"],
    contributions: ["Projects built", "Grants received", "DAO contributions"],
    twitterUrl: "https://x.com/SuperteamAU",
    profileLink: "https://superteamau.com/join",
  },
  {
    name: "Sora Kim",
    title: "Engineer",
    role: "Infrastructure Dev",
    location: "Canberra, ACT",
    avatar: "https://i.pravatar.cc/160?img=47",
    bio:
      "Sora builds developer tooling and infrastructure for community products. She also contributes to technical workshops and office-hour sessions.",
    skills: ["Dev", "Infra", "Content"],
    contributions: ["Hackathon wins", "Bounties completed", "Projects built"],
    twitterUrl: "https://x.com/SuperteamAU",
    profileLink: "https://superteamau.com/join",
  },
];

const eventImages = ["/events/1.jpg", "/events/2.jpg", "/events/3.jpg", "/events/4.jpg"];

const joinPerks = [
  "Weekly builder calls",
  "Project support & feedback",
  "High-signal community",
];

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

type CommunityMember = (typeof communityMembers)[number];

function CommunityMembersScroller() {
  const marqueeItems = [...communityMembers, ...communityMembers, ...communityMembers, ...communityMembers];
  const [active, setActive] = useState<CommunityMember | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useOutsideClick(cardRef, () => setActive(null));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = active ? "hidden" : "auto";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [active]);

  useEffect(() => {
    // Opening the modal can interrupt pointer leave events on the marquee.
    // Resetting hover state prevents the track from staying paused/invisible.
    setIsHovered(false);
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-50 grid place-items-center px-4 py-6">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl overflow-hidden rounded-3xl border border-border-yellowmd bg-surface-card shadow-2xl"
            >
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={active.avatar}
                      alt={active.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="space-y-1">
                      <h3
                        className="font-display text-2xl font-black text-text-primary"
                      >
                        {active.name}
                      </h3>
                      <p
                        className="font-body text-sm font-bold text-text-secondary"
                      >
                        {active.title}
                      </p>
                      <p className="font-body text-sm text-text-secondary">
                        {active.role}
                        <span className="px-1 text-text-muted">•</span>
                        <span className="text-text-muted">{active.location}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="rounded-full border border-border-yellowmd px-3 py-1.5 font-body text-xs font-bold text-text-secondary transition-colors hover:border-border-yellowhi hover:text-text-primary"
                  >
                    Close
                  </button>
                </div>
                <p className="font-body text-sm leading-relaxed text-text-secondary">{active.bio}</p>
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">Skill tags</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {active.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border-yellowmd bg-surface-base px-2.5 py-1 font-body text-xs font-bold text-text-secondary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                    Ecosystem contributions
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {active.contributions.map((item) => (
                      <li key={item} className="flex items-center gap-2 font-body text-sm text-text-secondary">
                        <span className="size-1.5 rounded-full bg-brand-yellow" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <a
                    href={active.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-body text-sm font-bold text-text-primary underline decoration-border-yellowmd underline-offset-4 transition-colors hover:text-brand-yellow"
                  >
                    <TwitterIcon className="size-3.5" />
                    Twitter / X
                  </a>
                  <a
                    href={active.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-brand-yellow px-4 py-2 font-body text-sm font-bold text-on-yellow transition-colors hover:bg-brand-gold"
                  >
                    Visit full profile
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div
        className="group relative overflow-hidden bg-surface-card/40 p-1 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "flex w-max gap-4 py-1 animate-[partners-marquee_24s_linear_infinite]",
            (isHovered || active) && "[animation-play-state:paused]",
          )}
        >
          {marqueeItems.map((member, index) => (
            <button
              type="button"
              key={`${member.name}-${index}`}
              onClick={() => setActive(member)}
              className="flex h-12 min-w-[210px] cursor-pointer items-center gap-3 rounded-lg border border-border-yellowmd bg-surface-card/40 px-3 text-left transition-[border-color,box-shadow,background-color] duration-200 hover:border-border-yellowhi hover:bg-surface-card/60 hover:shadow-[0_0_0_1px_rgb(249_215_28/0.28),0_0_18px_rgb(249_215_28/0.18)]"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="h-8 w-8 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-body text-xs font-bold text-text-primary">
                  {member.name}
                </p>
                <p className="truncate font-body text-[11px] text-text-secondary">
                  {member.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function EventsSlideshow({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % eventImages.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-border-yellowmd",
        className,
      )}
    >
      {eventImages.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Community event ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className={`object-cover transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface-base/45 via-transparent to-transparent" />
    </div>
  );
}

function JoinCard({ className }: { className?: string }) {
  const pointerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef({ x: 50, y: 50 });
  const targetRef = useRef({ x: 50, y: 50 });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.12;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.12;

      if (pointerRef.current) {
        pointerRef.current.style.left = `${currentRef.current.x}%`;
        pointerRef.current.style.top = `${currentRef.current.y}%`;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const openModal = () => setIsApplyModalOpen(true);
    window.addEventListener(OPEN_JOIN_APPLICATION_MODAL_EVENT, openModal);

    return () => {
      window.removeEventListener(OPEN_JOIN_APPLICATION_MODAL_EVENT, openModal);
    };
  }, []);

  return (
    <article
      className={cn(
        "relative flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-brand-green/35 bg-linear-to-br from-[#112118] via-[#12231a] to-[#1b2f1f] p-5 md:p-6",
        className,
      )}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        targetRef.current = { x, y };
      }}
      onMouseLeave={() => {
        targetRef.current = { x: 50, y: 50 };
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-12 -left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(249,215,28,0.28)_0%,rgba(249,215,28,0)_65%)] blur-xl animate-[join-move-vertical_24s_ease-in-out_infinite]" />
        <div className="absolute -right-10 top-1/4 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(27,138,61,0.38)_0%,rgba(27,138,61,0)_70%)] blur-xl animate-[join-move-horizontal_30s_ease-in-out_infinite]" />
        <div className="absolute -bottom-14 left-1/3 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(212,188,24,0.2)_0%,rgba(212,188,24,0)_72%)] blur-2xl animate-[join-spin_36s_linear_infinite]" />
        <div
          ref={pointerRef}
          className="absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,215,28,0.34)_0%,rgba(249,215,28,0)_70%)] blur-2xl transition-[left,top] duration-150 ease-out"
          style={{ left: "50%", top: "50%" }}
        />
      </div>
        <div className="relative z-10 flex min-h-0 flex-col">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-wide text-brand-yellow">Join</p>
          <h3 className="mt-1 font-display text-3xl font-black leading-tight text-text-primary">
            Build with us.
          </h3>
          <p className="mt-4 font-body text-base leading-relaxed text-text-secondary md:text-lg">
            If you&apos;re an Aussie builder, founder, or web3 enjoyoor you&apos;re in the right place.
          </p>
          <ul className="mt-3 space-y-2">
            {joinPerks.map((label) => (
              <li
                key={label}
                className="flex items-start gap-3 font-body text-base leading-relaxed text-text-secondary"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-yellow"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:mt-6 flex flex-col gap-3 mt-auto">
          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 py-3 font-body text-sm font-bold text-on-yellow shadow-[0_0_0_1px_rgba(249,215,28,0.25)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#ffe45c] hover:shadow-[0_0_0_1px_rgba(249,215,28,0.5),0_8px_20px_rgba(249,215,28,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#112118] active:translate-y-0 active:bg-[#e6ca24]"
          >
            Apply to join →
          </button>
          <div className="flex items-center gap-3">
            <span className="h-px min-w-0 flex-1 bg-border-yellow" aria-hidden />
            <span className="shrink-0 font-body text-sm text-text-muted">or follow along</span>
            <span className="h-px min-w-0 flex-1 bg-border-yellow" aria-hidden />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="https://twitter.com/SuperteamAU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border-yellowmd bg-surface-base/55 px-4 py-2.5 font-body text-sm font-bold text-text-primary backdrop-blur-sm transition-colors hover:border-border-yellowhi hover:bg-surface-hover sm:min-w-0"
            >
              <TwitterIcon className="size-4 shrink-0" />
              Twitter
            </a>
            <a
              href="https://t.me/SuperteamAU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border-yellowmd bg-surface-base/55 px-4 py-2.5 font-body text-sm font-bold text-text-primary backdrop-blur-sm transition-colors hover:border-border-yellowhi hover:bg-surface-hover sm:min-w-0"
            >
              <TelegramIcon className="size-4 shrink-0" />
              Telegram
            </a>
          </div>
        </div>
      </div>
      <JoinApplicationModal open={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
    </article>
  );
}

export function CommunitySection() {
  return (
    <section
      aria-labelledby="community-heading"
      className="relative overflow-hidden px-4 py-16 md:px-8 md:py-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <h2
          id="community-heading"
          className="mb-10"
        >
          <span className="mb-2 block font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
            Who we are
          </span>
          <span className="mt-1 block font-display text-4xl font-black leading-tight md:text-5xl">
            <span className="text-brand-green">Group of </span>
            <span className="text-brand-yellow">Aussies</span>
          </span>
        </h2>

        <div
          data-beam-collision-target
          className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start"
        >
          {/* Row 1: testimonials (cols 1–2) */}
          <article className="w-full md:col-span-2 md:col-start-1 md:row-start-1">
            <CommunityMembersCarousel autoplay />
          </article>

          {/* Rows 1–3: tweets — spans all rows; clips + scrolls inside */}
          <article className="flex min-h-[32rem] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-brand-green/30 bg-surface-card p-5 md:col-start-3 md:row-span-3 md:row-start-1 md:h-full md:min-h-0 md:self-stretch">
            <CommunityTweetsFeed />
          </article>

          {/* Row 2 col 1: join */}
          <JoinCard className="w-full md:col-start-1 md:row-start-2" />

          {/* Row 2 col 2: events photo + "meet all" CTA stacked */}
          <div className="flex flex-col gap-4 md:col-start-2 md:row-start-2 md:h-full">
            <EventsSlideshow className="md:h-[58%] md:aspect-auto" />
            <article className="relative cursor-pointer overflow-hidden rounded-2xl border border-brand-green/30 bg-surface-card p-5 transition-[transform,border-color,box-shadow] duration-300 hover:scale-[1.02] hover:border-border-yellowhi hover:shadow-[0_0_0_1px_rgb(249_215_28/0.24),0_0_26px_rgb(249_215_28/0.2),0_0_36px_rgb(27_138_61/0.18)] md:flex-1">
              <BackgroundBeams
                colorScheme="green"
                contrast="high"
                className="origin-center scale-125 opacity-80 mix-blend-screen"
              />
              <div className="relative z-10 flex h-full items-center">
                <h3 className="font-display text-3xl font-black leading-tight text-transparent bg-linear-to-r from-brand-green via-brand-yellow to-brand-amber bg-clip-text md:text-4xl">
                  Meet the community
                </h3>
              </div>
            </article>
          </div>

          {/* Row 3 cols 1–2: scrolling members marquee */}
          <article className="rounded-2xl border border-brand-green/30 bg-surface-card p-5 md:col-span-2 md:col-start-1 md:row-start-3">
            <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
              Meet the aussies
            </p>
            <div className="mt-4">
              <CommunityMembersScroller />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
