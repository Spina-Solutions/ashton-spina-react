import { useState, useEffect, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { fmtFig } from "./data.js";

export function Figure({ value, cur = "EUR", size = 42, showDec = true, unit = "", className = "" }:
  { value: number; cur?: string; size?: number; showDec?: boolean; unit?: string; className?: string }) {
  if (unit) {
    const whole = Math.round(value).toLocaleString("en-US");
    return (
      <span className={`figure ${className}`} style={{ fontSize: size }}>
        {whole}
        <span className="decimal" style={{ marginLeft: 6, fontFamily: "var(--italic)", fontStyle: "italic" }}>{unit}</span>
      </span>
    );
  }
  const { sym, whole, dec } = fmtFig(value, cur);
  return (
    <span className={`figure ${className}`} style={{ fontSize: size }}>
      <span className="cur">{sym}</span>
      {whole}
      {showDec && <span className="decimal">{dec}</span>}
    </span>
  );
}

export function Delta({ value, unit = "%", className = "" }: { value: number; unit?: string; className?: string }) {
  const pos = value > 0;
  return (
    <span className={`delta ${pos ? "pos" : "neg"} ${className}`}>
      {pos ? "▲" : "▼"} {Math.abs(value).toFixed(1)}{unit}
    </span>
  );
}

export function Smallcaps({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`smallcaps ${className}`}>{children}</span>;
}

export function Panel({ title, meta, children, variant = "ruled", flush = false, tight = false, action }:
  { title?: ReactNode; meta?: ReactNode; children: ReactNode; variant?: string; flush?: boolean; tight?: boolean; action?: ReactNode }) {
  return (
    <div className={`panel ${variant}`}>
      {(title || meta || action) && (
        <div className="panel-head">
          <div className="title">{title}</div>
          {meta && <div className="meta">{meta}</div>}
          {action && <div style={{ marginLeft: "auto" }}>{action}</div>}
        </div>
      )}
      <div className={`panel-body ${flush ? "flush" : ""} ${tight ? "tight" : ""}`}>{children}</div>
    </div>
  );
}

export function Stat({ label, value, cur = "EUR", unit = "", sub, delta, note, size = 42, showDec = true }:
  { label: ReactNode; value: number; cur?: string; unit?: string; sub?: ReactNode; delta?: number | null; note?: ReactNode; size?: number; showDec?: boolean }) {
  return (
    <div className="panel ruled stat">
      <div className="label">
        <span>{label}</span>
        {note && <span>{note}</span>}
      </div>
      <Figure value={value} cur={cur} unit={unit} size={size} showDec={showDec} />
      {(sub || (delta !== undefined && delta !== null)) && (
        <div className="sub">
          {delta !== undefined && delta !== null && <Delta value={delta} />} {sub}
        </div>
      )}
    </div>
  );
}

export function Bar({ pct, variant = "", height = 6 }: { pct: number; variant?: string; height?: number }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className={`bar ${variant}`} style={{ height }}>
      <div className="fill" style={{ right: `${100 - p}%` }} />
    </div>
  );
}

export function StackedBar({ segs, height = 6 }: { segs: { pct: number; color: string }[]; height?: number }) {
  return (
    <div className="bar stacked" style={{ height }}>
      {segs.map((s, i) => (
        <div key={i} className="fill" style={{ flex: s.pct, background: s.color }} />
      ))}
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange }:
  { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="segmented">
      {options.map(o => (
        <button key={o.value} className={value === o.value ? "on" : ""} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function EditableCell({ value, onChange, prefix = "", suffix = "", align = "right", format = (v: number) => v.toLocaleString("en-US") }:
  { value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; align?: "left" | "right" | "center"; format?: (v: number) => string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);
  const commit = () => {
    const n = parseFloat(draft.replace(/[,\s]/g, ""));
    if (!isNaN(n)) onChange(n);
    setEditing(false);
  };
  return (
    <td className="num editable" onClick={() => setEditing(true)}>
      {editing ? (
        <input
          className="cell-input mono"
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          style={{ textAlign: align as CSSProperties["textAlign"] }}
        />
      ) : (
        <>{prefix}{format(value)}{suffix}</>
      )}
    </td>
  );
}

export function Chip({ children, tone }: { children: ReactNode; tone?: string }) {
  return <span className={`chip ${tone || ""}`}>{children}</span>;
}

export function Who({ who, label }: { who: "ashton" | "partner" | string; label?: string }) {
  const cls = who === "ashton" ? "ashton" : who === "partner" ? "e" : "";
  return <span className={`who ${cls}`}><span className="dot" />{label || who}</span>;
}

export function Folio({ section, title, dek, no, date = "19 APRIL 2026" }:
  { section: ReactNode; title: ReactNode; dek?: ReactNode; no?: string; date?: string }) {
  return (
    <header className="folio">
      <div className="left">
        <span>№ {no || "I"}</span>
        <span>·</span>
        <span>{date}</span>
      </div>
      <div className="center">
        <div className="kicker">{section}</div>
        <h2>{title}</h2>
        {dek && <div className="dek">{dek}</div>}
      </div>
      <div className="right">
        <span>VOL. III</span>
        <span>·</span>
        <span>HELSINKI</span>
      </div>
    </header>
  );
}

export function LedgerModal({ title, meta, onClose, children, wide = false }: {
  title: ReactNode; meta?: ReactNode; onClose: () => void; children: ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      className="ledger-root ledger-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`ledger-modal${wide ? " wide" : ""}`}>
        <div className="ledger-modal-head">
          <span className="title">{title}</span>
          {meta && <span className="meta">{meta}</span>}
          <button className="ledger-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="ledger-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
