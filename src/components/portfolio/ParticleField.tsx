import { useEffect, useRef } from "react";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  tw: number;
};

function readToken(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const primary = readToken("--primary", "oklch(0.72 0.19 48)");
    const fg = readToken("--foreground", "oklch(0.96 0 0)");

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: P[] = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -999, y: -999, active: false };
    const trail: { x: number; y: number; life: number }[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = fine ? 13000 : 22000;
      const count = Math.max(18, Math.min(110, Math.round((w * h) / density)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -0.06 - Math.random() * 0.16,
        r: Math.random() < 0.14 ? 1.6 : 0.7 + Math.random() * 0.5,
        a: 0.16 + Math.random() * 0.34,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.012;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000 && d2 > 1) {
            const f = (1 - d2 / 26000) * 0.5;
            const d = Math.sqrt(d2);
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }

        if (p.y < -10) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 8;
        if (p.x > w + 10) p.x = -8;

        const flicker = 0.72 + Math.sin(p.tw + t * 0.0004) * 0.28;
        const near =
          pointer.active &&
          Math.abs(p.x - pointer.x) < 170 &&
          Math.abs(p.y - pointer.y) < 170;

        ctx.beginPath();
        ctx.fillStyle = near ? primary : fg;
        ctx.globalAlpha = p.a * flicker * (near ? 1 : 0.65);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (pointer.active && fine) {
        // pointer trail: fading rings that follow the cursor
        for (let i = trail.length - 1; i >= 0; i -= 1) {
          const t2 = trail[i]!;
          t2.life -= 0.022;
          if (t2.life <= 0) {
            trail.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.globalAlpha = t2.life * 0.5;
          ctx.strokeStyle = primary;
          ctx.lineWidth = 1;
          ctx.arc(t2.x, t2.y, (1 - t2.life) * 26 + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i]!;
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.globalAlpha = (1 - d / 150) * 0.22;
            ctx.strokeStyle = primary;
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      if (running) raf = window.requestAnimationFrame(draw);
    };

    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      const last = trail[trail.length - 1];
      if (!last || Math.hypot(last.x - pointer.x, last.y - pointer.y) > 22) {
        trail.push({ x: pointer.x, y: pointer.y, life: 1 });
        if (trail.length > 22) trail.shift();
      }
    };
    const leave = () => {
      pointer.active = false;
    };
    const visibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = window.requestAnimationFrame(draw);
      }
    };

    resize();
    if (reduced) {
      draw(0);
      running = false;
      window.cancelAnimationFrame(raf);
    } else {
      raf = window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-80"
    />
  );
}
