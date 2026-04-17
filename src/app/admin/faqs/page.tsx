"use client";

import { useEffect, useState } from "react";

type Faq = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
};

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{
    question: string;
    answer: string;
    display_order: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState({
    question: "",
    answer: "",
    display_order: 0,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/faqs");
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof payload.error === "string" ? payload.error : "Failed to load FAQs",
          );
        }
        if (!cancelled) {
          setFaqs(Array.isArray(payload) ? payload : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load FAQs");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const nextDisplayOrder = () => {
    if (faqs.length === 0) return 0;
    return Math.max(...faqs.map((f) => f.display_order)) + 1;
  };

  const openAdd = () => {
    setExpandedId(null);
    setDraft(null);
    setDeleteConfirmId(null);
    setAdding(true);
    setNewDraft({
      question: "",
      answer: "",
      display_order: nextDisplayOrder(),
    });
  };

  const toggleExpand = (faq: Faq) => {
    setDeleteConfirmId(null);
    setAdding(false);
    if (expandedId === faq.id) {
      setExpandedId(null);
      setDraft(null);
    } else {
      setExpandedId(faq.id);
      setDraft({
        question: faq.question,
        answer: faq.answer,
        display_order: faq.display_order,
      });
    }
  };

  const saveEdit = async () => {
    if (!expandedId || !draft) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: expandedId,
          question: draft.question,
          answer: draft.answer,
          display_order: draft.display_order,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "Failed to save",
        );
      }
      const updated = payload as Faq;
      setFaqs((prev) =>
        [...prev.filter((f) => f.id !== updated.id), updated].sort(
          (a, b) => a.display_order - b.display_order,
        ),
      );
      setExpandedId(null);
      setDraft(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveNew = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newDraft.question,
          answer: newDraft.answer,
          display_order: newDraft.display_order,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "Failed to create FAQ",
        );
      }
      const created = payload as Faq;
      setFaqs((prev) =>
        [...prev, created].sort((a, b) => a.display_order - b.display_order),
      );
      setAdding(false);
      setNewDraft({
        question: "",
        answer: "",
        display_order:
          Math.max(
            created.display_order,
            ...faqs.map((f) => f.display_order),
            -1,
          ) + 1,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create FAQ");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "Failed to delete",
        );
      }
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      if (expandedId === id) {
        setExpandedId(null);
        setDraft(null);
      }
      setDeleteConfirmId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-black text-text-primary">Manage FAQs</h1>
        <p className="mt-6 font-body text-text-secondary">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-text-primary">Manage FAQs</h1>
          <p className="mt-1 font-body text-sm text-text-muted">
            Edit questions and answers, set order, or add new entries.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="shrink-0 rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={saving}
        >
          Add FAQ
        </button>
      </div>

      {error ? (
        <div
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {adding ? (
        <div className="mt-8 rounded-xl border border-brand-green/25 bg-surface-card p-5">
          <h2 className="font-display text-lg font-black text-text-primary">New FAQ</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Question
              </label>
              <input
                type="text"
                value={newDraft.question}
                onChange={(e) =>
                  setNewDraft((d) => ({ ...d, question: e.target.value }))
                }
                className="mt-1.5 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Answer
              </label>
              <textarea
                value={newDraft.answer}
                onChange={(e) =>
                  setNewDraft((d) => ({ ...d, answer: e.target.value }))
                }
                rows={5}
                className="mt-1.5 w-full resize-y rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Display order
              </label>
              <input
                type="number"
                value={newDraft.display_order}
                onChange={(e) =>
                  setNewDraft((d) => ({
                    ...d,
                    display_order: Number(e.target.value),
                  }))
                }
                className="mt-1.5 w-full max-w-[12rem] rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary focus:border-brand-green/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={saveNew}
                disabled={saving}
                className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setError(null);
                }}
                disabled={saving}
                className="rounded-lg border border-brand-green/25 px-4 py-2 font-body text-sm font-bold text-text-secondary transition-colors hover:bg-surface-hover disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ul className="mt-8 space-y-4">
        {faqs.length === 0 && !adding ? (
          <li className="rounded-xl border border-brand-green/25 bg-surface-card px-5 py-8 text-center font-body text-sm text-text-muted">
            No FAQs yet. Use &ldquo;Add FAQ&rdquo; to create one.
          </li>
        ) : null}
        {faqs.map((faq) => {
          const isOpen = expandedId === faq.id;
          return (
            <li
              key={faq.id}
              className="overflow-hidden rounded-xl border border-brand-green/25 bg-surface-card"
            >
              <button
                type="button"
                onClick={() => toggleExpand(faq)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-bold text-text-primary">
                    {faq.question || "(No question)"}
                  </p>
                  {!isOpen ? (
                    <p className="mt-1 line-clamp-2 font-body text-sm text-text-secondary">
                      {faq.answer || "—"}
                    </p>
                  ) : null}
                  <p className="mt-2 font-body text-xs text-text-muted">
                    Order: {faq.display_order}
                  </p>
                </div>
                <span className="shrink-0 font-body text-xs font-bold text-brand-green">
                  {isOpen ? "Collapse" : "Edit"}
                </span>
              </button>

              {isOpen && draft ? (
                <div className="border-t border-brand-green/25 px-5 pb-5 pt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                        Question
                      </label>
                      <input
                        type="text"
                        value={draft.question}
                        onChange={(e) =>
                          setDraft((d) =>
                            d ? { ...d, question: e.target.value } : d,
                          )
                        }
                        className="mt-1.5 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                        Answer
                      </label>
                      <textarea
                        value={draft.answer}
                        onChange={(e) =>
                          setDraft((d) =>
                            d ? { ...d, answer: e.target.value } : d,
                          )
                        }
                        rows={6}
                        className="mt-1.5 w-full resize-y rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                        Display order
                      </label>
                      <input
                        type="number"
                        value={draft.display_order}
                        onChange={(e) =>
                          setDraft((d) =>
                            d
                              ? {
                                  ...d,
                                  display_order: Number(e.target.value),
                                }
                              : d,
                          )
                        }
                        className="mt-1.5 w-full max-w-[12rem] rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary focus:border-brand-green/50 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit();
                        }}
                        disabled={saving}
                        className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(faq.id);
                        }}
                        disabled={saving}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-body text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>

                    {deleteConfirmId === faq.id ? (
                      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                        <p className="font-body text-sm text-red-400">
                          Delete this FAQ? This cannot be undone.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(faq.id);
                            }}
                            disabled={saving}
                            className="rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 font-body text-xs font-bold text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                          >
                            Confirm delete
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(null);
                            }}
                            disabled={saving}
                            className="rounded-lg border border-brand-green/25 px-3 py-1.5 font-body text-xs font-bold text-text-secondary hover:bg-surface-hover disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
