/** Opt-in, local-only interaction telemetry. Nothing leaves the browser. */
export type NavEvent = {
  t: number;
  type:
    | "dpad"
    | "key"
    | "cycle"
    | "jump"
    | "stuck"
    | "preview"
    | "share"
    | "scroll"
    | "section"
    | "export";
  detail: string;
};

const KEY = "jp-telemetry";
const LOG = "jp-telemetry-log";
const MAX = 300;

let enabled = false;
let log: NavEvent[] = [];
const subs = new Set<(on: boolean) => void>();

export function initTelemetry() {
  if (typeof window === "undefined") return;
  enabled = localStorage.getItem(KEY) === "1";
  try {
    log = JSON.parse(localStorage.getItem(LOG) ?? "[]") as NavEvent[];
  } catch {
    log = [];
  }
}

export function isTelemetryEnabled() {
  return enabled;
}

export function setTelemetryEnabled(on: boolean) {
  enabled = on;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, on ? "1" : "0");
    if (!on) {
      log = [];
      localStorage.removeItem(LOG);
    }
  }
  subs.forEach((f) => f(on));
}

export function subscribeTelemetry(fn: (on: boolean) => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function track(type: NavEvent["type"], detail: string) {
  if (!enabled || typeof window === "undefined") return;
  log = [...log, { t: Date.now(), type, detail }].slice(-MAX);
  try {
    localStorage.setItem(LOG, JSON.stringify(log));
  } catch {
    /* storage full — drop silently */
  }
}

export function telemetrySummary() {
  const byType = new Map<string, number>();
  const byDetail = new Map<string, number>();
  log.forEach((e) => {
    byType.set(e.type, (byType.get(e.type) ?? 0) + 1);
    byDetail.set(e.detail, (byDetail.get(e.detail) ?? 0) + 1);
  });
  const top = [...byDetail.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  return { total: log.length, byType: [...byType.entries()], top };
}

/* ------------------------- engagement analytics ------------------------- */

/** Milestone scroll-depth reporter (25 / 50 / 75 / 100). */
export function trackScrollDepth(scope: string) {
  if (typeof window === "undefined") return () => {};
  const hit = new Set<number>();
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max <= 0 ? 100 : Math.round((window.scrollY / max) * 100);
    for (const step of [25, 50, 75, 100]) {
      if (pct >= step && !hit.has(step)) {
        hit.add(step);
        track("scroll", `${scope}:${step}%`);
      }
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

/**
 * Dwell-time reporter: records how long each `[data-analytics-section]`
 * element stays in view, so the sections that hold attention are visible
 * in the engagement summary.
 */
export function trackSectionEngagement() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window))
    return () => {};
  const since = new Map<string, number>();
  const flush = (id: string) => {
    const start = since.get(id);
    if (start === undefined) return;
    since.delete(id);
    const sec = Math.round((performance.now() - start) / 1000);
    if (sec >= 2) track("section", `${id}:${sec}s`);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const id = (e.target as HTMLElement).dataset["analyticsSection"];
        if (!id) continue;
        if (e.isIntersecting) since.set(id, performance.now());
        else flush(id);
      }
    },
    { threshold: 0.4 },
  );
  document
    .querySelectorAll<HTMLElement>("[data-analytics-section]")
    .forEach((el) => io.observe(el));
  const onHide = () => since.forEach((_, id) => flush(id));
  window.addEventListener("pagehide", onHide);
  return () => {
    onHide();
    io.disconnect();
    window.removeEventListener("pagehide", onHide);
  };
}

/** Aggregated recruiter-engagement view for the diagnostics panel. */
export function engagementSummary() {
  const previews = new Map<string, number>();
  const shares = new Map<string, number>();
  const depth = new Map<string, number>();
  const dwell = new Map<string, number>();

  for (const e of log) {
    if (e.type === "preview") previews.set(e.detail, (previews.get(e.detail) ?? 0) + 1);
    if (e.type === "share") shares.set(e.detail, (shares.get(e.detail) ?? 0) + 1);
    if (e.type === "scroll") depth.set(e.detail, (depth.get(e.detail) ?? 0) + 1);
    if (e.type === "section") {
      const [id, secs] = e.detail.split(":");
      if (!id) continue;
      dwell.set(id, (dwell.get(id) ?? 0) + Number.parseInt(secs ?? "0", 10));
    }
  }

  const rank = (m: Map<string, number>, n = 5) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

  return {
    previewOpens: [...previews.values()].reduce((a, b) => a + b, 0),
    topPreviews: rank(previews),
    shares: [...shares.values()].reduce((a, b) => a + b, 0),
    depth: rank(depth, 4),
    topSections: rank(dwell),
    exports: log.filter((e) => e.type === "export").length,
  };
}
