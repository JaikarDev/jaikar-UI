import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/portfolio/SiteNav";
import { Hero } from "@/components/portfolio/Hero";
import { Viewport } from "@/components/portfolio/Viewport";
import { SiteShell } from "@/components/portfolio/SiteShell";
import { Gallery } from "@/components/portfolio/Gallery";
import { Statement } from "@/components/portfolio/Statement";
import { Process } from "@/components/portfolio/Process";
import { Capabilities } from "@/components/portfolio/Capabilities";
import { Documentation } from "@/components/portfolio/Documentation";
import { Experience } from "@/components/portfolio/Experience";
import { Writing } from "@/components/portfolio/Writing";
import { Contact } from "@/components/portfolio/Contact";
import { Guestbook } from "@/components/portfolio/Guestbook";
import { trackScrollDepth, trackSectionEngagement } from "@/lib/telemetry";

const title = "Jaikar Pothula — Technical UI Designer | Game & Product UI";
const description =
  "Technical UI Designer shipping game HUDs and diegetic UE5 interfaces plus production product flows in Figma. Selected work, case studies, and resumes.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Jaikar Pothula",
          jobTitle: "Technical UI Designer",
          email: "mailto:Jaikardevgame@gmail.com",
          description,
          sameAs: [
            "https://www.linkedin.com/in/jaikar-pothula-489b681a5/",
            "https://www.artstation.com/jaikarpothula007",
            "https://jim-jam-play.itch.io/customizedangel",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    const stopDepth = trackScrollDepth("home");
    const stopSections = trackSectionEngagement();
    return () => {
      stopDepth();
      stopSections();
    };
  }, []);

  return (
    <SiteShell>
      <div className="min-h-screen overflow-x-clip bg-background pb-24 text-foreground">
        <SiteNav />
        <a
          href="#guestbook-wall"
          className="label-mono sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[200] focus-visible:border focus-visible:border-primary focus-visible:bg-background focus-visible:px-3 focus-visible:py-2 focus-visible:text-primary"
        >
          SKIP TO GUESTBOOK WALL
        </a>
        <main id="main-content">
          <div data-analytics-section="hero"><Hero /></div>
          <div data-analytics-section="work"><Viewport /></div>
          <div data-analytics-section="showcase"><Gallery /></div>
          <div data-analytics-section="case-files"><Documentation /></div>
          <div data-analytics-section="capabilities"><Capabilities /></div>
          <div data-analytics-section="process"><Process /></div>
          <div data-analytics-section="experience"><Experience /></div>
          <div data-analytics-section="statement"><Statement /></div>
          <div data-analytics-section="writing"><Writing /></div>
          <div data-analytics-section="contact"><Contact /></div>
          <div data-analytics-section="guestbook"><Guestbook /></div>
        </main>
      </div>
    </SiteShell>
  );
}
