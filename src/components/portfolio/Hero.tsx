import { useEffect, useState } from "react";
import { contact, links, projects } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Scribble } from "./Scribble";

const stats = [
  { value: "03+", label: "YEARS", note: "SHIPPING UI" },
  { value: "02", label: "LIVE", note: "TITLES" },
  { value: "UE5", label: "UMG &", note: "BLUEPRINTS" },
];

const reel = projects.filter((p) => p.image);

export function Hero() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setSlide((s) => (s + 1) % reel.length),
      3800,
    );
    return () => window.clearInterval(id);
  }, []);

  const current = reel[slide];

  return (
    <div
      id="top"
      className="relative overflow-hidden border-b border-border px-5 pt-28 pb-12 sm:px-8 sm:pt-32 lg:px-14"
    >
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-70" />
      <div className="relative mx-auto w-full max-w-[1400px]">
        <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="label-mono">Jaikar Pothula</span>
          <span className="h-px w-10 bg-border" />
          <span className="label-mono text-primary">Technical UI Designer</span>
        </Reveal>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <Reveal delay={80}>
              <h1 className="type-display">
                <span className="line-mask">
                  <span className="line-rise block">I design UI</span>
                </span>
                <span className="line-mask">
                  <span className="line-rise block" style={{ animationDelay: "120ms" }}>
                    that people{" "}
                    <span className="relative inline-block text-primary">
                      depend on.
                      <Scribble className="absolute -bottom-3 left-0 h-6 w-[105%] sm:-bottom-4 sm:h-8" />
                    </span>
                  </span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
            <p className="relative mt-10 max-w-xl text-base leading-relaxed text-muted-foreground">
              <Scribble
                variant="loop"
                className="absolute -top-10 -right-16 hidden h-16 w-24 opacity-30 xl:block"
              />
              I design player- and user-facing systems that ship — from game HUDs
              and diegetic interfaces in UE5 to production-ready product flows in
              Figma.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#work"
                data-cursor="browse"
                className="press-tile btn-console btn-console-primary px-6 py-4"
              >
                Browse the work →
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="press-tile btn-console px-6 py-4"
              >
                Email me ↗
              </a>
            </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <a
              href="#work"
              className="group relative block aspect-4/3 overflow-hidden border border-border bg-surface sm:aspect-16/10"
            >
              {reel.map((p, i) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={`${p.title} interface`}
                  aria-hidden={i !== slide}
                  className={`absolute inset-0 h-full w-full object-cover motion-media transition-opacity ${
                    i === slide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-background/78" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5">
                <div>
                  <span className="label-mono text-primary">
                    {current?.kind}
                  </span>
                  <div className="mt-1.5 font-display text-lg tracking-tight uppercase sm:text-2xl">
                    {current?.title}
                  </div>
                </div>
                <span className="label-mono text-muted-foreground transition-colors group-hover:text-foreground">
                  Browse all ↗
                </span>
              </div>
              <div className="absolute top-4 right-4 flex gap-1.5">
                {reel.map((p, i) => (
                  <span
                    key={p.id}
                    className={`motion-fast h-1 w-5 transition-colors ${
                      i === slide ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal delay={200} className="grid grid-cols-3 gap-px bg-border">
            {stats.map((s) => (
              <div key={s.label} className="bg-background p-4 sm:p-5">
                <div className="font-display text-2xl leading-none tracking-tight sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-2.5 label-mono text-muted-foreground">
                  {s.label}
                </div>
                <div className="label-mono text-muted-foreground">{s.note}</div>
              </div>
            ))}
          </Reveal>

        <Reveal delay={240}>
          <a
            href={links.steam}
            target="_blank"
            rel="noreferrer"
            className="group press-tile flex flex-wrap items-center gap-x-4 gap-y-2 border border-border bg-surface px-5 py-4 transition-colors hover:border-primary"
          >
            <span className="flex items-center gap-2 label-mono text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary live-dot" />
              Now shipping
            </span>
            <span className="font-display text-lg tracking-tight uppercase">
              The Dark Arrival
            </span>
            <span className="label-mono text-muted-foreground transition-colors group-hover:text-foreground">
              View on Steam ↗
            </span>
          </a>
        </Reveal>
        </div>
      </div>
    </div>
  );
}