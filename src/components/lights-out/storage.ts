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
