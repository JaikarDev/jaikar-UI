import {
  NOTE_STYLES,
  PALETTES,
  PATTERNS,
  type WallPrefs,
} from "@/lib/wall-prefs";
import { feedback, playSound } from "@/lib/ui-sound";

type Group<K extends string> = {
  legend: string;
  options: readonly { key: K; label: string }[];
  value: K;
  onPick: (key: K) => void;
};

function Row<K extends string>({ legend, options, value, onPick }: Group<K>) {
  return (
    <fieldset>
      <legend className="label-mono text-muted-foreground">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-px bg-border">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-pressed={value === o.key}
            onMouseEnter={() => playSound("hover")}
            onClick={() => {
              onPick(o.key);
              feedback("click");
            }}
            className={`label-mono grid min-h-11 place-items-center bg-background px-2.5 transition-colors ${
              value === o.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Small panel that tweaks stamp colour, wall pattern and note typography. */
export function WallSettings({
  prefs,
  onChange,
}: {
  prefs: WallPrefs;
  onChange: (next: Partial<WallPrefs>) => void;
}) {
  return (
    <details className="border-t border-border">
      <summary className="label-mono flex min-h-11 cursor-pointer items-center justify-between px-5 text-primary">
        WALL SETTINGS
        <span aria-hidden className="text-muted-foreground">
          ▾
        </span>
      </summary>
      <div className="space-y-4 p-4 sm:p-5">
        <Row
          legend="STAMP COLOUR"
          options={PALETTES}
          value={prefs.palette}
          onPick={(palette) => onChange({ palette })}
        />
        <Row
          legend="BACKGROUND PATTERN"
          options={PATTERNS}
          value={prefs.pattern}
          onPick={(pattern) => onChange({ pattern })}
        />
        <Row
          legend="NOTE TEXT STYLE"
          options={NOTE_STYLES}
          value={prefs.noteStyle}
          onPick={(noteStyle) => onChange({ noteStyle })}
        />
      </div>
    </details>
  );
}
