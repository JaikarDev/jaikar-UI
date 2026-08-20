import type { Project } from "@/data/portfolio";
import {
  barMax,
  barsFor,
  metricsFor,
  shotsFor,
  timelineFor,
} from "@/lib/case-study";

export function MetricsBlock({ project }: { project: Project }) {
  return <MetricsBlockInner project={project} />;
}

/** Reusable impact header: the three headline figures every case file carries. */
export function ImpactBlock({ project }: { project: Project }) {
  return (
    <section aria-label="Impact metrics" className="mt-8">
      <span className="label-mono text-primary">04 · IMPACT</span>
      <dl className="mt-3 grid gap-px bg-border sm:grid-cols-3">
        {project.impact.map((m) => (
          <div key={m.label} className="bg-background px-4 py-4">
            <dt className="label-mono text-muted-foreground">{m.label}</dt>
            <dd>
              <span className="mt-1.5 block font-display text-lg leading-none tracking-tight text-primary">
                {m.value}
              </span>
              <span className="mt-2 block text-[0.78rem] leading-relaxed text-muted-foreground">
                {m.detail}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Reusable supporting details: role, scope, engine, team, contribution. */
export function DetailsBlock({ project }: { project: Project }) {
  const d = project.details;
  const rows: [string, string][] = [
    ["ROLE", d.role],
    ["SCOPE", d.scope],
    ["ENGINE / TOOLS", d.engine],
    ["CONTEXT", d.team],
  ];
  return (
    <section aria-label="Supporting details" className="mt-8">
      <span className="label-mono text-primary">08 · DETAILS</span>
      <dl className="mt-3 divide-y divide-border border-y border-border">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="grid grid-cols-[minmax(0,1fr)] gap-1 py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="label-mono text-muted-foreground">{k}</dt>
            <dd className="min-w-0 text-sm leading-relaxed text-foreground/90">{v}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-3 space-y-1.5">
        {d.contribution.map((c) => (
          <li
            key={c}
            className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
          >
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-primary" />
            <span className="min-w-0">{c}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MetricsBlockInner({ project }: { project: Project }) {
  const metrics = metricsFor(project);
  const bars = barsFor(project);

  return (
    <section aria-label="Quantified results" className="mt-8">
      <span className="label-mono text-primary">05 · METRICS</span>
      <dl className="mt-3 grid gap-px bg-border sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-background px-4 py-3.5">
            <dt className="label-mono text-muted-foreground">{m.label}</dt>
            <dd className="mt-1.5 font-display text-sm leading-tight tracking-tight">
              {m.value}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-4 space-y-2.5">
        {bars.map((b) => (
          <li key={b.label} className="flex items-center gap-3">
            <span className="label-mono w-28 shrink-0 text-muted-foreground">
              {b.label}
            </span>
            <span className="h-1.5 min-w-0 flex-1 bg-border">
              <span
                className="motion-base block h-1.5 bg-primary transition-[width] duration-500"
                style={{ width: `${Math.max(6, (b.value / barMax) * 100)}%` }}
              />
            </span>
            <span className="label-mono w-6 text-right text-foreground/80">
              {b.value}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-[0.7rem] leading-relaxed text-muted-foreground">
        Counts are verifiable artifacts attached to this case file — playable
        builds, store pages, Figma sources and PDFs — not estimated figures.
      </p>
    </section>
  );
}

export function TimelineBlock({ project }: { project: Project }) {
  const phases = timelineFor(project);
  return (
    <section aria-label="Delivery timeline" className="mt-8">
      <span className="label-mono text-primary">06 · PIPELINE</span>
      <ol className="mt-3 border-l border-border pl-5">
        {phases.map((p) => (
          <li key={p.num} className="relative pb-5 last:pb-0">
            <span
              aria-hidden
              className="absolute top-1.5 -left-[1.4rem] h-1.5 w-1.5 rounded-full bg-primary"
            />
            <span className="label-mono text-foreground/85">
              {p.num} · {p.title}
            </span>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {p.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ShotsBlock({
  project,
  onOpen,
}: {
  project: Project;
  onOpen?: (src: string) => void;
}) {
  const shots = shotsFor(project);
  if (!shots.length) return null;

  return (
    <section aria-label="Screens" className="mt-8">
      <span className="label-mono text-primary">07 · SCREENS</span>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shots.map((s) => (
          <li key={s.src} className="border border-border bg-background">
            <button
              type="button"
              onClick={() => onOpen?.(s.src)}
              className="group block w-full text-left"
            >
              <span className="block aspect-16/10 overflow-hidden bg-surface">
                <img
                  src={s.src}
                  alt={s.caption}
                  loading="lazy"
                  className="motion-base h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </span>
              <span className="label-mono block px-3 py-2.5 text-muted-foreground group-hover:text-primary">
                {s.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}