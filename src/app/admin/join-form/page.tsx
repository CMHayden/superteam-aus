"use client";

import { useEffect, useState } from "react";

type Role = {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  display_order: number;
};

type Location = {
  id: string;
  name: string;
  location_group: string;
  display_order: number;
};

type Skill = {
  id: string;
  name: string;
  role_name: string;
  display_order: number;
};

type ExperienceOption = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badge_class: string;
  display_order: number;
};

type LookingForOption = {
  id: string;
  label: string;
  display_order: number;
};

type FormData = {
  roles: Role[];
  locations: Location[];
  skills: Skill[];
  experienceOptions: ExperienceOption[];
  lookingForOptions: LookingForOption[];
};

type SimpleSectionKey = "locations" | "experienceOptions" | "lookingForOptions";

const ICON_OPTIONS = ["code", "pen-nib", "rocket", "film", "chart-line", "landmark"];
const LOCATION_GROUPS = ["australia", "abroad"];

const SIMPLE_TABLE_MAP: Record<SimpleSectionKey, string> = {
  locations: "join_form_locations",
  experienceOptions: "join_form_experience_options",
  lookingForOptions: "join_form_looking_for",
};

const SIMPLE_SECTION_LABELS: Record<SimpleSectionKey, string> = {
  locations: "Locations",
  experienceOptions: "Experience Options",
  lookingForOptions: "Looking For Options",
};

async function apiCall(method: string, body: Record<string, unknown>) {
  const res = await fetch("/api/admin/join-form", {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed");
  }
  return data;
}

function nextOrder(items: { display_order: number }[]) {
  if (items.length === 0) return 0;
  return Math.max(...items.map((i) => i.display_order)) + 1;
}

const inputClass =
  "w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none";
const selectClass =
  "w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary focus:border-brand-green/50 focus:outline-none";
const labelClass =
  "block font-body text-xs font-bold uppercase tracking-wide text-text-muted";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={labelClass}>{children}</label>;
}

function RoleFields({
  data,
  onChange,
}: {
  data: Partial<Role>;
  onChange: (patch: Partial<Role>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>Name</FieldLabel>
        <input
          type="text"
          value={data.name ?? ""}
          onChange={(e) => onChange({ name: e.target.value })}
          className={`mt-1.5 ${inputClass}`}
          placeholder="e.g. Developer"
        />
      </div>
      <div>
        <FieldLabel>Icon Name</FieldLabel>
        <select
          value={data.icon_name ?? ""}
          onChange={(e) => onChange({ icon_name: e.target.value })}
          className={`mt-1.5 ${selectClass}`}
        >
          <option value="">Select icon…</option>
          {ICON_OPTIONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <FieldLabel>Description</FieldLabel>
        <input
          type="text"
          value={data.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          className={`mt-1.5 ${inputClass}`}
          placeholder="Short description"
        />
      </div>
      <div>
        <FieldLabel>Display Order</FieldLabel>
        <input
          type="number"
          value={data.display_order ?? 0}
          onChange={(e) => onChange({ display_order: Number(e.target.value) })}
          className={`mt-1.5 max-w-[10rem] ${inputClass}`}
        />
      </div>
    </div>
  );
}

function RoleSkillsPanel({
  roleName,
  skills,
  saving,
  onAdd,
  onUpdate,
  onDelete,
}: {
  roleName: string;
  skills: Skill[];
  saving: boolean;
  onAdd: (skill: Omit<Skill, "id">) => Promise<void>;
  onUpdate: (id: string, fields: Partial<Skill>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const roleSkills = skills
    .filter((s) => s.role_name === roleName)
    .sort((a, b) => a.display_order - b.display_order);

  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillDraft, setSkillDraft] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;
    await onAdd({
      name: newSkillName.trim(),
      role_name: roleName,
      display_order: nextOrder(roleSkills),
    });
    setNewSkillName("");
    setAddingSkill(false);
  };

  const handleSaveSkill = async (id: string) => {
    if (!skillDraft.trim()) return;
    await onUpdate(id, { name: skillDraft.trim() });
    setEditingSkillId(null);
    setSkillDraft("");
  };

  return (
    <div className="mt-4 rounded-lg border border-brand-yellow/20 bg-brand-yellow/5 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-body text-xs font-bold uppercase tracking-wide text-brand-yellow">
          Skills for {roleName} ({roleSkills.length})
        </h4>
        <button
          type="button"
          onClick={() => {
            setAddingSkill(true);
            setEditingSkillId(null);
          }}
          disabled={saving}
          className="rounded-md bg-brand-yellow/20 px-2.5 py-1 font-body text-xs font-bold text-brand-yellow transition-colors hover:bg-brand-yellow/30 disabled:opacity-50"
        >
          + Add Skill
        </button>
      </div>

      {addingSkill && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            placeholder="Skill name, e.g. React"
            className={`flex-1 ${inputClass}`}
            autoFocus
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={saving || !newSkillName.trim()}
            className="shrink-0 rounded-lg bg-brand-green px-3 py-2 font-body text-xs font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setAddingSkill(false); setNewSkillName(""); }}
            disabled={saving}
            className="shrink-0 rounded-lg border border-brand-green/25 px-3 py-2 font-body text-xs font-bold text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}

      {roleSkills.length === 0 && !addingSkill && (
        <p className="mt-3 font-body text-xs text-text-muted">No skills yet.</p>
      )}

      {roleSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {roleSkills.map((skill) => (
            <div key={skill.id} className="group relative">
              {editingSkillId === skill.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={skillDraft}
                    onChange={(e) => setSkillDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveSkill(skill.id);
                      if (e.key === "Escape") { setEditingSkillId(null); setSkillDraft(""); }
                    }}
                    className="w-32 rounded border border-brand-green/40 bg-surface-base px-2 py-1 font-body text-xs text-text-primary focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveSkill(skill.id)}
                    disabled={saving}
                    className="rounded bg-brand-green px-1.5 py-1 font-body text-[10px] font-bold text-surface-base"
                  >
                    OK
                  </button>
                </div>
              ) : deleteConfirm === skill.id ? (
                <div className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1">
                  <span className="font-body text-xs text-red-400">Delete?</span>
                  <button
                    type="button"
                    onClick={() => { onDelete(skill.id); setDeleteConfirm(null); }}
                    disabled={saving}
                    className="rounded bg-red-500/30 px-1.5 py-0.5 font-body text-[10px] font-bold text-red-400"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(null)}
                    disabled={saving}
                    className="rounded bg-surface-base px-1.5 py-0.5 font-body text-[10px] font-bold text-text-secondary"
                  >
                    No
                  </button>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-brand-green/20 bg-surface-base px-3 py-1 font-body text-xs font-semibold text-text-primary">
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => { setEditingSkillId(skill.id); setSkillDraft(skill.name); setDeleteConfirm(null); }}
                    className="ml-0.5 text-text-muted transition-colors hover:text-brand-green"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeleteConfirm(skill.id); setEditingSkillId(null); }}
                    className="text-text-muted transition-colors hover:text-red-400"
                    title="Delete"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LocationFields({
  data,
  onChange,
}: {
  data: Partial<Location>;
  onChange: (patch: Partial<Location>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <FieldLabel>Name</FieldLabel>
        <input
          type="text"
          value={data.name ?? ""}
          onChange={(e) => onChange({ name: e.target.value })}
          className={`mt-1.5 ${inputClass}`}
          placeholder="e.g. Sydney"
        />
      </div>
      <div>
        <FieldLabel>Location Group</FieldLabel>
        <select
          value={data.location_group ?? ""}
          onChange={(e) => onChange({ location_group: e.target.value })}
          className={`mt-1.5 ${selectClass}`}
        >
          <option value="">Select group…</option>
          {LOCATION_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel>Display Order</FieldLabel>
        <input
          type="number"
          value={data.display_order ?? 0}
          onChange={(e) => onChange({ display_order: Number(e.target.value) })}
          className={`mt-1.5 max-w-[10rem] ${inputClass}`}
        />
      </div>
    </div>
  );
}

function ExperienceFields({
  data,
  onChange,
}: {
  data: Partial<ExperienceOption>;
  onChange: (patch: Partial<ExperienceOption>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>Title</FieldLabel>
        <input
          type="text"
          value={data.title ?? ""}
          onChange={(e) => onChange({ title: e.target.value })}
          className={`mt-1.5 ${inputClass}`}
          placeholder="e.g. Beginner"
        />
      </div>
      <div>
        <FieldLabel>Subtitle</FieldLabel>
        <input
          type="text"
          value={data.subtitle ?? ""}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className={`mt-1.5 ${inputClass}`}
          placeholder="e.g. Less than 1 year"
        />
      </div>
      <div>
        <FieldLabel>Badge</FieldLabel>
        <input
          type="text"
          value={data.badge ?? ""}
          onChange={(e) => onChange({ badge: e.target.value })}
          className={`mt-1.5 ${inputClass}`}
          placeholder="e.g. New"
        />
      </div>
      <div>
        <FieldLabel>Badge Class</FieldLabel>
        <input
          type="text"
          value={data.badge_class ?? ""}
          onChange={(e) => onChange({ badge_class: e.target.value })}
          className={`mt-1.5 ${inputClass}`}
          placeholder="e.g. bg-brand-green/20 text-brand-green"
        />
      </div>
      <div>
        <FieldLabel>Display Order</FieldLabel>
        <input
          type="number"
          value={data.display_order ?? 0}
          onChange={(e) => onChange({ display_order: Number(e.target.value) })}
          className={`mt-1.5 max-w-[10rem] ${inputClass}`}
        />
      </div>
    </div>
  );
}

function LookingForFields({
  data,
  onChange,
}: {
  data: Partial<LookingForOption>;
  onChange: (patch: Partial<LookingForOption>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel>Label</FieldLabel>
        <input
          type="text"
          value={data.label ?? ""}
          onChange={(e) => onChange({ label: e.target.value })}
          className={`mt-1.5 ${inputClass}`}
          placeholder="e.g. Networking"
        />
      </div>
      <div>
        <FieldLabel>Display Order</FieldLabel>
        <input
          type="number"
          value={data.display_order ?? 0}
          onChange={(e) => onChange({ display_order: Number(e.target.value) })}
          className={`mt-1.5 max-w-[10rem] ${inputClass}`}
        />
      </div>
    </div>
  );
}

function simpleSectionSummary(section: SimpleSectionKey, item: Record<string, unknown>): string {
  switch (section) {
    case "locations":
      return `${item.name || "(unnamed)"} — ${item.location_group || "?"}`;
    case "experienceOptions":
      return `${item.title || "(unnamed)"}${item.subtitle ? ` — ${item.subtitle}` : ""}`;
    case "lookingForOptions":
      return `${item.label || "(unnamed)"}`;
  }
}

export default function AdminJoinFormPage() {
  const [formData, setFormData] = useState<FormData>({
    roles: [],
    locations: [],
    skills: [],
    experienceOptions: [],
    lookingForOptions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["roles"]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, unknown>>({});
  const [addingSection, setAddingSection] = useState<string | null>(null);
  const [addDraft, setAddDraft] = useState<Record<string, unknown>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/join-form", { credentials: "include" });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(typeof payload.error === "string" ? payload.error : "Failed to load");
        }
        if (!cancelled) {
          setFormData({
            roles: payload.roles ?? [],
            locations: payload.locations ?? [],
            skills: payload.skills ?? [],
            experienceOptions: payload.experienceOptions ?? [],
            lookingForOptions: payload.lookingForOptions ?? [],
          });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // --- Role CRUD ---
  const startEditRole = (role: Role) => {
    setAddingSection(null);
    setDeleteConfirmId(null);
    if (editingId === role.id) {
      setEditingId(null);
      setEditDraft({});
    } else {
      setEditingId(role.id);
      setEditDraft({ ...role });
    }
  };

  const startAddRole = () => {
    setEditingId(null);
    setEditDraft({});
    setDeleteConfirmId(null);
    setAddingSection("roles");
    setAddDraft({ name: "", description: "", icon_name: "", display_order: nextOrder(formData.roles) });
  };

  const saveEditRole = async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const { id: _id, ...fields } = editDraft;
      const updated = await apiCall("PUT", { table: "join_form_roles", id: editingId, ...fields });
      const oldRole = formData.roles.find((r) => r.id === editingId);
      setFormData((prev) => ({
        ...prev,
        roles: prev.roles.map((r) => (r.id === editingId ? updated : r)).sort((a, b) => a.display_order - b.display_order),
        skills: oldRole && oldRole.name !== updated.name
          ? prev.skills.map((s) => s.role_name === oldRole.name ? { ...s, role_name: updated.name } : s)
          : prev.skills,
      }));
      setEditingId(null);
      setEditDraft({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveAddRole = async () => {
    setSaving(true);
    setError(null);
    try {
      const created = await apiCall("POST", { table: "join_form_roles", ...addDraft });
      setFormData((prev) => ({
        ...prev,
        roles: [...prev.roles, created].sort((a, b) => a.display_order - b.display_order),
      }));
      setAddingSection(null);
      setAddDraft({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const role = formData.roles.find((r) => r.id === id);
      await apiCall("DELETE", { table: "join_form_roles", id });
      setFormData((prev) => ({
        ...prev,
        roles: prev.roles.filter((r) => r.id !== id),
        skills: role ? prev.skills.filter((s) => s.role_name !== role.name) : prev.skills,
      }));
      if (editingId === id) { setEditingId(null); setEditDraft({}); }
      setDeleteConfirmId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  // --- Skill CRUD (used within RoleSkillsPanel) ---
  const addSkill = async (skill: Omit<Skill, "id">) => {
    setSaving(true);
    setError(null);
    try {
      const created = await apiCall("POST", { table: "join_form_skills", ...skill });
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, created].sort((a, b) => a.display_order - b.display_order),
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add skill");
    } finally {
      setSaving(false);
    }
  };

  const updateSkill = async (id: string, fields: Partial<Skill>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await apiCall("PUT", { table: "join_form_skills", id, ...fields });
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update skill");
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await apiCall("DELETE", { table: "join_form_skills", id });
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete skill");
    } finally {
      setSaving(false);
    }
  };

  // --- Simple section CRUD (locations, experience, looking for) ---
  const startEditSimple = (section: SimpleSectionKey, item: Record<string, unknown>) => {
    setAddingSection(null);
    setDeleteConfirmId(null);
    if (editingId === item.id) {
      setEditingId(null);
      setEditDraft({});
    } else {
      setEditingId(item.id as string);
      setEditDraft({ ...item });
    }
  };

  const startAddSimple = (section: SimpleSectionKey) => {
    setEditingId(null);
    setEditDraft({});
    setDeleteConfirmId(null);
    setAddingSection(section);
    const items = formData[section] as { display_order: number }[];
    const base: Record<string, unknown> = { display_order: nextOrder(items) };
    switch (section) {
      case "locations":
        Object.assign(base, { name: "", location_group: "" });
        break;
      case "experienceOptions":
        Object.assign(base, { title: "", subtitle: "", badge: "", badge_class: "" });
        break;
      case "lookingForOptions":
        Object.assign(base, { label: "" });
        break;
    }
    setAddDraft(base);
  };

  const saveEditSimple = async (section: SimpleSectionKey) => {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const { id: _id, ...fields } = editDraft;
      const updated = await apiCall("PUT", { table: SIMPLE_TABLE_MAP[section], id: editingId, ...fields });
      setFormData((prev) => ({
        ...prev,
        [section]: (prev[section] as { id: string; display_order: number }[])
          .map((item) => (item.id === editingId ? updated : item))
          .sort((a, b) => a.display_order - b.display_order),
      }));
      setEditingId(null);
      setEditDraft({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveAddSimple = async (section: SimpleSectionKey) => {
    setSaving(true);
    setError(null);
    try {
      const created = await apiCall("POST", { table: SIMPLE_TABLE_MAP[section], ...addDraft });
      setFormData((prev) => ({
        ...prev,
        [section]: [...(prev[section] as { display_order: number }[]), created].sort(
          (a, b) => a.display_order - b.display_order,
        ),
      }));
      setAddingSection(null);
      setAddDraft({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteSimple = async (section: SimpleSectionKey, id: string) => {
    setSaving(true);
    setError(null);
    try {
      await apiCall("DELETE", { table: SIMPLE_TABLE_MAP[section], id });
      setFormData((prev) => ({
        ...prev,
        [section]: (prev[section] as { id: string }[]).filter((item) => item.id !== id),
      }));
      if (editingId === id) { setEditingId(null); setEditDraft({}); }
      setDeleteConfirmId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  const renderSimpleFields = (
    section: SimpleSectionKey,
    data: Record<string, unknown>,
    onChange: (patch: Record<string, unknown>) => void,
  ) => {
    switch (section) {
      case "locations":
        return <LocationFields data={data as Partial<Location>} onChange={onChange} />;
      case "experienceOptions":
        return <ExperienceFields data={data as Partial<ExperienceOption>} onChange={onChange} />;
      case "lookingForOptions":
        return <LookingForFields data={data as Partial<LookingForOption>} onChange={onChange} />;
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-black text-text-primary">Manage Join Form</h1>
        <p className="mt-6 font-body text-text-secondary">Loading…</p>
      </div>
    );
  }

  const totalSkills = formData.skills.length;

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-black text-text-primary">Manage Join Form</h1>
        <p className="mt-1 font-body text-sm text-text-muted">
          Configure roles, locations, skills, experience levels, and preferences for the join
          application form.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
        >
          {error}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {/* Roles + Skills combined section */}
        <div className="overflow-hidden rounded-xl border border-brand-green/25 bg-surface-card">
          <button
            type="button"
            onClick={() => toggleSection("roles")}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-hover"
          >
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-black text-brand-yellow">
                Roles &amp; Skills
              </h2>
              <span className="rounded-full bg-brand-green/10 px-2.5 py-0.5 font-body text-xs font-bold text-brand-green">
                {formData.roles.length} roles · {totalSkills} skills
              </span>
            </div>
            <span className="font-body text-sm font-bold text-text-muted">
              {expandedSections.has("roles") ? "▲" : "▼"}
            </span>
          </button>

          {expandedSections.has("roles") && (
            <div className="border-t border-brand-green/25 px-5 pb-5 pt-4">
              <div className="mb-4">
                <button
                  type="button"
                  onClick={startAddRole}
                  disabled={saving}
                  className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Add Role
                </button>
              </div>

              {addingSection === "roles" && (
                <div className="mb-4 rounded-xl border border-brand-green/25 bg-surface-base p-4">
                  <h3 className="mb-4 font-display text-base font-bold text-text-primary">New Role</h3>
                  <RoleFields
                    data={addDraft as Partial<Role>}
                    onChange={(patch) => setAddDraft((prev) => ({ ...prev, ...patch }))}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={saveAddRole} disabled={saving} className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50">
                      {saving ? "Saving…" : "Create"}
                    </button>
                    <button type="button" onClick={() => { setAddingSection(null); setError(null); }} disabled={saving} className="rounded-lg border border-brand-green/25 px-4 py-2 font-body text-sm font-bold text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-50">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {formData.roles.length === 0 && addingSection !== "roles" && (
                <p className="py-6 text-center font-body text-sm text-text-muted">
                  No roles yet. Click &ldquo;Add Role&rdquo; to create one.
                </p>
              )}

              <ul className="space-y-3">
                {formData.roles.map((role) => {
                  const isEditing = editingId === role.id;
                  const roleSkillCount = formData.skills.filter((s) => s.role_name === role.name).length;
                  return (
                    <li key={role.id} className="overflow-hidden rounded-lg border border-brand-green/15 bg-surface-base">
                      <button
                        type="button"
                        onClick={() => startEditRole(role)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-body text-sm font-semibold text-text-primary">
                              {role.name || "(unnamed)"}
                            </p>
                            <span className="rounded-full bg-brand-yellow/15 px-2 py-0.5 font-body text-[10px] font-bold text-brand-yellow">
                              {roleSkillCount} skills
                            </span>
                          </div>
                          <p className="mt-0.5 font-body text-xs text-text-muted">
                            {role.description || "No description"} · Order: {role.display_order}
                          </p>
                        </div>
                        <span className="shrink-0 font-body text-xs font-bold text-brand-green">
                          {isEditing ? "Collapse" : "Edit"}
                        </span>
                      </button>

                      {isEditing && (
                        <div className="border-t border-brand-green/15 px-4 pb-4 pt-3">
                          <RoleFields
                            data={editDraft as Partial<Role>}
                            onChange={(patch) => setEditDraft((prev) => ({ ...prev, ...patch }))}
                          />
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" onClick={(e) => { e.stopPropagation(); saveEditRole(); }} disabled={saving} className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50">
                              {saving ? "Saving…" : "Save Role"}
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(role.id); }} disabled={saving} className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-body text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50">
                              Delete Role
                            </button>
                          </div>

                          {deleteConfirmId === role.id && (
                            <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                              <p className="font-body text-sm text-red-400">
                                Delete this role and all its skills? This cannot be undone.
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button type="button" onClick={(e) => { e.stopPropagation(); deleteRole(role.id); }} disabled={saving} className="rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 font-body text-xs font-bold text-red-400 hover:bg-red-500/30 disabled:opacity-50">
                                  Confirm delete
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }} disabled={saving} className="rounded-lg border border-brand-green/25 px-3 py-1.5 font-body text-xs font-bold text-text-secondary hover:bg-surface-hover disabled:opacity-50">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          <RoleSkillsPanel
                            roleName={role.name}
                            skills={formData.skills}
                            saving={saving}
                            onAdd={addSkill}
                            onUpdate={updateSkill}
                            onDelete={deleteSkill}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Simple sections: locations, experience, looking for */}
        {(Object.keys(SIMPLE_TABLE_MAP) as SimpleSectionKey[]).map((section) => {
          const isOpen = expandedSections.has(section);
          const items = formData[section] as (Record<string, unknown> & {
            id: string;
            display_order: number;
          })[];

          return (
            <div
              key={section}
              className="overflow-hidden rounded-xl border border-brand-green/25 bg-surface-card"
            >
              <button
                type="button"
                onClick={() => toggleSection(section)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-hover"
              >
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-lg font-black text-brand-yellow">
                    {SIMPLE_SECTION_LABELS[section]}
                  </h2>
                  <span className="rounded-full bg-brand-green/10 px-2.5 py-0.5 font-body text-xs font-bold text-brand-green">
                    {items.length}
                  </span>
                </div>
                <span className="font-body text-sm font-bold text-text-muted">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-brand-green/25 px-5 pb-5 pt-4">
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => startAddSimple(section)}
                      disabled={saving}
                      className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      Add {SIMPLE_SECTION_LABELS[section].replace(/s$/, "")}
                    </button>
                  </div>

                  {addingSection === section && (
                    <div className="mb-4 rounded-xl border border-brand-green/25 bg-surface-base p-4">
                      <h3 className="mb-4 font-display text-base font-bold text-text-primary">
                        New {SIMPLE_SECTION_LABELS[section].replace(/s$/, "")}
                      </h3>
                      {renderSimpleFields(section, addDraft, (patch) =>
                        setAddDraft((prev) => ({ ...prev, ...patch })),
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" onClick={() => saveAddSimple(section)} disabled={saving} className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50">
                          {saving ? "Saving…" : "Create"}
                        </button>
                        <button type="button" onClick={() => { setAddingSection(null); setError(null); }} disabled={saving} className="rounded-lg border border-brand-green/25 px-4 py-2 font-body text-sm font-bold text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {items.length === 0 && addingSection !== section && (
                    <p className="py-6 text-center font-body text-sm text-text-muted">
                      No items yet. Click &ldquo;Add&rdquo; to create one.
                    </p>
                  )}

                  <ul className="space-y-3">
                    {items.map((item) => {
                      const isEditing = editingId === item.id;
                      return (
                        <li
                          key={item.id}
                          className="overflow-hidden rounded-lg border border-brand-green/15 bg-surface-base"
                        >
                          <button
                            type="button"
                            onClick={() => startEditSimple(section, item)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-body text-sm font-semibold text-text-primary">
                                {simpleSectionSummary(section, item)}
                              </p>
                              <p className="mt-0.5 font-body text-xs text-text-muted">
                                Order: {item.display_order}
                              </p>
                            </div>
                            <span className="shrink-0 font-body text-xs font-bold text-brand-green">
                              {isEditing ? "Collapse" : "Edit"}
                            </span>
                          </button>

                          {isEditing && (
                            <div className="border-t border-brand-green/15 px-4 pb-4 pt-3">
                              {renderSimpleFields(section, editDraft, (patch) =>
                                setEditDraft((prev) => ({ ...prev, ...patch })),
                              )}
                              <div className="mt-4 flex flex-wrap gap-2">
                                <button type="button" onClick={(e) => { e.stopPropagation(); saveEditSimple(section); }} disabled={saving} className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50">
                                  {saving ? "Saving…" : "Save"}
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }} disabled={saving} className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-body text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50">
                                  Delete
                                </button>
                              </div>

                              {deleteConfirmId === item.id && (
                                <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                                  <p className="font-body text-sm text-red-400">
                                    Delete this item? This cannot be undone.
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <button type="button" onClick={(e) => { e.stopPropagation(); confirmDeleteSimple(section, item.id); }} disabled={saving} className="rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 font-body text-xs font-bold text-red-400 hover:bg-red-500/30 disabled:opacity-50">
                                      Confirm delete
                                    </button>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }} disabled={saving} className="rounded-lg border border-brand-green/25 px-3 py-1.5 font-body text-xs font-bold text-text-secondary hover:bg-surface-hover disabled:opacity-50">
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
