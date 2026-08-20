import { useEffect, type ReactNode } from "react";
import { feedback, playSound } from "@/lib/ui-sound";

export function Overlay({
  open,
  onClose,
  label,
  children,
  onPrev,
  onNext,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        feedback("nav");
        onPrev?.();
      }
      if (e.key === "ArrowRight") {
        feedback("nav");
        onNext?.();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-100 flex items-center justify-center overlay-in bg-background/96 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="overlay-panel-in relative max-h-[92dvh] w-full max-w-[1200px] overflow-y-auto border border-border bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6">
          <span className="label-mono truncate text-muted-foreground">{label}</span>
          <div className="flex items-center gap-px bg-border">
            {onPrev ? (
              <button
                type="button"
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  feedback("nav");
                  onPrev();
                }}
                aria-label="Previous"
                className="motion-fast label-mono bg-background px-4 py-2.5 transition-colors hover:text-primary active:bg-primary/10"
              >
                ←
              </button>
            ) : null}
            {onNext ? (
              <button
                type="button"
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  feedback("nav");
                  onNext();
                }}
                aria-label="Next"
                className="motion-fast label-mono bg-background px-4 py-2.5 transition-colors hover:text-primary active:bg-primary/10"
              >
                →
              </button>
            ) : null}
            <button
              type="button"
              onMouseEnter={() => playSound("hover")}
              onClick={onClose}
              aria-label="Close"
              className="motion-fast label-mono bg-background px-4 py-2.5 transition-colors hover:text-primary active:bg-primary/10"
            >
              ✕ ESC
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}