import { describe, it, expect } from 'vitest';
import { fetchSubstackFeed } from '../substack-proxy';

describe('fetchSubstackFeed', () => {
  it('fetches the Chart Position feed with a real User-Agent so Cloudflare does not 403 it', async () => {
    let seenUrl: string | URL | Request | undefined;
    let seenInit: RequestInit | undefined;
    const fetchImpl = async (
      url: string | URL | Request,
      init?: RequestInit,
    ) => {
      seenUrl = url;
      seenInit = init;
      return {
        status: 200,
        text: async () => '<rss>fresh feed</rss>',
      } as unknown as Response;
    };

    const result = await fetchSubstackFeed(fetchImpl as typeof fetch);

    expect(String(seenUrl)).toBe('https://chartposition.substack.com/feed');
    expect(
      (seenInit?.headers as Record<string, string>)['User-Agent'],
    ).toBeTruthy();
    expect(result).toEqual({ status: 200, body: '<rss>fresh feed</rss>' });
  });

  it('passes through a non-200 status instead of throwing, so the caller can fall back', async () => {
    const fetchImpl = async () =>
      ({
        status: 403,
        text: async () => '',
      }) as unknown as Response;

    const result = await fetchSubstackFeed(fetchImpl as typeof fetch);

    expect(result.status).toBe(403);
  });
});
