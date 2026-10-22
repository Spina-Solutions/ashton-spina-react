import { useMemo, useState } from "react";
import { Tile, TileLabel } from "../bento/Tile.js";
import { SectionHeader } from "../bento/SectionHeader.js";
import { journey, type JourneyStop } from "../../content/journey.js";
import { computeTimelineLayout, timelineTicks, type TimelineBar } from "../../utils/timeline.js";

// One colour per stop, in journey order; all chosen to read on the dark tile.
const BAR_COLORS = ["bg-sage text-white", "bg-sun text-ink", "bg-coral text-white", "bg-paper text-ink", "bg-coral text-white"];
const LANE_HEIGHT_REM = 3.25;

function periodLabel(stop: JourneyStop): string {
  return `${stop.startYear}–${stop.endYear ?? "now"}`;
}

function durationLabel(stop: JourneyStop, nowYear: number): string {
  const years = Math.max((stop.endYear ?? nowYear) - stop.startYear, 1);
  return `${years} year${years === 1 ? "" : "s"}`;
}

export function JourneySection() {
  const nowYear = new Date().getFullYear();
  const layout = useMemo(() => computeTimelineLayout(journey, nowYear), [nowYear]);
  const ticks = useMemo(() => timelineTicks(layout.startYear, layout.endYear, 5), [layout]);
  const [activeIndex, setActiveIndex] = useState(journey.length - 1);
  const active = journey[activeIndex];

  const step = (delta: 1 | -1) => setActiveIndex((i) => (i + delta + journey.length) % journey.length);

  return (
    <section id="journey" className={"pt-12"}>
      <SectionHeader title="Journey" />
      <Tile tone="night" className={"!p-5 sm:!p-8"}>
        <div className={"flex flex-wrap items-end justify-between gap-4"}>
          <div>
            <TileLabel>Places I've called home</TileLabel>
            <div className={"mt-2 text-4xl sm:text-5xl font-medium tracking-tight"}>
              {journey.length} countries, {layout.endYear - layout.startYear} years
            </div>
          </div>
          <div className={"hidden sm:flex gap-2"}>
            <StepButton label="Previous stop" onClick={() => step(-1)} direction="left" />
            <StepButton label="Next stop" onClick={() => step(1)} direction="right" />
          </div>
        </div>

        <VerticalTimeline nowYear={nowYear} />

        <div className={"mt-8 hidden sm:block"}>
          <div className={"relative"} style={{ height: `${layout.laneCount * LANE_HEIGHT_REM}rem` }}>
            {journey.map((stop, i) => (
              <TimelineBarButton
                key={stop.country}
                stop={stop}
                bar={layout.bars[i]}
                color={BAR_COLORS[i % BAR_COLORS.length]}
                isActive={i === activeIndex}
                isCurrent={stop.endYear === null}
                onActivate={() => setActiveIndex(i)}
              />
            ))}
          </div>
          <TickAxis ticks={ticks} startYear={layout.startYear} endYear={layout.endYear} />
        </div>

        <div key={active.country} className={"mt-8 hidden sm:grid gap-4 grid-cols-[auto_1fr] items-center animate-fade-up"} aria-live="polite">
          <div className={"text-6xl sm:text-7xl leading-none"} aria-hidden>{active.flag}</div>
          <div>
            <div className={"flex flex-wrap items-baseline gap-x-3"}>
              <h3 className={"text-3xl font-medium tracking-tight"}>{active.country}</h3>
              <span className={"text-sm tabular-nums opacity-60"}>
                {periodLabel(active)} · {durationLabel(active, nowYear)}
              </span>
            </div>
            <p className={"mt-2 max-w-2xl opacity-75"}>{active.description}</p>
          </div>
        </div>
      </Tile>
    </section>
  );
}

// Phones get every stop at once, newest first, on a vertical rail.
function VerticalTimeline({ nowYear }: { nowYear: number }) {
  const stops = journey.map((stop, i) => ({ stop, color: BAR_COLORS[i % BAR_COLORS.length] })).reverse();

  return (
    <ol className={"relative mt-8 space-y-6 sm:hidden before:absolute before:left-[1.125rem] before:top-2 before:bottom-2 before:w-px before:bg-white/15"}>
      {stops.map(({ stop, color }) => (
        <li key={stop.country} className={"relative grid grid-cols-[2.25rem_1fr] gap-4"}>
          <span className={`relative grid h-9 w-9 place-items-center rounded-full text-lg ${color}`} aria-hidden>
            {stop.flag}
            {stop.endYear === null ? <span className={"absolute inset-0 rounded-full ring-2 ring-coral animate-pulse-ring"} /> : null}
          </span>
          <div>
            <div className={"flex flex-wrap items-baseline gap-x-2"}>
              <h3 className={"text-xl font-medium"}>{stop.country}</h3>
              <span className={"text-xs tabular-nums opacity-60"}>
                {periodLabel(stop)} · {durationLabel(stop, nowYear)}
              </span>
            </div>
            <p className={"mt-1 text-sm opacity-75"}>{stop.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function TimelineBarButton({
  stop,
  bar,
  color,
  isActive,
  isCurrent,
  onActivate,
}: {
  stop: JourneyStop;
  bar: TimelineBar;
  color: string;
  isActive: boolean;
  isCurrent: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onActivate}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-pressed={isActive}
      aria-label={`${stop.country}, ${periodLabel(stop)}`}
      className={[
        "absolute flex h-11 min-w-11 items-center gap-2 rounded-full px-2.5 text-sm font-medium",
        "transition-all duration-200 hover:scale-y-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
        color,
        isActive ? "-translate-y-1 ring-2 ring-paper ring-offset-2 ring-offset-ink shadow-lg shadow-black/40 z-10" : "saturate-[0.65] brightness-90 hover:saturate-100 hover:brightness-100",
      ].join(" ")}
      style={{
        left: `${bar.leftPct}%`,
        width: `${bar.widthPct}%`,
        top: `${bar.lane * LANE_HEIGHT_REM}rem`,
      }}
    >
      <span aria-hidden className={"text-lg leading-none"}>{stop.flag}</span>
      {bar.widthPct > 12 ? <span className={"hidden sm:inline truncate"}>{stop.country}</span> : null}
      {isCurrent ? (
        <span className={"absolute -right-1 top-1/2 -translate-y-1/2"} aria-hidden>
          <span className={"absolute inset-0 rounded-full bg-paper animate-pulse-ring"} />
          <span className={"relative block h-3 w-3 rounded-full bg-paper ring-2 ring-ink"} />
        </span>
      ) : null}
    </button>
  );
}

function TickAxis({ ticks, startYear, endYear }: { ticks: number[]; startYear: number; endYear: number }) {
  const span = endYear - startYear;
  return (
    <div className={"relative mt-3 h-6 border-t border-white/15 text-xs tabular-nums opacity-60"}>
      {ticks.map((year, i) => {
        const pct = ((year - startYear) / span) * 100;
        const align = i === 0 ? "translate-x-0" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2";
        return (
          <span key={year} className={`absolute top-1.5 ${align}`} style={{ left: `${pct}%` }}>
            {i === ticks.length - 1 ? "Now" : year}
          </span>
        );
      })}
    </div>
  );
}

function StepButton({ label, onClick, direction }: { label: string; onClick: () => void; direction: "left" | "right" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={"grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-coral hover:text-white transition-colors"}
    >
      <svg viewBox="0 0 24 24" className={"h-5 w-5"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
