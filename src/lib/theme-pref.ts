/** Light/dark theme preference — persisted locally, applied as a class. */
export type ThemeMode = "light" | "dark";

const KEY = "jp-theme";
const subs = new Set<(m: ThemeMode) => void>();
let mode: ThemeMode = "dark";

function apply(next: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("light", next === "light");
  document.documentElement.style.colorScheme = next;
}

export function initTheme() {
  if (typeof window === "undefined") return mode;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {
    stored = null;
  }
  if (stored === "light" || stored === "dark") {
    mode = stored;
  } else {
    mode = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  apply(mode);
  return mode;
}

export function getTheme(): ThemeMode {
  return mode;
}

export function setTheme(next: ThemeMode) {
  mode = next;
  apply(mode);
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* storage unavailable — keep the in-memory value */
  }
  subs.forEach((f) => f(mode));
}

export function toggleTheme() {
  setTheme(mode === "dark" ? "light" : "dark");
}

export function subscribeTheme(fn: (m: ThemeMode) => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}