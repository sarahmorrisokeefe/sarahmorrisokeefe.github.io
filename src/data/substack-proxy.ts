const SUBSTACK_FEED_URL = 'https://chartposition.substack.com/feed';

// Substack sits behind Cloudflare, which returns a flat 403 to every request
// from GitHub Actions' shared runner IPs regardless of headers sent. This
// module runs as a Vercel serverless function (api/substack-feed.ts) instead,
// so the fetch happens from a non-blocked IP; scripts/fetch-posts.ts then
// reads the feed from that endpoint rather than hitting Substack directly.
const FEED_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (compatible; okeefesarah-feed-fetcher/1.0; +https://www.okeefesarah.com)',
  Accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
};

export interface ProxiedFeed {
  status: number;
  body: string;
}

export async function fetchSubstackFeed(
  fetchImpl: typeof fetch = fetch,
): Promise<ProxiedFeed> {
  const res = await fetchImpl(SUBSTACK_FEED_URL, { headers: FEED_HEADERS });
  return { status: res.status, body: await res.text() };
}
