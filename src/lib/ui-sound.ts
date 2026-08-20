type Kind = "hover" | "click" | "open" | "close" | "nav" | "boot";

let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(v: boolean) => void>();
const STORAGE_KEY = "jp-sfx";
let ambient: { osc: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;

export function isSoundEnabled() {
  return enabled;
}

export function subscribeSound(fn: (v: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? "on" : "off");
    } catch {
      /* storage blocked */
    }
  }
  if (v) {
    const audio = ensureCtx();
    if (audio) {
      void audio.resume().then(() => {
        if (enabled) startAmbient();
      });
    }
  } else {
    stopAmbient();
  }
  listeners.forEach((l) => l(v));
}

/** Restore the saved SFX preference (call once on mount). */
export function initSound() {
  if (typeof window === "undefined") return;
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    saved = null;
  }
  if (saved !== "on") return;
  enabled = true;
  listeners.forEach((l) => l(true));
  // Autoplay policy: audio can only start after a user gesture.
  const unlock = () => {
    const audio = ensureCtx();
    if (!audio) return;
    void audio.resume().then(() => {
      if (!enabled) return;
      playSound("boot");
      startAmbient();
    });
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true });
}

/** Low CRT-style room tone under the interface, tied to the SFX toggle. */
function startAmbient() {
  const audio = ensureCtx();
  if (!audio || ambient || audio.state !== "running") return;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.linearRampToValueAtTime(0.012, audio.currentTime + 1.2);
  const osc = audio.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 56;
  const osc2 = audio.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 112.6;
  const sub = audio.createGain();
  sub.gain.value = 0.35;
  osc.connect(gain);
  osc2.connect(sub).connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc2.start();
  ambient = { osc, osc2, gain };
}

function stopAmbient() {
  const audio = ctx;
  if (!audio || !ambient) return;
  const { osc, osc2, gain } = ambient;
  ambient = null;
  const now = audio.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
  osc.stop(now + 0.4);
  osc2.stop(now + 0.4);
}

function ensureCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

const presets: Record<Kind, { freq: number; to: number; dur: number; type: OscillatorType; gain: number }> = {
  hover: { freq: 1180, to: 1320, dur: 0.045, type: "square", gain: 0.014 },
  click: { freq: 420, to: 190, dur: 0.09, type: "square", gain: 0.05 },
  open: { freq: 240, to: 720, dur: 0.16, type: "triangle", gain: 0.045 },
  close: { freq: 520, to: 150, dur: 0.13, type: "triangle", gain: 0.04 },
  nav: { freq: 700, to: 560, dur: 0.06, type: "square", gain: 0.02 },
  boot: { freq: 160, to: 880, dur: 0.5, type: "sawtooth", gain: 0.03 },
};

export function playSound(kind: Kind) {
  if (!enabled) return;
  const audio = ensureCtx();
  if (!audio) return;
  const p = presets[kind];
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = p.type;
  osc.frequency.setValueAtTime(p.freq, now);
  osc.frequency.exponentialRampToValueAtTime(p.to, now + p.dur);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(p.gain, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + p.dur);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + p.dur + 0.02);
}

const haptics: Record<Kind, number | number[]> = {
  hover: 0,
  click: 8,
  open: [10, 22, 14],
  close: 12,
  nav: 6,
  boot: [12, 40, 18],
};

/** Sound + haptic feedback for a key interaction. Opt-in via the SFX toggle. */
export function feedback(kind: Kind) {
  playSound(kind);
  if (!enabled) return;
  const pattern = haptics[kind];
  if (!pattern) return;
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* unsupported */
    }
  }
}
