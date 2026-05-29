import { describe, it, expect } from 'vitest';
import { selectByPlatform, type Post } from '../posts';

function post(
  id: string,
  platform: 'medium' | 'substack',
  pubDate: string,
): Post {
  return {
    title: id,
    description: '',
    url: `https://x/${id}`,
    pubDate,
    platform,
  };
}

const posts = [
  post('s1', 'substack', '2026-05-28'),
  post('m1', 'medium', '2026-05-22'),
  post('s2', 'substack', '2026-05-20'),
  post('m2', 'medium', '2026-05-18'),
  post('m3', 'medium', '2026-05-15'),
  post('m4', 'medium', '2026-05-10'),
];

describe('selectByPlatform', () => {
  it('returns only posts of the requested platform', () => {
    expect(
      selectByPlatform(posts, 'substack', 10).every(
        (p) => p.platform === 'substack',
      ),
    ).toBe(true);
  });

  it('caps the result at the given limit', () => {
    expect(selectByPlatform(posts, 'medium', 3)).toHaveLength(3);
  });

  it('preserves the input (newest-first) order', () => {
    expect(selectByPlatform(posts, 'medium', 3).map((p) => p.title)).toEqual([
      'm1',
      'm2',
      'm3',
    ]);
  });

  it('returns everything available when fewer than the limit exist', () => {
    expect(selectByPlatform(posts, 'substack', 5).map((p) => p.title)).toEqual([
      's1',
      's2',
    ]);
  });

  it('returns an empty array when no posts match', () => {
    expect(
      selectByPlatform([post('m1', 'medium', '2026-05-01')], 'substack', 3),
    ).toEqual([]);
  });
});
