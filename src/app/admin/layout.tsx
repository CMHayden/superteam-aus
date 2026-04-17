import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UnreadBadge } from "./unread-badge";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Stats", href: "/admin/stats" },
  { label: "Partners", href: "/admin/partners" },
  { label: "What We Do", href: "/admin/what-we-do" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Tweets", href: "/admin/tweets" },
  { label: "Join Section", href: "/admin/join" },
  { label: "Join Form", href: "/admin/join-form" },
  { label: "Carousel", href: "/admin/carousel" },
  { label: "Community", href: "/admin/community-members" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Footer", href: "/admin/footer" },
  { label: "Insights", href: "/admin/insights" },
];

export default async function AdminLayout({
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
    <div className="flex min-h-screen bg-surface-base">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-brand-green/25 bg-surface-nav">
        <div className="border-b border-brand-green/25 px-4 py-4">
          <Link href="/admin" className="font-display text-lg font-black text-brand-green">
            CMS Admin
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 font-body text-sm font-bold text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/submissions"
            className="flex items-center justify-between rounded-lg px-3 py-2 font-body text-sm font-bold text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <span>Submissions</span>
            <UnreadBadge />
          </Link>
        </nav>
        <div className="border-t border-brand-green/25 px-4 py-3">
          <p className="truncate font-body text-xs text-text-muted">{user.email}</p>
          <form action="/admin/auth/signout" method="post">
            <button
              type="submit"
              className="mt-2 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-body text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="ml-56 flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
