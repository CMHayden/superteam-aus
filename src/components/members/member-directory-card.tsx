"use client";

import { motion, type MotionProps } from "motion/react";
import Link from "next/link";
import type { MemberDirectoryItem } from "@/types/member-directory";

type MemberDirectoryCardProps = {
  member: MemberDirectoryItem;
  reduceMotion: boolean | null;
};

function cardMotion(reduceMotion: boolean | null): Pick<
  MotionProps,
  "layout" | "initial" | "animate" | "exit" | "transition"
> {
  return {
    layout: !reduceMotion,
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 },
    transition:
      reduceMotion === true
        ? { duration: 0.12 }
        : {
            duration: 0.2,
            ease: [0.4, 0, 1, 1],
            layout: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
          },
  };
}

export function MemberDirectoryCard({ member, reduceMotion }: MemberDirectoryCardProps) {
  const motionSettings = cardMotion(reduceMotion);

  return (
    <motion.article
      {...motionSettings}
      className="group overflow-hidden rounded-2xl border border-brand-green/35 bg-surface-card p-4 transition-colors hover:bg-surface-hover"
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.name}
              className="size-16 rounded-lg object-cover"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-lg border border-dashed border-brand-green/25 bg-surface-base font-body text-xs text-text-muted">
              —
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-black text-text-primary">{member.name}</h2>
            <p className="text-sm font-bold text-text-secondary">{member.title}</p>
            <p className="text-xs text-text-muted">{member.location}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {member.role && (
          <span className="rounded-full border border-brand-green/40 bg-brand-green/10 px-2.5 py-1 text-xs font-bold text-brand-green">
            {member.role}
          </span>
        )}
        {(member.skills ?? []).slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border-yellowmd bg-brand-yellow/10 px-2.5 py-1 text-xs font-bold text-brand-yellow"
          >
            {tag}
          </span>
        ))}
      </div>

      {member.bio && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">{member.bio}</p>
      )}

      {member.profile_link && (
        <Link
          href={`/members/${member.profile_link}`}
          className="mt-4 inline-flex rounded-full bg-brand-green px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#166f32]"
        >
          View profile
        </Link>
      )}
    </motion.article>
  );
}
