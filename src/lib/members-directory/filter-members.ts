import type { MemberDirectoryItem } from "@/types/member-directory";

export const MEMBERS_FILTER_ALL_ROLES = "All roles" as const;
export const MEMBERS_FILTER_ALL_LOCATIONS = "All locations" as const;

export function collectSortedRoles(members: MemberDirectoryItem[]): string[] {
  const set = new Set<string>();
  for (const m of members) {
    if (m.role) set.add(m.role);
  }
  return Array.from(set).sort();
}

export function collectSortedLocations(members: MemberDirectoryItem[]): string[] {
  const set = new Set<string>();
  for (const m of members) {
    if (m.location) set.add(m.location);
  }
  return Array.from(set).sort();
}

export function collectSortedAllSkills(members: MemberDirectoryItem[]): string[] {
  const set = new Set<string>();
  for (const m of members) {
    for (const s of m.skills ?? []) set.add(s);
  }
  return Array.from(set).sort();
}

/** Skills present among members with `selectedRole`, or all skills when role is “All roles”. */
export function collectSkillsForRole(
  members: MemberDirectoryItem[],
  selectedRole: string,
  allSkills: string[],
): string[] {
  if (selectedRole === MEMBERS_FILTER_ALL_ROLES) return allSkills;
  const set = new Set<string>();
  for (const m of members) {
    if (m.role === selectedRole) {
      for (const s of m.skills ?? []) set.add(s);
    }
  }
  return Array.from(set).sort();
}

export type MembersDirectoryFilterInput = {
  query: string;
  selectedRole: string;
  selectedLocation: string;
  selectedSkills: string[];
};

export function filterMemberDirectoryMembers(
  members: MemberDirectoryItem[],
  input: MembersDirectoryFilterInput,
): MemberDirectoryItem[] {
  const normalized = input.query.trim().toLowerCase();

  return members.filter((member) => {
    const matchesSearch =
      normalized.length === 0 ||
      member.name.toLowerCase().includes(normalized) ||
      (member.twitter_url ?? "").toLowerCase().includes(normalized);

    const matchesRole = input.selectedRole === MEMBERS_FILTER_ALL_ROLES || member.role === input.selectedRole;
    const matchesLocation =
      input.selectedLocation === MEMBERS_FILTER_ALL_LOCATIONS || member.location === input.selectedLocation;
    const matchesSkills =
      input.selectedSkills.length === 0 ||
      input.selectedSkills.some((skill) => (member.skills ?? []).includes(skill));

    return matchesSearch && matchesRole && matchesLocation && matchesSkills;
  });
}
