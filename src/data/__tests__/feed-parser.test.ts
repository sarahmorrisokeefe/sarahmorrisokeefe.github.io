import { describe, it, expect } from 'vitest';
import {
  stripTrackingParams,
  htmlToText,
  truncateTeaser,
  toIsoDate,
  parseFeed,
  mergeAndSort,
  buildPosts,
  type Post,
  type FeedSource,
} from '../feed-parser';

describe('stripTrackingParams', () => {
  it('removes Medium rss source param', () => {
    expect(
      stripTrackingParams(
        'https://levelup.gitconnected.com/foo-123?source=rss-9fa5f33ee186------2',
      ),
    ).toBe('https://levelup.gitconnected.com/foo-123');
  });

  it('removes Substack r and utm_* params', () => {
    expect(
      stripTrackingParams(
        'https://open.substack.com/pub/chartposition/p/the-mercedes-garage?r=9tgt6&utm_campaign=post-expanded-share&utm_medium=post%20viewer',
      ),
    ).toBe('https://open.substack.com/pub/chartposition/p/the-mercedes-garage');
  });

  it('leaves a clean url untouched', () => {
    expect(
      stripTrackingParams('https://chartposition.substack.com/p/neptune'),
    ).toBe('https://chartposition.substack.com/p/neptune');
  });

  it('returns an empty string for an empty url rather than throwing', () => {
    expect(stripTrackingParams('')).toBe('');
  });
});

describe('htmlToText', () => {
  it('strips tags and collapses whitespace', () => {
    expect(
      htmlToText('<p>Hello   <strong>there</strong></p>\n<p>world</p>'),
    ).toBe('Hello there world');
  });

  it('decodes common entities', () => {
    expect(htmlToText('Tom &amp; Jerry &#8217;s &hellip;')).toBe(
      'Tom & Jerry ’s …',
    );
  });
});

describe('truncateTeaser', () => {
  it('leaves short text unchanged', () => {
    expect(truncateTeaser('short text')).toBe('short text');
  });

  it('truncates long text on a word boundary with an ellipsis', () => {
    const long =
      'A field report from building on React nineteen, Next dot js sixteen, and Sanity version five before the entire surrounding ecosystem had actually caught up with any of it';
    const out = truncateTeaser(long, 160);
    expect(out.length).toBeLessThanOrEqual(161); // 160 + ellipsis char
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toMatch(/\s…$/); // no dangling space before ellipsis
    expect(long.startsWith(out.slice(0, -1))).toBe(true); // prefix preserved
  });
});

describe('toIsoDate', () => {
  it('converts RFC-822 to YYYY-MM-DD', () => {
    expect(toIsoDate('Fri, 22 May 2026 15:14:50 GMT')).toBe('2026-05-22');
  });

  it('returns an empty string for an empty or invalid date rather than throwing', () => {
    expect(toIsoDate('')).toBe('');
    expect(toIsoDate('not a date')).toBe('');
  });
});

const MEDIUM_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
<channel>
<item>
<title><![CDATA[Next.js + React + Sanity: The Bugs Nobody Warned Me About]]></title>
<link>https://levelup.gitconnected.com/next-js-react-sanity-96c912cacfdb?source=rss-9fa5f33ee186------2</link>
<pubDate>Fri, 22 May 2026 15:14:50 GMT</pubDate>
<description><![CDATA[<div class="medium-feed-item"><p class="medium-feed-image"><a href="https://levelup.gitconnected.com/next-js-react-sanity-96c912cacfdb?source=rss-9fa5f33ee186------2"><img src="https://cdn-images-1.medium.com/max/2600/0.jpg" width="5081"></a></p><p class="medium-feed-snippet">A field report from building on React 19, Next.js 16, and Sanity v5 before the ecosystem caught up.</p><p class="medium-feed-link"><a href="https://levelup.gitconnected.com/next-js-react-sanity-96c912cacfdb?source=rss-9fa5f33ee186------2">Continue reading on Level Up Coding »</a></p></div>]]></description>
</item>
</channel>
</rss>`;

const SUBSTACK_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
<channel>
<item>
<title><![CDATA[Neptune Did What Neptune Does]]></title>
<link>https://chartposition.substack.com/p/neptune-did-what-neptune-does</link>
<pubDate>Mon, 25 May 2026 13:03:45 GMT</pubDate>
<description><![CDATA[ROUND 5 RECAP: CANADIAN GRAND PRIX. A short clean summary.]]></description>
<content:encoded><![CDATA[<p>The full article body that we deliberately do NOT use for Substack teasers.</p>]]></content:encoded>
</item>
<item>
<title><![CDATA[The Out Lap: May 25-31]]></title>
<link>https://chartposition.substack.com/p/the-out-lap-may-25-31</link>
<pubDate>Mon, 25 May 2026 12:02:25 GMT</pubDate>
<description><![CDATA[Mars meets Pluto at 5 degrees Taurus.]]></description>
</item>
</channel>
</rss>`;

describe('parseFeed', () => {
  it('parses a Medium item, building the teaser from the description snippet', () => {
    const posts = parseFeed(MEDIUM_RSS, 'medium');
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      title: 'Next.js + React + Sanity: The Bugs Nobody Warned Me About',
      url: 'https://levelup.gitconnected.com/next-js-react-sanity-96c912cacfdb',
      pubDate: '2026-05-22',
      platform: 'medium',
      description:
        'A field report from building on React 19, Next.js 16, and Sanity v5 before the ecosystem caught up.',
    });
    expect(posts[0].description).not.toContain('Continue reading');
    expect(posts[0].description).not.toContain('<');
  });

  it('parses Substack items, building the teaser from description', () => {
    const posts = parseFeed(SUBSTACK_RSS, 'substack');
    expect(posts).toHaveLength(2);
    expect(posts[0]).toMatchObject({
      title: 'Neptune Did What Neptune Does',
      url: 'https://chartposition.substack.com/p/neptune-did-what-neptune-does',
      pubDate: '2026-05-25',
      platform: 'substack',
      description: 'ROUND 5 RECAP: CANADIAN GRAND PRIX. A short clean summary.',
    });
    expect(posts[1].title).toBe('The Out Lap: May 25-31');
  });

  it('handles a single-item feed (object, not array)', () => {
    const single = MEDIUM_RSS; // one <item>
    expect(parseFeed(single, 'medium')).toHaveLength(1);
  });

  it('skips items missing a link or pubDate instead of crashing the whole feed', () => {
    const withMalformed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
<channel>
<item>
<title><![CDATA[Good Post]]></title>
<link>https://chartposition.substack.com/p/good</link>
<pubDate>Mon, 25 May 2026 12:02:25 GMT</pubDate>
<description><![CDATA[fine]]></description>
</item>
<item>
<title><![CDATA[Missing link and date]]></title>
<description><![CDATA[no link, no date]]></description>
</item>
</channel>
</rss>`;
    const posts = parseFeed(withMalformed, 'substack');
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Good Post');
  });
});

const SOURCES: FeedSource[] = [
  { url: 'https://medium.test/feed', platform: 'medium' },
  { url: 'https://substack.test/feed', platform: 'substack' },
];

const EXISTING: Post[] = [
  {
    title: 'Old Medium',
    description: 'old',
    url: 'https://m/old',
    pubDate: '2026-01-01',
    platform: 'medium',
  },
  {
    title: 'Old Substack',
    description: 'old',
    url: 'https://s/old',
    pubDate: '2026-01-02',
    platform: 'substack',
  },
];

function ok(xml: string): Response {
  return {
    ok: true,
    status: 200,
    text: async () => xml,
  } as unknown as Response;
}
function fail(): Response {
  return {
    ok: false,
    status: 503,
    text: async () => '',
  } as unknown as Response;
}

describe('mergeAndSort', () => {
  it('orders posts across platforms by pubDate descending', () => {
    const a: Post[] = [
      {
        title: 'A',
        description: '',
        url: 'a',
        pubDate: '2026-05-01',
        platform: 'medium',
      },
    ];
    const b: Post[] = [
      {
        title: 'B',
        description: '',
        url: 'b',
        pubDate: '2026-05-10',
        platform: 'substack',
      },
    ];
    expect(mergeAndSort(a, b).map((p) => p.title)).toEqual(['B', 'A']);
  });
});

describe('buildPosts', () => {
  it('merges fresh results from both feeds when both succeed', async () => {
    const fetchImpl = async (url: string | URL | Request) =>
      String(url).includes('medium') ? ok(MEDIUM_RSS) : ok(SUBSTACK_RSS);
    const posts = await buildPosts(
      SOURCES,
      EXISTING,
      fetchImpl as typeof fetch,
    );
    expect(posts.some((p) => p.platform === 'medium')).toBe(true);
    expect(posts.some((p) => p.platform === 'substack')).toBe(true);
    // none of the EXISTING fallback posts should appear
    expect(posts.find((p) => p.url === 'https://m/old')).toBeUndefined();
    // sorted descending
    const dates = posts.map((p) => p.pubDate);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it('falls back to the existing slice for a feed that fails', async () => {
    const fetchImpl = async (url: string | URL | Request) =>
      String(url).includes('medium') ? fail() : ok(SUBSTACK_RSS);
    const posts = await buildPosts(
      SOURCES,
      EXISTING,
      fetchImpl as typeof fetch,
    );
    // medium falls back to existing
    expect(posts.find((p) => p.url === 'https://m/old')).toBeDefined();
    // substack is fresh (from SUBSTACK_RSS), not the existing old one
    expect(posts.find((p) => p.url === 'https://s/old')).toBeUndefined();
    expect(posts.some((p) => p.platform === 'substack')).toBe(true);
  });

  it('returns the existing set unchanged when both feeds fail', async () => {
    const fetchImpl = async () => fail();
    const posts = await buildPosts(
      SOURCES,
      EXISTING,
      fetchImpl as typeof fetch,
    );
    expect(posts.map((p) => p.url).sort()).toEqual([
      'https://m/old',
      'https://s/old',
    ]);
  });
});
