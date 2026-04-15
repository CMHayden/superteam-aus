"use client";

import { Tweet, TweetSkeleton } from "react-tweet";
import "react-tweet/theme.css";

/** Status IDs from curated X links (Superteam AU + community). */
const TWEET_IDS = [
  "2039270701329506500",
  "2043664233997779400",
  "2043671462163427618",
  "2043466440528064985",
  "2043221189133488426",
  "2042682763028107479",
  "2042740500890030355",
  "2042415352509002237",
] as const;

function TweetEmbedCard({ id }: { id: string }) {
  return (
    <div className="community-tweet-card shrink-0 overflow-hidden rounded-xl border border-border-yellowmd bg-surface-base/90 transition-colors hover:border-border-yellowhi">
      <Tweet
        id={id}
        apiUrl={`/api/tweet/${id}`}
        fallback={<TweetSkeleton />}
      />
    </div>
  );
}

export function CommunityTweetsFeed() {
  return (
    <div className="community-tweets-feed flex h-full min-h-0 flex-col">
      <p className="shrink-0 font-body text-sm font-bold uppercase tracking-wide text-brand-yellow">
        Tweets
      </p>
      <div className="community-tweets-scroll-area relative mt-3 min-h-0 flex-1 basis-0 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-linear-to-b from-surface-card to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-linear-to-t from-surface-card to-transparent"
          aria-hidden
        />
        <div className="community-tweets-ticker flex w-full flex-col gap-3">
          <div className="flex flex-col gap-3">
            {TWEET_IDS.map((id) => (
              <TweetEmbedCard key={id} id={id} />
            ))}
          </div>
          <div className="flex flex-col gap-3" aria-hidden>
            {TWEET_IDS.map((id) => (
              <TweetEmbedCard key={`${id}-dup`} id={id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
