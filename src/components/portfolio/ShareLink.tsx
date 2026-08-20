import { useState } from "react";
import type { Project } from "@/data/portfolio";
import { feedback, playSound } from "@/lib/ui-sound";
import { track } from "@/lib/telemetry";

/** Copies the shareable recruiter-preview URL for a case study. */
export function caseUrl(project: Project) {
  const origin =
    typeof window === "undefined" ? "https://jaikarpothula.com" : window.location.origin;
  return `${origin}/case/${project.id}`;
}

export function ShareLink({
  project,
  label = "COPY SHARE LINK",
}: {
  project: Project;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = caseUrl(project);
    track("share", project.id);
    feedback("click");
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this recruiter preview link", url);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onMouseEnter={() => playSound("hover")}
      onClick={() => void copy()}
      className="btn-console"
    >
      <span aria-live="polite">{copied ? "LINK COPIED ✓" : label}</span>
    </button>
  );
}