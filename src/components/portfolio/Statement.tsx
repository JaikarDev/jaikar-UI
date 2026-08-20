import { useEffect, useRef, useState } from "react";

/* Giant words stack up one at a time as you scroll through the sticky frame.
   Each entry keeps the original manifesto copy as its supporting line. */
const beats = [
  {
    word: "CLARITY",
    line: "I design UI systems that guide decisions - whether the user is a player in a game or someone using a product.",
  },
  {
    word: "SYSTEMS",
    line: "My craft spans game UI and product design: modular systems in Unreal Engine 5 and Unity, and clear flows and design systems in Figma - always built to ship.",
  },
  {
    word: "HIERARCHY",
    line: "I prioritize clarity, hierarchy, and performance. Interfaces should reduce friction and support real decisions.",
  },
  {
    word: "PRESSURE",
    line: "Interfaces should stay readable under pressure - in a thriller HUD or a product dashboard.",
  },
];

export function Statement() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? -rect.top / total : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const active = Math.min(
    beats.length - 1,
    Math.floor(progress * beats.length * 0.999),
  );

  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative h-[380vh] scroll-mt-0 border-t border-border"
    >
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center sm:px-8 lg:px-14">
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-40" />
        <div className="relative mx-auto w-full max-w-[1100px]">
          <div className="flex items-center justify-center gap-3">
            <span className="label-mono text-primary">05 / MANIFESTO</span>
            <span className="h-px w-14 bg-border" />
            <span className="label-mono text-muted-foreground">
              {Math.round(progress * 100)}% READ
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center">
            {beats.map((b, i) => {
              const state = i < active ? "past" : i === active ? "now" : "next";
              return (
                <span
                  key={b.word}
                  className="type-monument motion-media block transition-all duration-700"
                  style={{
                    opacity: state === "now" ? 1 : state === "past" ? 0.22 : 0.07,
                    transform:
                      state === "next"
                        ? "translateY(28px) scale(0.96)"
                        : state === "past"
                          ? "translateY(-8px) scale(0.97)"
                          : "translateY(0) scale(1)",
                    color:
                      state === "now" ? "var(--foreground)" : "var(--muted-foreground)",
                    filter: state === "next" ? "blur(6px)" : "blur(0px)",
                  }}
                >
                  {b.word}
                </span>
              );
            })}
          </div>

          <p
            key={beats[active]?.word}
            className="mx-auto mt-10 max-w-2xl animate-fade-in text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {beats[active]?.line}
          </p>

          <div className="mt-10 h-px w-full bg-border">
            <div
              className="h-px bg-primary transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
