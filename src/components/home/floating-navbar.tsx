"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { openJoinApplicationModal } from "@/lib/join-application-modal";
import { SuperteamLogo } from "@/components/superteam-logo";

const navItems = [
  { label: "Members", href: "/members" },
  { label: "What we do", href: "#what-we-do-heading" },
  { label: "Community", href: "#community-heading" },
  { label: "Events", href: "#events-heading" },
  { label: "FAQ", href: "#faq-heading" },
];

export function FloatingNavbar() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsFloating(window.scrollY > 72);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[110] px-3 pt-3 md:px-6 md:pt-4">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex w-full items-center justify-between border border-transparent px-4 py-3 transition-all duration-300 md:px-6",
          isFloating
            ? "max-w-7xl rounded-2xl border-brand-green/35 bg-surface-nav/92 shadow-[0_12px_34px_rgba(0,0,0,0.35)] backdrop-blur-md"
            : "max-w-full rounded-none bg-transparent",
        )}
      >
        <Link href="/" className="inline-flex items-center">
          <SuperteamLogo className="inline-flex items-center gap-2" />
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-3 py-1.5 font-body text-xs font-bold uppercase tracking-wide text-text-secondary transition-colors hover:bg-brand-green/10 hover:text-brand-green"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={openJoinApplicationModal}
          className="cursor-pointer rounded-full bg-brand-yellow px-4 py-2 font-body text-xs font-black uppercase tracking-wide text-on-yellow transition-colors hover:bg-[#ffe45c] active:bg-[#e6ca24]"
        >
          Get Involved
        </button>
      </div>
    </header>
  );
}
