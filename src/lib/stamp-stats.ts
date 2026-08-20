/** Local-only attention counters per stamp: hovers/focuses and clicks. */
export type StampStat = { hovers: number; clicks: number };

const KEY = "jp-stamp-stats";
const subs = new Set<(s: Record<string, StampStat>) => void>();
let stats: Record<string, StampStat> = {};

export function loadStampStats(): Record<string, StampStat> {
  if (typeof window === "undefined") return {};
  try {
    stats = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, StampStat>;
  } catch {
    stats = {};
  }
  return stats;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    /* storage full — keep in-memory counts */
  }
}

export function bumpStamp(id: string, kind: keyof StampStat) {
  const prev = stats[id] ?? { hovers: 0, clicks: 0 };
  stats = { ...stats, [id]: { ...prev, [kind]: prev[kind] + 1 } };
  persist();
  subs.forEach((f) => f(stats));
}

export function resetStampStats() {
  stats = {};
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  subs.forEach((f) => f(stats));
}

export function subscribeStampStats(fn: (s: Record<string, StampStat>) => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function stampScore(s: StampStat | undefined) {
  if (!s) return 0;
  return s.clicks * 3 + s.hovers;
}

/** Highest-attention stamps first. */
export function rankStamps<T extends { id: string }>(
  items: T[],
  stats: Record<string, StampStat>,
  limit = 5,
) {
  return items
    .map((item) => ({ item, stat: stats[item.id], score: stampScore(stats[item.id]) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
