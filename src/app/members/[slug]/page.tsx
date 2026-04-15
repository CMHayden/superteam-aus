import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemberBySlug, members } from "@/lib/members";

export function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-surface-base px-4 pt-24 pb-14 md:px-8 md:pt-28 md:pb-16">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/members"
          className="mb-5 inline-flex rounded-full border border-border-yellowmd bg-surface-card px-4 py-2 text-xs font-black uppercase tracking-wide text-text-secondary transition-colors hover:text-text-primary"
        >
          ← Back to members
        </Link>

        <section className="rounded-2xl border border-brand-green/40 bg-surface-card p-5 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <Image
              src={member.avatar}
              alt={member.name}
              width={120}
              height={120}
              className="size-28 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <h1 className="font-display text-4xl font-black text-text-primary">{member.name}</h1>
              <p className="mt-1 text-lg font-bold text-text-secondary">{member.title}</p>
              <p className="mt-1 text-sm text-text-muted">
                @{member.twitterHandle} • {member.location}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-base">{member.bio}</p>
              <a
                href={member.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-wide text-on-yellow transition-colors hover:bg-[#ffe45c]"
              >
                View on X
              </a>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[member.role, ...member.tags, ...member.skills].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border-yellowmd bg-brand-yellow/10 px-3 py-1 text-xs font-bold text-brand-yellow"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoCard title="Events attended" items={member.eventsAttended} />
          <InfoCard title="Hackathon wins" items={member.hackathonWins} />
          <InfoCard title="Projects launched" items={member.projectsLaunched} />
          <InfoCard title="Stuff worked on" items={member.workedOn} />
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-brand-green/35 bg-surface-card p-5">
      <h2 className="font-display text-2xl font-black text-brand-green">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
            <span className="mt-2 size-1.5 rounded-full bg-brand-yellow" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
