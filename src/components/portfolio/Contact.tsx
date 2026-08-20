import { contact, links } from "@/data/portfolio";
import { Reveal } from "./Reveal";
import { Shell } from "./SectionHeader";

const socials = [
  { label: "LinkedIn", href: contact.linkedin },
  { label: "Behance", href: contact.behance },
  { label: "ArtStation", href: contact.artstation },
  { label: "itch.io", href: contact.itch },
];

export function Contact() {
  return (
    <Shell id="contact" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" />
      <div className="relative">
        <Reveal className="label-mono text-primary">
          Hello — 08 / Get in touch
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-6 type-display">
            Let’s design something{" "}
            <span className="text-primary italic">meaningful.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Available for full-time Technical UI, Game UI, and Product Design
            roles — remote or on-site in the SF Bay Area.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <a
            href={`mailto:${contact.email}`}
            className="mt-10 inline-block border-b border-primary pb-2 font-display text-[clamp(1.2rem,4vw,2.6rem)] tracking-tight uppercase transition-colors hover:text-primary"
          >
            {contact.email} ↗
          </a>
        </Reveal>

        <div className="mt-14 grid gap-px bg-border lg:grid-cols-[1fr_1fr_1.2fr]">
          <Reveal className="flex flex-col items-start gap-4 bg-background p-6">
            <a href={contact.linkedin} target="_blank" rel="noreferrer">
              <img
                src={contact.linkedinQr}
                alt="QR code for Jaikar Pothula LinkedIn"
                loading="lazy"
                className="h-40 w-40 object-contain"
              />
              <span className="mt-4 block label-mono text-muted-foreground">
                Scan for LinkedIn
              </span>
            </a>
          </Reveal>
          <Reveal delay={70} className="flex flex-col items-start gap-4 bg-background p-6">
            <a href={contact.play} target="_blank" rel="noreferrer">
              <img
                src={contact.playQr}
                alt="QR code for Find the Octopus on Google Play"
                loading="lazy"
                className="h-40 w-40 object-contain"
              />
              <span className="mt-4 block label-mono text-muted-foreground">
                Scan to play
              </span>
            </a>
          </Reveal>
          <Reveal delay={140} className="bg-background p-6">
            <span className="label-mono text-primary">Resumes</span>
            <div className="mt-4 flex flex-col divide-y divide-border border-y border-border">
              <a
                href={links.resumeGame}
                target="_blank"
                rel="noreferrer"
                className="label-mono py-4 transition-colors hover:text-primary"
              >
                Game UI / UX resume ↓
              </a>
              <a
                href={links.resumeProduct}
                target="_blank"
                rel="noreferrer"
                className="label-mono py-4 transition-colors hover:text-primary"
              >
                Product design resume ↓
              </a>
            </div>
            <span className="mt-8 block label-mono text-primary">Elsewhere</span>
            <ul className="mt-4 grid grid-cols-2 gap-px bg-border">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="label-mono block bg-background px-4 py-4 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <span className="label-mono text-muted-foreground">
            © {new Date().getFullYear()} Jaikar Pothula — Technical UI Designer
          </span>
          <a href="#top" className="label-mono text-muted-foreground hover:text-primary">
            Back to top ↑
          </a>
        </div>
      </div>
    </Shell>
  );
}