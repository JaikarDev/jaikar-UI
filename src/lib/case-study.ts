import {
  galleryMoreWork,
  processSteps,
  projects,
  showcase,
  type Project,
} from "@/data/portfolio";
import { mediaFor } from "@/data/media";

/* ---------------- template + guided prompts ---------------- */

export type TemplateField = {
  key: "problem" | "decision" | "outcome" | "proof";
  label: string;
  prompt: string;
  hint: string;
  /** soft target for scannability */
  target: string;
};

export const CASE_TEMPLATE: TemplateField[] = [
  {
    key: "problem",
    label: "01 · PROBLEM",
    prompt: "What was breaking for the player or user before you touched it?",
    hint: "Name the friction, not the feature. One sentence, no solution yet.",
    target: "1 sentence · under 200 characters",
  },
  {
    key: "decision",
    label: "02 · DECISION",
    prompt: "What did you decide to do, and what did you deliberately not do?",
    hint: "Lead with the design/architecture call, then the craft that supported it.",
    target: "1–2 sentences · under 260 characters",
  },
  {
    key: "outcome",
    label: "03 · OUTCOME",
    prompt: "What changed for the player, the build, or the team as a result?",
    hint: "State the shipped result. Keep it verifiable.",
    target: "1 sentence · under 200 characters",
  },
  {
    key: "proof",
    label: "04 · PROOF",
    prompt: "What can a recruiter open, play, or read to verify this?",
    hint: "Store links, playable builds, PDFs, Figma sources, live titles.",
    target: "2–4 bullet points",
  },
];

export type FieldCheck = {
  field: TemplateField;
  value: string;
  chars: number;
  status: "ok" | "long" | "missing";
};

/** Enforces the problem → decision → outcome → proof structure. */
export function checkStructure(project: Project): FieldCheck[] {
  const limits: Record<TemplateField["key"], number> = {
    problem: 200,
    decision: 260,
    outcome: 200,
    proof: 600,
  };
  return CASE_TEMPLATE.map((field) => {
    const raw =
      field.key === "proof"
        ? project.study.proof.join(" · ")
        : project.study[field.key];
    const value = (raw ?? "").trim();
    const status: FieldCheck["status"] =
      !value || (field.key === "proof" && project.study.proof.length < 2)
        ? "missing"
        : value.length > limits[field.key]
          ? "long"
          : "ok";
    return { field, value, chars: value.length, status };
  });
}

/* ---------------- derived metrics ---------------- */

export type Metric = { label: string; value: string };
export type Bar = { label: string; value: number };

const PLATFORM_HINTS: [RegExp, string][] = [
  [/STEAM/i, "PC · Steam"],
  [/PLAY STORE|MOBILE/i, "Mobile · Play Store"],
  [/ITCH/i, "PC · itch.io"],
];

export function metricsFor(project: Project): Metric[] {
  const from = `${project.kind} ${project.status}`;
  const platform =
    PLATFORM_HINTS.find(([re]) => re.test(from))?.[1] ??
    (project.category === "product" ? "Product · Prototype" : "PC");
  return [
    { label: "DISCIPLINE", value: project.kind },
    { label: "PLATFORM", value: platform },
    { label: "STACK", value: project.tags[0] ?? "—" },
    { label: "STATE", value: project.status },
    { label: "PROOF POINTS", value: String(project.study.proof.length) },
    { label: "OPENABLE ARTIFACTS", value: String(project.links.length) },
  ];
}

/** Honest counts only — no invented performance numbers. */
export function barsFor(project: Project): Bar[] {
  return [
    { label: "PROOF POINTS", value: project.study.proof.length },
    { label: "ARTIFACTS", value: project.links.length },
    { label: "DISCIPLINES", value: project.tags.length },
  ];
}

export const barMax = Math.max(
  ...projects.flatMap((p) => barsFor(p).map((b) => b.value)),
  1,
);

/* ---------------- timeline ---------------- */

export type Phase = { num: string; title: string; body: string };

export function timelineFor(project: Project): Phase[] {
  return processSteps.map((s) => ({
    num: s.num,
    title: s.title,
    body: s.points?.[0] ? `${s.body} — ${s.points[0]}.` : s.body,
  }));
}

/* ---------------- media ---------------- */

export type Shot = { src: string; caption: string };

const KEYWORDS: Record<string, RegExp> = {
  "the-dark-arrival": /DARK ARRIVAL|CAPSULE/i,
  "suite-13": /HUD|OPTIONS/i,
  "customized-angel": /ANGEL|TIMELINE/i,
  "tale-of-ronin": /RONIN|MOOD/i,
  "find-the-dog": /FIND THE DOG/i,
  "find-the-octopus": /OCTOPUS/i,
};

export function shotsFor(project: Project): Shot[] {
  // Real captures from the asset library come first.
  const owned = mediaFor(project.id)
    .filter((m) => m.kind === "image")
    .map((m) => ({ src: m.src, caption: m.caption }));
  const pool = [...galleryMoreWork, ...showcase].map((m) => ({
    src: "image" in m ? m.image : "",
    caption: "label" in m ? m.label : "",
  }));
  const re = KEYWORDS[project.id];
  const matched = re ? pool.filter((s) => re.test(s.caption)) : [];
  const all = project.image
    ? [
        { src: project.image, caption: `${project.title} · PRIMARY SCREEN` },
        ...owned,
        ...matched,
      ]
    : [...owned, ...matched];
  const seen = new Set<string>();
  return all.filter((s) => s.src && !seen.has(s.src) && seen.add(s.src)).slice(0, 4);
}

/* ---------------- recruiter summary ---------------- */

export function recruiterSummary(project: Project) {
  return {
    headline: project.title,
    role: project.kind,
    state: project.status,
    problem: project.study.problem,
    decision: project.study.decision,
    outcome: project.study.outcome,
    proof: project.study.proof.slice(0, 3),
    stack: project.tags,
    artifacts: project.links,
  };
}