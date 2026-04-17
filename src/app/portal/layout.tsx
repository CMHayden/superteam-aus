import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <header className="border-b border-brand-green/25 bg-surface-nav">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/portal" className="font-display text-lg font-black text-brand-green">
            Member Portal
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/members"
              className="font-body text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
            >
              Back to profiles
            </Link>
            <Link
              href="/portal/profile"
              className="font-body text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
            >
              Edit Profile
            </Link>
            <Link
              href="/portal/password"
              className="font-body text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
            >
              Password
            </Link>
            <form action="/portal/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
