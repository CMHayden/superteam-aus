"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image_url: string;
  display_order: number;
};

type CommunityMember = {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar_url: string;
};

type Draft = Omit<Testimonial, "id">;

const emptyDraft = (): Draft => ({
  name: "",
  role: "",
  quote: "",
  image_url: "",
  display_order: 0,
});

function TestimonialFields({
  draft,
  setDraft,
  uploading,
  onFile,
  communityMembers,
}: {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
  uploading: boolean;
  onFile: (file: File | null) => void;
  communityMembers: CommunityMember[];
}) {
  const handlePrefill = (memberId: string) => {
    const member = communityMembers.find((m) => m.id === memberId);
    if (!member) return;
    setDraft((d) => ({
      ...d,
      name: member.name,
      role: member.role || member.title,
      image_url: member.avatar_url || d.image_url,
    }));
  };

  return (
    <div className="space-y-4">
      {communityMembers.length > 0 && (
        <div>
          <span className="font-body text-sm font-bold text-text-secondary">Prefill from member</span>
          <select
            onChange={(e) => {
              if (e.target.value) handlePrefill(e.target.value);
              e.target.value = "";
            }}
            defaultValue=""
            className="mt-1 block w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary"
          >
            <option value="" disabled>Select a community member…</option>
            {communityMembers.map((m) => (
              <option key={m.id} value={m.id}>{m.name} — {m.role || m.title}</option>
            ))}
          </select>
        </div>
      )}
      {draft.image_url ? (
        <img
          src={draft.image_url}
          alt=""
          className="h-24 w-24 rounded-lg border border-brand-green/25 object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-brand-green/25 bg-surface-base font-body text-xs text-text-muted">
          No image
        </div>
      )}
      <label className="block">
        <span className="font-body text-sm font-bold text-text-secondary">Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
          className="mt-1 block w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary file:mr-3 file:rounded file:border-0 file:bg-brand-green file:px-3 file:py-1.5 file:font-bold file:text-surface-base"
        />
      </label>
      <label className="block">
        <span className="font-body text-sm font-bold text-text-secondary">Name</span>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted"
        />
      </label>
      <label className="block">
        <span className="font-body text-sm font-bold text-text-secondary">Role</span>
        <input
          type="text"
          value={draft.role}
          onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted"
        />
      </label>
      <label className="block">
        <span className="font-body text-sm font-bold text-text-secondary">Quote</span>
        <textarea
          value={draft.quote}
          onChange={(e) => setDraft((d) => ({ ...d, quote: e.target.value }))}
          rows={4}
          className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted"
        />
      </label>
      <label className="block">
        <span className="font-body text-sm font-bold text-text-secondary">Image URL</span>
        <input
          type="url"
          value={draft.image_url}
          onChange={(e) => setDraft((d) => ({ ...d, image_url: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted"
        />
      </label>
      <label className="block">
        <span className="font-body text-sm font-bold text-text-secondary">Display order</span>
        <input
          type="number"
          value={draft.display_order}
          onChange={(e) => setDraft((d) => ({ ...d, display_order: Number(e.target.value) }))}
          className="mt-1 w-full max-w-xs rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary"
        />
      </label>
    </div>
  );
}

function FormActions({
  saving,
  uploading,
  onSave,
  onCancel,
}: {
  saving: boolean;
  uploading: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={saving || uploading}
        className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="rounded-lg border border-brand-green/25 bg-surface-base px-4 py-2 font-body text-sm font-bold text-text-secondary hover:text-text-primary"
      >
        Cancel
      </button>
    </div>
  );
}

export default function ManageTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [testimonialsRes, membersRes] = await Promise.all([
        fetch("/api/admin/testimonials"),
        fetch("/api/admin/community-members"),
      ]);
      const testimonialsData = await testimonialsRes.json().catch(() => ({}));
      const membersData = await membersRes.json().catch(() => []);
      if (!testimonialsRes.ok) throw new Error(testimonialsData.error || testimonialsRes.statusText || "Failed to load");
      setItems(Array.isArray(testimonialsData) ? testimonialsData : []);
      setCommunityMembers(Array.isArray(membersData) ? membersData : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setCreating(true);
    setDraft(emptyDraft());
    setDeleteConfirmId(null);
  }

  function openEdit(t: Testimonial) {
    setCreating(false);
    setEditingId(t.id);
    setDraft({
      name: t.name,
      role: t.role,
      quote: t.quote,
      image_url: t.image_url,
      display_order: t.display_order,
    });
    setDeleteConfirmId(null);
  }

  function closeForm() {
    setCreating(false);
    setEditingId(null);
    setDraft(emptyDraft());
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      if (creating) {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: draft.name,
            role: draft.role,
            quote: draft.quote,
            image_url: draft.image_url,
            display_order: Number(draft.display_order) || 0,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || res.statusText || "Failed to create");
        setItems((prev) => [...prev, data].sort((a, b) => a.display_order - b.display_order));
        closeForm();
      } else if (editingId) {
        const res = await fetch("/api/admin/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: draft.name,
            role: draft.role,
            quote: draft.quote,
            image_url: draft.image_url,
            display_order: Number(draft.display_order) || 0,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || res.statusText || "Failed to save");
        setItems((prev) =>
          prev.map((x) => (x.id === editingId ? data : x)).sort((a, b) => a.display_order - b.display_order),
        );
        closeForm();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText || "Failed to delete");
      setItems((prev) => prev.filter((x) => x.id !== id));
      setDeleteConfirmId(null);
      if (editingId === id) closeForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "testimonials");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText || "Upload failed");
      if (typeof data.url === "string") {
        setDraft((d) => ({ ...d, image_url: data.url }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const formActive = creating || editingId !== null;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl font-black text-text-primary">Manage Testimonials</h1>
        <button
          type="button"
          onClick={openCreate}
          disabled={formActive}
          className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add testimonial
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
        >
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-8 font-body text-text-muted">Loading…</p>
      ) : (
        <div className="mt-8 space-y-6">
          {creating && (
            <div className="rounded-xl border border-brand-green/25 bg-surface-card p-6">
              <h2 className="font-display text-lg font-black text-text-primary">New testimonial</h2>
              <div className="mt-4">
                <TestimonialFields
                  draft={draft}
                  setDraft={setDraft}
                  uploading={uploading}
                  onFile={handleFileChange}
                  communityMembers={communityMembers}
                />
              </div>
              <FormActions saving={saving} uploading={uploading} onSave={handleSave} onCancel={closeForm} />
            </div>
          )}

          {items.length === 0 && !creating ? (
            <p className="font-body text-text-muted">No testimonials yet. Add one to get started.</p>
          ) : (
            items.map((t) => {
              const isEditing = editingId === t.id;
              return (
                <div key={t.id} className="rounded-xl border border-brand-green/25 bg-surface-card p-6">
                  {isEditing ? (
                    <>
                      <h2 className="font-display text-lg font-black text-text-primary">Edit testimonial</h2>
                      <div className="mt-4">
                        <TestimonialFields
                          draft={draft}
                          setDraft={setDraft}
                          uploading={uploading}
                          onFile={handleFileChange}
                          communityMembers={communityMembers}
                        />
                      </div>
                      <FormActions saving={saving} uploading={uploading} onSave={handleSave} onCancel={closeForm} />
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-4 sm:flex-row">
                        {t.image_url ? (
                          <img
                            src={t.image_url}
                            alt=""
                            className="h-24 w-24 shrink-0 rounded-lg border border-brand-green/25 object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-brand-green/25 bg-surface-base font-body text-xs text-text-muted">
                            No image
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-lg font-black text-text-primary">{t.name}</p>
                          <p className="mt-1 font-body text-sm text-text-secondary">{t.role}</p>
                          <blockquote className="mt-3 border-l-2 border-brand-green/40 pl-3 font-body text-sm text-text-primary">
                            {t.quote}
                          </blockquote>
                          <p className="mt-3 font-body text-xs text-text-muted">Order: {t.display_order}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          disabled={formActive}
                          className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>
                        {deleteConfirmId === t.id ? (
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-body text-sm text-text-muted">Delete this testimonial?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(t.id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-body text-xs font-bold text-red-400 hover:bg-red-500/20"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded-lg border border-brand-green/25 bg-surface-base px-3 py-1.5 font-body text-xs font-bold text-text-secondary"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(t.id)}
                            disabled={formActive}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-body text-sm font-bold text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
