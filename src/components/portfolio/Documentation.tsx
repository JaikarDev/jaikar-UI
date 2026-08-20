import { docCards, links, resumes } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeader, Shell } from "./SectionHeader";
import { A } from "@/data/portfolio";

export function Documentation() {
  return (
    <Shell id="documentation">
      <SectionHeader
        index="04 / Documentation"
        title="Beyond"
        emphasis="design"
        intro="A deeper look at in-engine UI, system architecture, and scalable interfaces supporting real-time gameplay."
      />

      <Reveal
        delay={80}
        className="mt-12 grid gap-px bg-border lg:grid-cols-[1.25fr_1fr]"
      >
        <div className="relative min-h-72 overflow-hidden bg-background">
          <img
            src={`${A}/Dark%20Arrival/Screenshot_2026-03-31_195708.png`}
            alt="The Dark Arrival in-engine main menu system running in build"
            loading="lazy"
            className="h-full w-full object-cover opacity-85"
          />
        </div>
        <div className="flex flex-col justify-between gap-8 bg-background p-7 sm:p-10">
          <div>
            <span className="label-mono text-primary">In-engine output</span>
            <h3 className="mt-6 type-section">
              The interface
              <br />
              running live.
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              The in-engine main menu system previewed exactly as it plays
              in-build.
            </p>
          </div>
          <a
            href={links.steam}
            target="_blank"
            rel="noreferrer"
            className="label-mono self-start border border-border px-5 py-3.5 transition-colors hover:border-primary hover:text-primary"
          >
            View Steam page ↗
          </a>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-px bg-border lg:grid-cols-3">
        {docCards.map((c, i) => (
          <Reveal key={c.title + c.kicker} delay={i * 70} className="bg-background">
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-between gap-8 p-6 transition-colors hover:bg-surface"
            >
              <span className="label-mono text-muted-foreground">
                {c.kicker}
              </span>
              <span className="font-display text-2xl tracking-tight uppercase">
                {c.title}
              </span>
              <span className="label-mono text-primary opacity-70 transition-opacity group-hover:opacity-100">
                {c.cta}
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 border-t border-border pt-12">
        <Reveal className="label-mono text-primary">04A / Resume</Reveal>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <Reveal delay={60}>
            <h3 className="type-section">
              Choose the{" "}
              <span className="text-primary italic">right profile.</span>
            </h3>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Two focus areas, one designer — pick the résumé that fits the role
              you're hiring for.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-px bg-border lg:grid-cols-2">
          {resumes.map((r, i) => (
            <Reveal key={r.title} delay={i * 90} className="bg-background">
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col gap-6 p-7 transition-colors hover:bg-surface sm:p-10"
              >
                <span className="label-mono text-muted-foreground">
                  {r.kicker}
                </span>
                <span className="type-section">
                  {r.title}
                </span>
                <span className="text-sm text-muted-foreground">{r.body}</span>
                <span className="mt-auto label-mono text-primary">
                  View / download resume ↓
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </Shell>
  );
}