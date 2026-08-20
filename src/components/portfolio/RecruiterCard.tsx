import type { Project } from "@/data/portfolio";
import { metricsFor, recruiterSummary } from "@/lib/case-study";

/** Condensed, 20-second read of a case study. */
export function RecruiterCard({ project }: { project: Project }) {
  const s = recruiterSummary(project);
  const metrics = metricsFor(project).slice(0, 4);

  return (
    <article className="bg-background p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="label-mono bg-primary px-2.5 py-1.5 text-primary-foreground">
          FAST READ
        </span>
        <span className="label-mono text-muted-foreground">
          {s.role} · {s.state}
        </span>
      </div>

      <h3 className="mt-4 type-section">{s.headline}</h3>

      <ol className="mt-6 grid gap-px bg-border sm:grid-cols-3">
        {[
          { k: "PROBLEM", v: s.problem },
          { k: "DECISION", v: s.decision },
          { k: "OUTCOME", v: s.outcome },
        ].map((row) => (
          <li key={row.k} className="bg-background px-4 py-4">
            <span className="label-mono text-primary">{row.k}</span>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              {row.v}
            </p>
          </li>
        ))}
      </ol>

      <dl className="mt-5 grid gap-px bg-border sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-background px-4 py-3">
            <dt className="label-mono text-muted-foreground">{m.label}</dt>
            <dd className="mt-1 font-display text-xs leading-tight tracking-tight">
              {m.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <span className="label-mono text-primary">PROOF</span>
          <ul className="mt-2.5 space-y-1.5">
            {s.proof.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-foreground/85">
                <span aria-hidden className="mt-2 h-1 w-3 shrink-0 bg-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="label-mono text-primary">OPEN</span>
          <ul className="mt-2.5 space-y-1.5">
            {s.artifacts.map((l) => (
              <li key={l.href + l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label-mono dotted-underline text-foreground/85 hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}