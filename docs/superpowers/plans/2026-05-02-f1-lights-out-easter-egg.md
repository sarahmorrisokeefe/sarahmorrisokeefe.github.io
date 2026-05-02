# F1 Lights-Out Easter Egg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hidden F1 lights-out reaction-time game triggered by a centered checkered-flag glyph in the site footer, presented as a full-screen 8-bit pixel takeover.

**Architecture:** A single overlay component (`LightsOut.astro`) is mounted globally in `BaseLayout.astro`. Its imperative logic lives in vanilla TypeScript modules colocated with the component. The footer dispatches a `lights-out:open` custom event on `window` that the overlay listens for. Pure logic (state machine, localStorage helpers) is unit-tested with vitest; DOM/animation behavior is verified manually in the browser.

**Tech Stack:** Astro 6 (static), Tailwind CSS 3, vanilla TypeScript, Web Audio API, vitest (added by this plan), Press Start 2P from Google Fonts.

**Spec:** [docs/superpowers/specs/2026-05-02-f1-lights-out-easter-egg-design.md](../specs/2026-05-02-f1-lights-out-easter-egg-design.md)

---

## File structure

**New files:**

- `src/components/lights-out/LightsOut.astro` — overlay markup + thin script that boots the controller
- `src/components/lights-out/state.ts` — pure state-machine reducer (testable)
- `src/components/lights-out/storage.ts` — defensive localStorage helpers (testable)
- `src/components/lights-out/sound.ts` — Web Audio API tone generator
- `src/components/lights-out/controller.ts` — DOM wiring, animation, focus trap, lifecycle
- `src/components/lights-out/__tests__/state.test.ts` — vitest tests for the state machine
- `src/components/lights-out/__tests__/storage.test.ts` — vitest tests for storage helpers
- `vitest.config.ts` — vitest configuration

**Modified files:**

- `src/components/layout/Footer.astro` — add the centered `🏁` trigger button; restructure bottom bar to a 3-element layout
- `src/components/layout/BaseLayout.astro` — mount `<LightsOut />` once and add the `Press Start 2P` Google Fonts preconnect/stylesheet
- `package.json` — add `vitest` and `@vitest/ui` (optional) as devDependencies; add `test` and `test:watch` scripts

**Why this layout:** Logic that's worth testing (state machine, storage) is isolated in pure modules. DOM-bound code (animation, focus, audio) is in `controller.ts` — kept in one file so the orchestration is easy to follow. The component owns markup/styles only.

---

## Task 1: Add vitest test setup

**Files:**

- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Add vitest as a dev dependency**

Run:

```bash
npm install --save-dev vitest@^2.1.0 jsdom@^25.0.0
```

Expected: `package.json` updated, `package-lock.json` updated, `node_modules/vitest` exists.

- [ ] **Step 2: Add `test` scripts to package.json**

Edit `package.json` `"scripts"` block to add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

So the full scripts block becomes:

```json
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/__tests__/**/*.test.ts'],
    globals: false,
  },
});
```

- [ ] **Step 4: Verify vitest runs (no tests yet, so it should report "no tests found")**

Run: `npm test`

Expected: vitest starts, says something like "No test files found" with exit code 1, OR exits 0 with a "no tests" notice depending on version. Either is acceptable here — what matters is that the binary runs and the config loads without error.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "Add vitest for unit-testing the lights-out logic"
```

---

## Task 2: State machine module (TDD)

**Files:**

- Create: `src/components/lights-out/state.ts`
- Create: `src/components/lights-out/__tests__/state.test.ts`

The state machine is a pure reducer: `(context, event) → context`. The controller will own all timers and DOM; this module just describes valid transitions and computes derived values like `reactionMs`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/lights-out/__tests__/state.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { initialContext, reduce, type Context } from '../state';

describe('lights-out state machine', () => {
  const baseCtx: Context = initialContext({ bestMs: null });

  it('starts in idle', () => {
    expect(baseCtx.state).toBe('idle');
  });

  it('idle + INPUT transitions to arming', () => {
    const next = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    expect(next.state).toBe('arming');
  });

  it('arming + LIGHTS_ARMED transitions to holding', () => {
    const armed = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    const holding = reduce(armed, { type: 'LIGHTS_ARMED' });
    expect(holding.state).toBe('holding');
  });

  it('arming + INPUT transitions to jumpStart', () => {
    const armed = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    const jumped = reduce(armed, { type: 'INPUT', timestamp: 100 });
    expect(jumped.state).toBe('jumpStart');
  });

  it('holding + INPUT transitions to jumpStart', () => {
    let ctx = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 200 });
    expect(ctx.state).toBe('jumpStart');
  });

  it('holding + LIGHTS_OUT transitions to live and stores liveStartTime', () => {
    let ctx = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 1234 });
    expect(ctx.state).toBe('live');
    expect(ctx.liveStartTime).toBe(1234);
  });

  it('live + INPUT transitions to result and computes reactionMs', () => {
    let ctx = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 1000 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 1287 });
    expect(ctx.state).toBe('result');
    expect(ctx.reactionMs).toBe(287);
  });

  it('result with new best updates bestMs and flags isNewBest', () => {
    let ctx = reduce(initialContext({ bestMs: 500 }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 287 });
    expect(ctx.reactionMs).toBe(287);
    expect(ctx.bestMs).toBe(287);
    expect(ctx.isNewBest).toBe(true);
  });

  it('result with non-best keeps existing bestMs and clears isNewBest', () => {
    let ctx = reduce(initialContext({ bestMs: 200 }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 287 });
    expect(ctx.bestMs).toBe(200);
    expect(ctx.isNewBest).toBe(false);
  });

  it('result with no prior best treats first time as a new best', () => {
    let ctx = reduce(initialContext({ bestMs: null }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 287 });
    expect(ctx.bestMs).toBe(287);
    expect(ctx.isNewBest).toBe(true);
  });

  it('result + RACE_AGAIN transitions to arming and clears reactionMs', () => {
    let ctx = reduce(initialContext({ bestMs: null }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 287 });
    ctx = reduce(ctx, { type: 'RACE_AGAIN' });
    expect(ctx.state).toBe('arming');
    expect(ctx.reactionMs).toBe(null);
  });

  it('jumpStart + JUMP_START_RECOVERED returns to idle', () => {
    let ctx = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 100 });
    expect(ctx.state).toBe('jumpStart');
    ctx = reduce(ctx, { type: 'JUMP_START_RECOVERED' });
    expect(ctx.state).toBe('idle');
  });

  it('OPEN resets the context to idle while preserving bestMs', () => {
    let ctx = reduce(initialContext({ bestMs: 250 }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'OPEN' });
    expect(ctx.state).toBe('idle');
    expect(ctx.bestMs).toBe(250);
    expect(ctx.reactionMs).toBe(null);
    expect(ctx.liveStartTime).toBe(null);
    expect(ctx.isNewBest).toBe(false);
  });

  it('ignores irrelevant events without changing state', () => {
    const next = reduce(baseCtx, { type: 'LIGHTS_OUT', timestamp: 1000 });
    expect(next).toBe(baseCtx);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`

Expected: all tests fail with "Cannot find module '../state'" (or similar).

- [ ] **Step 3: Implement the state machine**

Create `src/components/lights-out/state.ts`:

```ts
export type State =
  | 'idle'
  | 'arming'
  | 'holding'
  | 'live'
  | 'result'
  | 'jumpStart';

export type GameEvent =
  | { type: 'OPEN' }
  | { type: 'INPUT'; timestamp: number }
  | { type: 'LIGHTS_ARMED' }
  | { type: 'LIGHTS_OUT'; timestamp: number }
  | { type: 'JUMP_START_RECOVERED' }
  | { type: 'RACE_AGAIN' };

export interface Context {
  state: State;
  liveStartTime: number | null;
  reactionMs: number | null;
  bestMs: number | null;
  isNewBest: boolean;
}

export function initialContext(opts: { bestMs: number | null }): Context {
  return {
    state: 'idle',
    liveStartTime: null,
    reactionMs: null,
    bestMs: opts.bestMs,
    isNewBest: false,
  };
}

export function reduce(ctx: Context, event: GameEvent): Context {
  switch (event.type) {
    case 'OPEN':
      return {
        ...ctx,
        state: 'idle',
        liveStartTime: null,
        reactionMs: null,
        isNewBest: false,
      };

    case 'INPUT':
      if (ctx.state === 'idle') {
        return { ...ctx, state: 'arming' };
      }
      if (ctx.state === 'arming' || ctx.state === 'holding') {
        return { ...ctx, state: 'jumpStart' };
      }
      if (ctx.state === 'live' && ctx.liveStartTime !== null) {
        const reactionMs = event.timestamp - ctx.liveStartTime;
        const isNewBest = ctx.bestMs === null || reactionMs < ctx.bestMs;
        return {
          ...ctx,
          state: 'result',
          reactionMs,
          isNewBest,
          bestMs: isNewBest ? reactionMs : ctx.bestMs,
        };
      }
      return ctx;

    case 'LIGHTS_ARMED':
      if (ctx.state === 'arming') {
        return { ...ctx, state: 'holding' };
      }
      return ctx;

    case 'LIGHTS_OUT':
      if (ctx.state === 'holding') {
        return { ...ctx, state: 'live', liveStartTime: event.timestamp };
      }
      return ctx;

    case 'JUMP_START_RECOVERED':
      if (ctx.state === 'jumpStart') {
        return { ...ctx, state: 'idle' };
      }
      return ctx;

    case 'RACE_AGAIN':
      if (ctx.state === 'result' || ctx.state === 'idle') {
        return { ...ctx, state: 'arming', reactionMs: null, liveStartTime: null, isNewBest: false };
      }
      return ctx;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`

Expected: all 13 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/lights-out/state.ts src/components/lights-out/__tests__/state.test.ts
git commit -m "Add lights-out state machine with unit tests"
```

---

## Task 3: localStorage helpers (TDD)

**Files:**

- Create: `src/components/lights-out/storage.ts`
- Create: `src/components/lights-out/__tests__/storage.test.ts`

Defensive helpers — must not crash if localStorage is unavailable, contains garbage, or is full.

- [ ] **Step 1: Write the failing tests**

Create `src/components/lights-out/__tests__/storage.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { readBestMs, writeBestMs, readSoundEnabled, writeSoundEnabled } from '../storage';

describe('lights-out storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('bestMs', () => {
    it('returns null when key is missing', () => {
      expect(readBestMs()).toBe(null);
    });

    it('returns null for non-numeric values', () => {
      localStorage.setItem('lightsOut.bestMs', 'not-a-number');
      expect(readBestMs()).toBe(null);
    });

    it('returns null for negative values', () => {
      localStorage.setItem('lightsOut.bestMs', '-5');
      expect(readBestMs()).toBe(null);
    });

    it('returns null for NaN', () => {
      localStorage.setItem('lightsOut.bestMs', 'NaN');
      expect(readBestMs()).toBe(null);
    });

    it('returns the stored number when valid', () => {
      localStorage.setItem('lightsOut.bestMs', '287');
      expect(readBestMs()).toBe(287);
    });

    it('round-trips a written value', () => {
      writeBestMs(241);
      expect(readBestMs()).toBe(241);
    });
  });

  describe('soundEnabled', () => {
    it('defaults to false when missing', () => {
      expect(readSoundEnabled()).toBe(false);
    });

    it('reads "true" as true', () => {
      localStorage.setItem('lightsOut.soundEnabled', 'true');
      expect(readSoundEnabled()).toBe(true);
    });

    it('reads anything else as false', () => {
      localStorage.setItem('lightsOut.soundEnabled', 'yes');
      expect(readSoundEnabled()).toBe(false);
    });

    it('round-trips a written boolean', () => {
      writeSoundEnabled(true);
      expect(readSoundEnabled()).toBe(true);
      writeSoundEnabled(false);
      expect(readSoundEnabled()).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`

Expected: all 10 tests fail (module not found).

- [ ] **Step 3: Implement the storage helpers**

Create `src/components/lights-out/storage.ts`:

```ts
const KEY_BEST_MS = 'lightsOut.bestMs';
const KEY_SOUND_ENABLED = 'lightsOut.soundEnabled';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable or full; ignore.
  }
}

export function readBestMs(): number | null {
  const raw = safeGet(KEY_BEST_MS);
  if (raw === null) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

export function writeBestMs(ms: number): void {
  if (!Number.isFinite(ms) || ms < 0) return;
  safeSet(KEY_BEST_MS, String(ms));
}

export function readSoundEnabled(): boolean {
  return safeGet(KEY_SOUND_ENABLED) === 'true';
}

export function writeSoundEnabled(enabled: boolean): void {
  safeSet(KEY_SOUND_ENABLED, enabled ? 'true' : 'false');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`

Expected: all 23 tests (13 from Task 2 + 10 new) pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/lights-out/storage.ts src/components/lights-out/__tests__/storage.test.ts
git commit -m "Add defensive localStorage helpers for lights-out"
```

---

## Task 4: Sound module

**Files:**

- Create: `src/components/lights-out/sound.ts`

The sound module is small, hard to unit test (Web Audio is an oral DOM API), and called from a single place. We skip TDD here and rely on manual verification.

- [ ] **Step 1: Implement the sound module**

Create `src/components/lights-out/sound.ts`:

```ts
let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

function playTone(frequency: number, durationMs: number): void {
  const audio = getContext();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(frequency, audio.currentTime);

  // Quick attack/decay envelope to avoid clicks
  gain.gain.setValueAtTime(0, audio.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, audio.currentTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, audio.currentTime + durationMs / 1000);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + durationMs / 1000);
}

/** Higher beep played as each light turns on. */
export function playLightOn(): void {
  playTone(880, 120);
}

/** Lower, longer beep played when all lights extinguish. */
export function playLightsOut(): void {
  playTone(440, 250);
}

/** Resume the AudioContext after a user gesture (required by browser autoplay policy). */
export function resumeAudio(): void {
  const audio = getContext();
  if (audio && audio.state === 'suspended') {
    void audio.resume();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/lights-out/sound.ts
git commit -m "Add Web Audio tone generator for lights-out sound"
```

---

## Task 5: Overlay markup and styles

**Files:**

- Create: `src/components/lights-out/LightsOut.astro`

This task creates the static markup and scoped styles. The controller (Task 6) will populate the column container, attach listeners, and run animations.

- [ ] **Step 1: Create the component**

Create `src/components/lights-out/LightsOut.astro`:

```astro
---
// Overlay for the F1 lights-out easter egg.
// Mounted once globally in BaseLayout.astro. Hidden until the
// 'lights-out:open' custom event is dispatched on `window`.
---

<div
  class="lights-out"
  data-state="closed"
  role="dialog"
  aria-modal="true"
  aria-label="F1 lights-out reaction game"
  aria-hidden="true"
  hidden
>
  <!-- Pixel takeover columns are populated by the controller -->
  <div class="lights-out__pixels" data-pixels></div>

  <!-- Game UI sits above the pixel takeover -->
  <div class="lights-out__ui">
    <div class="lights-out__top-bar">
      <button
        type="button"
        class="lights-out__icon-btn"
        data-sound-toggle
        aria-label="Toggle sound"
      >🔇</button>
      <button
        type="button"
        class="lights-out__icon-btn"
        data-close
        aria-label="Exit game"
      >✕</button>
    </div>

    <div class="lights-out__gantry" data-gantry>
      <span class="lights-out__bulb" data-bulb="0"></span>
      <span class="lights-out__bulb" data-bulb="1"></span>
      <span class="lights-out__bulb" data-bulb="2"></span>
      <span class="lights-out__bulb" data-bulb="3"></span>
      <span class="lights-out__bulb" data-bulb="4"></span>
    </div>

    <div class="lights-out__message" data-message aria-live="polite">
      PRESS SPACE OR CLICK TO START
    </div>

    <div class="lights-out__result" data-result hidden>
      <div class="lights-out__time" data-time>0 MS</div>
      <div class="lights-out__best" data-best></div>
      <div class="lights-out__buttons">
        <button type="button" class="lights-out__btn" data-race-again>RACE AGAIN</button>
        <button type="button" class="lights-out__btn" data-exit>EXIT</button>
      </div>
    </div>
  </div>
</div>

<script>
  import { mount } from './controller';
  mount();
</script>

<style is:global>
  .lights-out {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    font-family: 'Press Start 2P', system-ui, monospace;
    color: #fefcf6;
  }

  .lights-out[data-state='open'],
  .lights-out[data-state='opening'],
  .lights-out[data-state='closing'] {
    pointer-events: auto;
  }

  /* The pixel-block takeover layer */
  .lights-out__pixels {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .lights-out__pixel-col {
    position: absolute;
    bottom: 0;
    width: var(--col-width, 28px);
    height: var(--col-height, 120vh);
    background: #000;
    transform: translateY(100%);
    transition: transform var(--rise-duration, 1500ms) cubic-bezier(0.4, 0, 0.6, 1)
      var(--rise-delay, 0ms);
  }

  .lights-out[data-state='open'] .lights-out__pixel-col,
  .lights-out[data-state='opening'] .lights-out__pixel-col {
    transform: translateY(var(--col-rest-offset, 0));
  }

  /* Subtle scanlines over the takeover */
  .lights-out__pixels::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.02) 0,
      rgba(255, 255, 255, 0.02) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
  }

  /* UI layer — transparent to clicks except on its actual content,
     so clicks pass through empty UI areas to the pixel/gap layer below.
     Without this, the full-bleed UI container would absorb every click. */
  .lights-out__ui {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    opacity: 0;
    transition: opacity 250ms ease 800ms;
    pointer-events: none;
  }

  .lights-out__top-bar,
  .lights-out__gantry,
  .lights-out__message,
  .lights-out__result {
    pointer-events: auto;
  }

  .lights-out[data-state='open'] .lights-out__ui {
    opacity: 1;
  }

  .lights-out__top-bar {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.75rem;
  }

  .lights-out__icon-btn {
    background: #000;
    color: #fefcf6;
    border: 2px solid #fefcf6;
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
    cursor: pointer;
    image-rendering: pixelated;
  }

  .lights-out__icon-btn:focus-visible {
    outline: 2px solid #ff1f1f;
    outline-offset: 2px;
  }

  .lights-out__gantry {
    display: flex;
    gap: 1.25rem;
  }

  .lights-out__bulb {
    width: 56px;
    height: 56px;
    border: 4px solid #2a0606;
    background: #1a0303;
    box-shadow: inset 0 0 0 4px #000;
    image-rendering: pixelated;
  }

  .lights-out__bulb[data-on='true'] {
    background: #ff1f1f;
    border-color: #ff5555;
    box-shadow:
      inset 0 0 0 4px #b71010,
      0 0 24px rgba(255, 31, 31, 0.7);
  }

  .lights-out__message {
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-align: center;
    padding: 0 1rem;
  }

  .lights-out__result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .lights-out__time {
    font-size: 2.5rem;
  }

  .lights-out__time[data-new-best='true'] {
    color: #ff1f1f;
  }

  .lights-out__best {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: rgba(254, 252, 246, 0.6);
    min-height: 1em;
  }

  .lights-out__buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .lights-out__btn {
    background: #000;
    color: #fefcf6;
    border: 4px solid #fefcf6;
    padding: 0.75rem 1.25rem;
    font-family: inherit;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    cursor: pointer;
    image-rendering: pixelated;
  }

  .lights-out__btn:hover,
  .lights-out__btn:focus-visible {
    background: #fefcf6;
    color: #000;
    outline: none;
  }

  /* Jump-start flash */
  .lights-out__pixels[data-jump-start='true']::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 31, 31, 0.45);
    animation: lights-out-flash 150ms ease-out;
  }

  @keyframes lights-out-flash {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  /* Reduced motion: snap takeover in instantly */
  @media (prefers-reduced-motion: reduce) {
    .lights-out__pixel-col {
      transition: none !important;
    }
    .lights-out__ui {
      transition: none !important;
    }
  }

  @media (max-width: 640px) {
    .lights-out__bulb { width: 40px; height: 40px; }
    .lights-out__gantry { gap: 0.75rem; }
    .lights-out__time { font-size: 1.75rem; }
  }
</style>
```

- [ ] **Step 2: Format the file with Prettier**

Run: `npx prettier --write src/components/lights-out/LightsOut.astro`

Expected: file formatted in place. (Skipping a build/typecheck here because the controller doesn't exist yet, which would fail the import. The next task implements the controller; we'll verify the full integration in Task 8.)

- [ ] **Step 3: Commit**

```bash
git add src/components/lights-out/LightsOut.astro
git commit -m "Add lights-out overlay markup and styles"
```

---

## Task 6: Controller (DOM wiring, animation, focus)

**Files:**

- Create: `src/components/lights-out/controller.ts`

This is the largest module. It owns the runtime: opening/closing, the rising-pixel animation, ticking through the light sequence, capturing input, trapping focus, and swapping the result UI in/out.

- [ ] **Step 1: Implement the controller**

Create `src/components/lights-out/controller.ts`:

```ts
import { initialContext, reduce, type Context, type GameEvent } from './state';
import { readBestMs, writeBestMs, readSoundEnabled, writeSoundEnabled } from './storage';
import { playLightOn, playLightsOut, resumeAudio } from './sound';

const PIXEL_BLOCK_PX = 28;
const LIGHT_INTERVAL_MS = 1000;
const HOLD_MIN_MS = 200;
const HOLD_MAX_MS = 3000;
const JUMP_START_COOLDOWN_MS = 2000;
const NUM_LIGHTS = 5;

type Refs = {
  root: HTMLElement;
  pixels: HTMLElement;
  bulbs: HTMLElement[];
  message: HTMLElement;
  result: HTMLElement;
  time: HTMLElement;
  best: HTMLElement;
  raceAgain: HTMLButtonElement;
  exit: HTMLButtonElement;
  closeBtn: HTMLButtonElement;
  soundToggle: HTMLButtonElement;
};

type Runtime = {
  refs: Refs;
  ctx: Context;
  soundEnabled: boolean;
  triggerEl: HTMLElement | null;
  // Pending timers — must be cleared on close to avoid leaks.
  armingTimers: number[];
  holdTimer: number | null;
  jumpStartTimer: number | null;
};

let runtime: Runtime | null = null;

export function mount(): void {
  if (runtime) return;
  if (typeof document === 'undefined') return;

  const root = document.querySelector<HTMLElement>('.lights-out');
  if (!root) return;

  const refs = collectRefs(root);
  const soundEnabled = readSoundEnabled();
  refs.soundToggle.textContent = soundEnabled ? '🔊' : '🔇';

  runtime = {
    refs,
    ctx: initialContext({ bestMs: readBestMs() }),
    soundEnabled,
    triggerEl: null,
    armingTimers: [],
    holdTimer: null,
    jumpStartTimer: null,
  };

  attachListeners(runtime);
}

function collectRefs(root: HTMLElement): Refs {
  const q = <T extends HTMLElement = HTMLElement>(sel: string): T => {
    const el = root.querySelector<T>(sel);
    if (!el) throw new Error(`lights-out: missing element ${sel}`);
    return el;
  };

  const bulbs: HTMLElement[] = [];
  for (let i = 0; i < NUM_LIGHTS; i++) {
    bulbs.push(q<HTMLElement>(`[data-bulb="${i}"]`));
  }

  return {
    root,
    pixels: q('[data-pixels]'),
    bulbs,
    message: q('[data-message]'),
    result: q('[data-result]'),
    time: q('[data-time]'),
    best: q('[data-best]'),
    raceAgain: q<HTMLButtonElement>('[data-race-again]'),
    exit: q<HTMLButtonElement>('[data-exit]'),
    closeBtn: q<HTMLButtonElement>('[data-close]'),
    soundToggle: q<HTMLButtonElement>('[data-sound-toggle]'),
  };
}

function attachListeners(rt: Runtime): void {
  window.addEventListener('lights-out:open', (event) => {
    const trigger = (event as CustomEvent<{ trigger?: HTMLElement }>).detail?.trigger ?? null;
    open(rt, trigger);
  });

  rt.refs.closeBtn.addEventListener('click', () => close(rt));
  rt.refs.exit.addEventListener('click', () => close(rt));
  rt.refs.raceAgain.addEventListener('click', () => {
    dispatch(rt, { type: 'RACE_AGAIN' });
  });

  rt.refs.soundToggle.addEventListener('click', () => {
    rt.soundEnabled = !rt.soundEnabled;
    writeSoundEnabled(rt.soundEnabled);
    rt.refs.soundToggle.textContent = rt.soundEnabled ? '🔊' : '🔇';
    if (rt.soundEnabled) resumeAudio();
  });

  rt.refs.root.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target.closest('button')) return; // buttons handle themselves

    // Click landed on a black pixel column or a UI content area = game input.
    if (
      e.target.closest('.lights-out__pixel-col') ||
      e.target.closest('.lights-out__gantry') ||
      e.target.closest('.lights-out__message') ||
      e.target.closest('.lights-out__result')
    ) {
      dispatch(rt, { type: 'INPUT', timestamp: performance.now() });
      return;
    }

    // Anything else — i.e. the transparent gaps in `.lights-out__pixels`
    // where the portfolio shows through — counts as exit.
    close(rt);
  });

  document.addEventListener('keydown', (e) => {
    if (rt.refs.root.dataset.state !== 'open') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close(rt);
      return;
    }
    if (e.key === 'Tab') {
      const focusable = getFocusable(rt);
      if (focusable.length === 0) return;
      e.preventDefault();
      const current = document.activeElement;
      const idx = focusable.indexOf(current as HTMLElement);
      const next = e.shiftKey
        ? focusable[idx <= 0 ? focusable.length - 1 : idx - 1]
        : focusable[idx === -1 || idx === focusable.length - 1 ? 0 : idx + 1];
      next.focus();
      return;
    }
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      dispatch(rt, { type: 'INPUT', timestamp: performance.now() });
    }
  });
}

function getFocusable(rt: Runtime): HTMLElement[] {
  // Returns the overlay's currently visible interactive elements, in tab order.
  // `offsetParent === null` means the element (or an ancestor) is hidden,
  // which correctly excludes RACE AGAIN / EXIT while the result panel is hidden.
  const candidates: HTMLElement[] = [
    rt.refs.soundToggle,
    rt.refs.closeBtn,
    rt.refs.raceAgain,
    rt.refs.exit,
  ];
  return candidates.filter((el) => el.offsetParent !== null);
}

function open(rt: Runtime, trigger: HTMLElement | null): void {
  rt.triggerEl = trigger;
  rt.refs.root.hidden = false;
  rt.refs.root.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  buildPixels(rt);
  rt.refs.root.dataset.state = 'opening';
  // Force a reflow so the transition runs from the initial position.
  void rt.refs.root.offsetWidth;
  rt.refs.root.dataset.state = 'open';

  dispatch(rt, { type: 'OPEN' });

  // Move focus into the overlay (close button is a safe initial target).
  setTimeout(() => rt.refs.closeBtn.focus(), 50);
}

function close(rt: Runtime): void {
  clearAllTimers(rt);
  rt.refs.root.dataset.state = 'closing';

  // Reverse animation: pixels slide back down by clearing the rest offset.
  for (const col of Array.from(rt.refs.pixels.children) as HTMLElement[]) {
    col.style.setProperty('--rise-duration', '600ms');
    col.style.setProperty('--rise-delay', '0ms');
  }
  // Force reflow then remove the open data-state to trigger transition.
  void rt.refs.root.offsetWidth;
  rt.refs.root.dataset.state = 'closed';

  setTimeout(() => {
    rt.refs.root.hidden = true;
    rt.refs.root.setAttribute('aria-hidden', 'true');
    rt.refs.pixels.replaceChildren();
    document.body.style.overflow = '';
    if (rt.triggerEl) rt.triggerEl.focus();
  }, 650);
}

function buildPixels(rt: Runtime): void {
  rt.refs.pixels.replaceChildren();
  const colCount = Math.ceil(window.innerWidth / PIXEL_BLOCK_PX) + 1;
  const center = (colCount - 1) / 2;
  const maxDistance = center;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < colCount; i++) {
    const col = document.createElement('div');
    col.className = 'lights-out__pixel-col';
    const distance = Math.abs(i - center) / maxDistance; // 0 in middle, 1 at edges
    const delay = Math.round(distance * 600); // 0–600ms
    const duration = Math.round(900 + distance * 600); // 900–1500ms
    const restOffset = -(Math.floor(Math.random() * 4) * 6); // 0, -6, -12, -18 px
    col.style.setProperty('--col-width', `${PIXEL_BLOCK_PX}px`);
    col.style.setProperty('--rise-delay', `${delay}ms`);
    col.style.setProperty('--rise-duration', `${duration}ms`);
    col.style.setProperty('--col-rest-offset', `${restOffset}px`);
    col.style.left = `${i * PIXEL_BLOCK_PX}px`;
    frag.appendChild(col);
  }
  rt.refs.pixels.appendChild(frag);
}

function dispatch(rt: Runtime, event: GameEvent): void {
  const prev = rt.ctx;
  rt.ctx = reduce(rt.ctx, event);
  if (rt.ctx === prev) return;
  applyState(rt);
}

function applyState(rt: Runtime): void {
  const { ctx, refs } = rt;

  switch (ctx.state) {
    case 'idle':
      clearAllTimers(rt);
      refs.bulbs.forEach((b) => (b.dataset.on = 'false'));
      refs.message.textContent = 'PRESS SPACE OR CLICK TO START';
      refs.message.hidden = false;
      refs.result.hidden = true;
      refs.pixels.dataset.jumpStart = 'false';
      break;

    case 'arming':
      refs.message.textContent = 'GET READY';
      refs.result.hidden = true;
      refs.bulbs.forEach((b) => (b.dataset.on = 'false'));
      runArming(rt);
      break;

    case 'holding':
      runHolding(rt);
      break;

    case 'live':
      // All lights extinguish; visual handled in runHolding's lights-out callback.
      refs.message.textContent = 'GO!';
      break;

    case 'result':
      showResult(rt);
      break;

    case 'jumpStart':
      refs.pixels.dataset.jumpStart = 'true';
      refs.bulbs.forEach((b) => (b.dataset.on = 'false'));
      refs.message.textContent = '🚨 JUMP START 🚨';
      refs.result.hidden = true;
      clearAllTimers(rt);
      rt.jumpStartTimer = window.setTimeout(() => {
        refs.pixels.dataset.jumpStart = 'false';
        dispatch(rt, { type: 'JUMP_START_RECOVERED' });
      }, JUMP_START_COOLDOWN_MS);
      break;
  }
}

function runArming(rt: Runtime): void {
  clearAllTimers(rt);
  for (let i = 0; i < NUM_LIGHTS; i++) {
    const t = window.setTimeout(
      () => {
        if (rt.ctx.state !== 'arming') return;
        rt.refs.bulbs[i].dataset.on = 'true';
        if (rt.soundEnabled) playLightOn();
        if (i === NUM_LIGHTS - 1) {
          dispatch(rt, { type: 'LIGHTS_ARMED' });
        }
      },
      LIGHT_INTERVAL_MS * (i + 1),
    );
    rt.armingTimers.push(t);
  }
}

function runHolding(rt: Runtime): void {
  const delay = HOLD_MIN_MS + Math.random() * (HOLD_MAX_MS - HOLD_MIN_MS);
  rt.holdTimer = window.setTimeout(() => {
    if (rt.ctx.state !== 'holding') return;
    rt.refs.bulbs.forEach((b) => (b.dataset.on = 'false'));
    if (rt.soundEnabled) playLightsOut();
    dispatch(rt, { type: 'LIGHTS_OUT', timestamp: performance.now() });
  }, delay);
}

function showResult(rt: Runtime): void {
  const { ctx, refs } = rt;
  if (ctx.reactionMs === null) return;

  refs.message.hidden = true;
  refs.result.hidden = false;
  refs.time.textContent = `${Math.round(ctx.reactionMs)} MS`;
  refs.time.dataset.newBest = ctx.isNewBest ? 'true' : 'false';

  if (ctx.isNewBest) {
    refs.best.textContent = 'NEW PERSONAL BEST!';
    if (ctx.bestMs !== null) writeBestMs(Math.round(ctx.bestMs));
  } else if (ctx.bestMs !== null) {
    refs.best.textContent = `BEST: ${Math.round(ctx.bestMs)} MS`;
  } else {
    refs.best.textContent = '';
  }

  refs.raceAgain.focus();
}

function clearAllTimers(rt: Runtime): void {
  rt.armingTimers.forEach((t) => clearTimeout(t));
  rt.armingTimers = [];
  if (rt.holdTimer !== null) {
    clearTimeout(rt.holdTimer);
    rt.holdTimer = null;
  }
  if (rt.jumpStartTimer !== null) {
    clearTimeout(rt.jumpStartTimer);
    rt.jumpStartTimer = null;
  }
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run build 2>&1 | tail -30`

Expected: build succeeds with no TypeScript errors and `dist/` is produced. Astro's build pipeline runs the type checker over `.astro` and `.ts` files.

- [ ] **Step 3: Commit**

```bash
git add src/components/lights-out/controller.ts
git commit -m "Add lights-out controller wiring DOM, animation, focus"
```

---

## Task 7: Footer trigger (centered checkered flag)

**Files:**

- Modify: `src/components/layout/Footer.astro`

The current bottom bar uses a 2-element `justify-between` flex. We restructure it to a 3-element layout with the flag in the middle. On the small breakpoint where the bar wraps to a column, the flag stays between the two text elements.

- [ ] **Step 1: Read the current footer**

Run: `cat src/components/layout/Footer.astro`

Expected: file contents matching the spec context.

- [ ] **Step 2: Replace the bottom bar with a 3-element layout**

Edit `src/components/layout/Footer.astro`. Replace the current `<!-- Bottom bar -->` block with:

```astro
    <!-- Bottom bar -->
    <div
      class="mt-10 pt-6 border-t border-cream/10 flex flex-col sm:flex-row sm:justify-between items-center gap-2 text-cream/30 text-xs"
    >
      <p class="order-1">© {currentYear} {personalInfo.name}. All rights reserved.</p>

      <button
        type="button"
        class="lights-out-trigger order-2 text-cream/30 hover:text-cream focus-visible:text-cream transition-colors duration-200"
        aria-label="Open F1 lights-out reaction game"
        title="ready to race?"
      >
        <span aria-hidden="true">🏁</span>
      </button>

      <p class="order-3">Built with Astro + Tailwind.</p>
    </div>
```

- [ ] **Step 3: Add the trigger script at the end of the file**

After the closing `</footer>` tag, append:

```astro
<script>
  document.querySelectorAll<HTMLButtonElement>('.lights-out-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.dispatchEvent(
        new CustomEvent('lights-out:open', { detail: { trigger: btn } }),
      );
    });
  });
</script>
```

- [ ] **Step 4: Verify the footer builds**

Run: `npm run build 2>&1 | tail -20`

Expected: build succeeds. The footer trigger is wired but the overlay isn't mounted yet (that's Task 8) — clicking the flag in dev would dispatch an event no one is listening for, which is harmless.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "Add centered checkered-flag trigger to footer"
```

---

## Task 8: BaseLayout integration

**Files:**

- Modify: `src/components/layout/BaseLayout.astro`

Mount the overlay component once and add the Press Start 2P stylesheet.

- [ ] **Step 1: Add the import for LightsOut**

Edit `src/components/layout/BaseLayout.astro`. In the frontmatter (between the `---` fences), below the existing `import` line, add:

```astro
import LightsOut from '../lights-out/LightsOut.astro';
```

So the frontmatter becomes:

```astro
---
import '../../styles/global.css';
import LightsOut from '../lights-out/LightsOut.astro';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Sarah O'Keefe — Front-End Engineer",
  description =
    "Front-end software engineer based in Charlotte, NC. Building things with React and TypeScript at iHeartRadio.",
} = Astro.props;
---
```

- [ ] **Step 2: Add `Press Start 2P` to the existing Google Fonts stylesheet link**

Find the existing line:

```astro
<link
  href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

Replace it with:

```astro
<link
  href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=Press+Start+2P&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 3: Mount the overlay after the slot**

Inside the `<body>`, replace:

```astro
<body>
  <slot />
</body>
```

with:

```astro
<body>
  <slot />
  <LightsOut />
</body>
```

- [ ] **Step 4: Verify the integrated layout builds**

Run: `npm run build 2>&1 | tail -20`

Expected: build succeeds, `dist/` produced, no TypeScript errors. This is the first end-to-end verification that everything wires together.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/BaseLayout.astro
git commit -m "Mount lights-out overlay globally and load Press Start 2P"
```

---

## Task 9: Manual smoke test

This task is hands-on in the browser. Document any issues found and fix before the final commit.

- [ ] **Step 1: Run dev server**

Run: `npm run dev`

Open the URL printed (usually http://localhost:4321).

- [ ] **Step 2: Verify the trigger glyph**

- Scroll to the footer.
- The `🏁` glyph should sit exactly between the copyright (left) and "Built with Astro + Tailwind" (right) on desktop.
- On a narrow viewport (< 640px), the bar wraps; the flag should be the middle of the three vertically stacked items.
- Hovering should brighten the flag from `cream/30` to `cream`.
- The browser tooltip should read "ready to race?".

- [ ] **Step 3: Verify the takeover animation**

- Click the flag.
- Black columns should rise from the bottom of the viewport: middle columns first/fastest, edge columns slower. Total ~1.5s.
- After settling, the top edge should be slightly jagged (some columns visibly shorter than others).
- The portfolio should remain visible around the irregular edges.
- The light gantry and prompt should fade in.

- [ ] **Step 4: Play a clean round**

- Press Space (or click anywhere on the black area). Lights should turn on one per ~1s.
- After all 5 are lit, wait the random hold (200–3000ms).
- All lights extinguish simultaneously. Press Space.
- Result should display in `<reaction>ms` form, with `BEST: <ms> MS` below (or `NEW PERSONAL BEST!` flash if the first round).

- [ ] **Step 5: Verify the jump-start rule**

- Reload, click the flag, click anywhere on the black area to start, then click again before all 5 lights extinguish.
- Expected: red flash, `🚨 JUMP START 🚨` message, ~2s cooldown, then back to the ready state.

- [ ] **Step 6: Verify exit options**

- `Esc` key closes the overlay; the pixel columns rush back down.
- The `X` button closes the overlay.
- Clicking on visible portfolio area (around the pixel edges) closes the overlay.
- Focus returns to the flag in the footer after closing.

- [ ] **Step 7: Verify sound toggle**

- Click the speaker icon in the top-right. It should switch from 🔇 to 🔊.
- Play a round — beeps on each light, lower beep on lights-out.
- Reload the page, open the overlay; sound should still be enabled (localStorage persisted).
- Toggle off and reload to confirm the off state persists too.

- [ ] **Step 8: Verify persistence**

- After the first round, `localStorage` should contain `lightsOut.bestMs` with your time.
- Open dev tools → Application → Local Storage. Confirm.
- Reload, play another round slower than the best; the displayed `BEST:` should still match your earlier best.

- [ ] **Step 9: Verify accessibility**

- Tab through the page; the flag should be reachable in the footer with a visible focus ring.
- Inside the overlay, Tab should cycle between the sound toggle, close button, race-again, and exit buttons (focus trap).
- Try `prefers-reduced-motion: reduce` (DevTools → Rendering → Emulate CSS media feature). Reload and open the overlay — the takeover should snap in instantly without the rising animation.

- [ ] **Step 10: Verify mobile behavior**

- Open DevTools, toggle device emulation to a phone profile.
- The takeover should still work; the X button should be reachable; tap-to-react should work.

- [ ] **Step 11: Note any issues found**

If any of the above fail, fix in the relevant module before continuing. Common likely issues:

- The flag center alignment on `flex-col` (small viewport): check `order-1/2/3` rendering.
- Animation feels too fast or slow: tune `LIGHT_INTERVAL_MS`, `HOLD_MIN_MS`, `HOLD_MAX_MS`, `--rise-duration` in `controller.ts` / styles.
- Pixel column count off by one or columns visible past the right edge: check `colCount` calculation in `buildPixels`.

- [ ] **Step 12: Commit any fixes**

```bash
git add -p
git commit -m "Polish lights-out: <describe fix>"
```

---

## Task 10: Final verification before PR

- [ ] **Step 1: Run the full test suite**

Run: `npm test`

Expected: all 23 tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: build succeeds, `dist/` produced, no warnings about missing modules.

- [ ] **Step 3: Run Prettier**

Run: `npm run format:check`

If anything fails, run: `npm run format` and commit any formatting changes.

- [ ] **Step 4: Sanity-check commit history**

Run: `git log --oneline origin/master..HEAD`

Expected: a clean sequence of 8–10 commits, one per task.

- [ ] **Step 5: Push the branch**

Run: `git push -u origin feat/f1-easter-egg`

(Only when the user has confirmed they're ready to push — do not push without confirmation.)

---

## Self-review notes

This plan covers each section of the spec:

- **Trigger:** Task 7 (centered flag) + Task 8 (mount).
- **Site takeover:** Task 5 (markup/styles) + Task 6 (build/animate columns).
- **Game flow:** Task 2 (state machine) + Task 6 (controller wiring lights, hold, result).
- **Jump-start rule:** Task 2 (state) + Task 6 (`runArming`/`applyState 'jumpStart'` branch).
- **Sound:** Task 4 (module) + Task 6 (toggle wiring) + Task 3 (persistence).
- **Visuals:** Task 5 (CSS).
- **Architecture:** Tasks 2/3/4/6/8 wire it together via the `lights-out:open` event.
- **Accessibility:** Task 5 (`role="dialog"`, `aria-modal`, `aria-label`, focus rings) + Task 6 (Esc, focus management, `prefers-reduced-motion` respected via CSS).
- **Performance:** Task 8 (font preconnect existed, `display=swap` query already present).

**Out of scope (per spec):** leaderboards, multi-round, difficulty modes, additional triggers, mobile haptics, analytics. None added.
