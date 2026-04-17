"use client";

import { useCallback, useEffect, useState } from "react";

type WhatWeDoCard = {
  id: string;
  title: string;
  icon_name: string;
  bullets: string[];
  display_order: number;
};

const ICON_HINTS = "rocket, chart-line, signal, users, globe, landmark";

export default function AdminWhatWeDoPage() {
  const [cards, setCards] = useState<WhatWeDoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{
    title: string;
    icon_name: string;
    bullets: string[];
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setFetchError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/what-we-do", { credentials: "include" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFetchError(typeof data?.error === "string" ? data.error : "Failed to load cards");
        setCards([]);
        return;
      }
      if (!Array.isArray(data)) {
        setFetchError("Invalid response");
        setCards([]);
        return;
      }
      setCards(data as WhatWeDoCard[]);
    } catch {
      setFetchError("Network error");
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(card: WhatWeDoCard) {
    setSuccessMessage(null);
    setSaveError(null);
    setEditingId(card.id);
    setDraft({
      title: card.title,
      icon_name: card.icon_name,
      bullets: [...card.bullets],
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
    setSaveError(null);
  }

  async function saveEdit(id: string) {
    if (!draft) return;
    setSaving(true);
    setSaveError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/admin/what-we-do", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: draft.title,
          icon_name: draft.icon_name,
          bullets: draft.bullets,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSaveError(typeof data?.error === "string" ? data.error : "Save failed");
        return;
      }
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...(data as WhatWeDoCard) } : c)),
      );
      setSuccessMessage("Saved.");
      setEditingId(null);
      setDraft(null);
    } catch {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  }

  function updateDraftBullet(index: number, value: string) {
    setDraft((d) => {
      if (!d) return d;
      const next = [...d.bullets];
      next[index] = value;
      return { ...d, bullets: next };
    });
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-black text-text-primary">Manage What We Do</h1>
      <p className="mt-1 font-body text-sm text-text-muted">
        Edit the six mission cards shown on the homepage. Icon names map to Font Awesome solid icons.
      </p>
      <p className="mt-2 font-body text-xs text-text-secondary">
        Icon names: {ICON_HINTS}
      </p>

      {successMessage && (
        <p className="mt-4 rounded-lg border border-brand-green/25 bg-brand-green/10 px-4 py-2 font-body text-sm font-bold text-brand-green">
          {successMessage}
        </p>
      )}

      {loading && (
        <p className="mt-8 font-body text-sm text-text-muted">Loading cards…</p>
      )}

      {!loading && fetchError && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="font-body text-sm font-bold text-red-400">{fetchError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-3 rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !fetchError && (
        <div className="mt-8 space-y-6">
          {cards.map((card) => {
            const isEditing = editingId === card.id;
            return (
              <div
                key={card.id}
                className="rounded-xl border border-brand-green/25 bg-surface-card p-5 md:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                    Order {card.display_order + 1}
                  </p>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => startEdit(card)}
                      className="rounded-lg border border-brand-green/25 bg-surface-base px-3 py-1.5 font-body text-xs font-bold text-text-primary transition-colors hover:border-brand-green/50"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditing && draft ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block font-body text-xs font-bold text-text-secondary">
                        Title
                      </label>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-brand-green/50"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs font-bold text-text-secondary">
                        Icon name
                      </label>
                      <input
                        type="text"
                        value={draft.icon_name}
                        onChange={(e) => setDraft({ ...draft, icon_name: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-brand-green/50"
                      />
                    </div>
                    <div>
                      <p className="font-body text-xs font-bold text-text-secondary">Bullets</p>
                      <div className="mt-2 space-y-2">
                        {draft.bullets.map((bullet, i) => (
                          <input
                            key={i}
                            type="text"
                            value={bullet}
                            onChange={(e) => updateDraftBullet(i, e.target.value)}
                            className="w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-brand-green/50"
                          />
                        ))}
                      </div>
                    </div>
                    {saveError && (
                      <p className="font-body text-sm font-bold text-red-400">{saveError}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void saveEdit(card.id)}
                        className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base disabled:opacity-50"
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={cancelEdit}
                        className="rounded-lg border border-brand-green/25 bg-surface-base px-4 py-2 font-body text-sm font-bold text-text-primary disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <h2 className="font-display text-lg font-black text-text-primary">
                      {card.title}
                    </h2>
                    <p className="font-body text-sm text-text-secondary">
                      <span className="text-text-muted">Icon:</span> {card.icon_name}
                    </p>
                    <ul className="list-inside list-disc space-y-1 font-body text-sm text-text-muted">
                      {card.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
