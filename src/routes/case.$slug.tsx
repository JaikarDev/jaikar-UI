import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { projects } from "@/data/portfolio";
import { RecruiterCard } from "@/components/portfolio/RecruiterCard";
import {
  DetailsBlock,
  ImpactBlock,
  MetricsBlock,
  ShotsBlock,
  TimelineBlock,
} from "@/components/portfolio/CaseBlocks";
import { CasePrintSheet, exportCasePdf } from "@/components/portfolio/CasePrintSheet";
import { ShareLink } from "@/components/portfolio/ShareLink";
import {
  initTelemetry,
  track,
  trackScrollDepth,
  trackSectionEngagement,
} from "@/lib/telemetry";
import { feedback, playSound } from "@/lib/ui-sound";
import { Assistant, openAssistant } from "@/components/portfolio/Assistant";

const SITE = "https://jaikarpothula.com";

function findProject(slug: string) {
  return projects.find((p) => p.id === slug);
}

export const Route = createFileRoute("/case/$slug")({
  loader: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) throw notFound();
    return { slug: project.id };
  },
  head: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) {
      return {
        meta: [
          { title: "Case study unavailable — Jaikar Pothula" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${project.title} — ${project.kind} case study | Jaikar Pothula`;
    const description = `${project.study.problem} ${project.study.outcome}`.slice(0, 155);
    const url = `${SITE}/case/${project.id}`;
    const image = project.image?.startsWith("https://") ? project.image : null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Jaikar Pothula" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image
          ? [
              { property: "og:image", content: image },
              { property: "og:image:alt", content: `${project.title} — ${project.kind}` },
              { name: "twitter:image", content: image },
              { name: "twitter:image:alt", content: `${project.title} — ${project.kind}` },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CasePreview,
});

function CasePreview() {
  const { slug } = Route.useLoaderData();
  const project = findProject(slug)!;

  useEffect(() => {
    initTelemetry();
    track("preview", project.id);
    const stopDepth = trackScrollDepth(`case/${project.id}`);
    const stopSections = trackSectionEngagement();
    return () => {
      stopDepth();
      stopSections();
    };
  }, [project.id]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
          <Link
            to="/"
            onMouseEnter={() => playSound("hover")}
            onClick={() => feedback("nav")}
            className="label-mono dotted-underline text-muted-foreground hover:text-primary"
          >
            ← ALL WORK
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <ShareLink project={project} />
            <button
              type="button"
              onMouseEnter={() => playSound("hover")}
              onClick={() => {
                feedback("open");
                openAssistant(project.id);
              }}
              className="btn-console btn-console-primary"
            >
              ASK JP-01 ABOUT THIS ▸
            </button>
            <button
              type="button"
              onMouseEnter={() => playSound("hover")}
              onClick={() => {
                track("export", project.id);
                feedback("open");
                exportCasePdf();
              }}
              className="btn-console"
            >
              EXPORT PDF ↓
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <section
          data-analytics-section="hero"
          className="border-x border-b border-border"
        >
          <div className="relative aspect-4/3 overflow-hidden bg-surface sm:aspect-16/9">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} interface`}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-background/82" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <span className="label-mono bg-primary px-2.5 py-1.5 text-primary-foreground">
                {project.status}
              </span>
              <h1 className="mt-4 type-section">{project.title}</h1>
              <p className="label-mono mt-2 text-muted-foreground">
                RECRUITER PREVIEW · {project.kind}
              </p>
            </div>
          </div>
        </section>

        <div data-analytics-section="fast-read" className="border-x border-b border-border">
          <RecruiterCard project={project} />
        </div>

        <div
          data-analytics-section="metrics"
          className="border-x border-b border-border p-5 sm:p-8"
        >
          <ImpactBlock project={project} />
          <MetricsBlock project={project} />
        </div>

        <div
          data-analytics-section="pipeline"
          className="border-x border-b border-border p-5 sm:p-8"
        >
          <TimelineBlock project={project} />
        </div>

        <div
          data-analytics-section="screens"
          className="border-x border-b border-border p-5 sm:p-8"
        >
          <ShotsBlock project={project} />
          <DetailsBlock project={project} />
        </div>

        <div
          data-analytics-section="next"
          className="flex flex-wrap gap-2 border-x border-b border-border p-5 sm:p-8"
        >
          {projects
            .filter((p) => p.id !== project.id)
            .slice(0, 4)
            .map((p) => (
              <Link
                key={p.id}
                to="/case/$slug"
                params={{ slug: p.id }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => feedback("nav")}
                className="label-mono dotted-hover px-3 py-2 text-muted-foreground hover:text-primary"
              >
                {p.title} ↗
              </Link>
            ))}
        </div>
      </main>

      <Assistant />

      <CasePrintSheet project={project} />
    </div>
  );
}