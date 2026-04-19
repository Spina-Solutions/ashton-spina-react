interface Point { [k: string]: number | string; }

export function AreaChart({ data, width = 800, height = 220, x = "m", y = "v", style = "engraved" }:
  { data: Point[]; width?: number; height?: number; x?: string; y?: string; style?: "engraved" | "solid" }) {
  const pad = { l: 44, r: 12, t: 14, b: 22 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;
  const vals = data.map(d => d[y] as number);
  const ymin = Math.min(...vals) * 0.95;
  const ymax = Math.max(...vals) * 1.05;
  const xStep = W / (data.length - 1);
  const yScale = (v: number) => pad.t + H - ((v - ymin) / (ymax - ymin)) * H;
  const xScale = (i: number) => pad.l + i * xStep;

  const pts = data.map((d, i) => [xScale(i), yScale(d[y] as number)] as [number, number]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = line + ` L${pts[pts.length - 1][0]},${pad.t + H} L${pts[0][0]},${pad.t + H} Z`;

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => ymin + (ymax - ymin) * i / ticks);

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} x2={width - pad.r} y1={yScale(t)} y2={yScale(t)} className="grid-line" />
          <text x={pad.l - 6} y={yScale(t) + 3} textAnchor="end">{Math.round(t / 1000)}k</text>
        </g>
      ))}
      {style === "engraved" && (
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--rust)" strokeWidth="0.6" opacity="0.5" />
          </pattern>
        </defs>
      )}
      <path d={area} fill={style === "engraved" ? "url(#hatch)" : "var(--rust-soft)"} />
      <path d={line} className="line" />

      {data.map((d, i) => (
        i % 3 === 0 || i === data.length - 1 ? (
          <text key={i} x={xScale(i)} y={height - 6} textAnchor="middle">{(d[x] as string).split(" ")[0]}</text>
        ) : null
      ))}

      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" className="marker" />
      <text x={pts[pts.length - 1][0] + 6} y={pts[pts.length - 1][1] - 4} className="mono" style={{ fontSize: 10, fill: "var(--ink)" }}>
        €{Math.round(vals[vals.length - 1] / 1000)}k
      </text>
    </svg>
  );
}

export function Sparkline({ data, width = 140, height = 30, tone = "ink" }:
  { data: number[]; width?: number; height?: number; tone?: "ink" | "rust" | "moss" }) {
  const vals = data;
  const min = Math.min(...vals), max = Math.max(...vals);
  const pts = vals.map((v, i) => [
    (i / (vals.length - 1)) * width,
    height - ((v - min) / (max - min || 1)) * (height - 4) - 2,
  ] as [number, number]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const stroke = tone === "rust" ? "var(--rust)" : tone === "moss" ? "var(--moss)" : "var(--ink)";
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.2" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={stroke} />
    </svg>
  );
}

export function Donut({ segs, size = 140, stroke = 26 }: { segs: { value: number; color: string; label?: string }[]; size?: number; stroke?: number }) {
  const r = size / 2 - stroke / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  const total = segs.reduce((s, x) => s + x.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--paper-3)" strokeWidth={stroke} />
      {segs.map((s, i) => {
        const len = total > 0 ? (s.value / total) * C : 0;
        const el = <circle
          key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={s.color} strokeWidth={stroke}
          strokeDasharray={`${len} ${C - len}`}
          strokeDashoffset={-offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />;
        offset += len;
        return el;
      })}
    </svg>
  );
}

export function DepletionChart({ width = 800, height = 220, months = 42, monthlyBurn = 5200, startValue, targetFloor = 15000 }:
  { width?: number; height?: number; months?: number; monthlyBurn?: number; startValue: number; targetFloor?: number }) {
  const pad = { l: 44, r: 60, t: 14, b: 28 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;

  const pts: { i: number; v: number }[] = [];
  let v = startValue;
  for (let i = 0; i <= months; i++) {
    pts.push({ i, v });
    v = Math.max(0, v - monthlyBurn);
    if (v <= 0) { pts.push({ i: i + 1, v: 0 }); break; }
  }
  const ymax = startValue * 1.08;
  const xScale = (i: number) => pad.l + (i / months) * W;
  const yScale = (v: number) => pad.t + H - (v / ymax) * H;

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.i)},${yScale(p.v)}`).join(" ");
  const area = line + ` L${xScale(pts[pts.length - 1].i)},${pad.t + H} L${pad.l},${pad.t + H} Z`;

  const floorY = yScale(targetFloor);
  const zeroAt = pts.find(p => p.v === 0);

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (ymax / ticks) * i);

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`}>
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} x2={width - pad.r} y1={yScale(t)} y2={yScale(t)} className="grid-line" />
          <text x={pad.l - 6} y={yScale(t) + 3} textAnchor="end">€{Math.round(t / 1000)}k</text>
        </g>
      ))}
      <path d={area} fill="var(--rust-soft)" />
      <path d={line} className="line" />

      <line x1={pad.l} x2={width - pad.r} y1={floorY} y2={floorY} stroke="var(--crimson)" strokeDasharray="4 3" strokeWidth="1" />
      <text x={width - pad.r + 4} y={floorY + 3} style={{ fill: "var(--crimson)" }}>floor €{Math.round(targetFloor / 1000)}k</text>

      {zeroAt && (
        <>
          <line x1={xScale(zeroAt.i)} x2={xScale(zeroAt.i)} y1={pad.t} y2={pad.t + H}
                stroke="var(--ink)" strokeDasharray="2 3" />
          <text x={xScale(zeroAt.i) + 4} y={pad.t + 12} style={{ fill: "var(--ink)", fontWeight: 600 }}>
            Zero at month {zeroAt.i}
          </text>
        </>
      )}

      {[0, 6, 12, 18, 24, 30, 36].filter(m => m <= months).map(m => (
        <text key={m} x={xScale(m)} y={height - 8} textAnchor="middle">M{m}</text>
      ))}
    </svg>
  );
}
