import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { StampMark } from "./StampMark";
import {
  addStamp,
  fetchStamps,
  inkFor,
  rng,
  stampTime,
  STAMP_INKS,
  STAMP_SHAPES,
  type Stamp,
} from "@/lib/guestbook";
import { feedback, playSound } from "@/lib/ui-sound";
import { track } from "@/lib/telemetry";
import { WallSettings } from "./WallSettings";
import {
  DEFAULT_WALL_PREFS,
  loadWallPrefs,
  noteFontStyle,
  noteTextClass,
  patternStyle,
  setWallPrefs,
  stampColor,
  subscribeWallPrefs,
  type WallPrefs,
} from "@/lib/wall-prefs";
import {
  bumpStamp,
  loadStampStats,
  rankStamps,
  resetStampStats,
  stampScore,
  subscribeStampStats,
  type StampStat,
} from "@/lib/stamp-stats";

/** Column count follows the viewport; stamps stay large enough to tap. */
function useWallColumns() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const read = () => {
      const w = window.innerWidth;
      setCols(w >= 1024 ? 4 : w >= 640 ? 3 : 2);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return cols;
}

/** Scatters stamps across the wall deterministically so SSR matches hydration. */
function useWall(stamps: Stamp[], cols: number, size: number) {
  return useMemo(() => {
    const rowStep = size * 0.66;
    const colWidth = 100 / cols;
    /** Narrow walls need a bigger edge margin so stamps never clip. */
    const margin = cols <= 2 ? 28 : cols === 3 ? 20 : 16;
    return stamps.map((s, i) => {
      const r = rng(s.seed + i * 97 + 13);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const stagger = row % 2 === 1 ? colWidth * 0.34 : 0;
      const center = Math.min(
        100 - margin,
        Math.max(margin, col * colWidth + colWidth / 2 + stagger + r() * 8 - 4),
      );
      return {
        stamp: s,
        left: `${center}%`,
        top: `${row * rowStep + r() * (rowStep * 0.34)}px`,
        rotate: r() * 24 - 12,
        scale: 0.82 + r() * 0.34,
        z: Math.round(r() * 20),
      };
    });
  }, [stamps, cols, size]);
}

export function Guestbook() {
  const qc = useQueryClient();
  const { data: stamps = [], isLoading } = useQuery({
    queryKey: ["guestbook"],
    queryFn: fetchStamps,
  });

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [shape, setShape] = useState(6);
  const [hue, setHue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mine, setMine] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [readout, setReadout] = useState<Stamp | null>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const [prefs, setPrefs] = useState<WallPrefs>(DEFAULT_WALL_PREFS);
  const [stats, setStats] = useState<Record<string, StampStat>>({});

  useEffect(() => {
    setPrefs(loadWallPrefs());
    setStats(loadStampStats());
    const offPrefs = subscribeWallPrefs(setPrefs);
    const offStats = subscribeStampStats(setStats);
    return () => {
      offPrefs();
      offStats();
    };
  }, []);

  const ranked = rankStamps(stamps, stats);

  const cols = useWallColumns();
  const stampSize = cols === 2 ? 128 : cols === 3 ? 148 : 168;
  const wall = useWall(stamps, cols, stampSize);
  const rows = Math.max(1, Math.ceil(stamps.length / cols));
  const wallHeight = Math.max(
    stampSize * 2.4,
    (rows - 1) * stampSize * 0.66 + stampSize * 1.6,
  );

  const focusStamp = useCallback(
    (next: number) => {
      if (!stamps.length) return;
      const clamped = Math.max(0, Math.min(stamps.length - 1, next));
      setCursor(clamped);
      setReadout(stamps[clamped] ?? null);
      const node = wallRef.current?.querySelector<HTMLButtonElement>(
        `[data-stamp-index="${clamped}"]`,
      );
      node?.focus();
      playSound("hover");
    },
    [stamps],
  );

  const onStampKeyDown = (e: React.KeyboardEvent, index: number) => {
    const map: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index + cols,
      ArrowUp: index - cols,
      Home: 0,
      End: stamps.length - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    // keep the device-wide arrow shortcuts from also firing
    e.preventDefault();
    e.stopPropagation();
    focusStamp(next);
    track("key", "guestbook:walk");
  };

  const mutation = useMutation({
    mutationFn: () =>
      addStamp({ name: name.trim(), note: note.trim() || null, shape, hue }),
    onSuccess: (stamp) => {
      setName("");
      setNote("");
      setError(null);
      setMine(stamp.id);
      track("share", `guestbook:${stamp.shape}-${stamp.hue}`);
      feedback("open");
      void qc.invalidateQueries({ queryKey: ["guestbook"] });
    },
    onError: () => setError("Stamp rejected — try a shorter name or note."),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter a name to ink your stamp.");
      return;
    }
    mutation.mutate();
  };

  const preview: Stamp = {
    id: "preview",
    name: name.trim() || "YOU",
    note: null,
    shape,
    hue,
    seed: 4242,
    created_at: new Date().toISOString(),
  };

  return (
    <section id="guestbook" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-28">
        <SectionHeader index="10" title="Guestbook" emphasis="stamps" />

        <Reveal className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <p
            className="text-2xl leading-tight text-foreground/90 sm:text-4xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Your mark is on the wall.
          </p>
          <span className="label-mono text-muted-foreground">
            {stamps.length} VISITOR STAMP{stamps.length === 1 ? "" : "S"}
          </span>
        </Reveal>

        <p className="label-mono mt-3 text-muted-foreground">
          TAP A STAMP · OR ARROW KEYS TO WALK THE WALL
        </p>

        <div className="mt-8 grid gap-px bg-border sm:mt-10 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* wall */}
          <div
            style={{ alignSelf: "start" }}
            className="relative flex min-w-0 flex-col overflow-hidden bg-surface"
          >
            {/* faded name layer, decorative */}
            <p
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden p-4 text-center leading-[1.9] text-foreground/[0.055] select-none"
              style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem" }}
            >
              {stamps.concat(stamps).slice(0, 90).map((s) => `${s.name}  `)}
            </p>
            <div
              ref={wallRef}
              role="group"
              id="guestbook-wall"
              data-key-scope="guestbook"
              className="relative flex-1"
              style={{ minHeight: `${wallHeight}px`, ...patternStyle(prefs.pattern) }}
              aria-label="Wall of visitor stamps"
            >
              {isLoading ? (
                <p className="label-mono absolute inset-0 grid place-items-center text-muted-foreground">
                  READING THE WALL…
                </p>
              ) : null}
              {!isLoading && stamps.length === 0 ? (
                <p className="label-mono absolute inset-0 grid place-items-center text-muted-foreground">
                  NO STAMPS YET — BE THE FIRST
                </p>
              ) : null}
              {wall.map((w, i) => {
                const t = stampTime(w.stamp.created_at);
                const active =
                  readout?.id === w.stamp.id || w.stamp.id === mine;
                const stat = stats[w.stamp.id];
                const score = stampScore(stat);
                return (
                  <button
                    key={w.stamp.id}
                    type="button"
                    data-stamp-index={i}
                    tabIndex={i === cursor ? 0 : -1}
                    aria-label={`Stamp ${i + 1} of ${stamps.length}: ${w.stamp.name}, ${t.date} ${t.time}${
                      w.stamp.note ? `. Note: ${w.stamp.note}` : ""
                    }${
                      stat
                        ? `. ${stat.clicks} clicks, ${stat.hovers} hovers`
                        : ". No attention recorded yet"
                    }`}
                    onKeyDown={(e) => onStampKeyDown(e, i)}
                    onFocus={() => {
                      setCursor(i);
                      setReadout(w.stamp);
                      bumpStamp(w.stamp.id, "hovers");
                    }}
                    onMouseEnter={() => {
                      playSound("hover");
                      setReadout(w.stamp);
                      bumpStamp(w.stamp.id, "hovers");
                    }}
                    onClick={() => {
                      setCursor(i);
                      setReadout(w.stamp);
                      bumpStamp(w.stamp.id, "clicks");
                      track("key", `guestbook:stamp:${w.stamp.name}`);
                      feedback("click");
                    }}
                    className="motion-base group absolute grid min-h-11 min-w-11 -translate-x-1/2 place-items-center transition-[transform,opacity] duration-500 hover:z-50 focus-visible:z-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    style={{
                      left: w.left,
                      top: w.top,
                      zIndex: active ? 60 : w.z,
                      transform: `translateX(-50%) rotate(${w.rotate}deg) scale(${
                        active ? w.scale * 1.06 : w.scale
                      })`,
                      opacity: active ? 1 : 0.58,
                    }}
                  >
                    <StampMark
                      stamp={w.stamp}
                      size={stampSize}
                      ink={stampColor(w.stamp.hue, prefs.palette)}
                      className="motion-base transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                    {score > 0 ? (
                      <span
                        aria-hidden
                        className="label-mono absolute -top-1 right-0 border border-border bg-background px-1 text-primary"
                      >
                        {score}
                      </span>
                    ) : null}
                    {w.stamp.note ? (
                      <span
                        style={noteFontStyle(prefs.noteStyle)}
                        className={`pointer-events-none absolute top-full left-1/2 hidden w-40 -translate-x-1/2 text-center text-[0.7rem] leading-snug text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:block ${noteTextClass(
                          prefs.noteStyle,
                        )}`}
                      >
                        “{w.stamp.note}”
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {/* readout — the note surface for touch and keyboard users */}
            <div
              aria-live="polite"
              className="relative mt-auto border-t border-border bg-background px-4 py-3 sm:px-5"
            >
              {readout ? (
                <>
                  <span className="label-mono text-primary">
                    {readout.name} · {stampTime(readout.created_at).date}{" "}
                    {stampTime(readout.created_at).time}
                  </span>
                  <p
                    style={noteFontStyle(prefs.noteStyle)}
                    className={`mt-1 text-sm leading-relaxed text-foreground/90 ${noteTextClass(
                      prefs.noteStyle,
                    )}`}
                  >
                    {readout.note ? `“${readout.note}”` : "No note left."}
                  </p>
                </>
              ) : (
                <span className="label-mono text-muted-foreground">
                  SELECT A STAMP TO READ ITS NOTE
                </span>
              )}
            </div>
          </div>

          {/* console */}
          <div className="min-w-0 bg-background">
            <div className="border-b border-border px-5 py-3">
              <span className="label-mono text-primary">INK YOUR STAMP</span>
            </div>
            <form onSubmit={submit} className="space-y-5 p-4 sm:p-5">
              <div className="grid place-items-center border border-border bg-surface py-4">
                <StampMark stamp={preview} size={150} />
              </div>

              <label className="block">
                <span className="label-mono text-muted-foreground">NAME / TAG</span>
                <input
                  value={name}
                  maxLength={24}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Player one"
                  className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary"
                />
              </label>

              <label className="block">
                <span className="label-mono text-muted-foreground">NOTE (OPTIONAL)</span>
                <input
                  value={note}
                  maxLength={90}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Say something short"
                  className="mt-2 w-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary"
                />
              </label>

              <fieldset>
                <legend className="label-mono text-muted-foreground">DIE SHAPE</legend>
                <div className="mt-2 flex flex-wrap gap-px bg-border">
                  {STAMP_SHAPES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      aria-pressed={shape === s.key}
                      onMouseEnter={() => playSound("hover")}
                      onClick={() => {
                        setShape(s.key);
                        feedback("click");
                      }}
                      className={`label-mono grid min-h-11 min-w-11 place-items-center bg-background px-2.5 transition-colors ${
                        shape === s.key
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label-mono text-muted-foreground">INK</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STAMP_INKS.map((k) => (
                    <button
                      key={k.key}
                      type="button"
                      aria-label={`Ink ${k.label}`}
                      aria-pressed={hue === k.key}
                      onMouseEnter={() => playSound("hover")}
                      onClick={() => {
                        setHue(k.key);
                        feedback("click");
                      }}
                      className={`h-11 w-11 border transition-transform sm:h-9 sm:w-9 ${
                        hue === k.key ? "scale-110 border-primary" : "border-border"
                      }`}
                      style={{ background: k.color }}
                    />
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={mutation.isPending}
                onMouseEnter={() => playSound("hover")}
                className="btn-console btn-console-primary w-full justify-center disabled:opacity-60"
              >
                {mutation.isPending ? "STAMPING…" : "PRESS STAMP ↵"}
              </button>

              <p aria-live="polite" className="label-mono min-h-4 text-primary">
                {error ?? (mine ? "STAMP ACCEPTED — WELCOME TO THE WALL" : "")}
              </p>
            </form>

            <WallSettings
              prefs={prefs}
              onChange={(next) => setWallPrefs(next)}
            />

            {/* attention — which marks visitors actually look at */}
            <div className="border-t border-border">
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
                <span className="label-mono text-muted-foreground">ATTENTION</span>
                <button
                  type="button"
                  onClick={() => {
                    resetStampStats();
                    feedback("click");
                  }}
                  className="label-mono text-muted-foreground transition-colors hover:text-primary"
                >
                  RESET
                </button>
              </div>
              {ranked.length === 0 ? (
                <p className="label-mono px-4 py-3 text-muted-foreground sm:px-5">
                  NO STAMP ENGAGEMENT RECORDED YET
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {ranked.map(({ item, stat }) => (
                    <li
                      key={item.id}
                      className="flex items-baseline gap-3 px-4 py-2.5 sm:px-5"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground/90">
                        {item.name}
                      </span>
                      <span className="label-mono shrink-0 text-primary">
                        {stat?.clicks ?? 0} CLK · {stat?.hovers ?? 0} HVR
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-border">
              <div className="border-b border-border px-5 py-3">
                <span className="label-mono text-muted-foreground">CHANGELOG</span>
              </div>
              <ul className="divide-y divide-border">
                {stamps.slice(0, 10).map((s) => {
                  const t = stampTime(s.created_at);
                  return (
                    <li
                      key={s.id}
                      className="flex items-baseline gap-3 px-4 py-2.5 sm:px-5"
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0"
                        style={{ background: inkFor(s.hue).color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground/90">
                        {s.name}
                      </span>
                      <span className="label-mono shrink-0 text-muted-foreground">
                        {t.date} · {t.time}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}