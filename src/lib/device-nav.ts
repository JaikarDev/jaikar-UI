import { navSections } from "@/data/portfolio";
import { feedback } from "@/lib/ui-sound";
import { isMotionReduced } from "@/lib/motion-pref";
import { track } from "@/lib/telemetry";
import { smoothScrollTo } from "@/lib/smooth-scroll";

export const SECTION_IDS = ["top", ...navSections.map((s) => s.id)];

export function sectionLabel(id: string) {
  if (id === "top") return "HOME";
  return navSections.find((s) => s.id === id)?.label ?? "HOME";
}

function reduced() {
  return (
    typeof window !== "undefined" &&
    (isMotionReduced() ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

/** Index derived from real scroll position — deterministic, never stale. */
export function currentSectionIndex() {
  if (typeof window === "undefined") return 0;
  const probe = window.scrollY + window.innerHeight * 0.3;
  let idx = 0;
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.getBoundingClientRect().top + window.scrollY <= probe) idx = i;
  });
  return idx;
}

/* Queue rapid presses so each keypress advances exactly one section. */
let pending: number | null = null;
let pendingAt = 0;

export function jumpToSection(id: string, source = "jump") {
  const el = document.getElementById(id);
  if (!el) return;
  track(source === "key" ? "key" : "jump", `jump:${id}`);
  pending = SECTION_IDS.indexOf(id);
  pendingAt = Date.now();
  if (reduced() || !smoothScrollTo(el)) {
    el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  }
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function stepSection(dir: -1 | 1, source: "dpad" | "key" = "dpad") {
  const base =
    pending !== null && Date.now() - pendingAt < 900 ? pending : currentSectionIndex();
  // wrap so the device never dead-ends at either edge
  const next = (base + dir + SECTION_IDS.length) % SECTION_IDS.length;
  const id = SECTION_IDS[next];
  if (!id) return "";
  feedback("nav");
  track(source, `${dir === -1 ? "up" : "down"}:${id}`);
  jumpToSection(id);
  return id;
}

export function cycleTitle(dir: -1 | 1, source: "dpad" | "key" = "dpad") {
  feedback("nav");
  track("cycle", `${source}:${dir === -1 ? "prev" : "next"}`);
  window.dispatchEvent(new CustomEvent("jp-cycle", { detail: dir }));
}

/** Leave device focus mode: drop focus from chassis controls, land on content. */
export function exitDeviceFocus() {
  const el = document.activeElement as HTMLElement | null;
  if (el && el !== document.body) el.blur();
  const main = document.getElementById("main-content");
  if (main) {
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
  }
  track("key", "escape:exit-focus");
}

export const shortcuts = [
  { keys: "↑ / W", action: "Previous section" },
  { keys: "↓ / S", action: "Next section" },
  { keys: "← / →", action: "Cycle case-study titles" },
  { keys: "A", action: "Jump to the work" },
  { keys: "B", action: "Jump to contact" },
  { keys: "M", action: "Toggle SFX + haptics" },
  { keys: "N", action: "Toggle background music" },
  { keys: "R", action: "Toggle reduced motion" },
  { keys: "T", action: "Toggle light / dark theme" },
  { keys: "P", action: "Toggle recruiter fast-read mode" },
  { keys: "?", action: "Show / hide this help" },
  { keys: "Esc", action: "Close overlays / exit device focus" },
];
