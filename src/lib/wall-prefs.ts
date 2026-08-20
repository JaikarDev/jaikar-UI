/** Visitor-tweakable look of the guestbook wall. Local-only, persisted. */
import { inkFor } from "@/lib/guestbook";

export type WallPalette = "ink" | "ember" | "phosphor" | "mono";
export type WallPattern = "none" | "grid" | "dots" | "crosshatch";
export type NoteStyle = "serif" | "mono" | "caps";

export type WallPrefs = {
  palette: WallPalette;
  pattern: WallPattern;
  noteStyle: NoteStyle;
};

export const DEFAULT_WALL_PREFS: WallPrefs = {
  palette: "ink",
  pattern: "grid",
  noteStyle: "serif",
};

export const PALETTES: { key: WallPalette; label: string }[] = [
  { key: "ink", label: "AS INKED" },
  { key: "ember", label: "INDIGO" },
  { key: "phosphor", label: "PHOSPHOR" },
  { key: "mono", label: "MONO" },
];

export const PATTERNS: { key: WallPattern; label: string }[] = [
  { key: "none", label: "PLAIN" },
  { key: "grid", label: "GRID" },
  { key: "dots", label: "DOTS" },
  { key: "crosshatch", label: "HATCH" },
];

export const NOTE_STYLES: { key: NoteStyle; label: string }[] = [
  { key: "serif", label: "SERIF" },
  { key: "mono", label: "MONO" },
  { key: "caps", label: "CAPS" },
];

const KEY = "jp-wall-prefs";
const subs = new Set<(p: WallPrefs) => void>();
let prefs: WallPrefs = DEFAULT_WALL_PREFS;

export function loadWallPrefs(): WallPrefs {
  if (typeof window === "undefined") return DEFAULT_WALL_PREFS;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) prefs = { ...DEFAULT_WALL_PREFS, ...(JSON.parse(raw) as WallPrefs) };
  } catch {
    prefs = DEFAULT_WALL_PREFS;
  }
  return prefs;
}

export function setWallPrefs(next: Partial<WallPrefs>) {
  prefs = { ...prefs, ...next };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* storage full — keep the in-memory value */
    }
  }
  subs.forEach((f) => f(prefs));
}

export function subscribeWallPrefs(fn: (p: WallPrefs) => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}

/** Resolves the stroke colour for a stamp under the chosen palette. */
export function stampColor(hue: number, palette: WallPalette): string {
  if (palette === "ember") return "var(--primary)";
  if (palette === "phosphor") return "var(--phosphor)";
  if (palette === "mono") return "var(--foreground)";
  return inkFor(hue).color;
}

/** Background layer for the wall surface. */
export function patternStyle(pattern: WallPattern): React.CSSProperties {
  const line = "color-mix(in oklab, var(--primary) 12%, transparent)";
  if (pattern === "none") return {};
  if (pattern === "dots") {
    return {
      backgroundImage: `radial-gradient(${line} 1px, transparent 1px)`,
      backgroundSize: "18px 18px",
    };
  }
  if (pattern === "crosshatch") {
    return {
      backgroundImage: `repeating-linear-gradient(45deg, ${line} 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, ${line} 0 1px, transparent 1px 12px)`,
    };
  }
  return {
    backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
    backgroundSize: "44px 44px",
  };
}

/** Typographic treatment for the hover / readout note text. */
export function noteTextClass(style: NoteStyle): string {
  if (style === "mono") return "label-mono normal-case tracking-normal";
  if (style === "caps") return "label-mono uppercase";
  return "italic";
}

export function noteFontStyle(style: NoteStyle): React.CSSProperties {
  return style === "serif" ? { fontFamily: "var(--font-serif)" } : {};
}
