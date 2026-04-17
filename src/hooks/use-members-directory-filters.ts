"use client";

import { useMemo, useState } from "react";
import {
  collectSkillsForRole,
  collectSortedAllSkills,
  collectSortedLocations,
  collectSortedRoles,
  filterMemberDirectoryMembers,
  MEMBERS_FILTER_ALL_LOCATIONS,
  MEMBERS_FILTER_ALL_ROLES,
} from "@/lib/members-directory/filter-members";
import type { MemberDirectoryItem } from "@/types/member-directory";

export function useMembersDirectoryFilters(members: MemberDirectoryItem[]) {
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>(MEMBERS_FILTER_ALL_ROLES);
  const [selectedLocation, setSelectedLocation] = useState<string>(MEMBERS_FILTER_ALL_LOCATIONS);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const roles = useMemo(() => collectSortedRoles(members), [members]);
  const locations = useMemo(() => collectSortedLocations(members), [members]);
  const allSkills = useMemo(() => collectSortedAllSkills(members), [members]);

  const roleSkills = useMemo(
    () => collectSkillsForRole(members, selectedRole, allSkills),
    [members, selectedRole, allSkills],
  );

  const filteredMembers = useMemo(
    () =>
      filterMemberDirectoryMembers(members, {
        query,
        selectedRole,
        selectedLocation,
        selectedSkills,
      }),
    [members, query, selectedRole, selectedLocation, selectedSkills],
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((previous) =>
      previous.includes(skill) ? previous.filter((item) => item !== skill) : [...previous, skill],
    );
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setSelectedSkills([]);
  };

  return {
    query,
    setQuery,
    selectedRole,
    selectedLocation,
    selectedSkills,
    setSelectedLocation,
    setSelectedSkills,
    roles,
    locations,
    roleSkills,
    filteredMembers,
    toggleSkill,
    handleRoleChange,
  };
}
