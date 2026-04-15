import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChartLine,
  faCode,
  faFilm,
  faLandmark,
  faPenNib,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

export const joinRoleOptions: Array<{ name: string; description: string; icon: IconDefinition }> = [
  { name: "Builder", description: "You ship code, protocols or products.", icon: faCode },
  { name: "Designer", description: "UI/UX, brand and visual craft.", icon: faPenNib },
  { name: "Founder", description: "Building or scaling a project.", icon: faRocket },
  { name: "Creative", description: "Content, media and storytelling.", icon: faFilm },
  { name: "Operator", description: "Growth, ops, bizdev and community.", icon: faChartLine },
  { name: "Institution", description: "Enterprise, gov, finance or legal.", icon: faLandmark },
];

export const joinLocationOptions = {
  australia: [
    "Sydney, NSW",
    "Melbourne, VIC",
    "Brisbane, QLD",
    "Perth, WA",
    "Adelaide, SA",
    "Canberra, ACT",
    "Hobart, TAS",
    "Darwin, NT",
    "Regional Australia",
  ],
  abroad: [
    "Australian abroad - Asia Pacific",
    "Australian abroad - Europe",
    "Australian abroad - Americas",
    "Australian abroad - Other",
  ],
} as const;

export const joinSkillOptionsByRole: Record<string, string[]> = {
  Builder: ["Rust", "TypeScript", "React", "Node.js", "Smart Contracts", "Anchor", "DeFi"],
  Designer: ["UI Design", "UX Research", "Branding", "Figma", "Motion", "Design Systems"],
  Founder: ["Product Strategy", "Fundraising", "Go-to-Market", "Team Building", "Partnerships"],
  Creative: ["Content Writing", "Video", "Social Media", "Community", "PR", "Storytelling"],
  Operator: ["Growth", "Operations", "BizDev", "Analytics", "Project Management", "Community"],
  Institution: ["Policy", "Compliance", "Treasury", "Legal", "Partnerships", "Enterprise Strategy"],
};

export const joinFormRoleNames = joinRoleOptions.map((role) => role.name);

export const joinFormLocations = [...joinLocationOptions.australia, ...joinLocationOptions.abroad];

export const joinFormAllSkills = Array.from(new Set(Object.values(joinSkillOptionsByRole).flat())).sort((a, b) =>
  a.localeCompare(b),
);
