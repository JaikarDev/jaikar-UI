import { useEffect, useState } from "react";

/** Thin progress bar that plays once on page load, then fades out. */
export function LoadProgress() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDone(true), 1700);
    return () => window.clearTimeout(id);
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[2px] bg-transparent"
    >
      <div className="load-bar h-full w-full bg-primary shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_60%,transparent)]" />
    </div>
  );
}