"use client";

import { useEffect, useState } from "react";

type Tweet = {
  id: string;
  tweet_id: string;
  display_order: number;
};

export default function AdminTweetsPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTweetId, setNewTweetId] = useState("");
  const [newDisplayOrder, setNewDisplayOrder] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadTweets(showListLoading = true) {
    setError(null);
    if (showListLoading) setLoading(true);
    try {
      const res = await fetch("/api/admin/tweets");
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Failed to load tweets");
        setTweets([]);
        return;
      }
      setTweets(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load tweets");
      setTweets([]);
    } finally {
      if (showListLoading) setLoading(false);
    }
  }

  useEffect(() => {
    void loadTweets(true);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const order = Number(newDisplayOrder);
    if (!newTweetId.trim() || Number.isNaN(order)) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweet_id: newTweetId.trim(), display_order: order }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Failed to add tweet");
        return;
      }
      setNewTweetId("");
      setNewDisplayOrder("");
      await loadTweets(false);
    } catch {
      setError("Failed to add tweet");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this tweet from the list?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/tweets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Failed to delete tweet");
        return;
      }
      await loadTweets(false);
    } catch {
      setError("Failed to delete tweet");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-black text-text-primary">Manage Tweets</h1>
      <p className="mt-1 font-body text-sm text-text-muted">
        Featured tweets shown on the site. Order controls display sequence.
      </p>

      {error && (
        <div
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-brand-green/25 bg-surface-card p-6">
          <h2 className="font-display text-lg font-black text-text-primary">Add tweet</h2>
          <p className="mt-1 font-body text-xs text-text-muted">
            Paste the numeric tweet ID from the URL, e.g. 2039270701329506500
          </p>
          <form onSubmit={handleAdd} className="mt-4 space-y-4">
            <div>
              <label htmlFor="tweet_id" className="block font-body text-xs font-bold text-text-secondary">
                Tweet ID
              </label>
              <input
                id="tweet_id"
                type="text"
                value={newTweetId}
                onChange={(e) => setNewTweetId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none"
                placeholder="2039270701329506500"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="display_order" className="block font-body text-xs font-bold text-text-secondary">
                Display order
              </label>
              <input
                id="display_order"
                type="number"
                value={newDisplayOrder}
                onChange={(e) => setNewDisplayOrder(e.target.value)}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green/50 focus:outline-none"
                placeholder="0"
                min={0}
              />
            </div>
            <button
              type="submit"
              disabled={saving || !newTweetId.trim() || newDisplayOrder === "" || Number.isNaN(Number(newDisplayOrder))}
              className="w-full rounded-lg bg-brand-green px-4 py-2.5 font-body text-sm font-bold text-surface-base transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Adding…" : "Add tweet"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-brand-green/25 bg-surface-card p-6">
          <h2 className="font-display text-lg font-black text-text-primary">Tweets</h2>
          {loading ? (
            <p className="mt-4 font-body text-sm text-text-muted">Loading…</p>
          ) : tweets.length === 0 ? (
            <p className="mt-4 font-body text-sm text-text-muted">No tweets yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {tweets.map((tweet) => (
                <li
                  key={tweet.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-green/25 bg-surface-base px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="break-all font-body text-sm text-text-primary">{tweet.tweet_id}</p>
                    <p className="mt-0.5 font-body text-xs text-text-secondary">
                      Order: <span className="text-text-primary">{tweet.display_order}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(tweet.id)}
                    disabled={deletingId === tweet.id}
                    className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === tweet.id ? "Deleting…" : "Delete"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
