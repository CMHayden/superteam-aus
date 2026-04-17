"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setNewPassword("");
      setConfirm("");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md">
      <h1 className="font-display text-3xl font-black text-text-primary">Change Password</h1>
      <p className="mt-1 font-body text-sm text-text-muted">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-brand-green/60"
          />
        </div>
        <div>
          <label className="block font-body text-xs font-bold uppercase tracking-wide text-text-muted">
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-brand-green/25 bg-surface-base px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-brand-green/60"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 font-body text-sm text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg bg-brand-green/10 px-3 py-2 font-body text-sm text-brand-green">
            Password updated successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-green px-4 py-2.5 font-body text-sm font-bold text-white transition-colors hover:bg-brand-green/90 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
