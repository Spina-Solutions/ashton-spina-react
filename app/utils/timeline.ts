export type TimelineSpan = {
  startYear: number;
  endYear: number | null;
};

export type TimelineBar = {
  leftPct: number;
  widthPct: number;
  lane: number;
};

export type TimelineLayout = {
  startYear: number;
  endYear: number;
  laneCount: number;
  bars: TimelineBar[];
};

// Lays spans out on a shared year axis. Overlapping spans move to the first
// lane that is free; an open-ended span runs to `nowYear`.
export function computeTimelineLayout(spans: TimelineSpan[], nowYear: number): TimelineLayout {
  if (spans.length === 0) {
    return { startYear: nowYear, endYear: nowYear, laneCount: 0, bars: [] };
  }

  const resolved = spans.map((s) => ({ start: s.startYear, end: Math.max(s.endYear ?? nowYear, s.startYear) }));
  const startYear = Math.min(...resolved.map((s) => s.start));
  const endYear = Math.max(...resolved.map((s) => s.end), startYear + 1);
  const total = endYear - startYear;

  const order = resolved.map((_, i) => i).sort((a, b) => resolved[a].start - resolved[b].start);
  const laneEnds: number[] = [];
  const lanes = new Array<number>(spans.length);

  for (const i of order) {
    const { start, end } = resolved[i];
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    lanes[i] = lane;
  }

  const bars = resolved.map((s, i) => ({
    leftPct: ((s.start - startYear) / total) * 100,
    widthPct: ((s.end - s.start) / total) * 100,
    lane: lanes[i],
  }));

  return { startYear, endYear, laneCount: laneEnds.length, bars };
}

// Tick years every `step`, aligned to multiples of `step`, always including both ends.
export function timelineTicks(startYear: number, endYear: number, step: number): number[] {
  const ticks = new Set<number>([startYear]);
  // Skip ticks that would crowd the end label
  for (let y = Math.ceil(startYear / step) * step; y <= endYear - step / 2; y += step) {
    if (y - startYear >= step / 2) ticks.add(y);
  }
  ticks.add(endYear);
  return [...ticks].sort((a, b) => a - b);
}
