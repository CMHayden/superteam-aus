"use client";

import { Tweet, TweetSkeleton } from "react-tweet";
import "react-tweet/theme.css";

type TweetData = {
  id: string;
  tweet_id: string;
};

function TweetEmbedCard({ tweetId }: { tweetId: string }) {
  return (
    <div className="community-tweet-card shrink-0 overflow-hidden rounded-xl border border-border-yellowmd bg-surface-base/90 transition-colors hover:border-border-yellowhi">
      <Tweet
        id={tweetId}
        apiUrl={`/api/tweet/${tweetId}`}
        fallback={<TweetSkeleton />}
      />
    </div>
  );
}

export function CommunityTweetsFeed({ tweets }: { tweets: TweetData[] }) {
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
            {tweets.map((t) => (
              <TweetEmbedCard key={t.id} tweetId={t.tweet_id} />
            ))}
          </div>
          <div className="flex flex-col gap-3" aria-hidden>
            {tweets.map((t) => (
              <TweetEmbedCard key={`${t.id}-dup`} tweetId={t.tweet_id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
