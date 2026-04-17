"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MemberDirectoryCard } from "@/components/members/member-directory-card";
import { MembersDirectorySidebar } from "@/components/members/members-directory-sidebar";
import { useMembersDirectoryFilters } from "@/hooks/use-members-directory-filters";
import type { MemberDirectoryItem } from "@/types/member-directory";

export function MembersDirectory({ members }: { members: MemberDirectoryItem[] }) {
  const reduceMotion = useReducedMotion();
  const filters = useMembersDirectoryFilters(members);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <MembersDirectorySidebar
        query={filters.query}
        onQueryChange={filters.setQuery}
        selectedRole={filters.selectedRole}
        onRoleChange={filters.handleRoleChange}
        selectedLocation={filters.selectedLocation}
        onLocationChange={filters.setSelectedLocation}
        selectedSkills={filters.selectedSkills}
        onClearSkills={() => filters.setSelectedSkills([])}
        onToggleSkill={filters.toggleSkill}
        roles={filters.roles}
        locations={filters.locations}
        roleSkills={filters.roleSkills}
      />

      <div className="min-w-0 flex-1 space-y-6">
        <p className="font-body text-sm text-text-secondary">
          Showing <span className="font-bold text-text-primary">{filters.filteredMembers.length}</span> members
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {filters.filteredMembers.map((member) => (
              <MemberDirectoryCard key={member.id} member={member} reduceMotion={reduceMotion} />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {filters.filteredMembers.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
              className="py-12 text-center font-body text-sm text-text-muted"
            >
              No members match your filters.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
