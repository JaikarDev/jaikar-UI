import { supabase } from "@/integrations/supabase/client";

export type Stamp = {
  id: string;
  name: string;
  note: string | null;
  shape: number;
  hue: number;
  seed: number;
  created_at: string;
};

export const STAMP_INKS = [
  { key: 0, label: "INDIGO", color: "var(--primary)" },
  { key: 1, label: "PHOSPHOR", color: "var(--phosphor)" },
  { key: 2, label: "TEAL", color: "oklch(0.72 0.09 190)" },
  { key: 3, label: "BONE", color: "var(--foreground)" },
  { key: 4, label: "BRASS", color: "oklch(0.78 0.11 88)" },
  { key: 5, label: "GRAPHITE", color: "var(--muted-foreground)" },
] as const;

export const STAMP_SHAPES = [
  { key: 3, label: "TRI" },
  { key: 4, label: "QUAD" },
  { key: 5, label: "PENTA" },
  { key: 6, label: "HEX" },
  { key: 7, label: "HEPTA" },
  { key: 8, label: "OCTA" },
  { key: 9, label: "ENNEA" },
  { key: 12, label: "DODECA" },
] as const;

export function inkFor(hue: number) {
  return STAMP_INKS[Math.abs(hue) % STAMP_INKS.length]!;
}

/** Deterministic PRNG so a stamp renders identically on server and client. */
export function rng(seed: number) {
  let s = (seed % 2147483647) + 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const LOCAL_STAMPS_KEY = "jp-guestbook-stamps";

function hasSupabaseConfig() {
  return Boolean(
    import.meta.env["VITE_SUPABASE_URL"] &&
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
  );
}

function readLocalStamps(): Stamp[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_STAMPS_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as Stamp[]) : [];
  } catch {
    return [];
  }
}

function writeLocalStamps(stamps: Stamp[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_STAMPS_KEY, JSON.stringify(stamps.slice(0, 200)));
}

export async function fetchStamps(): Promise<Stamp[]> {
  if (!hasSupabaseConfig()) return readLocalStamps();

  const { data, error } = await supabase
    .from("guestbook_stamps")
    .select("id,name,note,shape,hue,seed,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as Stamp[];
}

export async function addStamp(input: {
  name: string;
  note: string | null;
  shape: number;
  hue: number;
}): Promise<Stamp> {
  if (!hasSupabaseConfig()) {
    const stamp: Stamp = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: input.name,
      note: input.note,
      shape: input.shape,
      hue: input.hue,
      seed: Math.floor(Math.random() * 100000),
      created_at: new Date().toISOString(),
    };
    writeLocalStamps([stamp, ...readLocalStamps()]);
    return stamp;
  }

  const { data, error } = await supabase
    .from("guestbook_stamps")
    .insert({
      name: input.name,
      note: input.note,
      shape: input.shape,
      hue: input.hue,
      seed: Math.floor(Math.random() * 100000),
    })
    .select("id,name,note,shape,hue,seed,created_at")
    .single();
  if (error) throw error;
  return data as Stamp;
}

export function stampTime(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${String(d.getUTCFullYear()).slice(2)}`,
    time: `${p(d.getUTCHours())}:${p(d.getUTCMinutes())} GMT`,
  };
}
