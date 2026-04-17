"use client";

import { useCallback, useEffect, useState } from "react";

type Partner = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  benefits: string;
  link: string;
  display_order: number;
};

const emptyNew: Omit<Partner, "id"> = {
  name: "",
  image_url: "",
  description: "",
  benefits: "",
  link: "",
  display_order: 0,
};

function sortPartners(list: Partner[]) {
  return [...list].sort((a, b) => a.display_order - b.display_order);
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [newPartner, setNewPartner] = useState(emptyNew);
  const [savingNew, setSavingNew] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadBusy, setUploadBusy] = useState<"new" | "edit" | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/partners");
    const data = await res.json();
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Failed to load partners");
      setPartners([]);
      return;
    }
    if (!Array.isArray(data)) {
      setError("Unexpected response");
      setPartners([]);
      return;
    }
    setPartners(sortPartners(data as Partner[]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "partners");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(typeof data.error === "string" ? data.error : "Upload failed");
    }
    if (typeof data.url !== "string") {
      throw new Error("Invalid upload response");
    }
    return data.url as string;
  }

  async function handleNewUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadBusy("new");
    setError(null);
    try {
      const url = await uploadImage(file);
      setNewPartner((p) => ({ ...p, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadBusy(null);
      e.target.value = "";
    }
  }

  async function handleEditUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadBusy("edit");
    setError(null);
    try {
      const url = await uploadImage(file);
      setEditing((p) => (p ? { ...p, image_url: url } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadBusy(null);
      e.target.value = "";
    }
  }

  async function submitNew(e: React.FormEvent) {
    e.preventDefault();
    if (!newPartner.image_url.trim()) {
      setError("Add an image by uploading or pasting a URL.");
      return;
    }
    setSavingNew(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPartner.name,
          image_url: newPartner.image_url.trim(),
          description: newPartner.description,
          benefits: newPartner.benefits,
          link: newPartner.link,
          display_order: Number(newPartner.display_order) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to create partner");
        return;
      }
      const created = data as Partner;
      setPartners((prev) => sortPartners([...prev, created]));
      setNewPartner({
        ...emptyNew,
        display_order: created.display_order + 1,
      });
    } catch {
      setError("Failed to create partner");
    } finally {
      setSavingNew(false);
    }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSavingEdit(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          name: editing.name,
          image_url: editing.image_url,
          description: editing.description,
          benefits: editing.benefits,
          link: editing.link,
          display_order: Number(editing.display_order) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to save");
        return;
      }
      setPartners((prev) =>
        sortPartners(prev.map((p) => (p.id === editing.id ? (data as Partner) : p))),
      );
      setEditing(null);
    } catch {
      setError("Failed to save");
    } finally {
      setSavingEdit(false);
    }
  }

  async function removePartner(id: string) {
    if (!window.confirm("Delete this partner?")) return;
    setError(null);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to delete");
        return;
      }
      setPartners((prev) => prev.filter((p) => p.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch {
      setError("Failed to delete");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none";

  return (
    <div>
      <h1 className="font-display text-3xl font-black text-text-primary">Manage Partners</h1>
      <p className="mt-1 font-body text-sm text-text-muted">
        Add, edit, or remove partner logos and details shown on the site.
      </p>

      {error && (
        <div
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-10 flex items-center justify-center py-16">
          <p className="font-body text-sm text-text-muted">Loading partners…</p>
        </div>
      ) : (
        <>
          <section className="mt-8 rounded-xl border border-brand-green/25 bg-surface-card p-6">
            <h2 className="font-display text-lg font-black text-text-primary">Add partner</h2>
            <form onSubmit={submitNew} className="mt-4 space-y-4">
              <div>
                <label className="block font-body text-xs font-bold text-text-secondary">Name</label>
                <input
                  className={`mt-1 ${inputClass}`}
                  value={newPartner.name}
                  onChange={(e) => setNewPartner((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block font-body text-xs font-bold text-text-secondary">Image</label>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer rounded-lg bg-brand-yellow px-3 py-2 font-body text-xs font-bold text-on-yellow transition-opacity hover:opacity-90 disabled:opacity-50">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleNewUpload}
                      disabled={uploadBusy === "new"}
                    />
                    {uploadBusy === "new" ? "Uploading…" : "Upload image"}
                  </label>
                  {newPartner.image_url ? (
                    <span className="font-body text-xs text-text-muted truncate max-w-[200px]">
                      {newPartner.image_url}
                    </span>
                  ) : null}
                </div>
                {newPartner.image_url ? (
                  <div className="mt-2">
                    <img
                      src={newPartner.image_url}
                      alt=""
                      className="h-16 max-w-full rounded-lg border border-brand-green/25 object-contain object-left"
                    />
                  </div>
                ) : null}
                <input
                  className={`mt-2 ${inputClass}`}
                  value={newPartner.image_url}
                  onChange={(e) => setNewPartner((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="Or paste image URL"
                />
              </div>
              <div>
                <label className="block font-body text-xs font-bold text-text-secondary">Description</label>
                <textarea
                  className={`mt-1 min-h-[80px] ${inputClass}`}
                  value={newPartner.description}
                  onChange={(e) => setNewPartner((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-body text-xs font-bold text-text-secondary">Benefits</label>
                <textarea
                  className={`mt-1 min-h-[80px] ${inputClass}`}
                  value={newPartner.benefits}
                  onChange={(e) => setNewPartner((p) => ({ ...p, benefits: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-body text-xs font-bold text-text-secondary">Link</label>
                <input
                  className={`mt-1 ${inputClass}`}
                  type="url"
                  value={newPartner.link}
                  onChange={(e) => setNewPartner((p) => ({ ...p, link: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-body text-xs font-bold text-text-secondary">Display order</label>
                <input
                  className={`mt-1 max-w-[120px] ${inputClass}`}
                  type="number"
                  value={newPartner.display_order}
                  onChange={(e) =>
                    setNewPartner((p) => ({ ...p, display_order: Number(e.target.value) }))
                  }
                />
              </div>
              <button
                type="submit"
                disabled={savingNew}
                className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-white transition-colors hover:bg-brand-green/90 disabled:opacity-50"
              >
                {savingNew ? "Saving…" : "Add partner"}
              </button>
            </form>
          </section>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((partner) => {
              const isEditing = editing?.id === partner.id;
              if (isEditing && editing) {
                return (
                  <form
                    key={partner.id}
                    onSubmit={saveEdit}
                    className="flex flex-col rounded-xl border border-brand-green/25 bg-surface-card p-5"
                  >
                    <h3 className="font-display text-lg font-black text-brand-green">Edit partner</h3>
                    <div className="mt-4 space-y-3 flex-1">
                      <div>
                        <label className="block font-body text-xs font-bold text-text-secondary">Name</label>
                        <input
                          className={`mt-1 ${inputClass}`}
                          value={editing.name}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-bold text-text-secondary">Image</label>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer rounded-lg bg-brand-yellow px-2.5 py-1.5 font-body text-xs font-bold text-on-yellow">
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleEditUpload}
                              disabled={uploadBusy === "edit"}
                            />
                            {uploadBusy === "edit" ? "…" : "Upload"}
                          </label>
                        </div>
                        {editing.image_url ? (
                          <img
                            src={editing.image_url}
                            alt=""
                            className="mt-2 h-20 w-full rounded-lg border border-brand-green/25 object-contain object-left"
                          />
                        ) : null}
                        <input
                          className={`mt-2 ${inputClass}`}
                          value={editing.image_url}
                          onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-bold text-text-secondary">Description</label>
                        <textarea
                          className={`mt-1 min-h-[72px] ${inputClass}`}
                          value={editing.description}
                          onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-bold text-text-secondary">Benefits</label>
                        <textarea
                          className={`mt-1 min-h-[72px] ${inputClass}`}
                          value={editing.benefits}
                          onChange={(e) => setEditing({ ...editing, benefits: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-bold text-text-secondary">Link</label>
                        <input
                          className={`mt-1 ${inputClass}`}
                          type="url"
                          value={editing.link}
                          onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block font-body text-xs font-bold text-text-secondary">Display order</label>
                        <input
                          className={`mt-1 max-w-[100px] ${inputClass}`}
                          type="number"
                          value={editing.display_order}
                          onChange={(e) =>
                            setEditing({ ...editing, display_order: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={savingEdit}
                        className="rounded-lg bg-brand-green px-3 py-1.5 font-body text-xs font-bold text-white disabled:opacity-50"
                      >
                        {savingEdit ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="rounded-lg border border-brand-green/25 bg-surface-base px-3 py-1.5 font-body text-xs font-bold text-text-secondary hover:text-text-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                );
              }
              return (
                <div
                  key={partner.id}
                  className="rounded-xl border border-brand-green/25 bg-surface-card p-5 transition-colors hover:border-brand-green/45 hover:bg-surface-hover"
                >
                  <div
                    className="cursor-pointer text-left"
                    role="button"
                    tabIndex={0}
                    onClick={() => setEditing({ ...partner })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setEditing({ ...partner });
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-black text-text-primary">{partner.name}</h3>
                      <span className="shrink-0 rounded-lg border border-brand-green/25 bg-surface-base px-2 py-0.5 font-body text-xs text-text-muted">
                        #{partner.display_order}
                      </span>
                    </div>
                    {partner.image_url ? (
                      <div className="mt-3">
                        <img
                          src={partner.image_url}
                          alt=""
                          className="h-16 max-w-full rounded-lg border border-brand-green/25 object-contain object-left"
                        />
                      </div>
                    ) : null}
                    <p className="mt-3 font-body text-sm text-text-secondary whitespace-pre-wrap">
                      {partner.description || (
                        <span className="text-text-muted italic">No description</span>
                      )}
                    </p>
                    {partner.benefits ? (
                      <p className="mt-2 font-body text-sm text-text-muted whitespace-pre-wrap">
                        {partner.benefits}
                      </p>
                    ) : (
                      <p className="mt-2 font-body text-xs text-text-muted">No benefits listed</p>
                    )}
                    {partner.link ? (
                      <p className="mt-2 truncate font-body text-xs text-brand-green">{partner.link}</p>
                    ) : (
                      <p className="mt-2 font-body text-xs text-text-muted">No link</p>
                    )}
                    <p className="mt-4 font-body text-xs text-text-muted">Click to edit</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void removePartner(partner.id)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && partners.length === 0 && (
            <p className="mt-8 font-body text-sm text-text-muted">No partners yet. Add one above.</p>
          )}
        </>
      )}
    </div>
  );
}
