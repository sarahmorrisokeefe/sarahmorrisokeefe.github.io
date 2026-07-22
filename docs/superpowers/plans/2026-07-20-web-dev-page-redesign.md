# Web Dev Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the visual design of `/web-dev` with the high-fidelity handoff (design 2a) in `design_handoff_web_dev_page/WebDevPage.dc.html`, recreated in Astro + Tailwind, while keeping the page's current copy and its place inside the site's shared `Header`/`Footer`.

**Architecture:** `src/components/sections/WebDev.astro` is rewritten section-by-section from scoped custom CSS to Tailwind utility classes, matching conventions already established elsewhere in the codebase (`About.astro`, `ProjectCard.astro`, `Hero.astro`). A new reusable `Button.astro` primitive replaces the page's one-off `.btn` class. `webDev.ts` gains a small pure helper for building per-package mailto links. Two small supporting fixes ride along: `Header.astro`'s simple-mode CTA anchor is repointed from `#cta` to `#contact` (the section id is changing), and the sitewide `fade-up` scroll-reveal script is promoted from `index.astro` into `BaseLayout.astro` so it works on `/web-dev` too (today it only exists on the homepage, so `fade-up` classes anywhere else render permanently invisible).

**Tech Stack:** Astro 7 (static output), Tailwind CSS 3, TypeScript, Vitest.

## Global Constraints

- Keep all current page copy verbatim (hero, intro, packages, care plans, process, contact) — do not adopt the handoff's rewritten wording.
- Keep the Intro section (the handoff drops it) — restyle only, content unchanged.
- Hero and Contact CTA sections render on fixed dark backgrounds (`ink-darker`, `ink-dark`) regardless of the site's light/dark toggle — no `dark:` classes on those two sections.
- Intro, Packages, Care Plans, and Process sections **do** get `dark:` variants, consistent with `About.astro`/`Projects`/`Writing` elsewhere on the site.
- Seven-color palette only, all already defined in `tailwind.config.mjs`: `sage` #5E6C5B, `sage-light` #849680, `cream` #FEFCF6, `cream-alt` #F4EFE6, `ink` #686867, `ink-dark` #162a2c, `ink-darker` #0f1e20.
- Headings/numerals/prices: `font-serif font-normal` (Lora, weight 400). Body/UI: default `font-sans` (Inter).
- Preserve section ids `#packages`, `#care`, `#process`, `#contact` (the contact section's id changes from the current `#cta` to `#contact` — see Task 9).
- `src/pages/web-dev.astro` is not modified — it keeps wrapping `WebDev` in `Header`/`Footer`.
- `design_handoff_web_dev_page/WebDevPage.dc.html` is read-only reference; never copy its markup verbatim (it's prototyping scaffolding with `_ds/…` wrapper components that don't exist in this codebase) or modify it.

**Note on token simplification:** the approved spec listed five new Tailwind config tokens (`radius-card`, `radius-pill`, `container`, `tracking-eyebrow`, `duration-hover`). Checking the existing codebase found that Tailwind's built-in `rounded-xl` (0.75rem), `rounded-full` (9999px), `max-w-5xl` (64rem), `tracking-widest` (used for every eyebrow elsewhere on the site), and `duration-200`/`duration-300` already produce the same or acceptably equivalent values and are what `About.astro`, `Header.astro`, `Hero.astro`, `ProjectCard.astro`, and `PostCard.astro` already use for these exact purposes. This plan uses those existing utilities instead of adding redundant tokens. The one token with no existing equivalent — the tinted card-hover shadow — is still added (Task 1).

---

### Task 1: Add the card-hover shadow token

**Files:**
- Modify: `tailwind.config.mjs`

**Interfaces:**
- Produces: Tailwind utility class `shadow-card-hover`, consumed by Task 6 (package cards).

- [ ] **Step 1: Add the token**

In `tailwind.config.mjs`, add a `boxShadow` entry to `theme.extend`, right after the `fontFamily` block:

```js
      fontFamily: {
        serif: ['Lora', ...defaultTheme.fontFamily.serif],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        'card-hover': '0 12px 24px -8px rgba(22,42,44,.18)',
      },
```

- [ ] **Step 2: Verify the build still succeeds**

Run: `npm run build`
Expected: build completes with no errors (confirms the config file is valid JS and Tailwind accepts the new key).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.mjs
git commit -m "Add card-hover shadow token for web-dev page redesign"
```

---

### Task 2: Add `mailtoSubject` and a mailto-link helper to `webDev.ts`

**Files:**
- Modify: `src/data/webDev.ts`
- Test: `src/data/__tests__/webDev.test.ts` (new)

**Interfaces:**
- Produces: `Package.mailtoSubject: string`; `packageMailtoHref(pkg: Pick<Package, 'mailtoSubject'>): string`. Consumed by Task 6 (per-package "Start here" buttons).

- [ ] **Step 1: Write the failing test**

Create `src/data/__tests__/webDev.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { packages, packageMailtoHref } from '../webDev';

describe('packageMailtoHref', () => {
  it('builds a mailto link with the URL-encoded package subject', () => {
    expect(packageMailtoHref({ mailtoSubject: 'The Custom Build' })).toBe(
      'mailto:hello@okeefesarah.com?subject=The%20Custom%20Build',
    );
  });
});

describe('packages', () => {
  it('gives every package a distinct, non-empty mailto subject', () => {
    const subjects = packages.map((p) => p.mailtoSubject);
    expect(subjects).toHaveLength(3);
    expect(new Set(subjects).size).toBe(3);
    expect(subjects.every((s) => s.length > 0)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/data/__tests__/webDev.test.ts`
Expected: FAIL — `packageMailtoHref` is not exported from `../webDev` (and `mailtoSubject` doesn't exist yet, so the second test fails too once the first compiles).

- [ ] **Step 3: Implement**

In `src/data/webDev.ts`, add `mailtoSubject` to the `Package` interface and populate it on each entry:

```ts
export interface Package {
  num: string;
  name: string;
  desc: string;
  price: string;
  featured: boolean;
  tag?: string;
  includes: string[];
  mailtoSubject: string;
}

export const packages: Package[] = [
  {
    num: '01',
    name: 'The Storefront',
    desc: 'A clean, professional presence for a business that mainly needs to be found, trusted, and easy to reach.',
    price: '$2,000',
    featured: false,
    mailtoSubject: 'The Storefront',
    includes: [
      'Up to 5 custom pages',
      'Mobile-first, fast-loading build',
      'Contact form and map',
      'Basic SEO setup',
      'Accessibility built in from the start',
    ],
  },
  {
    num: '02',
    name: 'The Custom Build',
    desc: 'A fuller site with real design work, room to grow, and the features a working business actually uses day to day.',
    price: '$4,500',
    featured: true,
    tag: 'Most chosen',
    mailtoSubject: 'The Custom Build',
    includes: [
      'Up to 10 custom pages',
      'Custom design in your brand',
      'A CMS so you can edit it yourself',
      'Booking, menus, or galleries',
      'Analytics and SEO setup',
    ],
  },
  {
    num: '03',
    name: 'The Shopfront',
    desc: 'For businesses selling online. Product pages, checkout, and a setup you can run without a developer on call.',
    price: '$7,000',
    featured: false,
    mailtoSubject: 'The Shopfront',
    includes: [
      'Everything in The Custom Build',
      'Online store and checkout',
      'Product and inventory setup',
      'Payment integration',
      'Training so you can manage it',
    ],
  },
];
```

Then add the helper near `contactEmail` at the bottom of the same file:

```ts
export const contactEmail = 'hello@okeefesarah.com';

export function packageMailtoHref(pkg: Pick<Package, 'mailtoSubject'>): string {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(pkg.mailtoSubject)}`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/data/__tests__/webDev.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/data/webDev.ts src/data/__tests__/webDev.test.ts
git commit -m "Add per-package mailto subjects and a mailto-link helper"
```

---

### Task 3: Share the fade-up scroll-reveal script via `BaseLayout.astro`

**Files:**
- Modify: `src/components/layout/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: any page rendered through `BaseLayout` can use `class="fade-up"` / `class="fade-up-stagger"` (defined in `src/styles/global.css`, already imported by `BaseLayout`) and have it animate in. Consumed by Tasks 5, 6, 7, 8.

Today the `IntersectionObserver` that adds the `.visible` class only lives in `index.astro`. `fade-up` elements start at `opacity: 0` (see `src/styles/global.css:41-45`) and never receive `.visible` outside the homepage — so any page other than `/` that uses `fade-up` renders that content invisible. This task moves the script to `BaseLayout.astro` (shared by every page) so it works site-wide, and removes the now-duplicate copy from `index.astro`.

- [ ] **Step 1: Move the script into `BaseLayout.astro`**

In `src/components/layout/BaseLayout.astro`, add this immediately after `<Analytics />` and before `</body>`:

```astro
    <Analytics />

    <!--
      Scroll-triggered fade-up animations.
      Elements with class "fade-up" or "fade-up-stagger" animate into view once.
    -->
    <script>
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      );

      document.querySelectorAll('.fade-up, .fade-up-stagger').forEach((el) => {
        observer.observe(el);
      });
    </script>
  </body>
</html>
```

(This replaces the existing plain `<Analytics />` / `</body>` / `</html>` closing lines at the end of the file.)

- [ ] **Step 2: Remove the now-duplicate script from `index.astro`**

In `src/pages/index.astro`, delete the trailing comment + `<script>` block (everything after the closing `</BaseLayout>` tag):

```astro
<!--
  Scroll-triggered fade-up animations.
  Elements with class "fade-up" or "fade-up-stagger" animate into view once.
-->
<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up, .fade-up-stagger').forEach((el) => {
    observer.observe(el);
  });
</script>
```

`index.astro` should end with `</BaseLayout>` and nothing after it.

- [ ] **Step 3: Verify the homepage still animates**

Run: `npm run build && npm run preview` (or `npm run dev`), open `http://localhost:4321/` (or the preview port shown), scroll down. Expected: About/Projects/Writing content still fades up on scroll exactly as before — the script now runs from `BaseLayout` instead of `index.astro`, so behavior should be unchanged on this page.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/BaseLayout.astro src/pages/index.astro
git commit -m "Move fade-up scroll-reveal script into BaseLayout so all pages can use it"
```

---

### Task 4: Create `Button.astro` and rewrite the Hero section

**Files:**
- Create: `src/components/ui/Button.astro`
- Modify: `src/components/sections/WebDev.astro`

**Interfaces:**
- Produces: `Button` component — props `variant: 'primary' | 'secondary' | 'inverse-solid'`, `href: string`, `class?: string`, default slot for label. Consumed by Tasks 6 and 9.
- Consumes: nothing new (this task only needs `contactEmail` from `webDev.ts`, already imported by the file).

- [ ] **Step 1: Create `Button.astro`**

```astro
---
interface Props {
  variant: 'primary' | 'secondary' | 'inverse-solid';
  href: string;
  class?: string;
}

const { variant, href, class: className = '' } = Astro.props;

const variantClasses: Record<Props['variant'], string> = {
  primary: 'bg-sage text-cream hover:bg-sage-light',
  secondary: 'bg-transparent text-sage border border-sage hover:bg-sage hover:text-cream',
  'inverse-solid': 'bg-cream text-ink-dark hover:bg-cream-alt',
};
---

<a
  href={href}
  class:list={[
    'inline-flex items-center justify-center rounded-full px-6 py-[11px] text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage',
    variantClasses[variant],
    className,
  ]}
>
  <slot />
</a>
```

**Why the `secondary` variant has no `dark:` classes baked in:** this component is reused both inside the Hero (fixed dark background, must render identically regardless of the toggle — see Global Constraints) and later inside the Packages section's outer cards (which do respond to the toggle). Baking `dark:` overrides into the variant itself would make the Hero's "See packages" button subtly shift color when the toggle flips, even though the Hero section around it never changes — a contradiction with the "fixed dark, ignore toggle" requirement. Instead, `Button` stays toggle-neutral, and any call site that needs a dark-mode contrast boost (Task 6's package cards) adds it explicitly via the `class` prop, which is appended last in the `class:list` above and so can extend or override the variant's defaults per call site.

- [ ] **Step 2: Replace the Hero markup in `WebDev.astro`**

Add the import at the top of the frontmatter:

```astro
---
import Button from '../ui/Button.astro';
import { packages, carePlans, processSteps, contactEmail } from '../../data/webDev';
---
```

Replace the `<!-- HERO -->` block:

```astro
  <!-- HERO -->
  <div class="hero">
    <div class="wrap">
      <p class="eyebrow">Web Development · Charlotte, NC</p>
      <h1>Websites that actually work for the businesses behind them.</h1>
      <p class="lede">
        I'm a front-end engineer with six years building production software.
        These days I also build fast, accessible, genuinely good websites for
        small businesses. <em>No template you have to fight, no jargon, and no
        disappearing after launch.</em>
      </p>
    </div>
  </div>
```

with:

```astro
  <!-- HERO -->
  <section class="relative overflow-hidden bg-ink-darker px-6 pt-[110px] pb-24 md:px-16">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_22%,rgba(132,150,128,.16),transparent_60%),radial-gradient(ellipse_at_82%_82%,rgba(94,108,91,.14),transparent_55%)]"
    >
    </div>
    <svg
      class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
      viewBox="0 0 800 500"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 420 Q 200 330 400 400 T 800 350" stroke="#849680" stroke-width="1" fill="none"></path>
      <path d="M0 90 Q 300 160 500 80 T 800 130" stroke="#849680" stroke-width="1" fill="none"></path>
    </svg>
    <div class="relative mx-auto max-w-[760px] text-center">
      <p class="mb-5 text-xs font-semibold uppercase tracking-widest text-sage-light">
        Web Development · Charlotte, NC
      </p>
      <h1 class="mb-6 font-serif text-[clamp(2.6rem,3vw+1.6rem,3.6rem)] font-normal leading-[1.05] text-cream">
        Websites that actually work for the businesses behind them.
      </h1>
      <p class="mx-auto mb-9 max-w-[600px] text-lg leading-relaxed text-cream/[0.82]">
        I'm a front-end engineer with six years building production software.
        These days I also build fast, accessible, genuinely good websites for
        small businesses. <em>No template you have to fight, no jargon, and no
        disappearing after launch.</em>
      </p>
      <div class="flex justify-center gap-4">
        <Button variant="primary" href={`mailto:${contactEmail}?subject=Website%20project`}>
          Book a discovery call
        </Button>
        <Button variant="secondary" href="#packages">See packages</Button>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Remove the now-dead Hero CSS**

In the `<style>` block at the bottom of `WebDev.astro`, delete the `/* HERO */` rule group: `.hero`, `.hero .eyebrow`, `.hero h1`, `.hero .lede`, `.hero .lede em`. Leave the shared `.eyebrow` base rule and everything else in place for now — later sections still use it.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds (this is the first task where `Button.astro` is actually imported, so this is the first real compile check of it).

Run: `npm run dev`, open `http://localhost:4321/web-dev`. Expected: hero renders on a dark background with the two gradient blobs, faint line-art curves, centered copy, and two pill buttons ("Book a discovery call" filled sage, "See packages" outlined). Clicking "See packages" should jump down the page (target doesn't exist yet as `#packages` until Task 6, so for now it's fine if it scrolls to the bottom — that will resolve once Task 6 lands).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Button.astro src/components/sections/WebDev.astro
git commit -m "Add Button component and rebuild the web-dev hero section"
```

---

### Task 5: Rewrite the Intro section

**Files:**
- Modify: `src/components/sections/WebDev.astro`

- [ ] **Step 1: Replace the Intro markup**

Replace:

```astro
  <!-- INTRO -->
  <div class="wrap intro">
    <p>
      Most small business sites are one of two things: a cheap builder the owner
      is stuck babysitting, or an overpriced agency build that took six months
      and still loads slowly on a phone.
    </p>
    <p>
      I sit in the middle. <strong>Custom-built, hand-coded, made to load fast
      and read clearly on every screen.</strong> You get one person who knows
      your project start to finish, and sticks around to keep it running.
    </p>
  </div>
```

with:

```astro
  <!-- INTRO -->
  <div
    class="fade-up mx-auto grid max-w-5xl grid-cols-1 gap-8 border-b border-ink-dark/10 bg-cream px-6 py-12 dark:border-cream/15 dark:bg-ink-dark md:grid-cols-2 md:gap-12 md:px-16"
  >
    <p class="text-base leading-relaxed text-ink dark:text-cream/70">
      Most small business sites are one of two things: a cheap builder the owner
      is stuck babysitting, or an overpriced agency build that took six months
      and still loads slowly on a phone.
    </p>
    <p class="text-base leading-relaxed text-ink dark:text-cream/70">
      I sit in the middle. <strong class="font-bold text-ink-dark dark:text-cream">Custom-built, hand-coded, made to load fast
      and read clearly on every screen.</strong> You get one person who knows
      your project start to finish, and sticks around to keep it running.
    </p>
  </div>
```

- [ ] **Step 2: Remove the now-dead Intro CSS**

Delete the `/* INTRO */` rule group (`.intro`, `.intro p`, `.intro p strong`) from the `<style>` block. Also remove the `.intro` line from the responsive media queries near the bottom (`@media (max-width: 720px) { .intro { grid-template-columns: 1fr; gap: 24px; } ... }`) — the Tailwind classes already handle this via `md:grid-cols-2`.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds.

Run: `npm run dev`, open `http://localhost:4321/web-dev`, scroll to the Intro section. Expected: two-column paragraph layout on desktop, single column on narrow viewports, fades in on scroll, matches surrounding light/dark background correctly when toggling dark mode from the header.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WebDev.astro
git commit -m "Restyle web-dev Intro section with Tailwind"
```

---

### Task 6: Rewrite the Packages section

**Files:**
- Modify: `src/components/sections/WebDev.astro`

**Interfaces:**
- Consumes: `Button` (Task 4), `packages` + `packageMailtoHref` (Task 2), `shadow-card-hover` (Task 1).

- [ ] **Step 1: Replace the Packages markup**

Replace:

```astro
  <!-- PACKAGES -->
  <div class="wrap section-head">
    <p class="eyebrow">Packages</p>
    <h2>Three ways to work together</h2>
    <p>
      Every project starts with a short discovery call, so the scope fits your
      business. The prices below are starting points, not ceilings.
    </p>
  </div>

  <div class="wrap packages">
    {packages.map((p) => (
      <div class={`card${p.featured ? " featured" : ""}`}>
        {p.featured && <span class="tag">{p.tag}</span>}
        <p class="num">{p.num}</p>
        <h3>{p.name}</h3>
        <p class="desc">{p.desc}</p>
        <p class="price"><span>Starting at</span><strong>{p.price}</strong></p>
        <ul>
          {p.includes.map((item) => <li>{item}</li>)}
        </ul>
      </div>
    ))}
  </div>
```

with:

```astro
  <!-- PACKAGES -->
  <section id="packages" class="bg-cream px-6 py-[88px] dark:bg-ink-dark md:px-16">
    <div class="fade-up mx-auto mb-12 max-w-[520px] text-center">
      <p class="mb-2.5 text-xs font-semibold uppercase tracking-widest text-sage dark:text-sage-light">
        Packages
      </p>
      <h2 class="mb-2 font-serif text-4xl font-normal text-ink-dark dark:text-cream">
        Three ways to work together
      </h2>
      <p class="text-base leading-relaxed text-ink dark:text-cream/70">
        Every project starts with a short discovery call. Prices are starting points, not ceilings.
      </p>
    </div>
    <div class="fade-up-stagger mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
      {packages.map((p) =>
        p.featured ? (
          <div class="relative flex -translate-y-2 flex-col rounded-xl bg-sage p-9 shadow-card-hover">
            <span class="absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-dark px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-cream">
              {p.tag}
            </span>
            <h3 class="mb-1 font-serif text-xl font-normal text-cream">{p.name}</h3>
            <p class="mb-[18px] min-h-[66px] text-sm leading-relaxed text-cream/85">{p.desc}</p>
            <div class="mb-5 text-sm text-cream/85">
              Starting at{' '}
              <span class="font-serif text-3xl font-normal text-cream">{p.price}</span>
            </div>
            <div class="mb-6 flex flex-1 flex-col gap-[11px]">
              {p.includes.map((item) => (
                <div class="flex items-start gap-2.5 text-sm text-cream">
                  <svg width="15" height="15" viewBox="0 0 24 24" class="mt-0.5 shrink-0 text-cream" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
            <Button variant="inverse-solid" href={packageMailtoHref(p)} class="w-full">
              Start here
            </Button>
          </div>
        ) : (
          <div class="flex flex-col rounded-xl bg-cream-alt p-8 transition-all duration-300 motion-reduce:transition-none hover:-translate-y-1 hover:shadow-card-hover dark:bg-ink dark:hover:shadow-ink-darker/50">
            <h3 class="mb-1 font-serif text-xl font-normal text-ink-dark dark:text-cream">{p.name}</h3>
            <p class="mb-[18px] min-h-[66px] text-sm leading-relaxed text-ink dark:text-cream/70">{p.desc}</p>
            <div class="mb-5 text-sm text-ink-dark dark:text-cream">
              Starting at{' '}
              <span class="font-serif text-3xl font-normal text-ink-dark dark:text-cream">{p.price}</span>
            </div>
            <div class="mb-6 flex flex-1 flex-col gap-[11px]">
              {p.includes.map((item) => (
                <div class="flex items-start gap-2.5 text-sm text-ink dark:text-cream/70">
                  <svg width="15" height="15" viewBox="0 0 24 24" class="mt-0.5 shrink-0 text-sage dark:text-sage-light" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              href={packageMailtoHref(p)}
              class="w-full dark:border-sage-light dark:text-sage-light dark:hover:bg-sage-light dark:hover:text-ink-dark"
            >
              Start here
            </Button>
          </div>
        ),
      )}
    </div>
  </section>
```

Add `packageMailtoHref` to the existing `webDev` import at the top of the file:

```astro
import { packages, carePlans, processSteps, contactEmail, packageMailtoHref } from '../../data/webDev';
```

- [ ] **Step 2: Remove the now-dead Packages CSS**

Delete the `/* PACKAGES */` rule group (`.packages`, `.card`, `.card .num`, `.card h3`, `.card .desc`, `.card .price`, `.card .price span`, `.card .price strong`, `.card ul`, `.card li`, `.card li::before`, `.card.featured` and its sub-rules) and the `.packages { grid-template-columns: 1fr; }` line in the `@media (max-width: 860px)` block.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds.

Run: `npm run dev`, open `http://localhost:4321/web-dev#packages`. Expected: three cards in a row on desktop (single column below ~768px), middle "Custom Build" card raised on a sage background with the "Most chosen" badge centered on its top edge, each card has a full-width "Start here" button at the bottom. Hover the outer two cards — they lift slightly with a soft shadow; the middle card doesn't move on hover. Click each "Start here" button and confirm the mail client opens with the correct subject line per package (Storefront / Custom Build / Shopfront). Toggle dark mode and confirm the outer cards and their text switch to the dark surface colors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WebDev.astro src/data/webDev.ts
git commit -m "Rebuild web-dev Packages section with per-card CTAs"
```

---

### Task 7: Rewrite the Care Plans section

**Files:**
- Modify: `src/components/sections/WebDev.astro`

- [ ] **Step 1: Replace the Care Plans markup**

Replace:

```astro
  <!-- CARE PLANS -->
  <div class="care">
    <div class="wrap">
      <div class="care-intro">
        <p class="eyebrow">Care Plans</p>
        <h2>Keep it running after launch</h2>
        <p>
          A website is a living thing. Care plans cover the updates, security,
          and small changes that keep it fast and current, so you never have to
          think about it. Cancel anytime.
        </p>
      </div>
      <div class="plans">
        {carePlans.map((plan) => (
          <div class="plan">
            <h4>{plan.name}</h4>
            <p class="rate"><b>{plan.rate}</b>{plan.unit && <span> {plan.unit}</span>}</p>
            <p>{plan.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
```

with:

```astro
  <!-- CARE PLANS -->
  <section id="care" class="bg-cream-alt px-6 py-[72px] dark:bg-ink md:px-16">
    <div class="mx-auto max-w-5xl">
      <div class="fade-up mb-9 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p class="mb-2.5 text-xs font-semibold uppercase tracking-widest text-sage dark:text-sage-light">
            Care Plans
          </p>
          <h2 class="font-serif text-3xl font-normal text-ink-dark dark:text-cream">
            Keep it running after launch
          </h2>
        </div>
        <p class="max-w-[360px] text-sm leading-relaxed text-ink dark:text-cream/70">
          Updates, security, and small changes that keep it fast and current. Cancel anytime.
        </p>
      </div>
      <div class="fade-up-stagger grid grid-cols-1 gap-5 md:grid-cols-3">
        {carePlans.map((plan) => (
          <div class="rounded-xl border border-ink-dark/10 bg-cream p-[26px] dark:border-cream/15 dark:bg-ink-dark">
            <h4 class="mb-1.5 font-serif text-lg font-normal text-ink-dark dark:text-cream">{plan.name}</h4>
            <p class="mb-2.5 text-sm text-sage dark:text-sage-light">
              <strong>{plan.rate}</strong>{plan.unit && <span> {plan.unit}</span>}
            </p>
            <p class="text-sm leading-relaxed text-ink dark:text-cream/70">{plan.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
```

Note: the current copy's care-intro paragraph ("A website is a living thing... so you never have to think about it.") is longer than the handoff's version. Keep the current wording as-is per the "keep current copy" decision — only the layout/styling changes.

- [ ] **Step 2: Remove the now-dead Care Plans CSS**

Delete the `/* CARE PLANS */` rule group (`.care`, `.care-intro`, `.care-intro h2`, `.care-intro p`, `.plans`, `.plan`, `.plan h4`, `.plan .rate`, `.plan .rate b`, `.plan p`) and the `.plans { grid-template-columns: 1fr; }` line in the `@media (max-width: 860px)` block, and the `.care { padding: 48px 0; }` line in the `@media (max-width: 520px)` block.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds.

Run: `npm run dev`, open `http://localhost:4321/web-dev#care`. Expected: header row with eyebrow/H2 on the left and the note paragraph on the right (wrapping to stack on narrow viewports), three plan cards below in a row (single column on mobile). Toggle dark mode and confirm the section and card backgrounds swap correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WebDev.astro
git commit -m "Restyle web-dev Care Plans section with Tailwind"
```

---

### Task 8: Rewrite the Process section

**Files:**
- Modify: `src/components/sections/WebDev.astro`

- [ ] **Step 1: Replace the Process markup**

Replace:

```astro
  <!-- PROCESS -->
  <div class="wrap process">
    <div class="section-head">
      <p class="eyebrow">How It Works</p>
      <h2>What working together looks like</h2>
    </div>
    <div class="steps">
      {processSteps.map((step) => (
        <div class="step">
          <span class="step-num">{step.num}</span>
          <h4>{step.title}</h4>
          <p>{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
```

with:

```astro
  <!-- PROCESS -->
  <section id="process" class="bg-cream px-6 py-20 dark:bg-ink-dark md:px-16">
    <div class="mx-auto max-w-5xl">
      <div class="fade-up mb-11 text-center">
        <p class="mb-2.5 text-xs font-semibold uppercase tracking-widest text-sage dark:text-sage-light">
          How It Works
        </p>
        <h2 class="font-serif text-3xl font-normal text-ink-dark dark:text-cream">
          What working together looks like
        </h2>
      </div>
      <div class="fade-up-stagger relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
        <div class="absolute left-[12.5%] right-[12.5%] top-[19px] hidden h-0.5 bg-ink-dark/10 dark:bg-cream/15 md:block"></div>
        {processSteps.map((step, i) => (
          <div class="relative text-center">
            <div class="relative z-10 mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage font-serif text-base font-normal text-cream">
              {i + 1}
            </div>
            <h4 class="mb-2 font-serif text-lg font-normal text-ink-dark dark:text-cream">{step.title}</h4>
            <p class="text-sm leading-relaxed text-ink dark:text-cream/70">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Remove the now-dead Process CSS and the shared `.eyebrow`/`.section-head`/`.wrap` rules**

By this point, every section that used the shared `.eyebrow`, `.section-head`, and `.wrap` classes has been converted to Tailwind. Delete from the `<style>` block:
- `.eyebrow` (the base rule)
- `.section-head` and its sub-rules
- `.wrap`
- `/* PROCESS */` rule group (`.process`, `.steps`, `.step .step-num`, `.step h4`, `.step p`)
- The `.steps { grid-template-columns: 1fr 1fr; gap: 32px 24px; }` line in the `@media (max-width: 720px)` block and the `.steps { grid-template-columns: 1fr; gap: 28px; }` line in the `@media (max-width: 520px)` block

Leave the CTA/footer rules and the `.webdev` root rule in place — Task 9 removes those.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds.

Run: `npm run dev`, open `http://localhost:4321/web-dev#process`. Expected: four numbered steps in a row on desktop with a thin horizontal line running behind the circles at their vertical center; on mobile (below ~768px) the steps stack to one column and the connector line disappears (it would look broken running behind stacked circles).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WebDev.astro
git commit -m "Restyle web-dev Process section with Tailwind"
```

---

### Task 9: Rewrite the Contact CTA section and fix the header's anchor

**Files:**
- Modify: `src/components/sections/WebDev.astro`
- Modify: `src/components/layout/Header.astro`

**Interfaces:**
- Consumes: `Button` (Task 4), `contactEmail` (already imported).

The current page has two separate pieces at the end — a `<div id="cta">` block and a trailing `<footer class="note">` with the "Based in Charlotte..." line. The handoff's Contact CTA section combines these into one block, drops the "Let's Build" eyebrow (not present in the approved spec's Contact CTA description), and renames the anchor target from `#cta` to `#contact`. `Header.astro`'s simple-mode "Get in Touch" button links to `#cta` in two places and must be updated to match.

- [ ] **Step 1: Replace the CTA + trailing footer markup**

Replace both of these blocks:

```astro
  <!-- CTA -->
  <div id="cta" class="cta scroll-mt-20">
    <div class="wrap">
      <p class="eyebrow">Let's Build</p>
      <h2>Have a project in mind?</h2>
      <p>
        Tell me a little about your business and what you're after. I'll come
        back with honest thoughts and a real starting point.
      </p>
      <a class="btn" href={`mailto:${contactEmail}?subject=Website%20project`}>
        Book a discovery call
      </a>
    </div>
  </div>

  <footer class="note">
    <div class="wrap">Based in Charlotte, working with businesses near and far.</div>
  </footer>
```

with:

```astro
  <!-- CONTACT CTA -->
  <section id="contact" class="scroll-mt-20 bg-ink-dark px-6 py-[88px] text-center md:px-16">
    <h2 class="mb-4 font-serif text-4xl font-normal text-cream">Have a project in mind?</h2>
    <p class="mx-auto mb-8 max-w-[560px] text-base leading-relaxed text-cream/[0.82]">
      Tell me a little about your business and what you're after. I'll come
      back with honest thoughts and a real starting point.
    </p>
    <Button variant="primary" href={`mailto:${contactEmail}?subject=Website%20project`}>
      Book a discovery call
    </Button>
    <p class="mt-6 text-sm text-sage-light">Based in Charlotte, working with businesses near and far.</p>
  </section>
```

- [ ] **Step 2: Remove the now-dead CTA/footer CSS and the `.webdev` wrapper rules**

Delete the `/* CTA */` rule group (`.cta`, `.cta .eyebrow`, `.cta h2`, `.cta p`, `.btn`, `.btn:hover`, `.btn:focus-visible`), the `.note` rule, the `.cta { padding: 56px 0; }` line in the `@media (max-width: 520px)` block, and the trailing `@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }` block (superseded by `motion-reduce:transition-none` already on `Button.astro`).

At this point every rule inside the `<style>` block should be gone except the root `.webdev { ... }` custom-property block, the `* { box-sizing: border-box; }` rule, and the (now-empty) `@media` blocks. None of the six section blocks themselves need to change here — only the file's outer wrapper and the leftover `<style>` block go. Make exactly two edits to the file:

1. Change the file's opening tag, currently:

```astro
<section class="webdev">
```

to:

```astro
<>
```

2. Find the closing `</section>` that pairs with it — it's the last line of markup, immediately before the `<style>` block — and delete from that `</section>` through the `<style>` block's closing `</style>` tag (i.e. delete `</section>`, the blank line after it, and the entire `<style>...</style>` block that follows), replacing all of it with a single `</>`.

Astro supports `<> ... </>` fragments the same as JSX. Nothing about the six sections' own markup changes in this step — only the outer wrapper and the now-fully-dead `<style>` block are removed.

- [ ] **Step 3: Fix `Header.astro`'s anchor**

In `src/components/layout/Header.astro`, both occurrences of:

```astro
            href="#cta"
```

become:

```astro
            href="#contact"
```

(One is in the desktop nav around line 52, one in the mobile nav around line 163 — both inside the `simple ? (...)` branch.)

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds, no leftover references to `.webdev`/`.hero`/`.cta`/etc. classes (they no longer exist anywhere).

Run: `npm run dev`, open `http://localhost:4321/web-dev`. Expected: page renders as one continuous flow with no stray wrapper spacing. Scroll to the bottom — Contact CTA is on a dark background, centered, with one pill button and the Charlotte footnote directly below it (no separate footer band). Click the "Get in Touch" button in the header (visible because this page uses `<Header simple />`) and confirm it jumps to the Contact CTA section.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/WebDev.astro src/components/layout/Header.astro
git commit -m "Rebuild web-dev Contact CTA section and fix header anchor to #contact"
```

---

### Task 10: Full-page verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass, including the new `webDev.test.ts` from Task 2.

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: succeeds with no errors or warnings about unused/missing classes.

- [ ] **Step 3: Full manual walkthrough**

Run: `npm run dev`, open `http://localhost:4321/web-dev`, and check:
- Every section (Hero, Intro, Packages, Care Plans, Process, Contact CTA) matches the handoff's colors, spacing, and typography at desktop width.
- Resize to a narrow (mobile) viewport: Packages and Process grids collapse to one column, the process connector line disappears, section horizontal padding visibly shrinks.
- Toggle dark mode from the header: Intro, Packages, Care Plans, and Process sections switch to their dark surface colors and text; Hero and Contact CTA stay exactly as they were (they have no `dark:` classes).
- Click every button on the page (hero ×2, all three package cards, contact CTA) and confirm each opens the correct `mailto:` link with the correct subject, or scrolls to the correct anchor.
- Open devtools, enable "prefers reduced motion," and confirm button/card hover transitions no longer animate.
- Confirm the homepage (`/`) still fades its sections in on scroll exactly as before (regression check for Task 3's script move).

- [ ] **Step 4: Format check**

Run: `npm run format:check`
Expected: passes. If it fails on any of the files touched in this plan, run `npm run format` and review the diff before committing.

- [ ] **Step 5: Final commit (if formatting needed changes)**

```bash
git add -A
git commit -m "Format web-dev redesign files"
```

(Skip this step entirely if Step 4 already passed with no changes.)
