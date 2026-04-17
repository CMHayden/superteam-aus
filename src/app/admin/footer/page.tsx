"use client";

import { useCallback, useEffect, useState } from "react";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  display_order: number;
};

type EditableRow = {
  key: string;
  id: string | null;
  platform: string;
  url: string;
  display_order: number;
};

function newRowKey() {
  return `new-${crypto.randomUUID()}`;
}

export default function AdminFooterPage() {
  const [footerDescription, setFooterDescription] = useState("");
  const [rows, setRows] = useState<EditableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingDescription, setSavingDescription] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    setError(null);
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);
    setSuccess(null);
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/footer");
      const data = await res.json();
      if (!res.ok) {
        showError(typeof data.error === "string" ? data.error : "Failed to load footer");
        return;
      }
      const desc = data.config?.footer_description ?? "";
      setFooterDescription(desc);
      const links: SocialLink[] = data.socialLinks ?? [];
      setRows(
        links.map((l) => ({
          key: l.id,
          id: l.id,
          platform: l.platform,
          url: l.url,
          display_order: l.display_order,
        })),
      );
    } catch {
      showError("Failed to load footer");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveDescription() {
    setSavingDescription(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footer_description: footerDescription }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(typeof data.error === "string" ? data.error : "Could not save description");
        return;
      }
      showSuccess("Footer description saved");
    } catch {
      showError("Could not save description");
    } finally {
      setSavingDescription(false);
    }
  }

  function updateRow(key: string, patch: Partial<Pick<EditableRow, "platform" | "url" | "display_order">>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        key: newRowKey(),
        id: null,
        platform: "",
        url: "",
        display_order: prev.length,
      },
    ]);
  }

  async function saveRow(row: EditableRow) {
    setSavingKey(row.key);
    setError(null);
    try {
      if (row.id === null) {
        const res = await fetch("/api/admin/footer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform: row.platform,
            url: row.url,
            display_order: Number(row.display_order),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          showError(typeof data.error === "string" ? data.error : "Could not create link");
          return;
        }
        setRows((prev) =>
          prev.map((r) =>
            r.key === row.key
              ? {
                  key: data.id as string,
                  id: data.id as string,
                  platform: data.platform,
                  url: data.url,
                  display_order: data.display_order,
                }
              : r,
          ),
        );
        showSuccess("Social link added");
        return;
      }
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialLink: {
            id: row.id,
            platform: row.platform,
            url: row.url,
            display_order: Number(row.display_order),
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(typeof data.error === "string" ? data.error : "Could not update link");
        return;
      }
      showSuccess("Social link saved");
    } catch {
      showError("Could not save link");
    } finally {
      setSavingKey(null);
    }
  }

  async function deleteRow(row: EditableRow) {
    if (row.id === null) {
      setRows((prev) => prev.filter((r) => r.key !== row.key));
      return;
    }
    setDeletingKey(row.key);
    setError(null);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(typeof data.error === "string" ? data.error : "Could not delete link");
        return;
      }
      setRows((prev) => prev.filter((r) => r.key !== row.key));
      showSuccess("Social link removed");
    } catch {
      showError("Could not delete link");
    } finally {
      setDeletingKey(null);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-black text-text-primary">Manage Footer</h1>
      <p className="mt-1 font-body text-sm text-text-muted">Edit the text under the logo and social links.</p>

      {error && (
        <div
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="mt-6 rounded-xl border border-brand-green/25 bg-brand-green/10 px-4 py-3 font-body text-sm text-brand-green"
          role="status"
        >
          {success}
        </div>
      )}

      {loading ? (
        <p className="mt-8 font-body text-text-secondary">Loading…</p>
      ) : (
        <div className="mt-8 space-y-6">
          <section className="rounded-xl border border-brand-green/25 bg-surface-card p-6">
            <h2 className="font-display text-lg font-black text-text-primary">Description</h2>
            <p className="mt-1 font-body text-sm text-text-muted">Shown under the logo in the footer.</p>
            <label className="mt-4 block">
              <span className="font-body text-sm font-bold text-text-secondary">Footer text</span>
              <textarea
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                rows={5}
                className="mt-2 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
            </label>
            <button
              type="button"
              onClick={() => void saveDescription()}
              disabled={savingDescription}
              className="mt-4 rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {savingDescription ? "Saving…" : "Save description"}
            </button>
          </section>

          <section className="rounded-xl border border-brand-green/25 bg-surface-card p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-black text-text-primary">Social links</h2>
                <p className="mt-1 font-body text-sm text-text-muted">Platform name, URL, and display order.</p>
              </div>
              <button
                type="button"
                onClick={addRow}
                className="rounded-lg border border-brand-green/25 bg-surface-base px-4 py-2 font-body text-sm font-bold text-brand-green transition-colors hover:border-brand-green/50 hover:bg-surface-hover"
              >
                Add social link
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {rows.length === 0 && (
                <p className="font-body text-sm text-text-muted">No social links yet. Add one to get started.</p>
              )}
              {rows.map((row) => (
                <div
                  key={row.key}
                  className="rounded-lg border border-brand-green/25 bg-surface-card p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="block sm:col-span-1">
                      <span className="font-body text-xs font-bold text-text-secondary">Platform</span>
                      <input
                        type="text"
                        value={row.platform}
                        onChange={(e) => updateRow(row.key, { platform: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </label>
                    <label className="block sm:col-span-1">
                      <span className="font-body text-xs font-bold text-text-secondary">URL</span>
                      <input
                        type="text"
                        value={row.url}
                        onChange={(e) => updateRow(row.key, { url: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </label>
                    <label className="block sm:col-span-1">
                      <span className="font-body text-xs font-bold text-text-secondary">Display order</span>
                      <input
                        type="number"
                        value={row.display_order}
                        onChange={(e) =>
                          updateRow(row.key, { display_order: Number(e.target.value) || 0 })
                        }
                        className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void saveRow(row)}
                      disabled={savingKey === row.key}
                      className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {savingKey === row.key ? "Saving…" : row.id === null ? "Create" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteRow(row)}
                      disabled={deletingKey === row.key}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-body text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {deletingKey === row.key ? "Removing…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
