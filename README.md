# sarahmorrisokeefe.github.io

Personal site for Sarah O'Keefe — bio, project portfolio, writing teasers, and contact.
Live at [www.okeefesarah.com](https://www.okeefesarah.com).

## Stack

- [Astro 6](https://astro.build) — static output
- [Tailwind CSS 3](https://tailwindcss.com) — via PostCSS (no `@astrojs/tailwind` integration)
- TypeScript
- Deployed on [Vercel](https://vercel.com) with auto-deploy on push to `master`

## Local development

Requires Node 20 or newer.

```bash
npm install
npm run dev      # Astro dev server at http://localhost:4321
npm run build    # static build to dist/
npm run preview  # preview the built site
```

## Project layout

```
src/
├── components/
│   ├── layout/      # BaseLayout, Header, Footer
│   ├── sections/    # Hero, About, Projects, Writing, Contact
│   └── ui/          # ProjectCard, PostCard, SocialIcon, etc.
├── data/            # Content as TypeScript modules — edit these to change site content
│   ├── personalInfo.ts
│   ├── projects.ts
│   └── posts.ts
├── pages/
│   └── index.astro  # The single page; composes the section components
└── styles/
    └── global.css   # Tailwind directives + custom utilities (fade-up, scroll-margin, etc.)

postcss.config.cjs   # PostCSS pipeline (tailwindcss + autoprefixer)
tailwind.config.mjs  # Theme tokens, dark mode, typography plugin
astro.config.mjs     # Astro config (output: 'static')
```

## Editing content

Most "what's on the site" lives in `src/data/`:

- `personalInfo.ts` — name, tagline, bio paragraphs, social links, email
- `projects.ts` — portfolio entries (set `featured: true` to put one in the large top card)
- `posts.ts` — writing teasers that link out to [blog.okeefesarah.com](https://blog.okeefesarah.com)

For copy in the hero or section headings, edit the relevant component in `src/components/sections/`.

## Features worth knowing about

- **Dark mode** — class-based, toggled in `Header.astro` and persisted in `localStorage`. A small inline script in `BaseLayout.astro` applies the saved theme before first paint to avoid a flash.
- **Scroll-triggered fade-up animations** — `IntersectionObserver` script in `pages/index.astro` adds a `visible` class to elements with `.fade-up` or `.fade-up-stagger` classes; CSS for those lives in `global.css`.
- **Smooth in-page scrolling** — `scroll-behavior: smooth` on `<html>` plus `scroll-margin-top: 5rem` on every `<section id>` so anchor navigation lands below the fixed header.
- **RelMeAuth-ready** — social links in the footer carry `rel="me"` for [IndieAuth](https://indieweb.org/IndieAuth) web sign-in.

## Deployment

Vercel watches `master` and deploys on every push. Preview deployments are created for every PR.

DNS for `www.okeefesarah.com` is configured to point at Vercel.

## Legacy

The original static-HTML version of the site lives in [`legacy/`](./legacy) for archival purposes. Not used by the build.

## License

ISC
