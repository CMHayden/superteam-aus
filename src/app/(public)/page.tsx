import { Hero } from "@/components/hero/hero";
import { EventsSection } from "@/components/home/events-section";
import { FaqSection } from "@/components/home/faq-section";
import { CommunitySection } from "@/components/home/community-section";
import { PartnersSection } from "@/components/home/partners-section";
import { PostHeroWithBeams } from "@/components/home/post-hero-with-beams";
import { StatsStrip } from "@/components/home/stats-strip";
import { WhatWeDoSection } from "@/components/home/what-we-do-section";
import {
  getStats,
  getPartners,
  getWhatWeDoCards,
  getTestimonials,
  getTweets,
  getCarouselImages,
  getVisibleCommunityMembers,
  getFaqs,
  getSocialLinks,
  getSiteConfig,
} from "@/lib/cms";

export const revalidate = 60;

export default async function Home() {
  const [
    stats,
    partners,
    whatWeDoCards,
    testimonials,
    tweets,
    carouselImages,
    communityMembers,
    faqs,
    socialLinks,
    siteConfig,
  ] = await Promise.all([
    getStats(),
    getPartners(),
    getWhatWeDoCards(),
    getTestimonials(),
    getTweets(),
    getCarouselImages(),
    getVisibleCommunityMembers(),
    getFaqs(),
    getSocialLinks(),
    getSiteConfig(
      "footer_description",
      "join_title",
      "join_body",
      "join_perks",
      "twitter_url",
      "telegram_url",
      "stats_headline",
      "stats_subtext",
    ),
  ]);

  return (
    <main className="bg-surface-base">
      <section id="hero" className="min-h-dvh">
        <Hero />
      </section>

      <PostHeroWithBeams>
        <div className="mx-4 w-auto overflow-hidden rounded-2xl border border-brand-green/45 bg-surface-card md:mx-auto md:w-full md:max-w-7xl">
          <StatsStrip
            stats={stats}
            headline={siteConfig.stats_headline}
            subtext={siteConfig.stats_subtext}
          />
          <PartnersSection partners={partners} />
        </div>
        <WhatWeDoSection cards={whatWeDoCards} />
        <CommunitySection
          testimonials={testimonials}
          tweets={tweets}
          carouselImages={carouselImages}
          communityMembers={communityMembers}
          joinConfig={{
            title: siteConfig.join_title,
            body: siteConfig.join_body,
            perks: siteConfig.join_perks
              ? JSON.parse(siteConfig.join_perks)
              : [],
            twitterUrl: siteConfig.twitter_url,
            telegramUrl: siteConfig.telegram_url,
          }}
        />
        <EventsSection />
        <FaqSection faqs={faqs} />
      </PostHeroWithBeams>
    </main>
  );
}
