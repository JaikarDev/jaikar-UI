import { useEffect, useState } from "react";
import { projects, type Project } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { feedback, playSound } from "@/lib/ui-sound";
import {
  DetailsBlock,
  ImpactBlock,
  MetricsBlock,
  ShotsBlock,
  TimelineBlock,
} from "./CaseBlocks";
import { RecruiterCard } from "./RecruiterCard";
import { MediaReel } from "./MediaReel";
import { TemplateGuide } from "./TemplateGuide";
import { CasePrintSheet, exportCasePdf } from "./CasePrintSheet";
import { openAssistant } from "@/components/portfolio/Assistant";
import { ShareLink } from "./ShareLink";
import { track } from "@/lib/telemetry";
import { Link } from "@tanstack/react-router";

const filters = [
  { key: "all", label: "ALL TITLES" },
  { key: "game", label: "GAME UI" },
  { key: "product", label: "PRODUCT UX" },
] as const;

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center grid-backdrop p-6">
      <span className="font-display text-center text-[clamp(1.4rem,4vw,3rem)] leading-none tracking-tight text-muted-foreground/35 uppercase">
        {title}
      </span>
    </div>
  );
}

function Readout({ project, index, total }: { project: Project; index: number; total: number }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <span className="absolute top-3 left-3 h-3 w-3 border-t border-l border-primary/80" />
      <span className="absolute top-3 right-3 h-3 w-3 border-t border-r border-primary/80" />
      <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-primary/80" />
      <span className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-primary/80" />
      <span className="absolute top-1/2 left-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-primary/40" />
      <span className="absolute top-1/2 left-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-primary/40" />
      <div className="absolute top-5 left-8 flex flex-col gap-1">
        <span className="label-mono text-primary">
          TITLE {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="label-mono text-muted-foreground">{project.kind}</span>
      </div>
      <span className="absolute right-8 bottom-5 hidden label-mono text-muted-foreground sm:inline">
        {project.image ? "PREVIEW · RENDERED" : "PREVIEW · UNAVAILABLE"}
      </span>
    </div>
  );
}

export function Viewport() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [index, setIndex] = useState(0);
  const [recruiter, setRecruiter] = useState(false);
  const [guide, setGuide] = useState(false);

  const list =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const active = list[Math.min(index, list.length - 1)];

  useEffect(() => {
    const onCycle = (e: Event) => {
      const dir = (e as CustomEvent<number>).detail === -1 ? -1 : 1;
      setIndex((i) => (i + dir + list.length) % list.length);
    };
    window.addEventListener("jp-cycle", onCycle as EventListener);
    return () => {
      window.removeEventListener("jp-cycle", onCycle as EventListener);
    };
  }, [list.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "p") {
        setRecruiter((v) => !v);
        feedback("click");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;

  return (
    <section
      id="work"
      className="scroll-mt-20 border-t border-border px-4 py-20 sm:px-8 lg:px-14"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="sr-only" aria-live="polite">
          Now showing case study {index + 1} of {list.length}: {active.title}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-7">
          <div>
            <Reveal className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary live-dot" />
              <span className="label-mono text-primary">
                01 / SELECTED WORK — {list.length} TITLES
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-4 type-section">
                Operate the <span className="text-primary italic">work.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120} className="flex flex-wrap items-center gap-4">
            <span className="hidden label-mono text-muted-foreground lg:inline">
              ↑ ↓ TO CYCLE TITLES
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={recruiter}
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  setRecruiter((v) => !v);
                  if (!recruiter) track("preview", `inline:${active.id}`);
                  feedback("click");
                }}
                className={`btn-console ${recruiter ? "btn-console-primary" : ""}`}
              >
                {recruiter ? "◉" : "◎"} RECRUITER MODE
                <span aria-hidden className="opacity-60">
                  P
                </span>
              </button>
              <button
                type="button"
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  feedback("open");
                  track("export", active.id);
                  exportCasePdf();
                }}
                className="btn-console"
              >
                EXPORT PDF ↓
              </button>
              <button
                type="button"
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  feedback("open");
                  openAssistant(active.id);
                }}
                className="btn-console"
              >
                ASK JP-01 ▸
              </button>
              <ShareLink project={active} />
              <Link
                to="/case/$slug"
                params={{ slug: active.id }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => feedback("nav")}
                className="btn-console"
              >
                OPEN PREVIEW PAGE ↗
              </Link>
            </div>
            <div className="flex flex-wrap gap-px bg-border">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onMouseEnter={() => playSound("hover")}
                  onClick={() => {
                    setFilter(f.key);
                    setIndex(0);
                    feedback("click");
                  }}
                  className={`motion-fast label-mono px-4 py-3 transition-colors ${
                    filter === f.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-px bg-border lg:grid-cols-[260px_1fr]">
          {/* Outliner */}
          <div className="min-w-0 overflow-hidden bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="label-mono text-muted-foreground">SELECT</span>
              <span className="label-mono text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <ul className="flex snap-x gap-px overflow-x-auto bg-border lg:block lg:overflow-visible">
              {list.map((p, i) => {
                const on = p.id === active.id;
                return (
                  <li key={p.id} className="min-w-[15rem] snap-start lg:min-w-0">
                    <button
                      type="button"
                      aria-current={on ? "true" : undefined}
                      onMouseEnter={() => playSound("hover")}
                      onPointerDown={() => feedback("nav")}
                      onClick={() => setIndex(i)}
                      className={`motion-base flex h-full w-full flex-col items-start gap-1.5 px-4 py-3.5 text-left transition-colors active:bg-primary/10 ${
                        on
                          ? "bg-primary/10 text-foreground"
                          : "bg-background text-muted-foreground hover:bg-surface hover:text-foreground"
                      }`}
                    >
                      <span className="flex w-full items-center gap-2">
                        <span
                          className={`motion-base h-px transition-all ${on ? "w-4 bg-primary" : "w-2 bg-border"}`}
                        />
                        <span className="label-mono truncate">{p.title}</span>
                      </span>
                      <span className="label-mono pl-6 text-muted-foreground/80">
                        {p.kind}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Viewport + details */}
          <div className="min-w-0 bg-background">
            <div className="relative aspect-4/3 overflow-hidden border-b border-border bg-surface sm:aspect-16/9">
              {active.image ? (
                <img
                  key={active.id}
                  src={active.image}
                  alt={`${active.title} interface`}
                  className="viewport-load h-full w-full object-cover"
                />
              ) : (
                <Placeholder title={active.title} />
              )}
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-background/80" />
              <Readout project={active} index={index} total={list.length} />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <span className="label-mono bg-primary px-2.5 py-1.5 text-primary-foreground">
                  {active.status}
                </span>
                <h3 className="mt-4 type-section">
                  {active.title}
                </h3>
              </div>
            </div>

            {recruiter ? (
              <RecruiterCard project={active} />
            ) : (
            <>
            <div className="grid min-w-0 gap-px bg-border lg:grid-cols-[1.4fr_1fr]">
              <div className="min-w-0 bg-background p-5 sm:p-8">
                <span className="label-mono text-primary">CASE FILE</span>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/90">
                  {active.description}
                </p>

                <dl className="mt-7 grid gap-px bg-border sm:grid-cols-3">
                  {[
                    { k: "PROBLEM", v: active.study.problem },
                    { k: "DECISION", v: active.study.decision },
                    { k: "OUTCOME", v: active.study.outcome },
                  ].map((row, i) => (
                    <div key={row.k} className="bg-background pt-4 sm:px-4 sm:pt-4">
                      <dt className="label-mono flex items-center gap-2 text-primary">
                        <span aria-hidden className="text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {row.k}
                      </dt>
                      <dd className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <span className="label-mono mt-8 block text-primary">PROOF</span>
                <ul className="mt-3 space-y-2">
                  {active.study.proof.map((p) => (
                    <li
                      key={p}
                      className="flex gap-3 text-sm leading-relaxed text-foreground/85"
                    >
                      <span aria-hidden className="mt-2 h-1 w-3 shrink-0 bg-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {active.tags.map((t) => (
                    <li key={t} className="label-mono dotted-hover px-3 py-1.5 text-muted-foreground">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0 bg-background">
                <div className="border-b border-border px-5 py-3 sm:px-6">
                  <span className="label-mono text-muted-foreground">LINKS</span>
                </div>
                <div className="flex flex-col divide-y divide-border">
                  {active.links.map((l) => (
                    <a
                      key={l.href + l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => playSound("hover")}
                      onClick={() => feedback("open")}
                      className="group press-tile label-mono flex items-center justify-between gap-4 border-transparent px-5 py-4 transition-colors hover:bg-primary/8 hover:text-primary active:bg-primary/10 sm:px-6"
                    >
                      <span className="min-w-0 truncate">{l.label}</span>
                      <span aria-hidden className="motion-base text-primary transition-transform group-hover:translate-x-1">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
                <div className="border-t border-border p-5 sm:p-6">
                  <ImpactBlock project={active} />
                  <MetricsBlock project={active} />
                  <TimelineBlock project={active} />
                </div>
              </div>
            </div>
            <div className="border-t border-border bg-background p-5 sm:p-8">
              <MediaReel project={active} />
              <ShotsBlock project={active} />
              <DetailsBlock project={active} />
              <button
                type="button"
                aria-expanded={guide}
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  setGuide((v) => !v);
                  feedback("click");
                }}
                className="btn-console mt-8"
              >
                {guide ? "HIDE" : "SHOW"} CASE-STUDY TEMPLATE
              </button>
              {guide ? <TemplateGuide project={active} /> : null}
            </div>
            </>
            )}
          </div>
        </div>
        <CasePrintSheet project={active} />
      </div>
    </section>
  );
}
