import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { contact } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";
import { metricsFor, shotsFor, timelineFor } from "@/lib/case-study";
import logoAsset from "@/assets/jaikar-ui-studio.jpg.asset.json";

/**
 * Print-only, branded one-pager for the active case study.
 * Hidden on screen; the browser's print dialog exports it as PDF.
 */
function Sheet({ project }: { project: Project }) {
  const metrics = metricsFor(project);
  const shots = shotsFor(project).slice(0, 2);
  const phases = timelineFor(project);

  return (
    <div className="print-sheet" aria-hidden>
      <header className="ps-head">
        <div>
          <span className="ps-label">JAIKAR POTHULA · TECHNICAL UI DESIGNER</span>
          <h1 className="ps-title">{project.title}</h1>
          <span className="ps-meta">
            {project.kind} · {project.status}
          </span>
        </div>
        <img
          className="ps-logo"
          src={logoAsset.url}
          alt="Jaikar UI Studio"
        />
      </header>

      <p className="ps-lead">{project.description}</p>

      <div className="ps-grid">
        {[
          { k: "01 · PROBLEM", v: project.study.problem },
          { k: "02 · DECISION", v: project.study.decision },
          { k: "03 · OUTCOME", v: project.study.outcome },
        ].map((row) => (
          <div key={row.k} className="ps-cell">
            <span className="ps-label">{row.k}</span>
            <p>{row.v}</p>
          </div>
        ))}
      </div>

      <div className="ps-cols">
        <div>
          <span className="ps-label">04 · PROOF</span>
          <ul className="ps-list">
            {project.study.proof.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <span className="ps-label">06 · PIPELINE</span>
          <ul className="ps-list">
            {phases.map((p) => (
              <li key={p.num}>
                <strong>{p.title}</strong> — {p.body}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="ps-label">05 · METRICS</span>
          <table className="ps-table">
            <tbody>
              {metrics.map((m) => (
                <tr key={m.label}>
                  <th scope="row">{m.label}</th>
                  <td>{m.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className="ps-label">ARTIFACTS</span>
          <ul className="ps-list ps-links">
            {project.links.map((l) => (
              <li key={l.href + l.label}>{l.href}</li>
            ))}
          </ul>
        </div>
      </div>

      {shots.length ? (
        <div className="ps-shots">
          {shots.map((s) => (
            <figure key={s.src}>
              <img src={s.src} alt={s.caption} />
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}

      <footer className="ps-foot">
        <span>{contact.email}</span>
        <span>jaikarpothula.com</span>
        <span>{project.tags.join(" · ")}</span>
      </footer>
    </div>
  );
}

/** Mounts the sheet at the end of <body> so print rules can isolate it. */
export function CasePrintSheet({ project }: { project: Project }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return createPortal(
    <div className="print-root hidden print:block">
      <Sheet project={project} />
    </div>,
    document.body,
  );
}

export function exportCasePdf() {
  window.print();
}