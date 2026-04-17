import Link from "next/link";
import { SectionReveal } from "@/components/home/section-reveal";
import { MembersDirectory } from "@/components/members/members-directory";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { getActiveCommunityMembers } from "@/lib/cms";
import { createClient } from "@/lib/supabase/server";

export default async function MembersPage() {
  const supabase = await createClient();
  const [{ data: auth }, members] = await Promise.all([
    supabase.auth.getUser(),
    getActiveCommunityMembers(),
  ]);
  const user = auth.user;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-surface-base px-4 pt-24 pb-16 md:px-8 md:pt-28 md:pb-20">
      <BackgroundBeams colorScheme="green" contrast="high" className="opacity-55" />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <SectionReveal>
          <div>
            <p className="mb-2 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">Members</p>
            <h1 className="font-display text-4xl font-black leading-tight text-text-primary md:text-5xl">
              <span className="text-brand-green">Meet the</span><span className="text-brand-yellow"> community</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
              Browse everyone in Superteam Australia, then dive into individual profiles for projects, events, wins, and
              the work they have shipped.
            </p>
            <div className="mt-5">
              <Link
                href={user ? "/portal/profile" : "/portal/login"}
                className="inline-flex items-center rounded-full border border-brand-green/45 bg-brand-green/12 px-5 py-2 text-xs font-black uppercase tracking-wide text-brand-green transition-colors hover:border-brand-green/65 hover:bg-brand-green/20"
              >
                {user ? "Edit your profile" : "Member login"}
              </Link>
            </div>
          </div>
        </SectionReveal>

        <div className="mt-8">
          <SectionReveal delay={0.06}>
            <MembersDirectory members={members} />
          </SectionReveal>
        </div>
      </div>
    </main>
  );
}
