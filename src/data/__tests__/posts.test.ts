import { describe, it, expect } from 'vitest';
import { pickFeatured, type Post } from '../posts';

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

describe('pickFeatured', () => {
  it('returns all posts when there are fewer than count', () => {
    const posts = [
      post('a', 'medium', '2026-05-03'),
      post('b', 'substack', '2026-05-02'),
    ];
    expect(pickFeatured(posts, 3)).toHaveLength(2);
  });

  it('keeps pure recency when the top already mixes platforms', () => {
    const posts = [
      post('s1', 'substack', '2026-05-10'),
      post('m1', 'medium', '2026-05-09'),
      post('s2', 'substack', '2026-05-08'),
      post('m2', 'medium', '2026-05-07'),
    ];
    expect(pickFeatured(posts, 3).map((p) => p.title)).toEqual([
      's1',
      'm1',
      's2',
    ]);
  });

  it('forces a medium post in when the top three are all substack', () => {
    const posts = [
      post('s1', 'substack', '2026-05-28'),
      post('s2', 'substack', '2026-05-25'),
      post('s3', 'substack', '2026-05-24'),
      post('m1', 'medium', '2026-05-22'),
      post('m2', 'medium', '2026-05-20'),
    ];
    const result = pickFeatured(posts, 3);
    expect(result).toHaveLength(3);
    expect(result.some((p) => p.platform === 'medium')).toBe(true);
    expect(result.some((p) => p.platform === 'substack')).toBe(true);
    // most recent medium added, oldest substack evicted, result sorted desc
    expect(result.map((p) => p.title)).toEqual(['s1', 's2', 'm1']);
  });

  it('forces a substack post in when the top three are all medium', () => {
    const posts = [
      post('m1', 'medium', '2026-05-28'),
      post('m2', 'medium', '2026-05-25'),
      post('m3', 'medium', '2026-05-24'),
      post('s1', 'substack', '2026-05-22'),
    ];
    const result = pickFeatured(posts, 3);
    expect(result.some((p) => p.platform === 'substack')).toBe(true);
    expect(result.map((p) => p.title)).toEqual(['m1', 'm2', 's1']);
  });

  it('leaves a single-platform set unchanged (only fills what exists)', () => {
    const posts = [
      post('m1', 'medium', '2026-05-10'),
      post('m2', 'medium', '2026-05-09'),
      post('m3', 'medium', '2026-05-08'),
      post('m4', 'medium', '2026-05-07'),
    ];
    expect(pickFeatured(posts, 3).map((p) => p.title)).toEqual([
      'm1',
      'm2',
      'm3',
    ]);
  });
});
