export interface Post {
  title: string;
  description: string;
  url: string;
  pubDate: string; // ISO date, e.g. "2026-05-22"
  platform: 'medium' | 'substack';
}

const TEASER_MAX = 160;

export function stripTrackingParams(url: string): string {
  const u = new URL(url);
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
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&(?:rsquo|lsquo);/g, "'")
    .replace(/&(?:ldquo|rdquo);/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      const cp = parseInt(h, 16);
      if (cp === 0x2018 || cp === 0x2019) return "'";
      if (cp === 0x201c || cp === 0x201d) return '"';
      return String.fromCodePoint(cp);
    })
    .replace(/&#(\d+);/g, (_, n) => {
      const cp = Number(n);
      if (cp === 8216 || cp === 8217) return "'";
      if (cp === 8220 || cp === 8221) return '"';
      return String.fromCodePoint(cp);
    });
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
  return new Date(rfc822).toISOString().slice(0, 10);
}
