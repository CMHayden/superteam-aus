"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminJoinPage() {
  const [joinTitle, setJoinTitle] = useState("");
  const [joinBody, setJoinBody] = useState("");
  const [perks, setPerks] = useState<string[]>([]);
  const [twitterUrl, setTwitterUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/join");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : `Failed to load (${res.status})`);
      }
      setJoinTitle(typeof data.join_title === "string" ? data.join_title : "");
      setJoinBody(typeof data.join_body === "string" ? data.join_body : "");
      let parsed: string[] = [];
      try {
        const raw = data.join_perks;
        if (typeof raw === "string" && raw.trim()) {
          const j = JSON.parse(raw) as unknown;
          parsed = Array.isArray(j) ? j.map((x) => String(x)) : [];
        }
      } catch {
        parsed = [];
      }
      setPerks(parsed);
      setTwitterUrl(typeof data.twitter_url === "string" ? data.twitter_url : "");
      setTelegramUrl(typeof data.telegram_url === "string" ? data.telegram_url : "");
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSuccess(false);
    try {
      const body = {
        join_title: joinTitle,
        join_body: joinBody,
        join_perks: JSON.stringify(perks),
        twitter_url: twitterUrl,
        telegram_url: telegramUrl,
      };
      const res = await fetch("/api/admin/join", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : `Save failed (${res.status})`);
      }
      setSuccess(true);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addPerk = () => {
    setPerks((p) => [...p, ""]);
  };

  const removePerk = (index: number) => {
    setPerks((p) => p.filter((_, i) => i !== index));
  };

  const updatePerk = (index: number, value: string) => {
    setPerks((p) => p.map((item, i) => (i === index ? value : item)));
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-black text-text-primary">Manage Join Section</h1>
      <p className="mt-1 max-w-2xl font-body text-sm text-text-muted">
        These settings control the Join section headline, body, and perk list. Twitter and Telegram URLs are global:
        they update every Twitter and Telegram link across the site, not only on this section.
      </p>

      {loading && (
        <div className="mt-8 rounded-xl border border-brand-green/25 bg-surface-card p-8">
          <p className="font-body text-sm text-text-secondary">Loading…</p>
        </div>
      )}

      {!loading && loadError && (
        <div className="mt-8 rounded-xl border border-brand-green/25 bg-surface-card p-8">
          <p className="font-body text-sm text-red-400">{loadError}</p>
          <button
            type="button"
            onClick={() => void loadConfig()}
            className="mt-4 rounded-lg bg-brand-green px-4 py-2 font-body text-sm font-bold text-white transition-colors hover:bg-brand-green/90"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-brand-green/25 bg-surface-card p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="join_title" className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Join title
              </label>
              <input
                id="join_title"
                type="text"
                value={joinTitle}
                onChange={(e) => setJoinTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none transition-colors focus:border-brand-green/60"
              />
            </div>

            <div>
              <label htmlFor="join_body" className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Join body
              </label>
              <textarea
                id="join_body"
                value={joinBody}
                onChange={(e) => setJoinBody(e.target.value)}
                rows={5}
                className="mt-1 w-full resize-y rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none transition-colors focus:border-brand-green/60"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-body text-xs font-bold uppercase tracking-wide text-text-muted">Perks</span>
                <button
                  type="button"
                  onClick={addPerk}
                  className="rounded-lg border border-brand-green/25 bg-surface-base px-3 py-1.5 font-body text-xs font-bold text-text-secondary transition-colors hover:border-brand-green/50 hover:text-text-primary"
                >
                  Add perk
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {perks.length === 0 && (
                  <p className="font-body text-sm text-text-secondary">No perks yet. Click &quot;Add perk&quot; to add one.</p>
                )}
                {perks.map((perk, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={perk}
                      onChange={(e) => updatePerk(index, e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none transition-colors focus:border-brand-green/60"
                    />
                    <button
                      type="button"
                      onClick={() => removePerk(index)}
                      className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="twitter_url" className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Twitter URL (global)
              </label>
              <input
                id="twitter_url"
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none transition-colors focus:border-brand-green/60"
              />
            </div>

            <div>
              <label htmlFor="telegram_url" className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
                Telegram URL (global)
              </label>
              <input
                id="telegram_url"
                type="url"
                value={telegramUrl}
                onChange={(e) => setTelegramUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none transition-colors focus:border-brand-green/60"
              />
            </div>
          </div>

          {saveError && (
            <p className="mt-6 rounded-lg bg-red-500/10 px-3 py-2 font-body text-sm text-red-400">{saveError}</p>
          )}

          {success && (
            <p className="mt-6 rounded-lg bg-brand-green/15 px-3 py-2 font-body text-sm text-brand-green">
              Saved successfully.
            </p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-green px-5 py-2.5 font-body text-sm font-bold text-white transition-colors hover:bg-brand-green/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
