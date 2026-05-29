import type { Post } from './feed-parser';
import generated from './posts.generated.json';

export type { Post };

/**
 * Manual control over the auto-generated feed data. Edited by hand; never
 * touched by the refresh script.
 * - `hidden`: canonical URLs to suppress from the site.
 * - `byUrl`: per-URL overrides for an auto-extracted title/description.
 */
const overrides: {
  hidden: string[];
  byUrl: Record<string, { title?: string; description?: string }>;
} = {
  hidden: [],
  byUrl: {},
};

export function getPosts(): Post[] {
  return (generated as Post[])
    .filter((post) => !overrides.hidden.includes(post.url))
    .map((post) => ({ ...post, ...overrides.byUrl[post.url] }));
}

/**
 * Select `count` teasers favouring recency, but guarantee every platform that
 * exists in the data is represented (so the dev/writing mix never collapses to
 * a single platform). Assumes `posts` is already sorted newest-first.
 */
export function pickFeatured(posts: Post[], count: number): Post[] {
  if (posts.length <= count) return posts;
  const result = posts.slice(0, count);
  for (const platform of new Set(posts.map((p) => p.platform))) {
    if (result.some((p) => p.platform === platform)) continue;
    const candidate = posts.find((p) => p.platform === platform);
    if (!candidate) continue;
    // Evict the lowest-priority item whose platform is over-represented.
    for (let i = result.length - 1; i >= 0; i--) {
      const overrepresented =
        result.filter((p) => p.platform === result[i].platform).length > 1;
      if (overrepresented) {
        result[i] = candidate;
        break;
      }
    }
  }
  return [...result].sort((a, b) =>
    a.pubDate < b.pubDate ? 1 : a.pubDate > b.pubDate ? -1 : 0,
  );
}

export function getFeaturedPosts(count = 3): Post[] {
  return pickFeatured(getPosts(), count);
}
