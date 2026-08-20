/** Hand-drawn scribble accents used as editorial marks near intro copy. */
export function Scribble({
  className = "",
  variant = "underline",
}: {
  className?: string;
  variant?: "underline" | "loop";
}) {
  if (variant === "loop") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 200 120"
        fill="none"
        className={`pointer-events-none text-primary ${className}`}
      >
        <path
          d="M18 92c22-52 52-78 82-70 26 7 24 46-4 55-30 10-58-14-44-42C67 8 108 2 142 16c30 12 44 40 40 66"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="scribble-draw"
          style={{ ["--len" as string]: 520 }}
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 320 40"
      fill="none"
      className={`pointer-events-none text-primary ${className}`}
    >
      <path
        d="M6 26c38-11 78-16 118-13 34 3 68 12 102 8 26-3 44-10 62-19-24 20-56 31-90 33-40 3-80-6-120-6-24 0-46 3-66 11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="scribble-draw"
        style={{ ["--len" as string]: 760 }}
      />
      <path
        d="M40 34c48-7 96-9 144-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
        className="scribble-draw"
        style={{ ["--len" as string]: 200, animationDelay: "700ms" }}
      />
    </svg>
  );
}