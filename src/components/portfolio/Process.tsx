import { coreLoadout, processSteps } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeader, Shell } from "./SectionHeader";

export function Process() {
  return (
    <Shell id="process">
      <SectionHeader
        index="02 / How I work"
        title="Design that"
        emphasis="holds up"
        intro="I stay close to implementation. That means fewer handoff surprises, clearer component logic, and motion that supports what the player is doing."
      />

      <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
        {processSteps.map((step, i) => (
          <Reveal
            key={step.num}
            delay={i * 90}
            className="group bg-background p-7 transition-colors hover:bg-surface"
          >
            <div className="flex items-start justify-between">
              <span className="label-mono text-muted-foreground">
                {step.num}
              </span>
              <span
                aria-hidden
                className="text-2xl text-primary transition-transform duration-500 group-hover:rotate-90"
              >
                {step.glyph}
              </span>
            </div>
            <h3 className="mt-8 font-display text-2xl tracking-tight uppercase">
              {step.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
            <ul className="mt-6 space-y-2 border-t border-border pt-5">
              {step.points.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="h-1 w-1 bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 overflow-hidden border border-border bg-surface py-5">
        <div className="flex items-center gap-4 px-5">
          <span className="label-mono text-primary">Core loadout</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-5 flex overflow-hidden">
          <div className="marquee-track flex shrink-0 items-center gap-12 pr-12">
            {[...coreLoadout, ...coreLoadout, ...coreLoadout, ...coreLoadout].map(
              (t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="font-display text-2xl tracking-tight whitespace-nowrap text-muted-foreground uppercase"
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}