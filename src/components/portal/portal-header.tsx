"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Back to profiles", href: "/members" },
  { label: "Edit Profile", href: "/portal/profile" },
  { label: "Password", href: "/portal/password" },
] as const;

export function PortalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <header className="border-b border-brand-green/25 bg-surface-nav">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/portal" className="font-display text-lg font-black text-brand-green">
          Member Portal
        </Link>

        <nav className="hidden items-center gap-4 md:flex" aria-label="Portal">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
          <form action="/portal/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
            >
              Sign out
            </button>
          </form>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-brand-green/35 bg-surface-base/80 text-text-primary md:hidden"
          aria-expanded={menuOpen}
          aria-controls="portal-mobile-menu"
          aria-label="Open menu"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <div
          id="portal-mobile-menu"
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Portal navigation"
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
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Mobile portal">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 font-body text-sm font-bold text-text-secondary transition-colors hover:bg-brand-green/10 hover:text-brand-green"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-brand-green/20 p-4">
              <form action="/portal/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
