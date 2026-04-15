import { Hero } from "@/components/hero/hero";
import { EventsSection } from "@/components/home/events-section";
import { FaqSection } from "@/components/home/faq-section";
import { FooterSection } from "@/components/home/footer-section";
import { FloatingNavbar } from "@/components/home/floating-navbar";
import { CommunitySection } from "@/components/home/community-section";
import { PartnersSection } from "@/components/home/partners-section";
import { PostHeroWithBeams } from "@/components/home/post-hero-with-beams";
import { StatsStrip } from "@/components/home/stats-strip";
import { WhatWeDoSection } from "@/components/home/what-we-do-section";

export default function Home() {
  return (
    <main className="bg-surface-base">
      <FloatingNavbar />
      <section id="hero" className="min-h-dvh">
        <Hero />
      </section>

      <PostHeroWithBeams>
        <div className="mx-4 w-auto overflow-hidden rounded-2xl border border-brand-green/45 bg-surface-card md:mx-auto md:w-full md:max-w-7xl">
          <StatsStrip />
          <PartnersSection />
        </div>
        <WhatWeDoSection />
        <CommunitySection />
        <EventsSection />
        <FaqSection />
      </PostHeroWithBeams>
      <FooterSection />
    </main>
  );
}
