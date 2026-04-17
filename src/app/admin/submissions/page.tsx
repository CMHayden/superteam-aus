"use client";

import { useEffect, useState, useCallback } from "react";

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  role: string;
  experience: string;
  looking_for: string[];
  looking_other: string;
  skills: string[];
  twitter: string;
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
  is_read: boolean;
  approved: boolean;
  created_at: string;
};

type Filter = "all" | "unread" | "read";

const LINK_FIELDS: { key: keyof Submission; label: string }[] = [
  { key: "twitter", label: "Twitter" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "dribbble", label: "Dribbble" },
  { key: "behance", label: "Behance" },
  { key: "figma", label: "Figma" },
  { key: "company_website", label: "Company Website" },
  { key: "pitch_deck", label: "Pitch Deck" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "calendly", label: "Calendly" },
  { key: "notion", label: "Notion" },
  { key: "organisation_website", label: "Organisation Website" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ensureUrl(val: string) {
  if (/^https?:\/\//i.test(val)) return val;
  return `https://${val}`;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approveResult, setApproveResult] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/submissions");
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof payload.error === "string" ? payload.error : "Failed to load submissions",
          );
        }
        if (!cancelled) {
          setSubmissions(Array.isArray(payload) ? payload : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load submissions");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      const sub = submissions.find((s) => s.id === id);
      if (!sub || sub.is_read) return;
      try {
        const res = await fetch("/api/admin/submissions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, is_read: true }),
        });
        if (res.ok) {
          setSubmissions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, is_read: true } : s)),
          );
        }
      } catch {
        // silently fail for read marking
      }
    },
    [submissions],
  );

  const toggleExpand = useCallback(
    (id: string) => {
      setDeleteConfirmId(null);
      if (expandedId === id) {
        setExpandedId(null);
      } else {
        setExpandedId(id);
        markAsRead(id);
      }
    },
    [expandedId, markAsRead],
  );

  const confirmDelete = async (id: string) => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions", {
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
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (expandedId === id) setExpandedId(null);
      setDeleteConfirmId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const approveSubmission = async (id: string) => {
    setApprovingId(id);
    setApproveResult(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Failed to approve");
      }
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, approved: true, is_read: true } : s)),
      );
      if (data.warning) {
        setApproveResult({ id, msg: data.warning, ok: true });
      } else {
        setApproveResult({ id, msg: "Approved! Welcome email sent.", ok: true });
      }
    } catch (e) {
      setApproveResult({ id, msg: e instanceof Error ? e.message : "Failed to approve", ok: false });
    } finally {
      setApprovingId(null);
    }
  };

  const totalCount = submissions.length;
  const unreadCount = submissions.filter((s) => !s.is_read).length;

  const filtered = submissions.filter((s) => {
    if (filter === "unread") return !s.is_read;
    if (filter === "read") return s.is_read;
    return true;
  });

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-3xl font-black text-text-primary">Submissions</h1>
        <p className="mt-6 font-body text-text-secondary">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-black text-text-primary">Submissions</h1>
        <p className="mt-1 font-body text-sm text-text-muted">
          {totalCount} total &middot; {unreadCount} unread
        </p>
      </div>

      {error ? (
        <div
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex gap-2">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 font-body text-sm font-bold transition-colors ${
              filter === f
                ? "bg-brand-green text-surface-base"
                : "border border-brand-green/25 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            }`}
          >
            {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
            {f === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-brand-green/25 bg-surface-card px-5 py-8 text-center font-body text-sm text-text-muted">
            No {filter === "all" ? "" : filter} submissions found.
          </li>
        ) : null}
        {filtered.map((sub) => {
          const isOpen = expandedId === sub.id;
          const populatedLinks = LINK_FIELDS.filter(
            (l) => sub[l.key] && typeof sub[l.key] === "string" && (sub[l.key] as string).trim(),
          );

          return (
            <li
              key={sub.id}
              className="overflow-hidden rounded-xl border border-brand-green/25 bg-surface-card"
            >
              <button
                type="button"
                onClick={() => toggleExpand(sub.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-hover"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {!sub.is_read ? (
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-yellow" />
                  ) : (
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-green/40" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-bold text-text-primary">
                      {sub.first_name} {sub.last_name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 font-body text-sm text-text-secondary">
                      <span>{sub.email}</span>
                      {sub.role ? <span>{sub.role}</span> : null}
                      {sub.location ? <span>{sub.location}</span> : null}
                      {sub.approved ? (
                        <span className="rounded-full bg-brand-green/15 px-2 py-0.5 text-[10px] font-bold text-brand-green">
                          Approved
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-body text-xs text-text-muted">
                    {formatDate(sub.created_at)}
                  </span>
                  <span className="font-body text-xs font-bold text-brand-green">
                    {isOpen ? "Collapse" : "View"}
                  </span>
                </div>
              </button>

              {isOpen ? (
                <div className="border-t border-brand-green/25 px-5 pb-5 pt-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <section>
                      <h3 className="font-display text-sm font-black uppercase tracking-wide text-brand-green">
                        Personal
                      </h3>
                      <dl className="mt-3 space-y-2 font-body text-sm">
                        <div>
                          <dt className="text-text-muted">Name</dt>
                          <dd className="text-text-primary">
                            {sub.first_name} {sub.last_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-text-muted">Email</dt>
                          <dd className="text-text-primary">{sub.email}</dd>
                        </div>
                        {sub.location ? (
                          <div>
                            <dt className="text-text-muted">Location</dt>
                            <dd className="text-text-primary">{sub.location}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </section>

                    <section>
                      <h3 className="font-display text-sm font-black uppercase tracking-wide text-brand-green">
                        Role & Experience
                      </h3>
                      <dl className="mt-3 space-y-2 font-body text-sm">
                        {sub.role ? (
                          <div>
                            <dt className="text-text-muted">Role</dt>
                            <dd className="text-text-primary">{sub.role}</dd>
                          </div>
                        ) : null}
                        {sub.experience ? (
                          <div>
                            <dt className="text-text-muted">Experience</dt>
                            <dd className="text-text-primary">{sub.experience}</dd>
                          </div>
                        ) : null}
                        {sub.skills?.length > 0 ? (
                          <div>
                            <dt className="text-text-muted">Skills</dt>
                            <dd className="mt-1 flex flex-wrap gap-1.5">
                              {sub.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-md border border-brand-green/25 bg-surface-base px-2 py-0.5 text-xs text-text-secondary"
                                >
                                  {skill}
                                </span>
                              ))}
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </section>

                    {(sub.looking_for?.length > 0 || sub.looking_other) ? (
                      <section>
                        <h3 className="font-display text-sm font-black uppercase tracking-wide text-brand-green">
                          Looking For
                        </h3>
                        <div className="mt-3 font-body text-sm">
                          {sub.looking_for?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {sub.looking_for.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-md border border-brand-green/25 bg-surface-base px-2 py-0.5 text-xs text-text-secondary"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          {sub.looking_other ? (
                            <p className="mt-2 text-text-primary">{sub.looking_other}</p>
                          ) : null}
                        </div>
                      </section>
                    ) : null}

                    {populatedLinks.length > 0 ? (
                      <section>
                        <h3 className="font-display text-sm font-black uppercase tracking-wide text-brand-green">
                          Links
                        </h3>
                        <dl className="mt-3 space-y-2 font-body text-sm">
                          {populatedLinks.map((link) => (
                            <div key={link.key}>
                              <dt className="text-text-muted">{link.label}</dt>
                              <dd>
                                <a
                                  href={ensureUrl(sub[link.key] as string)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-green underline decoration-brand-green/30 transition-colors hover:text-brand-yellow"
                                >
                                  {sub[link.key] as string}
                                </a>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    ) : null}
                  </div>

                  {approveResult && approveResult.id === sub.id && (
                    <div
                      className={`mt-4 rounded-lg border px-4 py-3 font-body text-sm ${
                        approveResult.ok
                          ? "border-brand-green/30 bg-brand-green/10 text-brand-green"
                          : "border-red-500/30 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {approveResult.msg}
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-3 border-t border-brand-green/25 pt-4">
                    {sub.approved ? (
                      <span className="rounded-lg bg-brand-green/10 px-4 py-2 font-body text-sm font-bold text-brand-green">
                        Approved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          approveSubmission(sub.id);
                        }}
                        disabled={approvingId === sub.id}
                        className="rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {approvingId === sub.id ? "Approving…" : "Approve & Send Welcome Email"}
                      </button>
                    )}
                    {deleteConfirmId === sub.id ? (
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm text-red-400">Delete this submission?</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(sub.id);
                          }}
                          disabled={deleting}
                          className="rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 font-body text-xs font-bold text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                        >
                          {deleting ? "Deleting…" : "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(null);
                          }}
                          disabled={deleting}
                          className="rounded-lg border border-brand-green/25 px-3 py-1.5 font-body text-xs font-bold text-text-secondary hover:bg-surface-hover disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(sub.id);
                        }}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-body text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    )}
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
