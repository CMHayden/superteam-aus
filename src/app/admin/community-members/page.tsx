"use client";

import { useCallback, useEffect, useState } from "react";

type CommunityMember = {
  id: string;
  name: string;
  title: string;
  role: string;
  location: string;
  avatar_url: string;
  bio: string;
  skills: string[];
  contributions: string[];
  twitter_url: string;
  profile_link: string;
  show_on_carousel: boolean;
  display_order: number;
  active: boolean;
  email: string;
  experience: string;
  looking_for: string[];
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

type FormState = {
  id?: string;
  name: string;
  title: string;
  role: string;
  location: string;
  avatar_url: string;
  bio: string;
  skillsText: string;
  contributionsText: string;
  twitter_url: string;
  profile_link: string;
  show_on_carousel: boolean;
  display_order: number;
  active: boolean;
  email: string;
  experience: string;
  lookingForText: string;
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

function emptyForm(defaultOrder: number): FormState {
  return {
    name: "",
    title: "",
    role: "",
    location: "",
    avatar_url: "",
    bio: "",
    skillsText: "",
    contributionsText: "",
    twitter_url: "",
    profile_link: "",
    show_on_carousel: true,
    display_order: defaultOrder,
    active: true,
    email: "",
    experience: "",
    lookingForText: "",
    github: "",
    portfolio: "",
    linkedin: "",
    dribbble: "",
    behance: "",
    figma: "",
    company_website: "",
    pitch_deck: "",
    youtube: "",
    tiktok: "",
    calendly: "",
    notion: "",
    organisation_website: "",
  };
}

function memberToForm(m: CommunityMember): FormState {
  return {
    id: m.id,
    name: m.name,
    title: m.title,
    role: m.role ?? "",
    location: m.location ?? "",
    avatar_url: m.avatar_url ?? "",
    bio: m.bio ?? "",
    skillsText: (m.skills ?? []).join(", "),
    contributionsText: (m.contributions ?? []).join(", "),
    twitter_url: m.twitter_url ?? "",
    profile_link: m.profile_link ?? "",
    show_on_carousel: m.show_on_carousel ?? true,
    display_order: m.display_order ?? 0,
    active: m.active ?? true,
    email: m.email ?? "",
    experience: m.experience ?? "",
    lookingForText: (m.looking_for ?? []).join(", "),
    github: m.github ?? "",
    portfolio: m.portfolio ?? "",
    linkedin: m.linkedin ?? "",
    dribbble: m.dribbble ?? "",
    behance: m.behance ?? "",
    figma: m.figma ?? "",
    company_website: m.company_website ?? "",
    pitch_deck: m.pitch_deck ?? "",
    youtube: m.youtube ?? "",
    tiktok: m.tiktok ?? "",
    calendly: m.calendly ?? "",
    notion: m.notion ?? "",
    organisation_website: m.organisation_website ?? "",
  };
}

function parseList(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

type Testimonial = {
  id: string;
  name: string;
  image_url: string;
};

export default function CommunityMembersAdminPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(0));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [membersRes, testimonialsRes] = await Promise.all([
        fetch("/api/admin/community-members"),
        fetch("/api/admin/testimonials"),
      ]);
      const membersData = await membersRes.json().catch(() => null);
      const testimonialsData = await testimonialsRes.json().catch(() => []);
      if (!membersRes.ok) {
        throw new Error(typeof membersData?.error === "string" ? membersData.error : "Failed to load members");
      }
      if (!Array.isArray(membersData)) {
        throw new Error("Invalid response");
      }
      setMembers(membersData as CommunityMember[]);
      setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setActionError(null);
    setEditingId(null);
    const nextOrder =
      members.length === 0 ? 0 : Math.max(...members.map((m) => m.display_order ?? 0), 0) + 1;
    setForm(emptyForm(nextOrder));
    setIsAdding(true);
  };

  const openEdit = (m: CommunityMember) => {
    setActionError(null);
    setIsAdding(false);
    setEditingId(m.id);
    setForm(memberToForm(m));
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(emptyForm(0));
    setActionError(null);
  };

  const uploadAvatar = async (file: File) => {
    setActionError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "members");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Upload failed");
      }
      if (typeof data.url !== "string") {
        throw new Error("Invalid upload response");
      }
      setForm((f) => ({ ...f, avatar_url: data.url }));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveForm = async () => {
    setActionError(null);
    if (!form.name.trim() || !form.title.trim()) {
      setActionError("Name and title are required.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      avatar_url: form.avatar_url.trim(),
      bio: form.bio,
      skills: parseList(form.skillsText),
      contributions: parseList(form.contributionsText),
      twitter_url: form.twitter_url.trim(),
      profile_link: form.profile_link.trim(),
      show_on_carousel: form.show_on_carousel,
      display_order: Number.isFinite(form.display_order) ? form.display_order : 0,
      active: form.active,
      email: form.email.trim(),
      experience: form.experience.trim(),
      looking_for: parseList(form.lookingForText),
      github: form.github.trim(),
      portfolio: form.portfolio.trim(),
      linkedin: form.linkedin.trim(),
      dribbble: form.dribbble.trim(),
      behance: form.behance.trim(),
      figma: form.figma.trim(),
      company_website: form.company_website.trim(),
      pitch_deck: form.pitch_deck.trim(),
      youtube: form.youtube.trim(),
      tiktok: form.tiktok.trim(),
      calendly: form.calendly.trim(),
      notion: form.notion.trim(),
      organisation_website: form.organisation_website.trim(),
    };
    setSaving(true);
    try {
      if (isAdding) {
        const res = await fetch("/api/admin/community-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(typeof data.error === "string" ? data.error : "Failed to create");
        }
        setMembers((prev) => [...prev, data as CommunityMember].sort((a, b) => a.display_order - b.display_order));
        closeForm();
      } else if (editingId) {
        const res = await fetch("/api/admin/community-members", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(typeof data.error === "string" ? data.error : "Failed to save");
        }
        const updated = data as CommunityMember;
        setMembers((prev) =>
          prev
            .map((m) => (m.id === updated.id ? updated : m))
            .sort((a, b) => a.display_order - b.display_order),
        );
        closeForm();
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (member: CommunityMember, checked: boolean) => {
    setActionError(null);
    const prev = member.active;
    setMembers((list) =>
      list.map((m) => (m.id === member.id ? { ...m, active: checked } : m)),
    );
    setTogglingId(member.id);
    try {
      const res = await fetch("/api/admin/community-members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, active: checked }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Failed to update");
      }
      setMembers((list) =>
        list.map((m) => (m.id === member.id ? (data as CommunityMember) : m)),
      );
    } catch (e) {
      setMembers((list) =>
        list.map((m) => (m.id === member.id ? { ...m, active: prev } : m)),
      );
      setActionError(e instanceof Error ? e.message : "Failed to toggle active");
    } finally {
      setTogglingId(null);
    }
  };

  const toggleCarousel = async (member: CommunityMember, checked: boolean) => {
    setActionError(null);
    const prev = member.show_on_carousel;
    setMembers((list) =>
      list.map((m) => (m.id === member.id ? { ...m, show_on_carousel: checked } : m)),
    );
    setTogglingId(member.id);
    try {
      const res = await fetch("/api/admin/community-members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, show_on_carousel: checked }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Failed to update");
      }
      setMembers((list) =>
        list.map((m) => (m.id === member.id ? (data as CommunityMember) : m)),
      );
    } catch (e) {
      setMembers((list) =>
        list.map((m) => (m.id === member.id ? { ...m, show_on_carousel: prev } : m)),
      );
      setActionError(e instanceof Error ? e.message : "Failed to update carousel");
    } finally {
      setTogglingId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this member? This cannot be undone.")) return;
    setActionError(null);
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/community-members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Failed to delete");
      }
      setMembers((prev) => prev.filter((m) => m.id !== id));
      if (editingId === id) closeForm();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const showForm = isAdding || editingId !== null;

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-text-primary">
            Manage Community Members
          </h1>
          <p className="mt-1 font-body text-sm text-text-muted">
            Meet the Aussies — edit bios, media, and carousel visibility.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          disabled={showForm}
          className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add member
        </button>
      </div>

      {loading && (
        <p className="mt-8 font-body text-sm text-text-secondary">Loading members…</p>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && actionError && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400">
          {actionError}
        </div>
      )}

      {!loading && !error && showForm && (
        <div className="mt-8 rounded-xl border border-brand-green/25 bg-surface-card p-6">
          <h2 className="font-display text-xl font-black text-text-primary">
            {isAdding ? "New member" : "Edit member"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Name
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Title
              </span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Role
              </span>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Location
              </span>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Avatar URL
              </span>
              <input
                type="url"
                value={form.avatar_url}
                onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <div className="sm:col-span-2">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Avatar image
              </span>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                {form.avatar_url ? (
                  <img
                    src={form.avatar_url}
                    alt=""
                    className="h-20 w-20 rounded-lg border border-brand-green/25 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-brand-green/25 bg-surface-base font-body text-xs text-text-muted">
                    No image
                  </div>
                )}
                <label className="cursor-pointer rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm font-bold text-text-secondary transition-colors hover:border-brand-green/50 hover:text-text-primary">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) void uploadAvatar(file);
                    }}
                  />
                  {uploading ? "Uploading…" : "Upload file"}
                </label>
              </div>
              {testimonials.filter((t) => t.image_url).length > 0 && (
                <div className="mt-3">
                  <span className="font-body text-xs font-bold text-text-muted">Use image from testimonial</span>
                  <select
                    onChange={(e) => {
                      const t = testimonials.find((x) => x.id === e.target.value);
                      if (t) setForm((f) => ({ ...f, avatar_url: t.image_url }));
                      e.target.value = "";
                    }}
                    defaultValue=""
                    className="mt-1 block w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary"
                  >
                    <option value="" disabled>Select a testimonial…</option>
                    {testimonials.filter((t) => t.image_url).map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <label className="block sm:col-span-2">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Bio
              </span>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={4}
                className="mt-1 w-full resize-y rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Skills (comma-separated)
              </span>
              <input
                type="text"
                value={form.skillsText}
                onChange={(e) => setForm((f) => ({ ...f, skillsText: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Contributions (comma-separated)
              </span>
              <input
                type="text"
                value={form.contributionsText}
                onChange={(e) => setForm((f) => ({ ...f, contributionsText: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="name@example.com"
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Experience
              </span>
              <input
                type="text"
                value={form.experience}
                onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                placeholder="e.g. Already building"
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Looking for (comma-separated)
              </span>
              <input
                type="text"
                value={form.lookingForText}
                onChange={(e) => setForm((f) => ({ ...f, lookingForText: e.target.value }))}
                placeholder="e.g. Hackathons & bounties, Mentorship & learning"
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>

            {/* Social & Links */}
            <div className="sm:col-span-2">
              <p className="mb-2 font-display text-sm font-black uppercase tracking-wide text-brand-green">
                Social &amp; Links
              </p>
            </div>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Twitter / X URL
              </span>
              <input
                type="url"
                value={form.twitter_url}
                onChange={(e) => setForm((f) => ({ ...f, twitter_url: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                GitHub
              </span>
              <input
                type="url"
                value={form.github}
                onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                placeholder="https://github.com/username"
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                LinkedIn
              </span>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/username"
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Portfolio
              </span>
              <input
                type="url"
                value={form.portfolio}
                onChange={(e) => setForm((f) => ({ ...f, portfolio: e.target.value }))}
                placeholder="https://portfolio.dev"
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Dribbble
              </span>
              <input
                type="url"
                value={form.dribbble}
                onChange={(e) => setForm((f) => ({ ...f, dribbble: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Behance
              </span>
              <input
                type="url"
                value={form.behance}
                onChange={(e) => setForm((f) => ({ ...f, behance: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Figma
              </span>
              <input
                type="url"
                value={form.figma}
                onChange={(e) => setForm((f) => ({ ...f, figma: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                YouTube
              </span>
              <input
                type="url"
                value={form.youtube}
                onChange={(e) => setForm((f) => ({ ...f, youtube: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                TikTok
              </span>
              <input
                type="url"
                value={form.tiktok}
                onChange={(e) => setForm((f) => ({ ...f, tiktok: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Company Website
              </span>
              <input
                type="url"
                value={form.company_website}
                onChange={(e) => setForm((f) => ({ ...f, company_website: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Organisation Website
              </span>
              <input
                type="url"
                value={form.organisation_website}
                onChange={(e) => setForm((f) => ({ ...f, organisation_website: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Pitch Deck
              </span>
              <input
                type="url"
                value={form.pitch_deck}
                onChange={(e) => setForm((f) => ({ ...f, pitch_deck: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Calendly
              </span>
              <input
                type="url"
                value={form.calendly}
                onChange={(e) => setForm((f) => ({ ...f, calendly: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Notion
              </span>
              <input
                type="url"
                value={form.notion}
                onChange={(e) => setForm((f) => ({ ...f, notion: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>

            {/* Profile & Visibility */}
            <div className="sm:col-span-2">
              <p className="mb-2 font-display text-sm font-black uppercase tracking-wide text-brand-green">
                Profile &amp; Visibility
              </p>
            </div>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Profile slug
              </span>
              <div className="mt-1 flex items-center rounded-lg border border-brand-green/25 bg-surface-base">
                <span className="shrink-0 pl-3 font-body text-sm text-text-muted">/members/</span>
                <input
                  type="text"
                  value={form.profile_link}
                  onChange={(e) => setForm((f) => ({ ...f, profile_link: e.target.value }))}
                  placeholder="hayden-ross"
                  className="w-full bg-transparent px-1 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Display order
              </span>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, display_order: Number(e.target.value) || 0 }))
                }
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none"
              />
            </label>
            <div className="flex items-end">
              <label
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                  form.active
                    ? "border-brand-green/40 bg-brand-green/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, active: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-brand-green/25 text-brand-green focus:ring-brand-green"
                />
                <span
                  className={`font-body text-sm font-bold ${
                    form.active ? "text-brand-green" : "text-red-400"
                  }`}
                >
                  {form.active ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
            <div className="flex items-end">
              <label
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                  form.show_on_carousel
                    ? "border-brand-yellow/40 bg-brand-yellow/10"
                    : "border-brand-green/25 bg-surface-base"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.show_on_carousel}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, show_on_carousel: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-brand-green/25 text-brand-yellow focus:ring-brand-yellow"
                />
                <span
                  className={`font-body text-sm font-bold ${
                    form.show_on_carousel ? "text-brand-yellow" : "text-text-secondary"
                  }`}
                >
                  Show on carousel
                </span>
              </label>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void saveForm()}
              disabled={saving}
              className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="rounded-lg border border-brand-green/25 bg-surface-base px-4 py-2 font-body text-sm font-bold text-text-secondary transition-colors hover:border-brand-green/50 hover:text-text-primary disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => {
            if (editingId === member.id) return null;
            return (
              <div
                key={member.id}
                className={`flex flex-col rounded-xl border bg-surface-card p-5 ${
                  member.active ? "border-brand-green/25" : "border-red-500/25 opacity-60"
                }`}
              >
                <div className="flex gap-4">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg border border-brand-green/25 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-brand-green/25 bg-surface-base font-body text-[10px] text-text-muted">
                      —
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display text-lg font-black text-text-primary">
                        {member.name}
                      </p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 font-body text-[10px] font-bold ${
                        member.active
                          ? "bg-brand-green/15 text-brand-green"
                          : "bg-red-500/15 text-red-400"
                      }`}>
                        {member.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-0.5 font-body text-sm text-text-secondary">{member.title}</p>
                    <p className="mt-1 font-body text-xs text-text-muted">{member.role}</p>
                    <p className="mt-0.5 font-body text-xs text-text-muted">{member.location}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <label
                    className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                      member.active
                        ? "border-brand-green/40 bg-brand-green/10"
                        : "border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={member.active}
                      disabled={togglingId === member.id}
                      onChange={(e) => void toggleActive(member, e.target.checked)}
                      className="h-4 w-4 rounded border-brand-green/25 text-brand-green focus:ring-brand-green disabled:opacity-50"
                    />
                    <span className={`font-body text-xs font-bold ${member.active ? "text-brand-green" : "text-red-400"}`}>
                      {member.active ? "Active" : "Inactive"}
                    </span>
                  </label>
                  <label
                    className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                      member.show_on_carousel
                        ? "border-brand-yellow/40 bg-brand-yellow/10"
                        : "border-brand-green/25 bg-surface-base"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={member.show_on_carousel}
                      disabled={togglingId === member.id}
                      onChange={(e) => void toggleCarousel(member, e.target.checked)}
                      className="h-4 w-4 rounded border-brand-green/25 text-brand-yellow focus:ring-brand-yellow disabled:opacity-50"
                    />
                    <span className={`font-body text-xs font-bold ${member.show_on_carousel ? "text-brand-yellow" : "text-text-muted"}`}>
                      Carousel
                    </span>
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    disabled={showForm && editingId !== member.id}
                    className="rounded-lg bg-brand-green px-3 py-1.5 font-body text-xs font-bold text-surface-base transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(member.id)}
                    disabled={deletingId === member.id || (showForm && editingId !== member.id)}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deletingId === member.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && members.length === 0 && !isAdding && (
        <p className="mt-8 font-body text-sm text-text-secondary">No members yet. Add one to get started.</p>
      )}
    </div>
  );
}
