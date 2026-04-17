"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/portal");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-green/30 bg-surface-card p-8">
        <h1 className="font-display text-2xl font-black text-brand-green">Member Login</h1>
        <p className="mt-1 font-body text-sm text-text-muted">
          Sign in to manage your community profile.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none transition-colors focus:border-brand-green/60"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none transition-colors focus:border-brand-green/60"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 font-body text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-green px-4 py-2.5 font-body text-sm font-bold text-white transition-colors hover:bg-brand-green/90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
