import { useCallback, useEffect, useRef, useState } from "react";
import { auditPairs, type Result } from "@/lib/contrast";

const THEMES = [
  { id: "default", label: "MIDNIGHT INDIGO", cls: "" },
  { id: "deep", label: "DEEP CRT", cls: "dark" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

function Row({ r }: { r: Result }) {
  const tone =
    r.status === "fail"
      ? "text-destructive"
      : r.status === "aa"
        ? "text-accent"
        : r.status === "info"
          ? "text-muted-foreground"
          : "text-primary";
  const badge =
    r.status === "fail"
      ? "FAIL"
      : r.status === "aa"
        ? "AA"
        : r.status === "info"
          ? "N/A"
          : "AAA";

  return (
    <div className="flex items-center justify-between gap-3 bg-background px-3 py-2">
      <span className="text-xs text-muted-foreground">{r.label}</span>
      <span className="flex shrink-0 items-center gap-3">
        <span className="label-mono text-foreground/80">
          {r.value.toFixed(2)}:1
        </span>
        <span className={`label-mono w-10 text-right ${tone}`}>{badge}</span>
      </span>
    </div>
  );
}

export function ThemeChecker() {
  const probes = useRef<Record<ThemeId, HTMLDivElement | null>>({
    default: null,
    deep: null,
  });
  const [theme, setTheme] = useState<ThemeId>("default");
  const [results, setResults] = useState<Record<string, Result[]>>({});

  const run = useCallback(() => {
    const next: Record<string, Result[]> = {};
    for (const t of THEMES) {
      const el = probes.current[t.id];
      if (el) next[t.id] = auditPairs(el);
    }
    setResults(next);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "deep");
  }, [theme]);

  const rows = results[theme] ?? [];
  const scored = rows.filter((r) => r.status !== "info");
  const fails = rows.filter((r) => r.status === "fail");
  const warns = rows.filter((r) => r.status === "aa");

  return (
    <section aria-label="Theme contrast checker" className="mt-6">
      {/* Off-screen probes so both themes can be measured without switching */}
      <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0">
        {THEMES.map((t) => (
          <div
            key={t.id}
            className={t.cls}
            ref={(el) => {
              probes.current[t.id] = el;
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-mono text-primary">THEME · CONTRAST</span>
        <div role="group" aria-label="Preview theme" className="flex gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={theme === t.id}
              onClick={() => setTheme(t.id)}
              className={`key-3d label-mono rounded-md px-3 py-2 ${
                theme === t.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <p
        aria-live="polite"
        className={`mt-3 text-xs leading-relaxed ${
          fails.length ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {fails.length
          ? `${fails.length} pair${fails.length > 1 ? "s" : ""} below WCAG AA: ${fails
              .map((f) => f.label)
              .join(", ")}.`
          : `All ${scored.length} token pairs meet WCAG AA${
              warns.length
                ? ` — ${warns.length} at AA but not AAA.`
                : " and AAA."
            }`}
      </p>

      <div className="mt-3 grid max-h-56 gap-px overflow-y-auto bg-border">
        {rows.map((r) => (
          <Row key={r.label} r={r} />
        ))}
      </div>

      <p className="mt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
        Ratios are measured live from the active design tokens, with translucent
        values flattened over their background. Text targets 4.5:1 (AA) and 7:1
        (AAA); large headlines, borders and indicators target 3:1.
      </p>
    </section>
  );
}