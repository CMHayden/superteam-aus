"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

const filterPillClass =
  "rounded-full border px-3 py-1.5 text-left text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

export function MembersDirectoryFilterPill({
  selected,
  children,
  onSelect,
}: {
  selected: boolean;
  children: ReactNode;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        filterPillClass,
        selected
          ? "border-border-yellowmd bg-brand-yellow/15 text-brand-yellow"
          : "border-border-yellow bg-surface-base text-text-secondary hover:border-border-yellowhi hover:text-text-primary",
      )}
    >
      {children}
    </button>
  );
}
