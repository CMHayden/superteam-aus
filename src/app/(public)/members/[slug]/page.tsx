import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberProfileInfoCard } from "@/components/members/member-profile-info-card";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { getCommunityMemberBySlug } from "@/lib/cms";
import { getMemberSocialLinks } from "@/lib/member-profile-social-links";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getCommunityMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const socialLinks = getMemberSocialLinks(member);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-surface-base px-4 pt-24 pb-14 md:px-8 md:pt-28 md:pb-16">
      <BackgroundBeams colorScheme="green" contrast="high" className="opacity-55" />
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <Link
          href="/members"
          className="mb-5 inline-flex rounded-full border border-border-yellowmd bg-surface-card px-4 py-2 text-xs font-black uppercase tracking-wide text-text-secondary transition-colors hover:text-text-primary"
        >
          ← Back to members
        </Link>

        <section className="rounded-2xl border border-brand-green/40 bg-surface-card p-5 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex flex-col items-center gap-2">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="size-28 rounded-xl object-cover"
                />
              ) : (
                <div className="flex size-28 items-center justify-center rounded-xl border border-dashed border-brand-green/25 bg-surface-base font-body text-sm text-text-muted">
                  —
                </div>
              )}
              {member.role && (
                <span className="rounded-full border border-brand-green/40 bg-brand-green/10 px-3 py-1 text-xs font-bold text-brand-green">
                  {member.role}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-4xl font-black text-text-primary">{member.name}</h1>
              <p className="mt-1 text-lg font-bold text-text-secondary">{member.title}</p>
              <p className="mt-1 text-sm text-text-muted">
                {member.location}
                {member.experience ? ` · ${member.experience}` : ""}
              </p>
              {member.bio && (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-base">{member.bio}</p>
              )}
              {socialLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-wide text-on-yellow transition-colors hover:bg-[#ffe45c]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(member.skills ?? []).map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-border-yellowmd bg-brand-yellow/10 px-3 py-1 text-xs font-bold text-brand-yellow"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {((member.contributions ?? []).length > 0 || (member.looking_for ?? []).length > 0) && (
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {(member.contributions ?? []).length > 0 && (
              <MemberProfileInfoCard title="Contributions" items={member.contributions} />
            )}
            {(member.looking_for ?? []).length > 0 && (
              <MemberProfileInfoCard title="Looking for" items={member.looking_for} />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
