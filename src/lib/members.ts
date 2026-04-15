export type Member = {
  slug: string;
  name: string;
  title: string;
  role: string;
  location: string;
  avatar: string;
  bio: string;
  twitterHandle: string;
  twitterUrl: string;
  skills: string[];
  tags: string[];
  eventsAttended: string[];
  hackathonWins: string[];
  projectsLaunched: string[];
  workedOn: string[];
};

export const members: Member[] = [
  {
    slug: "hayden-ross",
    name: "Hayden Ross",
    title: "Founder",
    role: "Founder",
    location: "Sydney, NSW",
    avatar: "https://i.pravatar.cc/320?img=12",
    bio: "Hayden leads founder onboarding and helps new builders plug into projects quickly. He runs weekly founder circles focused on shipping and accountability.",
    twitterHandle: "SuperteamAU",
    twitterUrl: "https://x.com/SuperteamAU",
    skills: ["Product Strategy", "Fundraising", "Go-to-Market", "Team Building", "Partnerships"],
    tags: ["Founder Support", "Ecosystem", "Growth"],
    eventsAttended: ["Sydney Solana Builder Night", "Superteam Open House", "Hackathon Demo Day"],
    hackathonWins: ["Solana Frontier - Top 10 Finalist"],
    projectsLaunched: ["Builder Sprint Program", "Founder Accountability Pods"],
    workedOn: ["Community onboarding", "Founder intros", "Grant pathway support"],
  },
  {
    slug: "priya-menon",
    name: "Priya Menon",
    title: "Community Ops",
    role: "Operator",
    location: "Brisbane, QLD",
    avatar: "https://i.pravatar.cc/320?img=5",
    bio: "Priya coordinates events and keeps member support running smoothly. She is the go-to for introductions, role matching, and collaboration opportunities.",
    twitterHandle: "priyamops",
    twitterUrl: "https://x.com/SuperteamAU",
    skills: ["Growth", "Operations", "BizDev", "Project Management", "Community"],
    tags: ["Community Ops", "Events", "Member Experience"],
    eventsAttended: ["Brisbane Builders Meetup", "Ecosystem Partner Mixer", "Women in Web3 Aus"],
    hackathonWins: ["Community Choice - Solana APAC Sprint"],
    projectsLaunched: ["Member Matchmaking Program", "Weekly Ecosystem Digest"],
    workedOn: ["Event operations", "Partner onboarding", "Community playbooks"],
  },
  {
    slug: "luca-tan",
    name: "Luca Tan",
    title: "Product Builder",
    role: "Builder",
    location: "Melbourne, VIC",
    avatar: "https://i.pravatar.cc/320?img=11",
    bio: "Luca prototypes product ideas with teams across the network. His focus is taking ideas from concept to clickable product in days, not months.",
    twitterHandle: "lucatanbuilds",
    twitterUrl: "https://x.com/SuperteamAU",
    skills: ["TypeScript", "React", "Rust", "Anchor", "Smart Contracts", "DeFi"],
    tags: ["Full-stack", "Rapid Prototyping", "Product"],
    eventsAttended: ["Melbourne Build Club", "Solana Builders Weekend"],
    hackathonWins: ["Solana Buildathon Winner 2025"],
    projectsLaunched: ["BountyBoard AU", "GrantRadar"],
    workedOn: ["Prototype architecture", "Frontend systems", "Developer tooling"],
  },
  {
    slug: "mia-chen",
    name: "Mia Chen",
    title: "Designer",
    role: "Designer",
    location: "Perth, WA",
    avatar: "https://i.pravatar.cc/320?img=32",
    bio: "Mia helps teams with brand systems and product UX. She mentors early designers in the community and runs regular design critiques.",
    twitterHandle: "miaxdesign",
    twitterUrl: "https://x.com/SuperteamAU",
    skills: ["UI Design", "UX Research", "Branding", "Figma", "Design Systems"],
    tags: ["Product Design", "Brand", "Mentorship"],
    eventsAttended: ["Perth Design Crit Night", "Web3 UX Roundtable"],
    hackathonWins: ["Best UX - Solana Design Jam"],
    projectsLaunched: ["Design System Starter Kit", "Founders Brand Sprint"],
    workedOn: ["Product UX audits", "Brand refreshes", "Design mentoring"],
  },
  {
    slug: "nate-walker",
    name: "Nate Walker",
    title: "Growth Lead",
    role: "Operator",
    location: "Adelaide, SA",
    avatar: "https://i.pravatar.cc/320?img=51",
    bio: "Nate works on growth experiments for ecosystem projects. He shares acquisition playbooks and supports teams with distribution and messaging.",
    twitterHandle: "nategrows",
    twitterUrl: "https://x.com/SuperteamAU",
    skills: ["Growth", "BizDev", "Analytics", "Operations"],
    tags: ["Growth", "GTM", "Distribution"],
    eventsAttended: ["Adelaide Growth Clinic", "Ecosystem GTM Session"],
    hackathonWins: ["Best Go-to-Market Strategy - AU Sprint"],
    projectsLaunched: ["Growth Playbook Repo", "Launch Readiness Framework"],
    workedOn: ["Acquisition funnels", "Partnership strategy", "Messaging frameworks"],
  },
  {
    slug: "sora-kim",
    name: "Sora Kim",
    title: "Engineer",
    role: "Builder",
    location: "Canberra, ACT",
    avatar: "https://i.pravatar.cc/320?img=47",
    bio: "Sora builds developer tooling and infrastructure for community products. She also contributes to technical workshops and office-hour sessions.",
    twitterHandle: "soradevinfra",
    twitterUrl: "https://x.com/SuperteamAU",
    skills: ["Rust", "TypeScript", "Node.js", "Smart Contracts", "Anchor"],
    tags: ["Infra", "DevRel", "Technical Workshops"],
    eventsAttended: ["Canberra Infra Night", "Solana Dev Office Hours"],
    hackathonWins: ["Best Infrastructure Tool - Solana Frontier"],
    projectsLaunched: ["RPC Monitor", "Build Starter Templates"],
    workedOn: ["Developer infrastructure", "Technical docs", "Mentoring builders"],
  },
];

export function getMemberBySlug(slug: string) {
  return members.find((member) => member.slug === slug);
}
