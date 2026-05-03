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
