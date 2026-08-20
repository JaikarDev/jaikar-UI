import { useEffect, useRef, useState, type ReactNode } from "react";
import { ThemeChecker } from "./ThemeChecker";
import { Assistant } from "./Assistant";
import { navSections } from "@/data/portfolio";
import { ParticleField } from "./ParticleField";
import { CornerReadout } from "./CornerReadout";
import { LoadProgress } from "./LoadProgress";
import { Preloader } from "./Preloader";
import { initSmoothScroll } from "@/lib/smooth-scroll";
import { pingVisitorAlert } from "@/lib/visitor-alert";
import {
  cycleTitle,
  exitDeviceFocus,
  jumpToSection,
  shortcuts,
  stepSection,
} from "@/lib/device-nav";
import {
  initMotionPref,
  isMotionReduced,
  setMotionReduced,
  subscribeMotion,
} from "@/lib/motion-pref";
import {
  initTelemetry,
  isTelemetryEnabled,
  setTelemetryEnabled,
  subscribeTelemetry,
  telemetrySummary,
  engagementSummary,
  track,
} from "@/lib/telemetry";
import {
  feedback,
  initSound,
  isSoundEnabled,
  playSound,
  setSoundEnabled,
  subscribeSound,
} from "@/lib/ui-sound";
import {
  getTheme,
  initTheme,
  subscribeTheme,
  toggleTheme,
  type ThemeMode,
} from "@/lib/theme-pref";
import {
  initMusic,
  isMusicPlaying,
  subscribeMusic,
  toggleMusic,
  MUSIC_TITLE,
} from "@/lib/music";

/* ---------------- pointer layers ---------------- */

function usePointerKind() {
  const [kind, setKind] = useState<"unknown" | "fine" | "coarse">("unknown");
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setKind(mq.matches ? "fine" : "coarse");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return kind;
}

function CustomCursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("cursor-none-desktop");
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        'a, button, [role="button"], input, textarea',
      );
      setLabel(el ? (el.dataset["cursor"] ?? "select") : null);
    };
    const loop = () => {
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const active = label !== null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-150">
      <div
        ref={ring}
        className={`absolute -top-6 -left-6 flex h-12 w-12 items-center justify-center rounded-full border transition-[opacity,scale,border-color] duration-200 ${
          active
            ? "scale-100 border-primary opacity-100"
            : "scale-[0.45] border-foreground/40 opacity-70"
        } ${pressed ? "scale-[0.8]" : ""}`}
      >
        <span
          className={`label-mono absolute top-full mt-2 whitespace-nowrap text-primary transition-opacity duration-200 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      </div>
      <div ref={dot} className="absolute -top-px -left-px h-1 w-1 rounded-full bg-primary" />
    </div>
  );
}

function TouchPulse() {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const down = (e: PointerEvent) => {
      const id = Date.now() + Math.random();
      setPulses((p) => [...p, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setPulses((p) => p.filter((i) => i.id !== id)), 650);
    };
    window.addEventListener("pointerdown", down, { passive: true });
    return () => window.removeEventListener("pointerdown", down);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-150">
      {pulses.map((p) => (
        <span
          key={p.id}
          style={{ left: p.x, top: p.y }}
          className="tap-pulse absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary"
        />
      ))}
    </div>
  );
}

/* ---------------- section index ---------------- */

function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const ids = ["top", ...navSections.map((s) => s.id)];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => !!n);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.01, 0.2, 0.6] },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
  return active;
}

/** Thin left-edge index — numbered rules, uppercase mono labels. */
function SectionIndex({ active }: { active: string }) {
  return (
    <nav
      aria-label="Section index"
      className="fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 min-[1700px]:block"
    >
      <ul className="flex flex-col">
        {navSections.map((s, i) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-cursor="jump"
                onMouseEnter={() => playSound("hover")}
                onClick={() => feedback("nav")}
                className={`group flex items-center gap-2.5 py-1.5 transition-colors ${
                  on ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`h-px transition-all duration-300 ${
                    on ? "w-7 bg-primary" : "w-3 bg-border group-hover:w-5"
                  }`}
                />
                <span className="label-mono">
                  {String(i + 1).padStart(2, "0")} {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------------- utility bar (flat, bottom-left) ---------------- */

function useSoundState() {
  const [sound, setSound] = useState(false);
  useEffect(() => {
    setSound(isSoundEnabled());
    const unsub = subscribeSound(setSound);
    return () => {
      unsub();
    };
  }, []);
  const toggle = () => {
    setSoundEnabled(!sound);
    if (!sound) feedback("open");
  };
  return { sound, toggle };
}

function UtilityBar({ onHelp }: { onHelp: () => void }) {
  return <UtilityBarInner onHelp={onHelp} />;
}

function useThemeState() {
  const [mode, setMode] = useState<ThemeMode>("dark");
  useEffect(() => {
    setMode(getTheme());
    const unsub = subscribeTheme(setMode);
    return () => {
      unsub();
    };
  }, []);
  const next = () => {
    toggleTheme();
    feedback("nav");
  };
  return { mode, next };
}

function UtilityBarInner({ onHelp }: { onHelp: () => void }) {
  const { sound, toggle } = useSoundState();
  const { mode, next } = useThemeState();
  const [music, setMusic] = useState(false);
  useEffect(() => {
    setMusic(isMusicPlaying());
    const unsub = subscribeMusic(setMusic);
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-background sm:right-8">
      <button
        type="button"
        aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode (keyboard shortcut T)`}
        data-cursor={mode === "dark" ? "light" : "dark"}
        onMouseEnter={() => playSound("hover")}
        onClick={next}
        className="nav-chip label-mono px-3 py-2 text-muted-foreground"
      >
        {mode === "dark" ? "LIGHT" : "DARK"}
      </button>
      <button
        type="button"
        aria-pressed={sound}
        aria-label="Toggle sound and haptics (keyboard shortcut M)"
        data-cursor={sound ? "mute" : "unmute"}
        onClick={toggle}
        className={`nav-chip label-mono px-3 py-2 ${
          sound ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {sound ? "SFX ON" : "SFX OFF"}
      </button>
      <button
        type="button"
        aria-pressed={music}
        aria-label={`${music ? "Pause" : "Play"} background music: ${MUSIC_TITLE} (keyboard shortcut N)`}
        title={MUSIC_TITLE}
        data-cursor={music ? "pause" : "play"}
        onMouseEnter={() => playSound("hover")}
        onClick={() => {
          toggleMusic();
          feedback("click");
        }}
        className={`nav-chip label-mono px-3 py-2 ${
          music ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {music ? "♪ MUSIC ON" : "♪ MUSIC OFF"}
      </button>
      <button
        type="button"
        aria-label="Show keyboard shortcuts (keyboard shortcut question mark)"
        data-cursor="help"
        onMouseEnter={() => playSound("hover")}
        onClick={onHelp}
        className="nav-chip label-mono px-3 py-2 text-muted-foreground"
      >
        ?
      </button>
    </div>
  );
}

/* ---------------- shortcuts overlay ---------------- */

function HelpOverlay({ onClose }: { onClose: () => void }) {
  const { sound, toggle } = useSoundState();
  const { mode, next } = useThemeState();
  const [reduce, setReduce] = useState(false);
  const [tel, setTel] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduce(isMotionReduced());
    setTel(isTelemetryEnabled());
    const a = subscribeMotion(setReduce);
    const b = subscribeTelemetry(setTel);
    ref.current?.focus();
    return () => {
      a();
      b();
    };
  }, []);

  const stats = tel ? telemetrySummary() : null;
  const eng = tel ? engagementSummary() : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts and preferences"
      className="fixed inset-0 z-200 flex items-end justify-center bg-background/95 p-3 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[86dvh] w-full max-w-xl overflow-y-auto border border-border bg-background p-5 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="label-mono text-primary">SHORTCUTS</span>
            <h2 className="mt-1 type-editorial text-lg">Moving around</h2>
          </div>
          <button
            type="button"
            aria-label="Close shortcuts overlay"
            onClick={onClose}
            className="nav-chip label-mono px-3 py-2 text-muted-foreground"
          >
            ESC
          </button>
        </div>

        <dl className="mt-5 grid gap-px bg-border sm:grid-cols-2">
          {shortcuts.map((s) => (
            <div
              key={s.keys}
              className="flex items-center justify-between gap-3 bg-background px-3 py-2.5"
            >
              <dt className="label-mono text-primary">{s.keys}</dt>
              <dd className="text-right text-xs text-muted-foreground">{s.action}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={sound}
            onClick={toggle}
            className={`nav-chip label-mono px-3 py-2.5 ${
              sound ? "text-primary" : "text-muted-foreground"
            }`}
          >
            SFX + HAPTICS {sound ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            aria-pressed={reduce}
            onClick={() => setMotionReduced(!reduce)}
            className={`nav-chip label-mono px-3 py-2.5 ${
              reduce ? "text-primary" : "text-muted-foreground"
            }`}
          >
            REDUCED MOTION {reduce ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={next}
            className="nav-chip label-mono px-3 py-2.5 text-muted-foreground"
          >
            THEME · {mode === "dark" ? "DARK" : "LIGHT"}
          </button>
          <button
            type="button"
            aria-pressed={tel}
            onClick={() => setTelemetryEnabled(!tel)}
            className={`nav-chip label-mono px-3 py-2.5 ${
              tel ? "text-primary" : "text-muted-foreground"
            }`}
          >
            USAGE TRACKING {tel ? "ON" : "OFF"}
          </button>
        </div>

        <p className="mt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
          Usage tracking is opt-in and stays on this device — it logs which controls
          and sections you use so navigation can be tuned. Nothing is uploaded.
        </p>

        <ThemeChecker />

        {stats ? (
          <p className="label-mono mt-3 text-foreground/70">
            {stats.total} EVENTS ·{" "}
            {stats.top
              .map(([k, n]: [string, number]) => `${k}×${n}`)
              .join("  ") || "NO DATA YET"}
          </p>
        ) : null}

        {eng ? (
          <dl className="mt-3 grid gap-px bg-border sm:grid-cols-2">
            {[
              { k: "PREVIEW OPENS", v: String(eng.previewOpens) },
              { k: "SHARE LINKS COPIED", v: String(eng.shares) },
              { k: "PDF EXPORTS", v: String(eng.exports) },
              {
                k: "SCROLL DEPTH",
                v:
                  eng.depth.map(([k, n]) => `${k.split(":")[1]}×${n}`).join(" ") ||
                  "—",
              },
              {
                k: "TOP SECTIONS",
                v: eng.topSections.map(([k, s]) => `${k} ${s}s`).join("  ") || "—",
              },
              {
                k: "TOP CASES",
                v: eng.topPreviews.map(([k, n]) => `${k}×${n}`).join("  ") || "—",
              },
            ].map((row) => (
              <div key={row.k} className="bg-background px-3 py-2.5">
                <dt className="label-mono text-primary">{row.k}</dt>
                <dd className="mt-1 text-[0.7rem] leading-relaxed text-muted-foreground">
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- shell ---------------- */

export function SiteShell({ children }: { children: ReactNode }) {
  const [help, setHelp] = useState(false);
  const active = useActiveSection();
  const pointer = usePointerKind();

  useEffect(() => {
    initMotionPref();
    initTelemetry();
    initSound();
    initMusic();
    initTheme();
    pingVisitorAlert();
    return initSmoothScroll();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (el?.closest("[data-key-scope]") && e.key.startsWith("Arrow")) return;
      const k = e.key.toLowerCase();

      if (e.key === "Escape") {
        if (help) {
          setHelp(false);
        } else {
          window.dispatchEvent(new CustomEvent("jp-escape"));
          exitDeviceFocus();
        }
        return;
      }
      if (help && k !== "?" && k !== "/") return;

      switch (k) {
        case "arrowup":
        case "w":
          e.preventDefault();
          stepSection(-1, "key");
          break;
        case "arrowdown":
        case "s":
          e.preventDefault();
          stepSection(1, "key");
          break;
        case "arrowleft":
          e.preventDefault();
          cycleTitle(-1, "key");
          break;
        case "arrowright":
          e.preventDefault();
          cycleTitle(1, "key");
          break;
        case "a":
          jumpToSection("work", "key");
          break;
        case "b":
          jumpToSection("contact", "key");
          break;
        case "m":
          setSoundEnabled(!isSoundEnabled());
          track("key", "toggle:sfx");
          break;
        case "n":
          toggleMusic();
          track("key", "toggle:music");
          break;
        case "r":
          setMotionReduced(!isMotionReduced());
          track("key", "toggle:reduced-motion");
          break;
        case "t":
          toggleTheme();
          track("key", "toggle:theme");
          break;
        case "?":
        case "/":
          e.preventDefault();
          setHelp((v) => !v);
          track("key", "toggle:help");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [help]);

  return (
    <>
      <Preloader />
      {pointer === "fine" ? <CustomCursor /> : null}
      {pointer === "coarse" ? <TouchPulse /> : null}
      <ParticleField />
      <CornerReadout />
      <LoadProgress />
      <SectionIndex active={active} />
      {children}
      <UtilityBar onHelp={() => setHelp(true)} />
      <Assistant />
      {help ? <HelpOverlay onClose={() => setHelp(false)} /> : null}
    </>
  );
}
