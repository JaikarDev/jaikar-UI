import {
  articles,
  capabilities,
  contact,
  dailyToolkit,
  experience,
  processSteps,
  projects,
  resumes,
  toolGroups,
} from "@/data/portfolio";

/** Compact, complete text dump of the portfolio so the assistant only speaks from real content. */
export function buildKnowledge(): string {
  const projectBlocks = projects
    .map((p) =>
      [
        `### ${p.title} (slug: ${p.id})`,
        `Category: ${p.category} · ${p.kind} · ${p.status}`,
        `Summary: ${p.description}`,
        `Tags: ${p.tags.join(", ")}`,
        `Problem: ${p.study.problem}`,
        `Decision: ${p.study.decision}`,
        `Outcome: ${p.study.outcome}`,
        `Proof: ${p.study.proof.join(" | ")}`,
        `Impact: ${p.impact.map((i) => `${i.label} ${i.value} — ${i.detail}`).join(" | ")}`,
        `Role: ${p.details.role} · Scope: ${p.details.scope} · Engine: ${p.details.engine} · Team: ${p.details.team}`,
        `Contribution: ${p.details.contribution.join(" | ")}`,
        `Links: ${p.links.map((l) => `${l.label} -> ${l.href}`).join(" | ")}`,
      ].join("\n"),
    )
    .join("\n\n");

  const experienceBlocks = experience
    .map((e) =>
      [
        `### ${e.company} — ${e.role}`,
        `${e.period} · ${e.meta}`,
        e.summary ? `Summary: ${e.summary}` : "",
        `Highlights: ${e.bullets.join(" | ")}`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  return [
    "## PROJECTS / CASE STUDIES",
    projectBlocks,
    "## EXPERIENCE TIMELINE",
    experienceBlocks,
    "## CAPABILITIES",
    capabilities
      .map((c) => `${c.title}: ${c.body} (${c.chips.join(", ")})`)
      .join("\n"),
    "## PROCESS",
    processSteps
      .map((s) => `${s.num} ${s.title}: ${s.body} (${s.points.join(", ")})`)
      .join("\n"),
    "## TOOLS",
    `Daily: ${dailyToolkit.join(", ")}`,
    toolGroups.map((g) => `${g.label}: ${g.items.join(", ")}`).join("\n"),
    "## WRITING",
    articles.map((a) => `${a.title} (${a.meta}) — ${a.body} -> ${a.href}`).join("\n"),
    "## RESUMES",
    resumes.map((r) => `${r.kicker} — ${r.body} -> ${r.href}`).join("\n"),
    "## CONTACT",
    `Email ${contact.email} · LinkedIn ${contact.linkedin} · Behance ${contact.behance} · ArtStation ${contact.artstation} · itch.io ${contact.itch} · Google Play ${contact.play}`,
  ].join("\n\n");
}

export function buildSystemPrompt(projectSlug?: string | null): string {
  const focus = projectSlug
    ? projects.find((p) => p.id === projectSlug)
    : undefined;

  return [
    "You are JP-01, the on-site assistant for Jaikar Pothula's portfolio — a technical UI designer working across game UI and product design.",
    "Voice: terse, confident, technical, warm. You are a CRT terminal companion, not a corporate bot. Never use emoji.",
    "",
    "RULES",
    "- Answer ONLY from the PORTFOLIO DATA below. If something is not in it, say you do not have that on file and point to the contact email.",
    "- Never invent metrics, employers, dates, or project details.",
    "- Keep answers short: 2-5 sentences or a tight markdown list. Recruiters skim.",
    "- Structure project answers as Problem -> Decision -> Outcome when useful, and quote the real proof/impact figures.",
    "- Proactively route people to the right case study: name the project and link it as [THE DARK ARRIVAL](/case/the-dark-arrival) using the project slug.",
    "- End most replies with one short line offering the natural next step (a related case study, a resume, or a Figma/Steam link).",
    "- If the visitor states a role or interest (e.g. hiring for live-service UI, UMG engineering, product UX), recommend the 2 most relevant projects and say why.",
    focus
      ? `\nFOCUS CONTEXT: The visitor opened you from inside the "${focus.title}" case study (slug: ${focus.id}). Default to going deep on THAT project — its problem, decisions, tradeoffs, implementation, and proof — unless they ask about something else.`
      : "",
    "",
    "PORTFOLIO DATA",
    buildKnowledge(),
  ]
    .filter(Boolean)
    .join("\n");
}