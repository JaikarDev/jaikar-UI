import { useEffect, useState } from "react";
import { isMotionReduced } from "@/lib/motion-pref";

const LINES = [
  "JAIKAR POTHULA",
  "TECHNICAL UI DESIGNER",
  "GAME HUDS / UE5",
  "SELECTED WORK",
];

const STEP = 300;
const SEEN_KEY = "jp-intro-seen";

/** Animated intro: cycles lines of type, then wipes away to reveal the page. */
export function Preloader() {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (isMotionReduced() || sessionStorage.getItem(SEEN_KEY) === "1") {
      setGone(true);
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    document.documentElement.classList.add("is-preloading");
    const ids: number[] = [];
    LINES.forEach((_, idx) => {
      if (idx === 0) return;
      ids.push(window.setTimeout(() => setI(idx), STEP * idx));
    });
    ids.push(window.setTimeout(() => setLeaving(true), STEP * LINES.length));
    ids.push(
      window.setTimeout(() => {
        setGone(true);
        document.documentElement.classList.remove("is-preloading");
      }, STEP * LINES.length + 700),
    );
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      document.documentElement.classList.remove("is-preloading");
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[300] flex items-center justify-center bg-background ${
        leaving ? "preloader-out" : ""
      }`}
    >
      <div className="w-full max-w-3xl px-6">
        <div className="overflow-hidden">
          <span
            key={i}
            className="preloader-line block font-headline text-[clamp(1.5rem,5.5vw,4rem)] leading-[1.05] font-extrabold tracking-[-0.01em] whitespace-nowrap text-foreground uppercase"
          >
            {LINES[i]}
          </span>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="label-mono text-muted-foreground">LOADING</span>
          <span className="label-mono text-muted-foreground">
            {String(Math.round(((i + 1) / LINES.length) * 100)).padStart(3, "0")}%
          </span>
        </div>
        <div className="mt-2 h-px w-full bg-border">
          <div
            className="h-px bg-foreground transition-[width] duration-300 ease-out"
            style={{ width: `${((i + 1) / LINES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
