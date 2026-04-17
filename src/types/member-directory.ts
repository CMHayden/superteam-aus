/** Public fields used on `/members` list and directory cards (subset of `community_members`). */
export type MemberDirectoryItem = {
  id: string;
  name: string;
  title: string;
  role: string;
  location: string;
  avatar_url: string;
  bio: string;
  skills: string[];
  twitter_url: string;
  profile_link: string;
};
