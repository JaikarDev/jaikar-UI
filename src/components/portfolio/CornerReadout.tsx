import { useEffect, useState } from "react";

function stamp(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** Live clock + pointer X/Y coordinate readouts pinned to the screen corners. */
export function CornerReadout() {
  const [time, setTime] = useState("");
  const [zone, setZone] = useState("");
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const offset = -new Date().getTimezoneOffset() / 60;
    setZone(`GMT${offset >= 0 ? "+" : ""}${offset}`);
    setTime(stamp(new Date()));
    const id = window.setInterval(() => setTime(stamp(new Date())), 1000);
    const move = (e: PointerEvent) =>
      setPos({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none">
      <div className="label-mono fixed bottom-6 left-5 z-40 px-1 text-muted-foreground/80 sm:left-8">
        {time}
        <span className="ml-2 text-primary/70">{zone}</span>
      </div>
      <div className="label-mono fixed bottom-16 right-8 z-40 hidden px-1 text-muted-foreground/80 lg:block">
        X{String(pos.x).padStart(4, "0")} / Y{String(pos.y).padStart(4, "0")}
      </div>
    </div>
  );
}