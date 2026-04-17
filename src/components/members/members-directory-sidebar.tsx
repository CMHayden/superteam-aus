"use client";

import { MembersDirectoryCollapsibleGroup } from "@/components/members/members-directory-collapsible-group";
import { MembersDirectoryFilterPill } from "@/components/members/members-directory-filter-pill";
import {
  MEMBERS_FILTER_ALL_LOCATIONS,
  MEMBERS_FILTER_ALL_ROLES,
} from "@/lib/members-directory/filter-members";

type SidebarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedSkills: string[];
  onClearSkills: () => void;
  onToggleSkill: (skill: string) => void;
  roles: string[];
  locations: string[];
  roleSkills: string[];
};

export function MembersDirectorySidebar({
  query,
  onQueryChange,
  selectedRole,
  onRoleChange,
  selectedLocation,
  onLocationChange,
  selectedSkills,
  onClearSkills,
  onToggleSkill,
  roles,
  locations,
  roleSkills,
}: SidebarProps) {
  return (
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
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Name or @handle"
            className="w-full rounded-lg border border-border-yellow bg-surface-base px-4 py-2.5 text-sm text-text-primary outline-none focus:border-border-yellowhi"
          />
        </div>

        <MembersDirectoryCollapsibleGroup
          title="Role"
          activeLabel={selectedRole === MEMBERS_FILTER_ALL_ROLES ? "Any" : selectedRole}
          initiallyOpen
        >
          <fieldset className="space-y-2">
            <legend className="sr-only">Role</legend>
            <div className="flex flex-wrap gap-2">
              <MembersDirectoryFilterPill
                selected={selectedRole === MEMBERS_FILTER_ALL_ROLES}
                onSelect={() => onRoleChange(MEMBERS_FILTER_ALL_ROLES)}
              >
                All
              </MembersDirectoryFilterPill>
              {roles.map((role) => (
                <MembersDirectoryFilterPill key={role} selected={selectedRole === role} onSelect={() => onRoleChange(role)}>
                  {role}
                </MembersDirectoryFilterPill>
              ))}
            </div>
          </fieldset>
        </MembersDirectoryCollapsibleGroup>

        {roleSkills.length > 0 && (
          <MembersDirectoryCollapsibleGroup
            title="Skills"
            activeLabel={selectedSkills.length === 0 ? "Any" : `${selectedSkills.length} selected`}
          >
            <fieldset className="space-y-2">
              <legend className="sr-only">Skills</legend>
              <div className="flex flex-wrap gap-2">
                <MembersDirectoryFilterPill selected={selectedSkills.length === 0} onSelect={onClearSkills}>
                  Any
                </MembersDirectoryFilterPill>
                {roleSkills.map((skill) => (
                  <MembersDirectoryFilterPill
                    key={skill}
                    selected={selectedSkills.includes(skill)}
                    onSelect={() => onToggleSkill(skill)}
                  >
                    {skill}
                  </MembersDirectoryFilterPill>
                ))}
              </div>
            </fieldset>
          </MembersDirectoryCollapsibleGroup>
        )}

        <MembersDirectoryCollapsibleGroup
          title="Location"
          activeLabel={selectedLocation === MEMBERS_FILTER_ALL_LOCATIONS ? "Any" : selectedLocation}
        >
          <fieldset className="space-y-2">
            <legend className="sr-only">Location</legend>
            <div className="flex flex-wrap gap-2">
              <MembersDirectoryFilterPill
                selected={selectedLocation === MEMBERS_FILTER_ALL_LOCATIONS}
                onSelect={() => onLocationChange(MEMBERS_FILTER_ALL_LOCATIONS)}
              >
                All
              </MembersDirectoryFilterPill>
              {locations.map((location) => (
                <MembersDirectoryFilterPill
                  key={location}
                  selected={selectedLocation === location}
                  onSelect={() => onLocationChange(location)}
                >
                  {location}
                </MembersDirectoryFilterPill>
              ))}
            </div>
          </fieldset>
        </MembersDirectoryCollapsibleGroup>
      </div>
    </aside>
  );
}
