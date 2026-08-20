import type { Project } from "@/data/portfolio";
import { CASE_TEMPLATE, checkStructure } from "@/lib/case-study";

/**
 * Authoring aid: shows the enforced problem → decision → outcome → proof
 * template with guided prompts, and flags any field that breaks it.
 */
export function TemplateGuide({ project }: { project: Project }) {
  const checks = checkStructure(project);
  const issues = checks.filter((c) => c.status !== "ok");

  return (
    <section aria-label="Case study template" className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-mono text-primary">08 · TEMPLATE</span>
        <span
          aria-live="polite"
          className={`label-mono ${issues.length ? "text-destructive" : "text-muted-foreground"}`}
        >
          {issues.length
            ? `${issues.length} FIELD${issues.length > 1 ? "S" : ""} NEED WORK`
            : "STRUCTURE COMPLETE"}
        </span>
      </div>

      <ol className="mt-3 grid gap-px bg-border">
        {checks.map(({ field, chars, status }, i) => (
          <li key={field.key} className="bg-background px-4 py-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="label-mono text-foreground/85">{field.label}</span>
              <span
                className={`label-mono ${
                  status === "ok"
                    ? "text-primary"
                    : status === "long"
                      ? "text-accent"
                      : "text-destructive"
                }`}
              >
                {status === "ok"
                  ? "OK"
                  : status === "long"
                    ? `TRIM · ${chars} CHARS`
                    : "MISSING"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              {field.prompt}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {field.hint} <span className="label-mono">· {field.target}</span>
            </p>
            {i === CASE_TEMPLATE.length - 1 ? null : null}
          </li>
        ))}
      </ol>
    </section>
  );
}