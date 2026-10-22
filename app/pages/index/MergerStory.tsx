import type { ReactNode } from "react";
import flatfoxLogo from "../../assets/logos/flatfox_logo.svg";
import smgLogo from "../../assets/logos/smg_logo.png";
import { Tile, TileLabel } from "../../components/bento/Tile.js";

// Visual case study: two marketplaces merge, flatfox is acquired, all of it becomes SMG Real Estate.
export function MergerStory() {
  return (
    <section id="case-study" className={"pt-12"}>
      <Tile tone="night" className={"sm:!p-8"}>
        <div className={"flex flex-wrap items-end justify-between gap-3"}>
          <div>
            <TileLabel>Case study</TileLabel>
            <h2 className={"mt-2 text-3xl sm:text-5xl font-medium leading-[1] tracking-tight"}>Building SMG Real Estate</h2>
          </div>
          <p className={"max-w-sm text-sm opacity-70"}>I was part of the merger and the acquisition that brought these marketplaces together.</p>
        </div>

        <ol className={"stagger mt-8 grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]"}>
          <li className={"grid gap-2"}>
            <StageLabel step={1}>Two marketplaces</StageLabel>
            <Brand name="homegate.ch" />
            <Brand name="immoscout24.ch" />
          </li>

          <Connector label="Merger" />

          <li className={"grid gap-2"}>
            <StageLabel step={2}>One platform, one team</StageLabel>
            <div className={"rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/15"}>
              <div className={"text-lg font-medium"}>homegate.ch <span className={"text-coral"}>+</span> immoscout24.ch</div>
              <div className={"text-xs opacity-60"}>Organisations and processes integrated</div>
            </div>
            <div className={"flex items-center gap-3 rounded-2xl border border-dashed border-white/25 px-4 py-3"}>
              <img src={flatfoxLogo} alt="" className={"h-8 w-8 rounded-lg bg-white p-1"} />
              <div>
                <div className={"font-medium"}>flatfox</div>
                <div className={"text-xs opacity-60"}>Joins through acquisition</div>
              </div>
            </div>
          </li>

          <Connector label="Acquisition" />

          <li className={"grid gap-2"}>
            <StageLabel step={3}>Today</StageLabel>
            <div className={"flex items-center gap-4 rounded-2xl bg-coral px-5 py-6 text-white"}>
              <img src={smgLogo} alt="" className={"h-14 w-14 rounded-xl bg-white object-contain"} />
              <div>
                <div className={"text-2xl font-medium leading-tight"}>SMG Real Estate</div>
                <div className={"text-sm opacity-85"}>Part of SMG Swiss Marketplace Group</div>
              </div>
            </div>
          </li>
        </ol>
      </Tile>
    </section>
  );
}

function StageLabel({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div className={"flex items-center gap-2 text-xs uppercase tracking-[0.14em] opacity-60"}>
      <span className={"grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[10px] tabular-nums"}>{step}</span>
      {children}
    </div>
  );
}

function Brand({ name }: { name: string }) {
  return (
    <div className={"flex items-center gap-3 rounded-2xl bg-paper px-4 py-3 text-ink"}>
      <span className={"grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-medium text-paper"} aria-hidden>
        {name[0].toUpperCase()}
      </span>
      <span className={"font-medium"}>{name}</span>
    </div>
  );
}

// Horizontal arrow on wide screens, vertical on narrow ones.
function Connector({ label }: { label: string }) {
  return (
    <li aria-hidden className={"flex items-center justify-center gap-2 py-1 lg:flex-col lg:px-2"}>
      <span className={"text-xs font-medium uppercase tracking-[0.14em] text-coral"}>{label}</span>
      <svg viewBox="0 0 48 24" className={"h-6 w-12 rotate-90 lg:rotate-0 text-coral"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h42M36 4l8 8-8 8" />
      </svg>
    </li>
  );
}
