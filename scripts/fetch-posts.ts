import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPosts, type FeedSource, type Post } from '../src/data/feed-parser';

const SOURCES: FeedSource[] = [
  { url: 'https://sarahmorrisokeefe.medium.com/feed', platform: 'medium' },
  { url: 'https://chartposition.substack.com/feed', platform: 'substack' },
];

const here = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(here, '../src/data/posts.generated.json');

function readExisting(): Post[] {
  try {
    return JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Post[];
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const existing = readExisting();
  const posts = await buildPosts(SOURCES, existing);

  if (posts.length === 0) {
    console.warn('[fetch-posts] no posts from any source; leaving file unchanged');
    return;
  }

  // Stable formatting so unchanged data produces a byte-identical file (no spurious diffs).
  writeFileSync(OUT_PATH, JSON.stringify(posts, null, 2) + '\n');
  console.log(`[fetch-posts] wrote ${posts.length} posts to posts.generated.json`);
}

main().catch((error) => {
  console.error('[fetch-posts] unexpected failure:', error);
  process.exit(1);
});
