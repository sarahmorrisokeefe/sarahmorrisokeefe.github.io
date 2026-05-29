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
 * The most recent `limit` posts from a single platform, preserving the
 * newest-first order of the input.
 */
export function selectByPlatform(
  posts: Post[],
  platform: Post['platform'],
  limit: number,
): Post[] {
  return posts.filter((post) => post.platform === platform).slice(0, limit);
}
