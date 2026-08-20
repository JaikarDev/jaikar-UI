import { useEffect, useRef, useState, type ElementType } from "react";
import { isMotionReduced } from "@/lib/motion-pref";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#";

/**
 * Letters scramble briefly on hover / focus, then settle back into the real
 * word — the signature link treatment on lisa.locomotive.ca.
 */
export function ScrambleText({
  text,
  as = "span",
  className,
  trigger,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  /** External trigger: flips scramble on when it changes to true. */
  trigger?: boolean;
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(() => setDisplay(text), [text]);

  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    setDisplay(text);
  };

  const run = () => {
    if (isMotionReduced() || timer.current !== null) return;
    frame.current = 0;
    timer.current = window.setInterval(() => {
      frame.current += 1;
      const revealed = Math.floor(frame.current / 1.6);
      if (revealed >= text.length) {
        stop();
        return;
      }
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (i < revealed || ch === " ") return ch;
            const g = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? ch;
            return ch === ch.toLowerCase() && ch !== ch.toUpperCase()
              ? g.toLowerCase()
              : g;
          })
          .join(""),
      );
    }, 28);
  };

  useEffect(() => {
    if (trigger) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => () => {
    if (timer.current !== null) window.clearInterval(timer.current);
  }, []);

  const Tag = as;
  return (
    <Tag
      className={className}
      onMouseEnter={run}
      onFocus={run}
      onPointerDown={run}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {display}
    </Tag>
  );
}
