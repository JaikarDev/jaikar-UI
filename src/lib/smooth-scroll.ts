import Lenis from "lenis";
import { isMotionReduced, subscribeMotion } from "@/lib/motion-pref";

let lenis: Lenis | null = null;
let raf = 0;

export function getLenis() {
  return lenis;
}

/** Momentum-based smooth scrolling (Locomotive/Lenis style). */
function start() {
  if (lenis) return;
  lenis = new Lenis({
    duration: 1.15,
    lerp: 0.085,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    smoothWheel: true,
  });
  const loop = (time: number) => {
    lenis?.raf(time);
    raf = window.requestAnimationFrame(loop);
  };
  raf = window.requestAnimationFrame(loop);
}

function stop() {
  if (!lenis) return;
  window.cancelAnimationFrame(raf);
  lenis.destroy();
  lenis = null;
}

/** Scroll to an element through the momentum engine (falls back to native). */
export function smoothScrollTo(el: HTMLElement) {
  if (lenis) {
    lenis.scrollTo(el, { offset: 0 });
    return true;
  }
  return false;
}

export function initSmoothScroll() {
  if (typeof window === "undefined") return () => {};
  const reduced = () =>
    isMotionReduced() || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const apply = () => (reduced() ? stop() : start());
  apply();
  const unsub = subscribeMotion(apply);

  // Route in-page anchors through the momentum engine.
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    const hash = a?.getAttribute("href");
    if (!a || !hash || hash === "#") return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    if (smoothScrollTo(target)) e.preventDefault();
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    unsub();
    stop();
  };
}
