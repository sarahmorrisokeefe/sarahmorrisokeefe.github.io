# DevRel Consulting Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Link to `http://dx.okeefesarah.com/` from the personal site via a "Consulting ↗" header nav entry and a consulting callout card in the About section.

**Architecture:** Two isolated component edits — `Header.astro` gets an external nav link added to the `navLinks` array (with a new `external` flag handled in both desktop and mobile templates), and `About.astro` gets a full-width callout card appended below the existing two-column grid. No new files. No data layer changes.

**Tech Stack:** Astro 5, Tailwind CSS 3 (PostCSS), TypeScript

## Global Constraints

- Color palette: `sage` #5E6C5B / `sage-light` #849680 / `cream-alt` #F4EFE6 / `ink` #686867 — no new colors
- Dark mode via Tailwind `dark:` prefix (class strategy)
- All external links: `target="_blank" rel="noopener noreferrer"`
- Consulting URL: `http://dx.okeefesarah.com/` (exact, no trailing slash variations)
- Animation class: `fade-up` (defined in `src/styles/global.css`)
- No unit tests needed for these markup-only changes; verification is visual + build check

---

### Task 1: Header nav — "Consulting ↗" external link

**Files:**
- Modify: `src/components/layout/Header.astro`

**Interfaces:**
- Produces: a "Consulting ↗" link in both desktop nav and mobile dropdown that opens `http://dx.okeefesarah.com/` in a new tab

- [ ] **Step 1: Update the `navLinks` array to support an optional `external` flag**

Replace the existing `navLinks` declaration (lines 2–7 of the frontmatter) with:

```typescript
const navLinks: { href: string; label: string; external?: boolean }[] = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
  { href: 'http://dx.okeefesarah.com/', label: 'Consulting ↗', external: true },
];
```

(` ` is a non-breaking space between "Consulting" and "↗" so they never wrap onto separate lines.)

- [ ] **Step 2: Update the desktop nav `map` to conditionally add `target`/`rel`**

Find the desktop nav `navLinks.map(...)` block (inside `<div class="hidden md:flex ...">`) and replace it with:

```astro
{
  navLinks.map((link) => (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      class="text-sm font-medium text-ink dark:text-cream/70 hover:text-ink-dark dark:hover:text-cream transition-colors duration-200 relative group"
    >
      {link.label}
      <span class="absolute -bottom-0.5 left-0 w-0 h-px bg-sage group-hover:w-full transition-all duration-300" />
    </a>
  ))
}
```

- [ ] **Step 3: Update the mobile dropdown `map` the same way**

Find the mobile dropdown `navLinks.map(...)` block (inside `<div id="mobile-menu" ...>`) and replace it with:

```astro
{
  navLinks.map((link) => (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      class="mobile-nav-link text-sm font-medium text-ink dark:text-cream/70 hover:text-sage transition-colors py-1"
    >
      {link.label}
    </a>
  ))
}
```

Note: external links in the mobile menu intentionally keep the `mobile-nav-link` class — the click handler closes the menu before navigating, which is fine for external links too.

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: exits 0, no TypeScript or Astro errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.astro
git commit -m "feat: add Consulting nav link to header"
```

---

### Task 2: About section — consulting callout card

**Files:**
- Modify: `src/components/sections/About.astro`

**Interfaces:**
- Consumes: nothing from Task 1
- Produces: a styled callout card visible below the photo/bio grid in the About section

- [ ] **Step 1: Add the callout card below the grid**

In `src/components/sections/About.astro`, find the closing `</div>` that ends the two-column grid (the `<div class="grid md:grid-cols-2 ...">` block, around line 24). Insert the following block **after** that closing `</div>`, still inside the `<div class="max-w-5xl mx-auto">` container:

```astro
<!-- Consulting callout -->
<div class="mt-12 fade-up" style="transition-delay: 0.3s">
  <div class="border-l-4 border-sage bg-cream-alt dark:bg-ink rounded-r-xl p-6">
    <p class="text-xs font-medium tracking-widest uppercase text-sage dark:text-sage-light mb-3">
      Available for consulting
    </p>
    <p class="text-ink dark:text-cream/70 text-sm leading-relaxed mb-1">
      I work with companies building developer-facing products on developer
      relations strategy, documentation, and community.
    </p>
    <p class="text-ink dark:text-cream/70 text-sm leading-relaxed mb-5">
      If you're trying to earn developer trust and adoption, I'd love to talk.
    </p>
    <a
      href="http://dx.okeefesarah.com/"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 border border-sage/40 text-sage dark:text-sage-light hover:border-sage dark:hover:border-sage-light font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
    >
      See how I can help →
    </a>
  </div>
</div>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 3: Run dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:4321` and check:
- Header shows "Consulting ↗" after "Contact" in desktop nav and mobile menu
- Clicking "Consulting ↗" opens `http://dx.okeefesarah.com/` in a new tab
- About section shows the callout card below the photo/bio grid
- Card has left sage border, cream-alt background (light mode) / ink background (dark mode)
- "See how I can help →" button opens `http://dx.okeefesarah.com/` in a new tab
- Toggle dark mode — card and button colors switch correctly

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/About.astro
git commit -m "feat: add devrel consulting callout card to About section"
```
