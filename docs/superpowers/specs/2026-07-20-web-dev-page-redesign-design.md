# Web Dev Services Page Redesign — Design Spec

**Date:** 2026-07-20
**Branch:** to be cut from `master`

## Goal

Replace the visual design of the existing `/web-dev` marketing page with the high-fidelity design handed off in `design_handoff_web_dev_page/WebDevPage.dc.html` ("design 2a"), while keeping the page's current copy, content structure, and its place in the site shell (`Header` + `Footer`).

The handoff file is prototyping scaffolding, not production code — it exists to pin down colors, typography, spacing, and hover behavior exactly. It is not copied directly; its section markup and token values are recreated using the site's own Astro + Tailwind conventions.

## Content decisions (deviations from the handoff)

The handoff is a redesign of the *whole* page including copy. This implementation intentionally keeps the site's current wording rather than adopting the handoff's rewritten copy, specifically:

- Hero eyebrow/H1/sub-paragraph: current copy kept.
- The **Intro** section ("Most small business sites are one of two things...") is **kept** even though the handoff drops it — restyled to match the new visual system, content unchanged.
- Package, Care Plan, and Process Step names/descriptions: current copy in `webDev.ts` kept as-is.
- Dark-mode toggle: the handoff assumes a single light scheme with two intentionally dark-ground sections (hero, contact CTA). This site has a global light/dark toggle; the hero and contact CTA sections stay fixed on their dark background colors regardless of the toggle — they do not gain `dark:` variants.
- Nav/footer: unchanged. The page continues to render inside `Header` / `Footer` via `web-dev.astro`, which the handoff doesn't cover (it's a bodyless section bundle).

Everything else — layout, spacing, color usage, hover interactions, button shapes, card treatments — is recreated pixel-accurately from the handoff.

## Changes

### 1. Design tokens — `tailwind.config.mjs`

Add to `theme.extend` (existing `colors`/`fontFamily`/`typography` entries untouched — the seven-color palette already matches the handoff exactly):

```js
borderRadius: {
  card: '0.75rem',
  pill: '9999px',
},
boxShadow: {
  'card-hover': '0 12px 24px -8px rgba(22,42,44,.18)',
},
maxWidth: {
  container: '64rem',
},
letterSpacing: {
  eyebrow: '.15em',
},
transitionDuration: {
  hover: '240ms',
},
```

These become real utilities (`rounded-card`, `rounded-pill`, `shadow-card-hover`, `max-w-container`, `tracking-eyebrow`, `duration-hover`) usable site-wide, not just on this page — important since `Button` needs `rounded-pill` wherever it's used later.

### 2. New component — `src/components/ui/Button.astro`

Props: `variant: 'primary' | 'secondary' | 'inverse-solid'`, `href: string`, `class?: string`; renders an `<a>` with a default slot for the label.

- `primary` — `bg-sage text-cream`
- `secondary` — transparent bg, `text-sage`, `border border-sage`
- `inverse-solid` — `bg-cream text-ink-dark` (needed for the highlighted middle package card's button, which sits on a sage background — `secondary`'s sage-on-transparent styling wouldn't read there)

Shared across variants: `rounded-pill`, `inline-flex items-center justify-center`, `px-6 py-[11px] text-sm font-medium`, `transition-colors duration-hover`, and a visible `focus-visible` ring (the site has no existing pill-button focus treatment to inherit, so this component defines its own).

### 3. Data model — `src/data/webDev.ts`

- Add `mailtoSubject: string` to the `Package` interface.
- Populate it per package: `The Storefront`, `The Custom Build`, `The Shopfront`.
- No other interface or content changes.

This powers new per-card "Start here" buttons: `mailto:hello@okeefesarah.com?subject=${encodeURIComponent(mailtoSubject)}`. Today, no package card has an individual CTA button — only the closing Contact CTA has one. This redesign adds one to every card, per the handoff.

### 4. `src/components/sections/WebDev.astro` — section-by-section

1. **Hero** (dark, `ink-darker`, fixed regardless of toggle): current copy kept. Adopt the handoff's layout — centered `max-w-[760px]` column, dual radial-gradient background + faint sage-light line-art SVG, uppercase eyebrow, Lora `font-normal` H1, Inter lede paragraph, two pill buttons side by side (`primary` "Book a discovery call" / `secondary` "See packages" → `#packages`).
2. **Intro**: current two-paragraph copy and two-column grid kept, restyled with the new spacing/type scale so it reads as part of the same system.
3. **Packages** (`#packages`): 3-column grid, `max-w-container` centered. Outer cards: `bg-cream-alt`, `rounded-card`, hover → `-translate-y-1` + `shadow-card-hover`. Middle card: `bg-sage`, raised at rest (`-translate-y-2`) with the resting shadow, "Most chosen" badge pill absolutely centered on top edge, all text/checks in cream, `inverse-solid` button. Each card gets a full-width "Start here" button (`secondary` on outer cards, `inverse-solid` on the middle) using the new `mailtoSubject`.
4. **Care Plans** (`#care`): section background `cream-alt`, 3-column grid, cards on `bg-cream` with `border border-default` (`rgba(22,42,44,.12)`), matching the handoff's spacing/typography.
5. **Process** (`#process`): 4-column grid with an absolutely-positioned 2px connector line (`border-default`) behind numbered circles (`bg-sage`, cream Lora numeral), `z-index` keeping circles above the line.
6. **Contact CTA** (`#contact`, dark, `ink-dark`, fixed regardless of toggle): centered, Lora H2, Inter paragraph, one `primary` button, `sage-light` footnote.

Section ids (`#packages`, `#care`, `#process`, `#contact`) are preserved so the hero's "See packages" anchor and any external links keep working.

### 5. `src/pages/web-dev.astro`

No changes — already wraps `WebDev` in `Header` / `Footer`.

## Responsive behavior

Not shown in the handoff's desktop-only mock; per its own recommendation:
- Package grid and process-step grid collapse to 1 column below ~720px.
- Process connector line hidden or softened once stacked (a horizontal line behind vertically-stacked circles reads as broken).
- Section horizontal padding reduces from 64px down to ~24px on small screens.
- `prefers-reduced-motion` disables hover transitions, matching the current page's existing pattern.

## Out of scope

- No changes to `Header.astro` or `Footer.astro`.
- No new copy — all wording stays exactly as currently in `webDev.ts` / `WebDev.astro`, with the sole structural addition of per-package `mailtoSubject`.
- No dark-mode variants for the hero or contact CTA sections.
- No changes to the `_ds/…` prototyping bundle or `WebDevPage.dc.html` itself — it's reference only and is not wired into the build.
