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
