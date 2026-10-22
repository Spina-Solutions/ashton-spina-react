import { useSiteMode } from "../../hooks/useSiteMode.js";
import type { SiteMode } from "../../types/bento.js";

const OPTIONS: Array<{ value: SiteMode; label: string }> = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
];

export function ModeToggle({ inverted = false }: { inverted?: boolean }) {
  const { mode, setMode } = useSiteMode();

  const track = inverted ? "bg-white/10 dark:bg-black/10" : "bg-black/5 dark:bg-white/10";
  const active = inverted
    ? "bg-paper text-ink dark:bg-ink dark:text-paper"
    : "bg-ink text-paper dark:bg-paper dark:text-ink";

  return (
    <div role="radiogroup" aria-label="Site mode" className={`inline-flex rounded-full p-1 text-sm font-medium ${track}`}>
      {OPTIONS.map((opt) => {
        const selected = opt.value === mode;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setMode(opt.value)}
            className={`rounded-full px-3.5 py-1.5 transition-colors ${selected ? active : "opacity-70 hover:opacity-100"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
