"use client";

import { useState, type ReactNode } from "react";

export function MembersDirectoryCollapsibleGroup({
  title,
  activeLabel,
  initiallyOpen,
  children,
}: {
  title: string;
  activeLabel: string;
  initiallyOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(Boolean(initiallyOpen));

  return (
    <details
      className="rounded-lg border border-border-yellow/80 bg-surface-base/40 open:[&_.filter-chevron]:rotate-180 [&_summary::-webkit-details-marker]:hidden"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 select-none">
        <span className="text-xs font-extrabold uppercase tracking-wide text-text-secondary">{title}</span>
        <span className="min-w-0 flex-1 truncate text-right text-xs font-bold text-brand-yellow" title={activeLabel}>
          {activeLabel}
        </span>
        <span
          className="filter-chevron shrink-0 text-[10px] text-text-muted transition-transform duration-200"
          aria-hidden
        >
          ▼
        </span>
      </summary>
      <div className="border-t border-border-yellow/50 px-3 pb-3 pt-2">{children}</div>
    </details>
  );
}
