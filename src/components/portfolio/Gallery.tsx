import { useState } from "react";
import {
  artstationThumbs,
  astraCards,
  astraFacts,
  galleryMoreWork,
  links,
  showcase,
} from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Shell } from "./SectionHeader";
import { Overlay } from "./Overlay";
import { feedback, playSound } from "@/lib/ui-sound";
import { usePress } from "@/hooks/use-press";

function Tile({
  label,
  image,
  onOpen,
}: {
  label: string;
  image: string;
  onOpen: () => void;
}) {
  const { pressProps } = usePress();
  return (
    <button
      type="button"
      {...pressProps}
      onMouseEnter={() => playSound("hover")}
      onClick={() => {
        feedback("open");
        onOpen();
      }}
      className="group press-tile relative block aspect-[4/3] w-full overflow-hidden border border-border bg-surface"
    >
      <img
        src={image}
        alt={label}
        loading="lazy"
        className="motion-media h-full w-full object-cover opacity-85 transition group-hover:scale-105 group-hover:opacity-100 group-data-[pressed=true]:scale-105 group-data-[pressed=true]:opacity-100"
      />
      <span className="absolute inset-x-0 bottom-0 label-mono bg-background/85 px-3 py-3 text-left">
        {label}
      </span>
    </button>
  );
}

const media = [
  ...showcase.map((s) => ({ label: s.label, image: s.image })),
  ...galleryMoreWork.map((g) => ({ label: g.label, image: g.image })),
].filter(
  (m, i, all) => all.findIndex((other) => other.image === m.image) === i,
);

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const active = index === null ? null : media[index];

  return (
    <Shell id="showcase">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <Reveal className="label-mono text-primary">
            02 / Visual showcase — {media.length} frames
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 type-section">
              Systems <span className="text-primary italic">in motion.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            UI motion, menu prototypes, layout structures, and in-engine
            implementations. Tap any frame to view it full size.
          </p>
        </Reveal>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-3">
        {media.map((m, i) => (
          <Reveal key={m.label + i} delay={Math.min(i, 8) * 45}>
            <Tile label={m.label} image={m.image} onOpen={() => setIndex(i)} />
          </Reveal>
        ))}
      </div>

      <div className="mt-20 border-t border-border pt-12">
        <Reveal className="label-mono text-primary">
          Astra UI · Interaction reel
        </Reveal>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal delay={60}>
            <h3 className="type-section">
              Interface <span className="text-primary italic">in motion</span>
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Astra UI was designed as a focused, cinematic menu system where
              motion communicates hierarchy and state. Transitions establish
              context, feedback confirms player input, and the restrained visual
              language keeps navigation readable without breaking immersion.
            </p>
          </Reveal>
          <Reveal
            delay={120}
            className="divide-y divide-border border-y border-border"
          >
            {astraFacts.map((f) => (
              <div key={f.label} className="flex flex-wrap gap-x-6 gap-y-1 py-4">
                <span className="label-mono w-24 shrink-0 text-primary">
                  {f.label}
                </span>
                <span className="text-sm text-muted-foreground">{f.value}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-10 grid gap-px bg-border lg:grid-cols-3">
          {astraCards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80} className="bg-background p-6">
              <span className="label-mono text-muted-foreground">{c.tag}</span>
              <h4 className="mt-6 font-display text-xl tracking-tight uppercase">
                {c.title}
              </h4>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-20 grid gap-px border-t border-border bg-border pt-px lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="bg-background p-6 sm:p-10">
          <span className="label-mono text-primary">ArtStation archive</span>
          <h3 className="mt-6 type-section">
            UI / UX + 3D
            <br />
            explorations
          </h3>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            A broader archive of game UI, mobile systems, Unreal and Unity work,
            plus earlier 3D studies.
          </p>
          <a
            href={links.artstation}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => playSound("hover")}
            onClick={() => feedback("open")}
            className="motion-fast mt-8 inline-block label-mono border border-border px-5 py-3.5 transition-colors hover:border-primary hover:text-primary"
          >
            Open ArtStation profile ↗
          </a>
        </Reveal>
        <div className="grid grid-cols-3 gap-px bg-border">
          {artstationThumbs.map((t, i) => (
            <Reveal key={t.src} delay={i * 50} className="bg-background">
              <a
                href={links.artstation}
                target="_blank"
                rel="noreferrer"
                className="group block aspect-square overflow-hidden"
              >
                <img
                  src={t.src}
                  alt={t.alt}
                  loading="eager"
                  className="motion-media h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <Overlay
        open={active !== null}
        label={active ? active.label : ""}
        onClose={() => {
          feedback("close");
          setIndex(null);
        }}
        onPrev={() =>
          setIndex((i) => (i === null ? null : (i - 1 + media.length) % media.length))
        }
        onNext={() => setIndex((i) => (i === null ? null : (i + 1) % media.length))}
      >
        {active ? (
          <img
            src={active.image}
            alt={active.label}
            className="max-h-[80dvh] w-full bg-surface object-contain"
          />
        ) : null}
      </Overlay>
    </Shell>
  );
}
