import { describe, it, expect } from 'vitest';
import {
  stripTrackingParams,
  htmlToText,
  truncateTeaser,
  toIsoDate,
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
    expect(stripTrackingParams('https://chartposition.substack.com/p/neptune')).toBe(
      'https://chartposition.substack.com/p/neptune',
    );
  });
});

describe('htmlToText', () => {
  it('strips tags and collapses whitespace', () => {
    expect(htmlToText('<p>Hello   <strong>there</strong></p>\n<p>world</p>')).toBe(
      'Hello there world',
    );
  });

  it('decodes common entities', () => {
    expect(htmlToText('Tom &amp; Jerry &#8217;s &hellip;')).toBe("Tom & Jerry 's …");
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
});
