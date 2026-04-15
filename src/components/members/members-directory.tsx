"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { joinFormLocations, joinFormRoleNames, joinSkillOptionsByRole } from "@/lib/join-options";
import { members } from "@/lib/members";

const filterPillClass =
  "rounded-full border px-3 py-1.5 text-left text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

function FilterPill({
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

function CollapsibleFilterGroup({
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

export function MembersDirectory() {
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All roles");
  const [selectedLocation, setSelectedLocation] = useState("All locations");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const roleIsSelected = selectedRole !== "All roles";
  const roleSkills = roleIsSelected ? (joinSkillOptionsByRole[selectedRole] ?? []) : [];

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        normalized.length === 0 ||
        member.name.toLowerCase().includes(normalized) ||
        member.twitterHandle.toLowerCase().includes(normalized);

      const matchesRole = selectedRole === "All roles" || member.role === selectedRole;
      const matchesLocation = selectedLocation === "All locations" || member.location === selectedLocation;
      const matchesSkills =
        selectedSkills.length === 0 || selectedSkills.some((skill) => member.skills.includes(skill));

      return matchesSearch && matchesRole && matchesLocation && matchesSkills;
    });
  }, [query, selectedRole, selectedLocation, selectedSkills]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((previous) =>
      previous.includes(skill) ? previous.filter((item) => item !== skill) : [...previous, skill],
    );
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setSelectedSkills([]);
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <aside className="w-full shrink-0 space-y-4 rounded-2xl border border-brand-green/40 bg-surface-card p-4 md:p-5 lg:sticky lg:top-24 lg:w-72">
        <div>
          <h2 className="font-display text-lg font-black text-text-primary">Filter</h2>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">Tap an option to narrow the list.</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="members-search" className="block text-xs font-extrabold uppercase tracking-wide text-text-secondary">
              Search
            </label>
            <input
              id="members-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name or @handle"
              className="w-full rounded-lg border border-border-yellow bg-surface-base px-4 py-2.5 text-sm text-text-primary outline-none focus:border-border-yellowhi"
            />
          </div>

          <CollapsibleFilterGroup
            title="Role"
            activeLabel={selectedRole === "All roles" ? "Any" : selectedRole}
            initiallyOpen
          >
            <fieldset className="space-y-2">
              <legend className="sr-only">Role</legend>
              <div className="flex flex-wrap gap-2">
                <FilterPill selected={selectedRole === "All roles"} onSelect={() => handleRoleChange("All roles")}>
                  All
                </FilterPill>
                {joinFormRoleNames.map((role) => (
                  <FilterPill key={role} selected={selectedRole === role} onSelect={() => handleRoleChange(role)}>
                    {role}
                  </FilterPill>
                ))}
              </div>
            </fieldset>
          </CollapsibleFilterGroup>

          {roleIsSelected ? (
            <CollapsibleFilterGroup
              title="Skills"
              activeLabel={selectedSkills.length === 0 ? "Any" : `${selectedSkills.length} selected`}
            >
              <fieldset className="space-y-2">
                <legend className="sr-only">Skills</legend>
                <div className="flex flex-wrap gap-2">
                  <FilterPill selected={selectedSkills.length === 0} onSelect={() => setSelectedSkills([])}>
                    Any
                  </FilterPill>
                  {roleSkills.map((skill) => (
                    <FilterPill key={skill} selected={selectedSkills.includes(skill)} onSelect={() => toggleSkill(skill)}>
                      {skill}
                    </FilterPill>
                  ))}
                </div>
              </fieldset>
            </CollapsibleFilterGroup>
          ) : null}

          <CollapsibleFilterGroup
            title="Location"
            activeLabel={selectedLocation === "All locations" ? "Any" : selectedLocation}
          >
            <fieldset className="space-y-2">
              <legend className="sr-only">Location</legend>
              <div className="flex flex-wrap gap-2">
                <FilterPill
                  selected={selectedLocation === "All locations"}
                  onSelect={() => setSelectedLocation("All locations")}
                >
                  All
                </FilterPill>
                {joinFormLocations.map((location) => (
                  <FilterPill
                    key={location}
                    selected={selectedLocation === location}
                    onSelect={() => setSelectedLocation(location)}
                  >
                    {location}
                  </FilterPill>
                ))}
              </div>
            </fieldset>
          </CollapsibleFilterGroup>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <p className="font-body text-sm text-text-secondary">
          Showing <span className="font-bold text-text-primary">{filteredMembers.length}</span> members
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <article
              key={member.slug}
              className="group overflow-hidden rounded-2xl border border-brand-green/35 bg-surface-card p-4 transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-start gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="size-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-xl font-black text-text-primary">{member.name}</h2>
                    <p className="text-sm font-bold text-text-secondary">{member.title}</p>
                    <p className="text-xs text-text-muted">
                      @{member.twitterHandle} • {member.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-brand-green/40 bg-brand-green/10 px-2.5 py-1 text-xs font-bold text-brand-green">
                  {member.role}
                </span>
                {member.skills.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border-yellowmd bg-brand-yellow/10 px-2.5 py-1 text-xs font-bold text-brand-yellow"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">{member.bio}</p>

              <Link
                href={`/members/${member.slug}`}
                className="mt-4 inline-flex rounded-full bg-brand-green px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#166f32]"
              >
                View profile
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
