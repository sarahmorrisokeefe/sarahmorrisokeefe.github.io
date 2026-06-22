# DevRel Consulting Link — Design Spec

**Date:** 2026-06-22
**Branch:** to be cut from `master`

## Goal

Surface Sarah's freelance devrel consulting site (`http://dx.okeefesarah.com/`) on the personal site (`www.okeefesarah.com`) so that visitors interested in that work can find it. Two touchpoints: an always-visible nav link and a contextual callout card in the About section.

## Changes

### 1. Header nav — "Consulting" link

**Files:** `src/components/layout/Header.astro`

Add a "Consulting" entry to the `navLinks` array after "Contact". Unlike the other nav links (which are anchor hrefs that scroll the page), this is an external link:
- `href`: `http://dx.okeefesarah.com/`
- `target="_blank"`, `rel="noopener noreferrer"`
- Label: `Consulting ↗` (the ↗ glyph signals external destination)
- Styled identically to existing nav links; the glyph provides sufficient visual distinction

The mobile dropdown menu renders `navLinks` the same way, so the Consulting link appears there automatically.

### 2. About section — consulting callout card

**Files:** `src/components/sections/About.astro`

Add a full-width card below the existing two-column grid (photo column + bio/interests column), still inside the `About` section container. The card:

- **Background:** `bg-cream-alt dark:bg-ink`
- **Left accent border:** `border-l-4 border-sage`
- **Padding:** `p-6`
- **Border radius:** `rounded-r-xl` (flat on the left to meet the accent border, rounded on the right)
- **Animation:** `fade-up` with a small transition delay (after the grid)

**Card contents:**

```
[eyebrow]  Available for consulting
[pitch]    I work with companies building developer-facing products on
           developer relations strategy, documentation, and community.
           If you're trying to earn developer trust and adoption, I'd love to talk.
[CTA]      See how I can help →
```

- Eyebrow: `text-xs font-medium tracking-widest uppercase text-sage dark:text-sage-light` — same treatment as other eyebrow labels on the page
- Pitch: two `<p>` tags, `text-ink dark:text-cream/70 text-sm leading-relaxed`
- CTA: `<a>` styled as a small pill outline button (matching the secondary "Say hello" button in the Hero), opens `http://dx.okeefesarah.com/` in a new tab

## Out of scope

- No changes to `personalInfo.ts` social links
- No changes to the bio copy in `personalInfo.ts`
- No new section in the page nav (the callout lives inside About, not as its own nav target)
- No changes to the footer
