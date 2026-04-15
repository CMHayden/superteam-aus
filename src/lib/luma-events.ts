export type LumaEvent = {
  title: string;
  location: string;
  dateLabel: string;
  timeLabel: string;
  url?: string;
  /** Cover image when provided by Luma (JSON-LD or inline in event block). */
  imageUrl?: string;
  /** ISO 8601 start time when known. */
  startDateIso?: string;
};

const LUMA_CALENDAR_URL = "https://luma.com/SuperteamAU";
const LUMA_BASE_URL = "https://luma.com";

function toAbsoluteLumaUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${LUMA_BASE_URL}${value}`;
  }

  return `${LUMA_BASE_URL}/${value}`;
}

function cleanTitle(raw: string) {
  return raw
    .replace(/\s+\|\s+Superteam Australia:.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date TBA";
  }

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatTimeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Time TBA";
  }

  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function extractDateLabel(lines: string[], block: string) {
  const dateCandidate =
    block.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/)?.[0] ??
    lines.find((line) =>
      /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b.*\b\d{1,2}\b.*\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(
        line,
      ),
    ) ??
    lines.find((line) =>
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i.test(
        line,
      ),
    );

  if (!dateCandidate) {
    return {
      dateLabel: "Date TBA",
      timeLabel: "Time TBA",
      startDateIso: undefined as string | undefined,
    };
  }

  const normalized = dateCandidate.replace(/^[A-Za-z]{3},\s*/i, "");
  const isoMatch = block.match(
    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)/,
  )?.[1];
  return {
    dateLabel: formatDateLabel(normalized),
    timeLabel: formatTimeLabel(normalized),
    startDateIso: isoMatch,
  };
}

/** Normalize JSON-LD `image` (string | object | array) to a single HTTPS URL. */
function pickImageUrl(raw: unknown): string | undefined {
  if (raw == null) {
    return undefined;
  }
  if (typeof raw === "string") {
    return toAbsoluteLumaUrl(raw);
  }
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const url = pickImageUrl(item);
      if (url) {
        return url;
      }
    }
    return undefined;
  }
  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (typeof o.url === "string") {
      return toAbsoluteLumaUrl(o.url);
    }
    if (typeof o.contentUrl === "string") {
      return toAbsoluteLumaUrl(o.contentUrl);
    }
  }
  return undefined;
}

function parseJsonLdEvents(source: string): LumaEvent[] {
  const scripts = [
    ...source.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ]
    .map((match) => match[1])
    .filter(Boolean);

  for (const script of scripts) {
    try {
      const payload = JSON.parse(script) as {
        events?: Array<{
          name?: string;
          startDate?: string;
          location?: { name?: string } | string;
          image?: unknown;
          offers?: Array<{ url?: string }>;
          "@id"?: string;
        }>;
      };

      if (!Array.isArray(payload.events) || payload.events.length === 0) {
        continue;
      }

      return payload.events
        .filter((event) => typeof event.name === "string" && event.name.length > 0)
        .map((event) => {
          const loc =
            typeof event.location === "string"
              ? event.location.trim()
              : event.location?.name?.trim();
          return {
            title: cleanTitle(event.name as string),
            location: loc || "Australia",
            dateLabel: event.startDate ? formatDateLabel(event.startDate) : "Date TBA",
            timeLabel: event.startDate ? formatTimeLabel(event.startDate) : "Time TBA",
            url: toAbsoluteLumaUrl(event.offers?.[0]?.url || event["@id"]),
            imageUrl: pickImageUrl(event.image),
            startDateIso: event.startDate,
          };
        });
    } catch {
      continue;
    }
  }

  return [];
}

function extractAnchorEventLinks(source: string) {
  const links = new Map<string, string>();

  const matches = source.matchAll(
    /<a[^>]*class="[^"]*\bevent-link\b[^"]*"[^>]*aria-label="([^"]+)"[^>]*href="([^"]+)"/g,
  );

  for (const match of matches) {
    const rawLabel = match[1]?.trim();
    const rawHref = match[2]?.trim();
    if (!rawLabel || !rawHref) {
      continue;
    }

    links.set(cleanTitle(rawLabel), toAbsoluteLumaUrl(rawHref) as string);
  }

  return links;
}

/** First image URL in a markdown/HTML block (markdown image or <img src>). */
function extractImageFromBlock(block: string): string | undefined {
  const md = block.match(/!\[[^\]]*]\((https?:\/\/[^)\s]+)\)/i)?.[1];
  if (md) {
    return md;
  }
  const img = block.match(
    /<img[^>]+src=["'](https?:\/\/[^"']+)["']/i,
  )?.[1];
  if (img) {
    return img;
  }
  return undefined;
}

function parseMarkdownLikeBlocks(source: string): LumaEvent[] {
  const parts = source.split(/\n###\s+/).slice(1);
  const events: LumaEvent[] = [];

  for (const part of parts) {
    const lines = part
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line !== "By Superteam Australia");

    if (lines.length === 0) {
      continue;
    }

    const title = cleanTitle(lines[0]);
    if (!title) {
      continue;
    }

    const location =
      lines.find((line) =>
        /(Australia Wide|Google Meet|Sydney|Melbourne|Brisbane|Perth|New South Wales|Victoria|Queensland|Western Australia)/i.test(
          line,
        ),
      ) ?? "Australia";

    const { dateLabel, timeLabel, startDateIso } = extractDateLabel(lines, part);
    const imageUrl = extractImageFromBlock(part);
    events.push({ title, location, dateLabel, timeLabel, startDateIso, imageUrl });
  }

  return events;
}

function normalizeDedupePart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Normalize URL so equivalent Luma links dedupe (trailing slash, hash, casing). */
function normalizeEventUrl(url: string): string {
  const trimmed = url.trim();
  try {
    const u = new URL(trimmed);
    u.hash = "";
    let out = u.href.toLowerCase();
    if (u.pathname.length > 1 && out.endsWith("/")) {
      out = out.slice(0, -1);
    }
    return out;
  } catch {
    return trimmed.toLowerCase();
  }
}

/**
 * Stable React key. Prefer normalized URL; otherwise title + location + date (no time).
 */
export function lumaEventDedupeKey(event: LumaEvent): string {
  if (event.url?.trim()) {
    return normalizeEventUrl(event.url);
  }
  const datePart =
    event.startDateIso && event.startDateIso.length >= 10
      ? event.startDateIso.slice(0, 10)
      : normalizeDedupePart(event.dateLabel);
  return `nourl:${normalizeDedupePart(event.title)}|${normalizeDedupePart(event.location)}|${datePart}`;
}

function dedupeEvents(events: LumaEvent[]): LumaEvent[] {
  const seenUrls = new Set<string>();
  const seenNoUrl = new Set<string>();
  const out: LumaEvent[] = [];

  for (const event of events) {
    const rawUrl = event.url?.trim();
    if (rawUrl) {
      const key = normalizeEventUrl(rawUrl);
      if (seenUrls.has(key)) {
        continue;
      }
      seenUrls.add(key);
      out.push(event);
      continue;
    }

    const fallback = lumaEventDedupeKey(event);
    if (seenNoUrl.has(fallback)) {
      continue;
    }
    seenNoUrl.add(fallback);
    out.push(event);
  }

  return out;
}

export async function getLumaEvents(limit = 6): Promise<LumaEvent[]> {
  try {
    const response = await fetch(LUMA_CALENDAR_URL, {
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const anchorLinks = extractAnchorEventLinks(text);
    const jsonLdEvents = parseJsonLdEvents(text).map((event) => ({
      ...event,
      url: event.url || anchorLinks.get(event.title),
    }));
    const parsedEvents =
      jsonLdEvents.length > 0 ? jsonLdEvents : parseMarkdownLikeBlocks(text);
    const events = dedupeEvents(
      parsedEvents.map((event) => ({
        ...event,
        url: event.url || anchorLinks.get(event.title),
      })),
    );
    return events.slice(0, limit);
  } catch {
    return [];
  }
}

export { LUMA_CALENDAR_URL };
