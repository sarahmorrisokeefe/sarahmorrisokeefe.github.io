import { track } from '@vercel/analytics';
import { initialContext, reduce, type Context, type GameEvent } from './state';
import {
  readBestMs,
  writeBestMs,
  readSoundEnabled,
  writeSoundEnabled,
} from './storage';
import { playLightOn, playLightsOut, resumeAudio } from './sound';

const PIXEL_BLOCK_PX = 28;
const LIGHT_INTERVAL_MS = 1000;
const HOLD_MIN_MS = 200;
const HOLD_MAX_MS = 3000;
const JUMP_START_COOLDOWN_MS = 2000;
const NUM_LIGHTS = 5;

const SOUND_ON_SVG = `<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="M2 6 H4 L7 3 V13 L4 10 H2 Z" /><path d="M9 5 Q11 8 9 11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /><path d="M11 3 Q14 8 11 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>`;

const SOUND_OFF_SVG = `<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="M2 6 H4 L7 3 V13 L4 10 H2 Z" /><line x1="9" y1="6" x2="13" y2="10" stroke="currentColor" stroke-width="1.5" /><line x1="13" y1="6" x2="9" y2="10" stroke="currentColor" stroke-width="1.5" /></svg>`;

type Refs = {
  root: HTMLElement;
  pixels: HTMLElement;
  bulbs: HTMLElement[];
  message: HTMLElement;
  hint: HTMLElement;
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
  focusTimer: number | null;
  cleanupTimer: number | null;
};

let runtime: Runtime | null = null;

export function mount(): void {
  if (runtime) return;
  if (typeof document === 'undefined') return;

  const root = document.querySelector<HTMLElement>('.lights-out');
  if (!root) return;

  const refs = collectRefs(root);
  const soundEnabled = readSoundEnabled();
  refs.soundToggle.innerHTML = soundEnabled ? SOUND_ON_SVG : SOUND_OFF_SVG;

  runtime = {
    refs,
    ctx: initialContext({ bestMs: readBestMs() }),
    soundEnabled,
    triggerEl: null,
    armingTimers: [],
    holdTimer: null,
    jumpStartTimer: null,
    focusTimer: null,
    cleanupTimer: null,
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
    hint: q('[data-hint]'),
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
    const trigger =
      (event as CustomEvent<{ trigger?: HTMLElement }>).detail?.trigger ?? null;
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
    rt.refs.soundToggle.innerHTML = rt.soundEnabled
      ? SOUND_ON_SVG
      : SOUND_OFF_SVG;
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
      e.target.closest('.lights-out__hint') ||
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
  track('lights_out_opened');

  buildPixels(rt);
  // Force the browser to compute the initial 'closed' state before we change to 'open',
  // so the column transition runs from translateY(100%) to the rest position.
  void rt.refs.root.offsetWidth;
  rt.refs.root.dataset.state = 'open';

  dispatch(rt, { type: 'OPEN' });

  // Move focus into the overlay (close button is a safe initial target).
  // Tracked on runtime so close() can cancel it if the user closes within 50ms.
  rt.focusTimer = window.setTimeout(() => {
    rt.focusTimer = null;
    rt.refs.closeBtn.focus();
  }, 50);
}

function close(rt: Runtime): void {
  // Re-entry guard: if a close is already in flight, ignore subsequent calls.
  // Without this, a click during the 650ms close transition can compound timers and animations.
  if (
    rt.refs.root.dataset.state === 'closing' ||
    rt.refs.root.dataset.state === 'closed'
  ) {
    return;
  }
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

  rt.cleanupTimer = window.setTimeout(() => {
    rt.cleanupTimer = null;
    rt.refs.root.hidden = true;
    rt.refs.root.setAttribute('aria-hidden', 'true');
    rt.refs.pixels.replaceChildren();
    rt.refs.pixels.style.clipPath = '';
    document.body.style.overflow = '';
    if (rt.triggerEl) rt.triggerEl.focus();
  }, 650);
}

function buildPixels(rt: Runtime): void {
  rt.refs.pixels.replaceChildren();
  // Use the pixels container's actual dimensions (which is now inset from the viewport)
  // so columns fill exactly the takeover area, not the whole window.
  const containerWidth = rt.refs.pixels.clientWidth;
  const containerHeight = rt.refs.pixels.clientHeight;

  rt.refs.pixels.style.clipPath = buildJaggedClipPath(
    containerWidth,
    containerHeight,
  );

  const colCount = Math.ceil(containerWidth / PIXEL_BLOCK_PX) + 1;
  const center = (colCount - 1) / 2;
  const maxDistance = center || 1;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < colCount; i++) {
    const col = document.createElement('div');
    col.className = 'lights-out__pixel-col';
    const distance = Math.abs(i - center) / maxDistance; // 0 in middle, 1 at edges
    const delay = Math.round(distance * 600); // 0–600ms
    const duration = Math.round(900 + distance * 600); // 900–1500ms
    col.style.setProperty('--col-width', `${PIXEL_BLOCK_PX}px`);
    col.style.setProperty('--rise-delay', `${delay}ms`);
    col.style.setProperty('--rise-duration', `${duration}ms`);
    col.style.left = `${i * PIXEL_BLOCK_PX}px`;
    frag.appendChild(col);
  }
  rt.refs.pixels.appendChild(frag);
}

function buildJaggedClipPath(width: number, height: number): string {
  const step = PIXEL_BLOCK_PX;
  const points: string[] = [];
  const jitter = (max: number): number =>
    Math.floor(Math.random() * (max + 1)) * step;

  // Top edge: left → right (inward jitter pushes the edge DOWN)
  for (let x = 0; x <= width; x += step) {
    points.push(`${x}px ${jitter(3)}px`);
  }
  // Right edge: top → bottom (inward jitter pushes the edge LEFT)
  for (let y = step; y < height; y += step) {
    points.push(`${width - jitter(2)}px ${y}px`);
  }
  // Bottom edge: right → left (inward jitter pushes the edge UP)
  for (let x = width; x >= 0; x -= step) {
    points.push(`${x}px ${height - jitter(2)}px`);
  }
  // Left edge: bottom → top (inward jitter pushes the edge RIGHT)
  for (let y = height - step; y > 0; y -= step) {
    points.push(`${jitter(2)}px ${y}px`);
  }

  return `polygon(${points.join(', ')})`;
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
      refs.hint.hidden = false;
      refs.result.hidden = true;
      refs.pixels.dataset.jumpStart = 'false';
      break;

    case 'arming':
      refs.message.textContent = 'GET READY';
      refs.message.hidden = false;
      refs.hint.hidden = false;
      refs.result.hidden = true;
      refs.time.textContent = '0 MS';
      refs.time.dataset.newBest = 'false';
      refs.best.textContent = '';
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
      track('lights_out_jump_start');
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
  refs.hint.hidden = true;
  refs.result.hidden = false;
  refs.time.textContent = `${Math.round(ctx.reactionMs)} MS`;
  refs.time.dataset.newBest = ctx.isNewBest ? 'true' : 'false';

  if (ctx.isNewBest) {
    refs.best.textContent = 'NEW PERSONAL BEST!';
    if (ctx.bestMs !== null) writeBestMs(Math.round(ctx.bestMs));
    track('lights_out_new_best', { reactionMs: Math.round(ctx.reactionMs) });
  } else if (ctx.bestMs !== null) {
    refs.best.textContent = `BEST: ${Math.round(ctx.bestMs)} MS`;
  } else {
    refs.best.textContent = '';
  }

  track('lights_out_completed', { reactionMs: Math.round(ctx.reactionMs) });
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
  if (rt.focusTimer !== null) {
    clearTimeout(rt.focusTimer);
    rt.focusTimer = null;
  }
  if (rt.cleanupTimer !== null) {
    clearTimeout(rt.cleanupTimer);
    rt.cleanupTimer = null;
  }
}
