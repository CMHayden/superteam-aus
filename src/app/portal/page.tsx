import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PortalDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: member } = await supabase
    .from("community_members")
    .select("name, title, role, location, avatar_url, profile_link")
    .eq("auth_user_id", user!.id)
    .single();

  return (
    <div>
      <h1 className="font-display text-3xl font-black text-text-primary">
        Welcome{member?.name ? `, ${member.name}` : ""}
      </h1>
      <p className="mt-1 font-body text-sm text-text-muted">
        Manage your Superteam Australia profile.
      </p>

      {member ? (
        <div className="mt-8 rounded-xl border border-brand-green/25 bg-surface-card p-6">
          <div className="flex items-start gap-4">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt=""
                className="size-20 rounded-xl border border-brand-green/25 object-cover"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-xl border border-dashed border-brand-green/25 bg-surface-base font-body text-xs text-text-muted">
                No image
              </div>
            )}
            <div>
              <p className="font-display text-xl font-black text-text-primary">{member.name}</p>
              <p className="mt-0.5 font-body text-sm text-text-secondary">{member.title}</p>
              <p className="mt-0.5 font-body text-xs text-text-muted">
                {member.role} · {member.location}
              </p>
              {member.profile_link && (
                <Link
                  href={`/members/${member.profile_link}`}
                  className="mt-2 inline-flex font-body text-xs font-bold text-brand-green transition-colors hover:text-brand-yellow"
                >
                  View public profile →
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-red-500/25 bg-red-500/10 px-5 py-4 font-body text-sm text-red-400">
          No member profile found linked to your account. Please contact an admin.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/portal/profile"
          className="group rounded-xl border border-brand-green/25 bg-surface-card p-5 transition-colors hover:border-brand-green/50 hover:bg-surface-hover"
        >
          <h2 className="font-display text-lg font-black text-brand-green transition-colors group-hover:text-brand-yellow">
            Edit Profile
          </h2>
          <p className="mt-1 font-body text-sm text-text-muted">
            Update your bio, skills, social links, and more.
          </p>
        </Link>
        <Link
          href="/portal/password"
          className="group rounded-xl border border-brand-green/25 bg-surface-card p-5 transition-colors hover:border-brand-green/50 hover:bg-surface-hover"
        >
          <h2 className="font-display text-lg font-black text-brand-green transition-colors group-hover:text-brand-yellow">
            Change Password
          </h2>
          <p className="mt-1 font-body text-sm text-text-muted">
            Update your login password.
          </p>
        </Link>
      </div>
    </div>
  );
}
