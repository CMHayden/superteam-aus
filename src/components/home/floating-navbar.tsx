"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

function resolveHref(href: string, pathname: string) {
  return href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
}

export function FloatingNavbar() {
  const [isFloating, setIsFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleGetInvolved = () => {
    setMenuOpen(false);
    openJoinApplicationModal();
  };

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

        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={resolveHref(item.href, pathname)}
              className="rounded-full px-3 py-1.5 font-body text-xs font-bold uppercase tracking-wide text-text-secondary transition-colors hover:bg-brand-green/10 hover:text-brand-green"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-brand-green/35 bg-surface-nav/80 text-text-primary md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label="Open menu"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          onClick={openJoinApplicationModal}
          className="hidden cursor-pointer rounded-full bg-brand-yellow px-4 py-2 font-body text-xs font-black uppercase tracking-wide text-on-yellow transition-colors hover:bg-[#ffe45c] active:bg-[#e6ca24] md:inline-flex"
        >
          Get Involved
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav-menu"
          className="pointer-events-auto fixed inset-0 z-[130] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-brand-green/30 bg-surface-nav shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-green/20 px-4 py-3">
              <span className="font-body text-xs font-black uppercase tracking-wide text-text-muted">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-2 text-text-secondary hover:bg-brand-green/10 hover:text-text-primary"
                aria-label="Close menu"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={resolveHref(item.href, pathname)}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 font-body text-sm font-bold uppercase tracking-wide text-text-secondary transition-colors hover:bg-brand-green/10 hover:text-brand-green"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-brand-green/20 p-4">
              <button
                type="button"
                onClick={handleGetInvolved}
                className="w-full cursor-pointer rounded-full bg-brand-yellow px-4 py-3 font-body text-xs font-black uppercase tracking-wide text-on-yellow transition-colors hover:bg-[#ffe45c] active:bg-[#e6ca24]"
              >
                Get Involved
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
