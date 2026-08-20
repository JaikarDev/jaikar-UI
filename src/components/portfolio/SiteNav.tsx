import { useEffect, useState } from "react";
import { navSections, contact, links } from "@/data/portfolio";
import { ScrambleText } from "./ScrambleText";
import logoAsset from "@/assets/jaikar-ui-studio.jpg.asset.json";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 40);
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-background"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-6 xl:px-8 2xl:gap-6 2xl:px-14">
        <a href="#top" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden border border-border bg-surface transition-colors group-hover:border-primary">
            <img
              src={logoAsset.url}
              alt="Jaikar UI Studio phoenix mark"
              className="h-full w-full scale-[1.35] object-cover object-left invert [.light_&]:invert-0"
              loading="eager"
              decoding="async"
            />
          </span>
          <span className="hidden 2xl:block">
            <span className="block label-mono">Jaikar Pothula</span>
            <span className="block label-mono text-muted-foreground">
              Technical UI Designer
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-0 lg:flex xl:gap-1">
          {navSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="nav-chip motion-fast px-1.5 text-[0.6rem] tracking-[0.1em] text-muted-foreground xl:px-2 xl:text-[0.66rem] xl:tracking-[0.14em]"
            >
              <ScrambleText text={s.label} />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={links.resumeGame}
            target="_blank"
            rel="noreferrer"
            className="press-tile btn-console hidden whitespace-nowrap sm:inline-flex lg:hidden xl:inline-flex"
          >
            <ScrambleText text="Resume ↓" />
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="press-tile btn-console btn-console-primary whitespace-nowrap"
          >
            <ScrambleText text="Hire me ↗" />
          </a>
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center border border-border lg:hidden"
          >
            <span className="label-mono">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="grid grid-cols-2 gap-px border-t border-border bg-border lg:hidden">
          {navSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className="nav-chip bg-background px-5 py-4 text-muted-foreground"
            >
              <ScrambleText text={s.label} />
            </a>
          ))}
        </nav>
      ) : null}

      <div className="h-px w-full bg-border">
        <div
          className="h-px bg-primary transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}