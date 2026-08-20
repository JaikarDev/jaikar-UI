/* WCAG contrast utilities for the in-app theme checker. */

export type Pair = {
  label: string;
  fg: string;
  bg: string;
  /** large / bold text can pass at 3:1 */
  large?: boolean;
  /** non-text (borders, indicators) target 3:1 */
  ui?: boolean;
  /** purely decorative hairlines: informational only, no WCAG threshold */
  decorative?: boolean;
};

export const AUDIT_PAIRS: Pair[] = [
  { label: "Body text", fg: "--foreground", bg: "--background" },
  { label: "Secondary text", fg: "--muted-foreground", bg: "--background" },
  { label: "Secondary on surface", fg: "--muted-foreground", bg: "--surface" },
  { label: "Secondary on card", fg: "--muted-foreground", bg: "--card" },
  { label: "Mono labels (accent)", fg: "--primary", bg: "--background" },
  { label: "Accent text", fg: "--accent", bg: "--background" },
  { label: "Primary button", fg: "--primary-foreground", bg: "--primary" },
  { label: "Chassis key text", fg: "--muted-foreground", bg: "--chassis" },
  { label: "Headline on screen", fg: "--foreground", bg: "--screen", large: true },
  {
    label: "Hairline borders (decorative)",
    fg: "--border",
    bg: "--background",
    decorative: true,
  },
  { label: "Focus ring", fg: "--ring", bg: "--background", ui: true },
];

function parse(color: string): [number, number, number, number] {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d");
  if (!ctx) return [0, 0, 0, 1];
  ctx.fillStyle = "#000";
  ctx.fillStyle = color;
  // Non-parsable values leave fillStyle unchanged; canvas normalises the rest.
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0]!, d[1]!, d[2]!, (d[3]! as number) / 255];
}

function luminance([r, g, b]: number[]) {
  const lin = [r!, g!, b!].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
}

/** Flatten a translucent foreground over its background before measuring. */
function composite(
  fg: [number, number, number, number],
  bg: [number, number, number, number],
) {
  const a = fg[3];
  return [
    fg[0] * a + bg[0] * (1 - a),
    fg[1] * a + bg[1] * (1 - a),
    fg[2] * a + bg[2] * (1 - a),
  ];
}

export function ratio(fgColor: string, bgColor: string) {
  const bg = parse(bgColor);
  const fg = composite(parse(fgColor), bg);
  const l1 = luminance(fg);
  const l2 = luminance([bg[0], bg[1], bg[2]]);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export type Result = Pair & {
  value: number;
  required: number;
  status: "pass" | "aa" | "fail" | "info";
};

export function auditPairs(scope: HTMLElement, pairs = AUDIT_PAIRS): Result[] {
  const styles = getComputedStyle(scope);
  const read = (token: string) => styles.getPropertyValue(token).trim();

  return pairs.map((p) => {
    const value = ratio(read(p.fg), read(p.bg));
    const required = p.decorative ? 0 : p.ui || p.large ? 3 : 4.5;
    const status: Result["status"] = p.decorative
      ? "info"
      : value >= (p.ui || p.large ? 4.5 : 7)
        ? "pass"
        : value >= required
          ? "aa"
          : "fail";
    return { ...p, value, required, status };
  });
}