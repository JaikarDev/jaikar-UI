import { articles } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeader, Shell } from "./SectionHeader";

export function Writing() {
  return (
    <Shell id="writing">
      <SectionHeader
        index="07 / Writing"
        title="Writing &"
        emphasis="insights"
        intro="Notes on intuition, artistic intent, player experience, and narrative interface design."
      />

      <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
        {articles.map((a, i) => (
          <Reveal key={a.href} delay={i * 80} className="bg-background">
            <a
              href={a.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col gap-6 p-7 transition-colors hover:bg-surface sm:p-9"
            >
              <span className="label-mono text-muted-foreground">{a.meta}</span>
              <h3 className="font-display text-2xl leading-tight tracking-tight uppercase">
                {a.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {a.body}
              </p>
              <span className="mt-auto label-mono text-primary opacity-70 transition-opacity group-hover:opacity-100">
                Read article ↗
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}