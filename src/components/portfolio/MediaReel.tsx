import { useState } from "react";
import { mediaFor, type MediaItem } from "@/data/media";
import type { Project } from "@/data/portfolio";
import { feedback, playSound } from "@/lib/ui-sound";

function Frame({ item, active }: { item: MediaItem; active: boolean }) {
  if (item.kind === "video") {
    return (
      <video
        key={item.src}
        src={item.src}
        poster={item.poster}
        controls
        playsInline
        muted
        loop
        preload="none"
        aria-label={item.caption}
        className="h-full w-full bg-black object-contain"
      />
    );
  }
  return (
    <img
      key={item.src}
      src={item.src}
      alt={item.caption}
      loading={active ? "eager" : "lazy"}
      className="h-full w-full object-contain"
    />
  );
}

/** 06 · REEL — production captures (video, GIF, screens) shipped with each title. */
export function MediaReel({ project }: { project: Project }) {
  const items = mediaFor(project.id);
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const current = items[Math.min(i, items.length - 1)]!;

  return (
    <section aria-label={`${project.title} media reel`} className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="label-mono text-primary">06 · REEL</span>
        <span className="label-mono text-muted-foreground">
          {items.filter((m) => m.kind === "video").length} CLIPS ·{" "}
          {items.filter((m) => m.kind === "image").length} SCREENS
        </span>
      </div>

      <div className="mt-3 border border-border bg-surface">
        <div className="relative aspect-16/9 overflow-hidden bg-background">
          <Frame item={current} active />
          {current.kind === "image" ? (
            <span className="pointer-events-none absolute top-3 left-3 label-mono bg-background/85 px-2 py-1 text-muted-foreground">
              STILL
            </span>
          ) : null}
        </div>
        <p className="label-mono border-t border-border px-4 py-3 text-muted-foreground">
          {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} ·{" "}
          <span className="text-foreground">{current.caption}</span>
        </p>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {items.map((m, idx) => {
          const on = idx === Math.min(i, items.length - 1);
          return (
            <li key={m.src}>
              <button
                type="button"
                aria-current={on ? "true" : undefined}
                aria-label={`Show ${m.caption}`}
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  setI(idx);
                  feedback("nav");
                }}
                className={`motion-base group block w-full border text-left transition-colors ${
                  on ? "border-primary" : "border-border hover:border-foreground/40"
                }`}
              >
                <span className="relative block aspect-16/10 overflow-hidden bg-surface">
                  <img
                    src={m.kind === "video" ? (m.poster ?? m.src) : m.src}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {m.kind === "video" ? (
                    <span className="label-mono absolute inset-0 flex items-center justify-center bg-background/45 text-primary">
                      ▶
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
