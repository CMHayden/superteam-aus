import { MembersDirectory } from "@/components/members/members-directory";

export default function MembersPage() {
  return (
    <main className="min-h-dvh bg-surface-base px-4 pt-24 pb-16 md:px-8 md:pt-28 md:pb-20">
      <div className="mx-auto w-full max-w-7xl">
        <p className="mb-2 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">Members</p>
        <h1 className="font-display text-4xl font-black leading-tight text-text-primary md:text-5xl">
          Meet the <span className="text-brand-green">community</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
          Browse everyone in Superteam Australia, then dive into individual profiles for projects, events, wins, and
          the work they have shipped.
        </p>

        <div className="mt-8">
          <MembersDirectory />
        </div>
      </div>
    </main>
  );
}
