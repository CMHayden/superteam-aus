/** Fields that may hold outbound profile URLs (matches `community_members` URL columns). */
export type MemberProfileLinkFields = {
  twitter_url?: string | null;
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  dribbble?: string | null;
  behance?: string | null;
  figma?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  calendly?: string | null;
  notion?: string | null;
  company_website?: string | null;
  organisation_website?: string | null;
  pitch_deck?: string | null;
};

export type MemberSocialLink = { label: string; url: string };

export function getMemberSocialLinks(member: MemberProfileLinkFields): MemberSocialLink[] {
  const pairs: Array<{ label: string; url: string | null | undefined }> = [
    { label: "Twitter / X", url: member.twitter_url },
    { label: "GitHub", url: member.github },
    { label: "LinkedIn", url: member.linkedin },
    { label: "Portfolio", url: member.portfolio },
    { label: "Dribbble", url: member.dribbble },
    { label: "Behance", url: member.behance },
    { label: "Figma", url: member.figma },
    { label: "YouTube", url: member.youtube },
    { label: "TikTok", url: member.tiktok },
    { label: "Calendly", url: member.calendly },
    { label: "Notion", url: member.notion },
    { label: "Company", url: member.company_website },
    { label: "Organisation", url: member.organisation_website },
    { label: "Pitch Deck", url: member.pitch_deck },
  ];

  return pairs.filter((p): p is MemberSocialLink => Boolean(p.url));
}
