import { XMLParser } from 'fast-xml-parser';

export interface Post {
  title: string;
  description: string;
  url: string;
  pubDate: string; // ISO date, e.g. "2026-05-22"
  platform: 'medium' | 'substack';
}

const TEASER_MAX = 160;

export function stripTrackingParams(url: string): string {
  if (!url) return '';
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  for (const key of [...u.searchParams.keys()]) {
    if (key === 'source' || key === 'r' || key.startsWith('utm_')) {
      u.searchParams.delete(key);
    }
  }
  const qs = u.searchParams.toString();
  u.search = qs ? `?${qs}` : '';
  return u.toString();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

export function htmlToText(html: string): string {
  const noTags = html.replace(/<[^>]+>/g, ' ');
  return decodeEntities(noTags).replace(/\s+/g, ' ').trim();
}

export function truncateTeaser(text: string, max = TEASER_MAX): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[\s.,;:!?–—-]+$/, '') + '…';
}

export function toIsoDate(rfc822: string): string {
  const date = new Date(rfc822);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

interface RawItem {
  title?: unknown;
  link?: unknown;
  pubDate?: unknown;
  description?: unknown;
  'content:encoded'?: unknown;
}

function asText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'object' && '#text' in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)['#text'] ?? '');
  }
  return String(value);
}

const parser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  processEntities: true,
});

export function parseFeed(xml: string, platform: 'medium' | 'substack'): Post[] {
  const doc = parser.parse(xml) as {
    rss?: { channel?: { item?: RawItem | RawItem[] } };
  };
  const rawItems = doc?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items
    .map((item): Post => {
      const sourceHtml =
        platform === 'substack'
          ? asText(item.description)
          : asText(item['content:encoded']);
      return {
        title: htmlToText(asText(item.title)),
        description: truncateTeaser(htmlToText(sourceHtml)),
        url: stripTrackingParams(asText(item.link)),
        pubDate: toIsoDate(asText(item.pubDate)),
        platform,
      };
    })
    .filter((post) => post.url !== '' && post.pubDate !== '');
}
