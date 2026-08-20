import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  title,
  emphasis,
  intro,
  children,
}: {
  index: string;
  title: string;
  emphasis?: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-border pb-10">
      <Reveal className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-primary live-dot" />
        <span className="label-mono text-primary">{index}</span>
      </Reveal>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <Reveal delay={60}>
          <h2 className="type-display">
            {title}{" "}
            {emphasis ? (
              <span className="text-primary italic">{emphasis}</span>
            ) : null}
          </h2>
        </Reveal>
        {intro ? (
          <Reveal delay={140}>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {intro}
            </p>
          </Reveal>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function Shell({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-border px-5 py-24 sm:px-8 lg:px-14 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1400px]">{children}</div>
    </section>
  );
}