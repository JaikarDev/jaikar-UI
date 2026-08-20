/** User-facing reduced-motion switch, layered on top of the OS preference. */
const KEY = "jp-reduced-motion";
let reduced = false;
const subs = new Set<(on: boolean) => void>();

function apply() {
  document.documentElement.classList.toggle("reduce-motion", reduced);
}

export function initMotionPref() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(KEY);
  reduced =
    stored === null
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : stored === "1";
  apply();
}

export function isMotionReduced() {
  return reduced;
}

export function setMotionReduced(on: boolean) {
  reduced = on;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, on ? "1" : "0");
    apply();
  }
  subs.forEach((f) => f(on));
}

export function subscribeMotion(fn: (on: boolean) => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}
