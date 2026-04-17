"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AvatarUpload } from "@/components/portal/avatar-upload";

type MemberProfile = {
  id: string;
  name: string;
  title: string;
  role: string;
  location: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  contributions: string[];
  experience: string;
  looking_for: string[];
  twitter_url: string;
  github: string;
  portfolio: string;
  linkedin: string;
  dribbble: string;
  behance: string;
  figma: string;
  company_website: string;
  pitch_deck: string;
  youtube: string;
  tiktok: string;
  calendly: string;
  notion: string;
  organisation_website: string;
};

type FormRole = { id: string; name: string };
type FormLocation = { id: string; name: string; location_group: string };
type FormSkill = { id: string; name: string; role_name: string };
type FormExperience = { id: string; title: string };

type FormConfig = {
  roles: FormRole[];
  locations: FormLocation[];
  skills: FormSkill[];
  experienceOptions: FormExperience[];
};

type RoleLinkField = {
  key: keyof MemberProfile;
  label: string;
  placeholder: string;
  icon: string;
};

const roleLinkFields: Record<string, RoleLinkField[]> = {
  Builder: [
    { key: "github", label: "GitHub", placeholder: "github.com/yourprofile", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
    { key: "portfolio", label: "Portfolio / Website", placeholder: "yoursite.com", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-3a6 6 0 0 0 4.24-1.76l-1.42-1.42A4 4 0 0 1 8 12a4 4 0 0 1 6.82-2.82l1.42-1.42A6 6 0 0 0 12 6a6 6 0 0 0 0 12z" },
  ],
  Designer: [
    { key: "dribbble", label: "Dribbble", placeholder: "dribbble.com/yourprofile", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2z" },
    { key: "behance", label: "Behance", placeholder: "behance.net/yourprofile", icon: "M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168z" },
    { key: "figma", label: "Figma Portfolio", placeholder: "figma.com/@yourhandle", icon: "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zm0 14.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zm0-7a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 12a3.5 3.5 0 0 1 3.5-3.5H12v7H8.5A3.5 3.5 0 0 1 5 12z" },
  ],
  Founder: [
    { key: "company_website", label: "Company Website", placeholder: "yourstartup.com", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
    { key: "pitch_deck", label: "Pitch Deck", placeholder: "Notion / Drive / DocSend link", icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" },
  ],
  Creative: [
    { key: "youtube", label: "YouTube", placeholder: "youtube.com/@yourchannel", icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
    { key: "tiktok", label: "TikTok", placeholder: "tiktok.com/@yourhandle", icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
    { key: "portfolio", label: "Portfolio / Media Kit", placeholder: "portfolio link", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" },
  ],
  Operator: [
    { key: "notion", label: "Notion / Work Samples", placeholder: "notion.so/...", icon: "M4 4v16h16V4H4zm14 14H6V6h12v12z" },
    { key: "calendly", label: "Calendly", placeholder: "calendly.com/yourname", icon: "M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" },
    { key: "portfolio", label: "Personal Site", placeholder: "yourprofile.com", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" },
  ],
  Institution: [
    { key: "organisation_website", label: "Organisation Website", placeholder: "company.gov.au / company.com", icon: "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" },
    { key: "portfolio", label: "Case Study / Initiative", placeholder: "link to relevant program", icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" },
  ],
};

function SectionCard({
  icon,
  title,
  accent = "green",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: "green" | "yellow";
  children: React.ReactNode;
}) {
  const accentClasses =
    accent === "yellow"
      ? "border-brand-yellow/20 from-brand-yellow/5"
      : "border-brand-green/20 from-brand-green/5";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border bg-gradient-to-br to-transparent p-5 md:p-6 ${accentClasses}`}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${
            accent === "yellow"
              ? "bg-brand-yellow/15 text-brand-yellow"
              : "bg-brand-green/15 text-brand-green"
          }`}
        >
          {icon}
        </div>
        <h3
          className={`font-display text-sm font-black uppercase tracking-wide ${
            accent === "yellow" ? "text-brand-yellow" : "text-brand-green"
          }`}
        >
          {title}
        </h3>
      </div>
      {children}
    </motion.section>
  );
}

function LinkIcon({ path }: { path: string }) {
  return (
    <svg className="size-4 shrink-0 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
      <path d={path} />
    </svg>
  );
}

const inputClass =
  "w-full rounded-xl border border-brand-green/20 bg-surface-base/80 px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted/60 outline-none transition-all focus:border-brand-green/50 focus:bg-surface-base focus:shadow-[0_0_0_3px_rgba(27,138,61,0.08)]";
const selectClass =
  "w-full rounded-xl border border-brand-green/20 bg-surface-base/80 px-4 py-2.5 font-body text-sm text-text-primary outline-none transition-all focus:border-brand-green/50 focus:bg-surface-base focus:shadow-[0_0_0_3px_rgba(27,138,61,0.08)]";
const labelClass =
  "mb-1.5 block font-body text-xs font-bold uppercase tracking-wider text-text-muted";

export default function ProfileEditPage() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [contributionsText, setContributionsText] = useState("");
  const [experience, setExperience] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkValues, setLinkValues] = useState<Record<string, string>>({});

  const role = profile?.role ?? "";

  const availableSkills = useMemo(
    () => (config?.skills ?? []).filter((s) => s.role_name === role).map((s) => s.name),
    [config, role],
  );

  const australiaLocations = useMemo(
    () => (config?.locations ?? []).filter((l) => l.location_group === "australia"),
    [config],
  );
  const abroadLocations = useMemo(
    () => (config?.locations ?? []).filter((l) => l.location_group === "abroad"),
    [config],
  );

  const activeRoleLinkFields = useMemo(
    () => roleLinkFields[role] ?? [],
    [role],
  );

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, configRes] = await Promise.all([
        fetch("/api/portal/profile"),
        fetch("/api/join-form"),
      ]);
      const profileData = await profileRes.json();
      const configData = await configRes.json();
      if (!profileRes.ok) throw new Error(profileData.error || "Failed to load");

      setProfile(profileData);
      setConfig(configData);
      setTitle(profileData.title ?? "");
      setAvatarUrl(profileData.avatar_url ?? "");
      setLocation(profileData.location ?? "");
      setBio(profileData.bio ?? "");
      setSkills(profileData.skills ?? []);
      setContributionsText((profileData.contributions ?? []).join(", "));
      setExperience(profileData.experience ?? "");
      setTwitterUrl(profileData.twitter_url ?? "");

      const links: Record<string, string> = {};
      for (const key of [
        "github", "portfolio", "linkedin", "dribbble", "behance", "figma",
        "company_website", "pitch_deck", "youtube", "tiktok", "calendly",
        "notion", "organisation_website",
      ] as const) {
        links[key] = profileData[key] ?? "";
      }
      setLinkValues(links);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const parseList = (text: string) =>
    text.split(",").map((s) => s.trim()).filter(Boolean);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          location: location.trim(),
          bio,
          skills,
          contributions: parseList(contributionsText),
          experience: experience.trim(),
          twitter_url: twitterUrl.trim(),
          ...Object.fromEntries(
            Object.entries(linkValues).map(([k, v]) => [k, (v ?? "").trim()]),
          ),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green/30 border-t-brand-green" />
        <p className="font-body text-sm text-text-muted">Loading your profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg pt-12">
        <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="font-display text-lg font-black text-text-primary">Profile not found</h2>
          <p className="mt-1 font-body text-sm text-red-400">
            {error || "No profile is linked to your account. Please contact an admin."}
          </p>
        </div>
      </div>
    );
  }

  const experienceOptions = config?.experienceOptions ?? [];

  return (
    <div className="mx-auto max-w-4xl pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black text-text-primary md:text-4xl">
          Edit <span className="text-brand-green">Profile</span>
        </h1>
        <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
          Keep your profile up to date so the ecosystem can discover you.
        </p>
      </div>

      {/* Toast notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-xs text-red-400">!</span>
            <p className="font-body text-sm text-red-400">{error}</p>
            <button type="button" onClick={() => setError(null)} className="ml-auto text-xs text-red-400/60 hover:text-red-400">✕</button>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-brand-green/25 bg-brand-green/5 px-4 py-3"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-xs text-brand-green">✓</span>
            <p className="font-body text-sm text-brand-green">Profile updated successfully.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity card */}
        <SectionCard
          icon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          title="Identity"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="sm:w-48 sm:shrink-0">
              <AvatarUpload
                currentUrl={avatarUrl}
                name={profile.name}
                onUploaded={(url) => setAvatarUrl(url)}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <div className="mb-1 flex items-baseline gap-3">
                  <h2 className="font-display text-xl font-black text-text-primary">{profile.name}</h2>
                  {role && (
                    <span className="rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-2.5 py-0.5 font-body text-[10px] font-extrabold uppercase tracking-wider text-brand-yellow">
                      {role}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Developer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell the community about yourself…"
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Location & Experience */}
        <SectionCard
          icon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
          title="Location & Experience"
          accent="yellow"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass}>
                <option value="">Select location…</option>
                <optgroup label="Australia">
                  {australiaLocations.map((loc) => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Building from overseas">
                  {abroadLocations.map((loc) => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className={labelClass}>Experience level</label>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className={selectClass}>
                <option value="">Select level…</option>
                {experienceOptions.map((opt) => (
                  <option key={opt.id} value={opt.title}>{opt.title}</option>
                ))}
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Skills */}
        {availableSkills.length > 0 && (
          <SectionCard
            icon={
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            }
            title={`Skills · ${skills.length} selected`}
          >
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <motion.button
                    key={skill}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-3.5 py-1.5 font-body text-xs font-bold transition-all ${
                      selected
                        ? "border-brand-green/50 bg-brand-green/15 text-brand-green shadow-[0_0_8px_rgba(27,138,61,0.15)]"
                        : "border-brand-green/15 bg-surface-base/60 text-text-secondary hover:border-brand-green/30 hover:text-text-primary"
                    }`}
                  >
                    {selected && (
                      <span className="mr-1.5 inline-block text-brand-green">✓</span>
                    )}
                    {skill}
                  </motion.button>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* Contributions */}
        <SectionCard
          icon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          }
          title="Contributions"
          accent="yellow"
        >
          <div>
            <label className={labelClass}>Ecosystem contributions (comma-separated)</label>
            <input
              type="text"
              value={contributionsText}
              onChange={(e) => setContributionsText(e.target.value)}
              placeholder="e.g. Hackathon wins, Projects built, Bounties completed"
              className={inputClass}
            />
            {contributionsText && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {parseList(contributionsText).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-brand-yellow/25 bg-brand-yellow/8 px-2.5 py-1 font-body text-[11px] font-bold text-brand-yellow"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Social & Links */}
        <SectionCard
          icon={
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          }
          title="Social & Links"
        >
          <div className="space-y-3">
            {/* Twitter & LinkedIn always shown */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <label className={labelClass}>Twitter / X</label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="size-4 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="@yourhandle"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div className="relative">
                <label className={labelClass}>LinkedIn</label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="size-4 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={linkValues.linkedin ?? ""}
                    onChange={(e) => setLinkValues((prev) => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="linkedin.com/in/yourprofile"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* Role-specific links */}
            {activeRoleLinkFields.length > 0 && (
              <>
                <div className="flex items-center gap-3 pt-1">
                  <div className="h-px flex-1 bg-brand-green/10" />
                  <span className="font-body text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
                    {role} links
                  </span>
                  <div className="h-px flex-1 bg-brand-green/10" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeRoleLinkFields.map((field) => (
                    <div key={field.key}>
                      <label className={labelClass}>{field.label}</label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                          <LinkIcon path={field.icon} />
                        </div>
                        <input
                          type="text"
                          value={linkValues[field.key] ?? ""}
                          onChange={(e) => setLinkValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </SectionCard>

        {/* Save */}
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.01 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          className="relative w-full overflow-hidden rounded-xl bg-brand-green px-6 py-3.5 font-display text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-brand-green/20 transition-all hover:shadow-xl hover:shadow-brand-green/25 disabled:opacity-60"
        >
          <span className={saving ? "invisible" : ""}>Save Profile</span>
          {saving && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </span>
          )}
        </motion.button>
      </form>
    </div>
  );
}
