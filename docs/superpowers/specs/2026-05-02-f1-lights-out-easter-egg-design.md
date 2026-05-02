# F1 Lights-Out Easter Egg — Design

**Date:** 2026-05-02
**Status:** Draft, pending user review

## Motivation

Sarah's bio already mentions that she's "diving deep into the rabbit hole that is Formula 1." A small F1 easter egg gives the portfolio site a memorable, personality-revealing detail — the kind of thing a recruiter or curious visitor stumbles on and remembers. The trigger should be discoverable but not loud; the payoff should feel like a deliberate aesthetic choice, not a gimmick.

## Goals

- A recognizable F1 reference (the start-light reaction-time test) anyone familiar with the sport will immediately appreciate.
- A "site takeover" moment that's visually striking but easy to escape from.
- Self-contained — no new dependencies beyond a single Google Font; no framework added; safe to remove.
- Works on desktop and mobile.

## Non-goals

- Leaderboards, sharing, social integrations.
- Multi-round / best-of-N modes.
- Difficulty settings.
- A second easter egg surface (Konami code, hidden URL, etc.) — the architecture should not preclude these, but they're out of scope for this spec.

## User flow

1. Visitor scrolls to the footer and notices a small `🏁` glyph centered in the bottom bar — exactly between the copyright text on the left and "Built with Astro + Tailwind" on the right. The deliberate center placement is itself the clue: there's no obvious functional reason for a checkered flag to live there, which invites curiosity.
2. Hovering brightens the glyph; a `title="ready to race?"` tooltip hints at clickability.
3. Clicking dispatches a `lights-out:open` custom event on `window`.
4. A fullscreen overlay listens for that event and runs a "pixel takeover" animation: chunky black blocks rise from the bottom of the viewport in independent columns, fastest in the middle and slower at the edges, producing a naturally jagged leading edge. Total animation ~1.5s.
5. Once settled, the F1 light gantry fades in over the black background. The portfolio remains visible around the irregular pixel edges.
6. The visitor plays the lights-out reaction-time game (see Game mechanics).
7. Exit options: `X` button top-right, `Esc` key, or clicking on any visible portfolio area around the takeover. On exit, the pixel blocks rush back down (~600ms) and scroll position is restored.

## Visual design

### Pixel takeover

- Pixel "blocks" are pure black, ~24-32px square. Exact size finalized in implementation; pick a value that divides cleanly into common viewport widths.
- Animation: each column rises independently. The middle columns start first and fastest; columns toward the edges start later and rise more slowly. Within a column, blocks stack with a slight cascade (~80ms apart in the avalanche phase).
- The leading edge is naturally irregular during the rise. Once columns settle, the top edge stays slightly jagged (column heights differ by 1-3 blocks), so portfolio peeks through gaps and around the edges.
- A subtle scanline overlay (CSS `repeating-linear-gradient`) adds CRT flavor without cost.

### Game UI

- Pixel font: `Press Start to Play` from Google Fonts (one weight; preconnect added to `<head>`).
- Color palette inside the takeover deliberately departs from the site's sage/cream:
  - Background: pure black `#000`.
  - Lights when on: neon red `#ff1f1f`.
  - Text: cream `#FEFCF6` (the one tie back to site palette).
- Five horizontal "bulbs" laid out across the upper third of the takeover, sized for both viewports.
- `image-rendering: pixelated` and chunky borders reinforce the 8-bit feel.

### Controls overlay

- Top-right of the takeover: speaker icon (`🔇`/`🔊`) and `X` button. Both opaque so they stay readable over jagged pixel edges.
- Bottom of the screen during ready/results states: chunky pixel-button labels (`PRESS SPACE OR CLICK TO START`, `RACE AGAIN`, `EXIT`).

## Game mechanics

### States

`idle` → `arming` → `holding` → `live` → `result` → (back to `arming` or exit)
Plus `jumpStart` as an interrupt from `arming` or `holding` that returns to `idle` after a 2-second cooldown.

### Sequence

1. **idle** — ready screen, prompt visible. Game input (Space or click/tap inside the takeover) transitions to `arming`.
2. **arming** — lights begin turning on, one per ~1000ms, until all 5 are red. Game input here = jump start.
3. **holding** — random 200-3000ms delay with all 5 lit. Game input here = jump start.
4. **live** — all 5 lights extinguish simultaneously; timer starts. The next game input stops the timer and transitions to `result`.
5. **result** — display reaction time in big chunky type. Compare to localStorage `lightsOut.bestMs`:
   - If new best: `NEW PERSONAL BEST!` flash; save the new value.
   - Otherwise: `BEST: 241 MS` shown below the current time.
     Buttons: `RACE AGAIN` transitions directly to `arming` (auto-starts the next round, no need to "ready up" again). `EXIT` closes the overlay.

### Input zones

- Click/tap on the **black takeover area** = game input (start, react, jump-start trigger).
- Click/tap on **visible portfolio** around or through the pixel gaps = exit.
- Spacebar = game input only (never exits; `Esc` exits).

This zoning makes intent unambiguous — clicking the black is "I'm playing"; clicking the portfolio is "I'm done."

### Jump-start rule

Any game input during `arming` or `holding` triggers `jumpStart`:

- Red flash overlay (~150ms).
- Big text: `🚨 JUMP START 🚨`.
- 2-second forced cooldown — input ignored.
- Returns to `idle`.

This is faithful to the F1 rule; visitors familiar with the sport will recognize and appreciate it.

## Sound (opt-in)

- Speaker icon top-right toggles `lightsOut.soundEnabled` in localStorage. Default off.
- When enabled:
  - Each light coming on plays a short beep via Web Audio API (`OscillatorNode`).
  - Lights-out plays a lower beep.
  - No audio files shipped; tones are synthesized in-browser.
- AudioContext is created lazily on first toggle to avoid autoplay-policy issues.

## Architecture

### File layout

- `src/components/lights-out/LightsOut.astro` — the overlay component. Includes:
  - Markup for the takeover container, light gantry, prompt/result text, control buttons.
  - A single `<script>` block (vanilla TypeScript) implementing the state machine, animation, input handling, sound, and localStorage interaction.
- `src/components/layout/Footer.astro` — adds the `🏁` trigger button (centered in the bottom bar between the copyright and "Built with Astro + Tailwind") and dispatches `lights-out:open` on click. The bottom bar currently uses a 2-element `justify-between` flex; this becomes a 3-element layout with the flag in the middle. On the small breakpoint where the bar wraps to a column, the flag should still sit between the two text elements vertically.
- `src/layouts/BaseLayout.astro` — mounts `<LightsOut />` once, after the main content, so it's available on every page.

### Communication

- The footer trigger and the overlay communicate via a `window` custom event named `lights-out:open`.
- This decoupling means future triggers (Konami code, hidden URL, easter-egg-elsewhere) can dispatch the same event without touching the overlay component.

### Persistence

- `localStorage` keys (string-prefixed for clarity):
  - `lightsOut.bestMs` — number, milliseconds. Best reaction time across visits.
  - `lightsOut.soundEnabled` — `"true"` or `"false"`.
- Both are read defensively (try/catch and `Number.isFinite` check) so localStorage failures or tampering don't break the game.

### Why no framework

The site is Astro static + Tailwind. The game is small and self-contained. A vanilla TS `<script>` keeps the bundle lean and matches the existing project pattern. No React/Preact/Solid added.

### Why a single overlay (not a route)

The user explicitly chose "site takeover" rather than navigation away. A route would lose the "the portfolio is still there behind it" effect that the click-through-to-exit relies on.

## Accessibility

- The trigger glyph has an accessible label (`aria-label="Open F1 lights-out reaction game"`).
- The overlay is a `<dialog>` element (or `role="dialog"` with `aria-modal="true"`) so screen readers handle it correctly.
- `Esc` always exits.
- Focus is trapped inside the overlay while open and returned to the trigger on close.
- The takeover animation respects `prefers-reduced-motion`: if set, the takeover snaps in instantly (no rising-pixel animation), but the game itself still runs.
- All interactive elements have visible focus rings.
- The game requires reaction time and is therefore not playable by everyone — that's inherent to the concept. The site itself remains fully accessible; the easter egg is opt-in.

## Performance

- Press Start 2P loaded via Google Fonts with `font-display: swap` and a `<link rel="preconnect">` in `BaseLayout.astro`.
- The pixel takeover is rendered with CSS-animated divs (one per column or one per block, decided in implementation). No canvas. No images.
- Total added JS, gzipped: target < 5KB.
- The overlay markup is present in the DOM on every page but hidden via `display: none` until the event fires, so it has zero visual cost on initial paint.

## Out of scope

- Pixel-art SVG/PNG assets (DOM + CSS only).
- Leaderboards, sharing, score export.
- Multi-round / best-of-N.
- Difficulty modes.
- Additional easter-egg triggers (Konami, hidden URL).
- Mobile haptic feedback.
- Analytics / tracking on the easter egg.

## Open questions

None. All decisions are captured above.
