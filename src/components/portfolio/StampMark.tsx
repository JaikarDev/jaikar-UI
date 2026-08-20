import { inkFor, rng, stampTime, type Stamp } from "@/lib/guestbook";

/**
 * A single visitor stamp: nested geometric outlines drawn deterministically
 * from the stamp seed, with the visitor name inked in the middle.
 */
export function StampMark({
  stamp,
  size = 168,
  className,
  ink: inkOverride,
}: {
  stamp: Stamp;
  size?: number;
  className?: string;
  /** Overrides the inked colour, e.g. when the visitor picks a wall palette. */
  ink?: string;
}) {
  const ink = inkFor(stamp.hue);
  const r = rng(stamp.seed + stamp.shape * 31 + 7);
  const sides = Math.max(3, Math.min(12, stamp.shape));
  const c = 100;
  const rings = [92, 78, 62];
  const spin = r() * 60 - 30;
  const star = sides >= 6;
  /** Reference wall mixes polygon dies with rounded-rect and circular dies. */
  const frame: "poly" | "rect" | "circle" =
    sides === 4 ? "rect" : sides >= 9 ? "circle" : "poly";
  const { date, time } = stampTime(stamp.created_at);

  const poly = (radius: number, rot: number, step = 1) => {
    const pts: string[] = [];
    const count = sides * (step > 1 ? 2 : 1);
    for (let i = 0; i < count; i += 1) {
      const a = ((i * step) % count) * ((Math.PI * 2) / count) + (rot * Math.PI) / 180;
      pts.push(
        `${(c + Math.cos(a - Math.PI / 2) * radius).toFixed(2)},${(
          c + Math.sin(a - Math.PI / 2) * radius
        ).toFixed(2)}`,
      );
    }
    return pts.join(" ");
  };

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={`Stamp from ${stamp.name}, ${date} ${time}`}
      style={{ color: inkOverride ?? ink.color }}
      className={`overflow-visible ${className ?? ""}`}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.15} opacity={0.9}>
        {rings.map((radius, i) => {
          const key = radius;
          const rot = spin + i * (r() * 14 - 7);
          const op = 1 - i * 0.18;
          if (frame === "rect") {
            return (
              <rect
                key={key}
                x={c - radius}
                y={c - radius * 0.82}
                width={radius * 2}
                height={radius * 1.64}
                rx={12}
                opacity={op}
                transform={`rotate(${rot.toFixed(2)} ${c} ${c})`}
              />
            );
          }
          if (frame === "circle") {
            return <circle key={key} cx={c} cy={c} r={radius} opacity={op} />;
          }
          return <polygon key={key} points={poly(radius, rot)} opacity={op} />;
        })}
        {star ? (
          <polygon points={poly(88, spin, 3)} opacity={0.5} strokeWidth={0.8} />
        ) : (
          <circle cx={c} cy={c} r={70} opacity={0.45} strokeWidth={0.8} />
        )}
      </g>
      <text
        x={c}
        y={c - 2}
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-serif)", fontSize: 26 }}
      >
        {stamp.name.slice(0, 14)}
      </text>
      <text
        x={c}
        y={c + 14}
        textAnchor="middle"
        fill="currentColor"
        opacity={0.7}
        style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: 0.6 }}
      >
        {date}
      </text>
      <text
        x={c}
        y={c + 25}
        textAnchor="middle"
        fill="currentColor"
        opacity={0.55}
        style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: 0.6 }}
      >
        {time}
      </text>
    </svg>
  );
}