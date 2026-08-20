import { useState } from "react";
import { experience } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { SectionHeader, Shell } from "./SectionHeader";

export function Experience() {
  const [open, setOpen] = useState<number>(0);

  return (
    <Shell id="experience">
      <SectionHeader
        index="06 / Experience"
        title="Where I’ve"
        emphasis="worked"
        intro="3+ years designing and shipping UI across games and digital products — bridging design thinking with technical execution."
      />

      <Reveal delay={80} className="mt-12 border border-primary/40 bg-surface p-7 sm:p-10">
        <span className="flex items-center gap-2 label-mono text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary live-dot" />
          Open to hire
        </span>
        <h3 className="mt-6 font-display text-2xl tracking-tight uppercase">
          Current focus
        </h3>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          UI/UX Designer with 2+ years designing interfaces across games and
          digital products — from Smart Guardian's health-monitoring UX to shipped
          UI on Steam and Google Play. Open to full-time Product Design, Technical
          UI, or Game UI roles.
        </p>
      </Reveal>

      <div className="mt-10 divide-y divide-border border-t border-b border-border">
        {experience.map((role, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={role.company} delay={i * 60}>
              <div className="py-6">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="group grid w-full gap-4 text-left lg:grid-cols-[160px_1fr_auto] lg:items-start"
                >
                  <span className="label-mono text-primary">{role.period}</span>
                  <span>
                    <span className="block label-mono text-muted-foreground">
                      {role.meta}
                    </span>
                    <span className="mt-3 block font-display text-[clamp(1.3rem,3vw,2rem)] tracking-tight uppercase transition-colors group-hover:text-primary">
                      {role.company}
                    </span>
                    <span className="mt-2 block text-sm text-muted-foreground">
                      {role.role}
                    </span>
                  </span>
                  <span className="label-mono flex h-9 w-9 items-center justify-center border border-border text-primary">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen ? (
                  <div className="mt-6 lg:pl-[160px]">
                    {role.summary ? (
                      <p className="max-w-3xl text-sm leading-relaxed text-foreground/90">
                        {role.summary}
                      </p>
                    ) : null}
                    <ul className="mt-5 space-y-3">
                      {role.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 bg-primary" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {role.link ? (
                      <a
                        href={role.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-block label-mono text-primary hover:underline"
                      >
                        {role.link.label}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Shell>
  );
}