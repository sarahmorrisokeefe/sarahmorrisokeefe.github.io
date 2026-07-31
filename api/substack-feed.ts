import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchSubstackFeed } from '../src/data/substack-proxy';

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  const { status, body } = await fetchSubstackFeed();
  res
    .status(status)
    .setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
    .send(body);
}
