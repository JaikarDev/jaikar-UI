import { useState } from "react";
import {
  capabilities,
  capabilityTabs,
  dailyToolkit,
  toolGroups,
} from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeader, Shell } from "./SectionHeader";

export function Capabilities() {
  const [active, setActive] = useState(0);
  const item = capabilities[active] ?? capabilities[0]!;

  return (
    <Shell id="capabilities">
      <SectionHeader
        index="03 / Capabilities"
        title="What I"
        emphasis="bring"
        intro="I work across the full UI pipeline—from player journeys and wireframes to animated, reusable systems running inside the engine."
      />

      <div className="mt-12 grid gap-px bg-border lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col bg-background">
          {capabilityTabs.map((t, i) => (
            <button
              key={t.num}
              type="button"
              onClick={() => setActive(i)}
              className={`flex items-start gap-4 border-b border-border p-5 text-left transition-colors ${
                active === i
                  ? "bg-surface text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="label-mono pt-1 text-primary">{t.num}</span>
              <span>
                <span className="block font-display text-lg tracking-tight uppercase">
                  {t.label}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {t.note}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="bg-background p-7 sm:p-10">
          <span className="label-mono text-primary">{item.num}</span>
          <h3 className="mt-6 type-section">
            {item.title}
          </h3>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {item.body}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {item.chips.map((c) => (
              <li
                key={c}
                className="border border-border px-3 py-2 font-mono text-xs text-muted-foreground"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 overflow-hidden border border-border bg-surface py-5">
        <div className="flex items-center gap-4 px-5">
          <span className="label-mono text-primary">Daily toolkit</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-5 flex overflow-hidden">
          <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
            {[...dailyToolkit, ...dailyToolkit, ...dailyToolkit].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="label-mono whitespace-nowrap text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {toolGroups.map((g, i) => (
          <Reveal key={g.label} delay={i * 70} className="bg-background p-6">
            <span className="label-mono text-primary">{g.label}</span>
            <ul className="mt-5 space-y-2">
              {g.items.map((it) => (
                <li key={it} className="text-sm text-muted-foreground">
                  {it}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}