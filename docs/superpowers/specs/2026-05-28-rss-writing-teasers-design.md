# Auto-Populated Writing Teasers from RSS — Design

**Date:** 2026-05-28
**Status:** Draft, pending user review

## Motivation

The Writing section's teaser cards are hand-maintained in `src/data/posts.ts`. Every time Sarah publishes on Medium or Substack, she has to manually add an entry — title, URL, date, a hand-written description. This is recurring toil and the list drifts out of date. The goal is to auto-populate the teasers from Sarah's RSS feeds at no ongoing manual cost, while keeping the site's build robust and giving Sarah a manual escape hatch when she wants one.

## Goals

- New Medium and Substack posts appear in the Writing section automatically, with no hand-editing.
- The site build is **pure-static and never fetches at build time** — a feed outage can never break a Vercel deploy.
- The committed post data is always reasonably fresh (refreshed daily) and doubles as the fallback, so nothing rots.
- Teaser descriptions are clean plain text, never raw third-party HTML.
- Sarah retains manual control: she can hide a post or override its title/description without the next refresh clobbering her change.

## Non-goals

- Rendering full article bodies on-site (a separate idea Sarah is mulling — explicitly out of scope here).
- Fetching from any platform beyond Medium and Substack.
- Author-filtering the Substack feed — the `chartposition` Substack is single-author (Sarah), confirmed.
- Pagination or an on-site archive — the Writing section still shows the top 3 by date; "All posts" links out.
- Changing PostCard's link behavior — it already opens links in a new tab (`target="_blank" rel="noopener noreferrer"`).

## Architecture

The core decision: **git is the source of truth.** A scheduled GitHub Action fetches the feeds, regenerates a committed JSON data file, and commits it back. Vercel deploys off that push via its normal GitHub integration. The Astro build itself does zero network I/O.

This collapses "freshness" and "fallback" into a single artifact — the committed JSON is simultaneously the live data and the last-known-good snapshot, so it can never go stale relative to itself.

### Components

1. **`scripts/fetch-posts.mjs`** — a Node script (run by the Action and via `npm run posts:refresh`):
   - Fetches both feeds in parallel:
     - Medium: `https://sarahmorrisokeefe.medium.com/feed`
     - Substack: `https://chartposition.substack.com/feed`
   - Parses each with `fast-xml-parser`.
   - Normalizes each `<item>` into the `Post` shape (see Data model).
   - **Per-feed fallback:** if a feed fetch/parse fails, retain that platform's slice from the existing committed JSON rather than dropping it. If *both* fail, the script makes no changes and exits 0 (the Action then commits nothing).
   - Merges both platforms, sorts by ISO `pubDate` descending.
   - Writes `src/data/posts.generated.json` with **stable key ordering** and ISO-normalized dates so re-runs produce byte-identical output when nothing changed (no spurious daily diffs).

2. **`.github/workflows/refresh-posts.yml`** — GitHub Action:
   - Triggers: daily `schedule` cron + `workflow_dispatch` (manual) + on `push` to `master` (so a refresh runs alongside normal deploys).
   - Steps: checkout → `npm ci` → `node scripts/fetch-posts.mjs` → `git diff --quiet src/data/posts.generated.json || (commit && push)`.
   - Permissions: `contents: write`.
   - The commit author is the github-actions bot. The resulting push triggers Vercel's standard GitHub-integration deploy. It does **not** re-trigger this workflow — pushes made with the default `GITHUB_TOKEN` do not fire new Action runs — so there is no refresh loop.

3. **`src/data/posts.ts`** — keeps the `Post` interface and the manual overrides; becomes the read accessor instead of the data store:
   - Imports `posts.generated.json`.
   - Applies `overrides` (see Data model): hide-by-URL, plus optional per-URL `title`/`description` override.
   - Filters out `draft`/hidden entries.
   - Exports `getPosts(): Post[]` (synchronous — it's just reading imported JSON + applying overrides).

4. **`src/components/sections/Writing.astro`** — imports `getPosts()` instead of the raw `posts` array; otherwise unchanged (still `.slice(0, 3)`).

5. **`package.json`** — add `fast-xml-parser` dependency and a `"posts:refresh": "node scripts/fetch-posts.mjs"` script.

### Data model

```ts
interface Post {
  title: string;
  description: string;   // plain text teaser
  url: string;           // canonical article URL (tracking params stripped)
  pubDate: string;       // ISO date, e.g. "2026-05-22"
  platform: 'medium' | 'substack';
}
```

`posts.generated.json` is a `Post[]` sorted by `pubDate` desc.

Manual overrides live in a small committed structure in `posts.ts` (hand-edited, never touched by the script):

```ts
const overrides = {
  hidden: [/* urls to suppress */],
  byUrl: {
    // 'https://…': { title?: string; description?: string }
  },
};
```

### Teaser extraction

- **Substack**: use the feed item's `<description>` (already a clean short summary), stripped of any residual tags and whitespace-collapsed.
- **Medium**: there is no clean subtitle field; strip `<content:encoded>` to plain text, collapse whitespace, then truncate to ~160 characters on a word boundary and append "…". Never emit HTML.
- **URL hygiene**: strip Medium's `?source=rss-…` (and similar) tracking query params so URLs are canonical and stable across runs.

### Security

Feed content is third-party. The teaser is rendered as a text node in PostCard (`{post.description}`), which Astro auto-escapes — and we never switch to `set:html` — so stored-XSS via feed content is not possible. HTML stripping is for cleanliness, not safety, but both reinforce the same decision: text only.

## Data flow

1. Daily (or on push), the Action runs `fetch-posts.mjs`.
2. Script fetches both feeds, normalizes, merges, sorts, writes `posts.generated.json`.
3. If the file changed, the Action commits and pushes it.
4. Vercel sees the push and rebuilds the static site.
5. `astro build` imports the committed JSON; `getPosts()` applies overrides + draft filter; `Writing.astro` renders the top 3.
6. Local dev (`astro dev`/`build`) reads the same committed JSON — no network needed.

## Error handling

- **One feed down (in the Action):** keep that platform's slice from the prior committed JSON; refresh the other.
- **Both feeds down (in the Action):** no file change, Action commits nothing, site unaffected.
- **Action itself fails:** no push, no deploy, site continues serving the last committed JSON.
- **Build time:** no fetch happens, so there is no build-time failure mode tied to the feeds.

## Testing (TDD)

Pure helpers are unit-tested with committed RSS fixtures via the existing vitest setup:

- `parseItem` (per platform) → correct `Post` fields.
- `extractTeaser` → strips HTML, collapses whitespace, truncates on word boundary, appends ellipsis; Substack path uses `<description>` directly.
- `stripTrackingParams` → canonical URL.
- `mergeAndSort` → correct descending date order across platforms.
- `applyOverrides` → hidden URLs removed; title/description overrides applied.
- Per-feed fallback: with a simulated feed failure, prior slice is retained.

The fetch/IO orchestration in `fetch-posts.mjs` is tested with a mocked `fetch` (success, single-feed failure, double failure).

## Manual steps for Sarah

- After merge, confirm the Action's bot push actually triggers a Vercel deploy (expected via the GitHub integration). If Vercel does not auto-deploy on the bot commit, add a Vercel Deploy Hook curl as a backup trigger step in the workflow. (Deferred until observed; not built up front.)

## Open questions / future

- Description-override quality: Medium auto-teasers may occasionally read awkwardly; the `byUrl` override exists precisely for those cases. No further mechanism needed now.
- On-site full-article reading remains a separate, future exploration.
