import { useState } from "react";
import { createPortal } from "react-dom";
import { Folio, Panel, Segmented, Smallcaps, Stat, Who } from "../primitives.js";
import { AreaChart, Donut } from "../charts.js";
import { BUSINESS, CATEGORIES, NET_WORTH_HISTORY, deriveBiz, fmt, fx } from "../data.js";
import type { Asset } from "../data.js";
import type { Derived, LedgerState } from "../state.js";

export function Dashboard({ state, d }: { state: LedgerState; d: Derived }) {
  const { dashView, setDashView } = state;
  const vals = NET_WORTH_HISTORY.map(h => h.v);
  const mom = ((vals[vals.length - 1] - vals[vals.length - 2]) / vals[vals.length - 2]) * 100;

  // Joint pot uses ALL accessible assets (liquid + brokerage + business), not just cash.
  // This matches what Ashton's individual view does (liquidA + businessAssets).
  const mult = state.amtPeriod === "annual" ? 12 : 1;
  const periodLabel = state.amtPeriod === "annual" ? "/yr" : "/mo";
  const claimSub = (claim: number) => claim > 0 ? ` · €${Math.round(claim).toLocaleString()} owed to me` : "";

  const heroMap = {
    joint: {
      net: d.netWorth,
      netLabel: "Household net worth",
      netSub: `€${Math.round(d.totalAssets).toLocaleString()} assets · €${Math.round(d.externalDebt).toLocaleString()} debt · €${Math.round(d.iouNet).toLocaleString()} IOU`,
      saving: d.hhSaving * mult,
      savingLabel: "Household saving",
      savingSub: `${Math.round(d.hhSaving / d.hhIncome * 100)}% of €${Math.round(d.hhIncome * mult).toLocaleString()}${periodLabel} combined income`,
      runwayPot: d.liquidAssets + d.brokerageAssets + d.businessAssets,
      runwayBurn: d.hhBurn,
    },
    ashton: {
      net: d.netWorthA,
      netLabel: "Ashton net worth",
      netSub: `€${Math.round(d.personalAssetsA + d.businessAssets).toLocaleString()} assets · €${Math.round(d.debtA).toLocaleString()} debt · €${Math.round(d.iouNet).toLocaleString()} IOU${claimSub(d.debtAClaim)}`,
      saving: (d.aIncome - d.aBurn) * mult,
      savingLabel: "Ashton saving",
      savingSub: `€${Math.round(d.aIncome * mult).toLocaleString()}${periodLabel} in · €${Math.round(d.aBurn * mult).toLocaleString()}${periodLabel} out (€${Math.round(d.aPersonal * mult).toLocaleString()} personal + €${Math.round(d.jointTotal * d.aShare * mult).toLocaleString()} joint share)`,
      runwayPot: d.liquidA + d.businessAssets,
      runwayBurn: d.aBurn,
    },
    partner: {
      net: d.netWorthM,
      netLabel: "Maria net worth",
      netSub: `€${Math.round(d.personalAssetsM).toLocaleString()} assets · €${Math.round(d.debtM).toLocaleString()} debt${claimSub(d.debtMClaim)}`,
      saving: (d.mIncome - d.mBurn) * mult,
      savingLabel: "Maria saving",
      savingSub: `€${Math.round(d.mIncome * mult).toLocaleString()}${periodLabel} in · €${Math.round(d.mBurn * mult).toLocaleString()}${periodLabel} out (€${Math.round(d.mPersonal * mult).toLocaleString()} personal + €${Math.round(d.jointTotal * d.mShare * mult).toLocaleString()} joint share)`,
      runwayPot: d.liquidM,
      runwayBurn: d.mBurn,
    },
  } as const;
  const hero = heroMap[dashView];

  const runwayMonths = Math.floor(hero.runwayPot / Math.max(100, hero.runwayBurn));

  const assetsMeta = dashView === "joint"
    ? `€${Math.round(d.totalAssets).toLocaleString()}`
    : dashView === "ashton"
    ? `€${Math.round(d.personalAssetsA + d.businessAssets).toLocaleString()}`
    : `€${Math.round(d.personalAssetsM).toLocaleString()}`;

  return (
    <>
      <Folio section="The Ledger" title="Dashboard" no="I"
        dek="The household, the business, and the long view — on one page." />

      <div className="content">
        <div className="flex-between mb-md" style={{ alignItems: "center" }}>
          <Smallcaps>Viewing as</Smallcaps>
          <Segmented
            value={dashView}
            onChange={setDashView}
            options={[
              { value: "joint", label: "Joint" },
              { value: "ashton", label: "Ashton" },
              { value: "partner", label: "Maria" },
            ]}
          />
        </div>

        {/* Headline: assets chart + key stats */}
        <div className="grid g-2">
          <Panel title="Assets" meta={assetsMeta}>
            <AssetsPanel dashView={dashView} d={d} state={state} />
          </Panel>
          <div className="flex-col gap-sm">
            <Stat label={`Runway — ${dashView}`} value={runwayMonths} unit="months" size={60}
              sub={`at €${Math.round(hero.runwayBurn).toLocaleString()}/mo burn · pot €${Math.round(hero.runwayPot).toLocaleString()}`} />
            <Stat label={hero.savingLabel} value={hero.saving} size={38} showDec={false} sub={hero.savingSub} />
            <Stat label={hero.netLabel} note="EUR equiv." value={hero.net} size={38} showDec={false}
              sub={hero.netSub} delta={dashView === "joint" ? mom : null} />
          </div>
        </div>

        <div className="grid g-2">
          <Panel title={state.amtPeriod === "annual" ? "This year" : "This month"} meta={dashView === "joint" ? "household flow" : `${dashView === "ashton" ? "Ashton" : "Maria"} flow`}>
            {dashView === "joint" ? <JointTable d={d} state={state} mult={mult} periodLabel={periodLabel} /> :
              dashView === "ashton" ? <PersonTable who="ashton" d={d} mult={mult} periodLabel={periodLabel} /> :
                <PersonTable who="partner" d={d} mult={mult} periodLabel={periodLabel} />}
          </Panel>

          <CategoryComparison state={state} d={d} />
        </div>

        {/* Net worth chart — at bottom */}
        <Panel title="Net worth, 12 months" meta={`current €${Math.round(d.netWorth).toLocaleString()} · MoM ${mom >= 0 ? "+" : "−"}${Math.abs(mom).toFixed(1)}%`}>
          <AreaChart data={NET_WORTH_HISTORY} style="engraved" height={240} />
        </Panel>
      </div>
    </>
  );
}

function JointTable({ d, state, mult, periodLabel }: { d: Derived; state: LedgerState; mult: number; periodLabel: string }) {
  const b = deriveBiz(
    { monthlyRevenue: state.bizRevenue, costs: state.bizCosts, grossSalary: BUSINESS.grossSalary, dividendMonthly: state.income.ashton.dividend },
    state.tax,
  );
  const m = (n: number) => `€${Math.round(n * mult).toLocaleString()}`;
  return (
    <table className="table">
      <tbody>
        <tr className="subtotal"><td colSpan={2} style={{ paddingBottom: 2 }}>Business (Ashton's Oy) · {periodLabel.replace("/", "per ")}</td></tr>
        <tr><td className="italic" style={{ paddingLeft: 14 }}>Revenue</td><td className="num">{m(state.bizRevenue)}</td></tr>
        <tr><td className="italic" style={{ paddingLeft: 14 }}>Operating costs</td><td className="num neg">−{m(d.bizCostTotal)}</td></tr>
        <tr><td className="italic" style={{ paddingLeft: 14 }}>→ Salary + dividend to Ashton</td><td className="num">{m(b.netSalary + b.dividendNet)}</td></tr>
        <tr><td className="italic" style={{ paddingLeft: 14 }}>→ Retained in Oy</td><td className="num">{m(b.retained)}</td></tr>
        <tr className="subtotal"><td colSpan={2} style={{ paddingBottom: 2, paddingTop: 8 }}>Household cashflow</td></tr>
        <tr><td><Who who="ashton" label="Ashton income" /></td><td className="num">{m(d.aIncome)}</td></tr>
        <tr><td className="italic" style={{ paddingLeft: 14, color: "var(--ink-3)" }}>Business retained in Oy</td><td className="num" style={{ color: "var(--ink-3)" }}>{m(b.retained)}</td></tr>
        <tr><td><Who who="partner" label="Maria income" /></td><td className="num">{m(d.mIncome)}</td></tr>
        <tr className="subtotal"><td>Combined income (incl. retained)</td><td className="num">{m(d.hhIncome + b.retained)}</td></tr>
        <tr><td>Joint expenses</td><td className="num neg">−{m(d.jointTotal)}</td></tr>
        <tr><td>Ashton personal</td><td className="num neg">−{m(d.aPersonal)}</td></tr>
        <tr><td>Maria personal</td><td className="num neg">−{m(d.mPersonal)}</td></tr>
        <tr className="total"><td>Net saving ({periodLabel.replace("/", "")})</td><td className={`num ${d.hhSaving > 0 ? "pos" : "neg"}`}>{m(d.hhSaving)}</td></tr>
      </tbody>
    </table>
  );
}

function PersonTable({ who, d, mult, periodLabel }: { who: "ashton" | "partner"; d: Derived; mult: number; periodLabel: string }) {
  const A = who === "ashton";
  const income = A ? d.aIncome : d.mIncome;
  const personal = A ? d.aPersonal : d.mPersonal;
  const jointShare = d.jointTotal * (A ? d.aShare : d.mShare);
  const net = income - personal - jointShare;
  const m = (n: number) => `€${Math.round(n * mult).toLocaleString()}`;
  return (
    <table className="table">
      <tbody>
        <tr><td>Take-home income ({periodLabel.replace("/", "")})</td><td className="num">{m(income)}</td></tr>
        <tr><td>Share of joint ({((A ? d.aShare : d.mShare) * 100) | 0}%)</td>
          <td className="num neg">−{m(jointShare)}</td></tr>
        <tr><td>Personal spending</td>
          <td className="num neg">−{m(personal)}</td></tr>
        <tr className="total"><td>Surplus</td>
          <td className={`num ${net >= 0 ? "pos" : "neg"}`}>{m(net)}</td></tr>
      </tbody>
    </table>
  );
}

function AssetsPanel({ dashView, d, state }: { dashView: "joint" | "ashton" | "partner"; d: Derived; state: LedgerState }) {
  if (dashView === "partner") {
    const rows: Asset[] = state.assets.filter(a => a.owner === "partner");
    return (
      <div>
        <table className="table">
          <tbody>
            {rows.map(a => (
              <tr key={a.id}>
                <td>{a.label}</td>
                <td className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{a.type}</td>
                <td className="num">{fmt(a.bal * fx[a.cur])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  const seg = dashView === "ashton"
    ? [
      { value: d.liquidA, color: "var(--ink)", label: "Liquid (Ashton)" },
      { value: d.brokerageAssets, color: "var(--rust)", label: "Brokerage" },
      { value: d.pensionAssets - 14000, color: "var(--moss)", label: "Swiss pension" },
    ]
    : [
      { value: d.liquidAssets, color: "var(--ink)", label: "Liquid" },
      { value: d.brokerageAssets, color: "var(--rust)", label: "Brokerage" },
      { value: d.businessAssets - d.brokerageAssets, color: "var(--ochre)", label: "Business (excl. brokerage)" },
      { value: d.pensionAssets, color: "var(--moss)", label: "Pension" },
    ];
  return (
    <div className="flex gap-md" style={{ alignItems: "center" }}>
      <Donut segs={seg} size={160} />
      <div className="flex-col gap-sm" style={{ fontSize: 13, flex: 1 }}>
        {seg.map((s, i) => (
          <div key={i} className="flex-between">
            <span><span style={{ width: 8, height: 8, background: s.color, display: "inline-block", marginRight: 6 }} />{s.label}</span>
            <span className="mono">€{Math.round(s.value).toLocaleString()}</span>
          </div>
        ))}
        <hr className="rule" style={{ margin: "4px 0" }} />
        <div className="flex-between italic" style={{ color: "var(--crimson)" }}>
          <span>Debts</span>
          <span className="mono">−€{Math.round(dashView === "ashton" ? d.debtA : d.externalDebt).toLocaleString()}</span>
        </div>
        {dashView === "ashton" && d.debtAClaim > 0 && (
          <div className="flex-between italic" style={{ color: "var(--moss)" }}>
            <span>Owed to me (from Maria)</span>
            <span className="mono">+€{Math.round(d.debtAClaim).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface CatItem { label: string; amt: number; joint?: boolean }
interface CatRow { ashton: number; partner: number; ashtonItems: CatItem[]; partnerItems: CatItem[] }

function CategoryComparison({ state, d }: { state: LedgerState; d: Derived }) {
  const [tooltip, setTooltip] = useState<{ cat: string; x: number; y: number; row: CatRow } | null>(null);

  const byCat: Record<string, CatRow> = {};
  const ensure = (cat: string) => {
    if (!byCat[cat]) byCat[cat] = { ashton: 0, partner: 0, ashtonItems: [], partnerItems: [] };
  };
  state.ashtonP.forEach(e => {
    ensure(e.cat || "other");
    byCat[e.cat || "other"].ashton += e.amt;
    byCat[e.cat || "other"].ashtonItems.push({ label: e.label, amt: e.amt });
  });
  state.mariaP.forEach(e => {
    ensure(e.cat || "other");
    byCat[e.cat || "other"].partner += e.amt;
    byCat[e.cat || "other"].partnerItems.push({ label: e.label, amt: e.amt });
  });
  state.joint.forEach(j => {
    ensure(j.cat || "other");
    byCat[j.cat || "other"].ashton += j.amt * d.aShare;
    byCat[j.cat || "other"].partner += j.amt * d.mShare;
    byCat[j.cat || "other"].ashtonItems.push({ label: j.label, amt: j.amt * d.aShare, joint: true });
    byCat[j.cat || "other"].partnerItems.push({ label: j.label, amt: j.amt * d.mShare, joint: true });
  });

  const rows = Object.entries(byCat)
    .map(([cat, v]) => ({ cat, ...v, total: v.ashton + v.partner }))
    .sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...rows.map(r => r.total));

  return (
    <Panel title="Spending by category — Ashton vs Maria" meta="includes share of joint expenses">
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th className="num"><Who who="ashton" label="Ashton" /></th>
            <th className="num"><Who who="partner" label="Maria" /></th>
            <th className="num">Total</th>
            <th style={{ width: 200 }}>Split</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const catMeta = CATEGORIES[r.cat] || { label: r.cat, color: "#555" };
            const aPct = r.total ? r.ashton / r.total * 100 : 0;
            return (
              <tr key={r.cat}
                style={{ cursor: "default" }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({ cat: r.cat, x: rect.left + rect.width / 2, y: rect.bottom + 4, row: r });
                }}
                onMouseLeave={() => setTooltip(null)}>
                <td>
                  <span style={{ display: "inline-block", width: 10, height: 10, background: catMeta.color, marginRight: 8, verticalAlign: "middle" }} />
                  {catMeta.label}
                </td>
                <td className="num">€{r.ashton.toFixed(0)}</td>
                <td className="num">€{r.partner.toFixed(0)}</td>
                <td className="num" style={{ fontWeight: 600 }}>€{r.total.toFixed(0)}</td>
                <td><SplitBar aPct={aPct} width={r.total / maxTotal * 100} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tooltip && createPortal(<CatTooltip tooltip={tooltip} />, document.body)}
    </Panel>
  );
}

function CatTooltip({ tooltip }: { tooltip: { cat: string; x: number; y: number; row: CatRow } }) {
  const { x, y, row } = tooltip;
  const catMeta = CATEGORIES[tooltip.cat] || { label: tooltip.cat, color: "#555" };
  const allItems = [
    ...row.ashtonItems.map(i => ({ ...i, who: "ashton" as const })),
    ...row.partnerItems.map(i => ({ ...i, who: "partner" as const })),
  ];
  // Merge joint items (same label appears in both ashton and partner)
  const merged: { label: string; ashton: number; partner: number; joint: boolean }[] = [];
  const seen: Record<string, number> = {};
  allItems.forEach(item => {
    const key = item.label + (item.joint ? "#j" : `#${item.who}`);
    if (seen[key] !== undefined) {
      merged[seen[key]][item.who] = (merged[seen[key]][item.who] || 0) + item.amt;
    } else {
      seen[key] = merged.length;
      merged.push({ label: item.label, ashton: item.who === "ashton" ? item.amt : 0, partner: item.who === "partner" ? item.amt : 0, joint: !!item.joint });
    }
  });
  merged.sort((a, b) => (b.ashton + b.partner) - (a.ashton + a.partner));

  const w = 320;
  const left = Math.min(Math.max(x - w / 2, 8), window.innerWidth - w - 8);

  return (
    <div className="ledger-root" style={{
      position: "fixed", top: y, left, width: w, zIndex: 9999,
      background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 4,
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)", padding: "10px 14px",
      pointerEvents: "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 10, height: 10, background: catMeta.color, display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--ink-2)" }}>{catMeta.label.toUpperCase()}</span>
      </div>
      <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 10 }}>
            <th style={{ textAlign: "left", paddingBottom: 4, fontWeight: 400 }}>Item</th>
            <th style={{ textAlign: "right", paddingBottom: 4, fontWeight: 400 }}>A</th>
            <th style={{ textAlign: "right", paddingBottom: 4, fontWeight: 400 }}>M</th>
          </tr>
        </thead>
        <tbody>
          {merged.map((m, i) => (
            <tr key={i} style={{ borderTop: "1px solid var(--rule-soft)" }}>
              <td style={{ padding: "3px 0", color: "var(--ink)", fontFamily: "var(--serif)" }}>
                {m.label}{m.joint && <span style={{ color: "var(--ink-3)", fontSize: 10, marginLeft: 4 }}>joint</span>}
              </td>
              <td style={{ textAlign: "right", fontFamily: "var(--mono)", color: m.ashton ? "var(--ink)" : "var(--ink-4)" }}>
                {m.ashton ? `€${Math.round(m.ashton)}` : "—"}
              </td>
              <td style={{ textAlign: "right", fontFamily: "var(--mono)", color: m.partner ? "var(--ink)" : "var(--ink-4)" }}>
                {m.partner ? `€${Math.round(m.partner)}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SplitBar({ aPct, width }: { aPct: number; width: number }) {
  return (
    <div style={{ height: 12, background: "var(--paper-2)", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${width}%`, display: "flex" }}>
        <div style={{ width: `${aPct}%`, background: "var(--ink)" }} />
        <div style={{ flex: 1, background: "var(--ink-3)" }} />
      </div>
    </div>
  );
}
