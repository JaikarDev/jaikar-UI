/** Background score: "Sun-Bleached Spokes" — streamed from the asset library. */
export const MUSIC_SRC = "https://jaikarpothula.com/sun-bleached_spokes.mp3.mp3";
export const MUSIC_TITLE = "SUN-BLEACHED SPOKES";

const STORAGE_KEY = "jp-music";
let el: HTMLAudioElement | null = null;
let playing = false;
const listeners = new Set<(v: boolean) => void>();

function emit() {
  listeners.forEach((l) => l(playing));
}

function ensureEl() {
  if (typeof window === "undefined") return null;
  if (!el) {
    el = new Audio(MUSIC_SRC);
    el.loop = true;
    el.preload = "none";
    el.volume = 0;
    el.addEventListener("pause", () => {
      playing = false;
      emit();
    });
  }
  return el;
}

function fade(to: number, ms = 900) {
  const audio = ensureEl();
  if (!audio) return;
  const from = audio.volume;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * t));
    if (t < 1) window.requestAnimationFrame(step);
    else if (to === 0) audio.pause();
  };
  window.requestAnimationFrame(step);
}

export function isMusicPlaying() {
  return playing;
}

export function subscribeMusic(fn: (v: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setMusicEnabled(v: boolean) {
  const audio = ensureEl();
  if (!audio) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, v ? "on" : "off");
  } catch {
    /* storage blocked */
  }
  if (v) {
    audio.volume = 0;
    void audio
      .play()
      .then(() => {
        playing = true;
        emit();
        fade(0.32);
      })
      .catch(() => {
        playing = false;
        emit();
      });
  } else {
    playing = false;
    emit();
    fade(0, 500);
  }
}

export function toggleMusic() {
  setMusicEnabled(!playing);
}

/** Restore the saved preference; browsers require a gesture before playback. */
export function initMusic() {
  if (typeof window === "undefined") return;
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    saved = null;
  }
  if (saved !== "on") return;
  const unlock = () => {
    setMusicEnabled(true);
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true });
}
