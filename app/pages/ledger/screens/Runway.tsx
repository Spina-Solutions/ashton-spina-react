import { useState } from "react";
import { Bar, Folio, LedgerModal, Panel, Segmented, Smallcaps, Stat } from "../primitives.js";
import { DepletionChart } from "../charts.js";
import { BUSINESS, deriveBiz } from "../data.js";
import type { Derived, LedgerState } from "../state.js";
import type { Scenario, ScenarioExpense, SplitMode } from "../data.js";

type ModalKind = "new" | "rename" | null;
type ExpenseTab = "joint" | "ashton" | "business";

// ─── Normalise old scenarios that predate the new fields ─────────────────────

function normalizeScenario(s: Scenario): Scenario {
  const raw = s as unknown as Partial<Scenario>;
  return {
    ...s,
    bizRevenue: raw.bizRevenue ?? BUSINESS.monthlyRevenue,
    bizCosts: raw.bizCosts ?? BUSINESS.costs.map(c => ({ label: c.label, amt: c.amt })),
    scenarioSplitMode: raw.scenarioSplitMode ?? "fifty",
    scenarioSplitCustom: raw.scenarioSplitCustom ?? 0.5,
  };
}

// ─── Burn computation (Ashton-only model) ────────────────────────────────────
//
// Maria is always working — she handles her own personal costs + her joint share.
// The runway pot is Ashton's assets only; the burn is Ashton's obligations only.
//
// aScenShare = Ashton's portion of joint costs in this scenario.
//   partnerWorking = true  → Maria covers her share; Ashton pays scenarioSplitMode share.
//   partnerWorking = false → Ashton covers 100% of joint (e.g. baby year, both on leave).

interface BizCalc {
  opCosts: number; grossSalary: number; salaryTax: number; netSalary: number;
  preTaxProfit: number; corpTax: number; afterCorp: number;
  dividendGross: number; dividendTax: number; dividendNet: number; retained: number;
}

interface ScenarioBurnResult {
  biz: BizCalc;
  ashtonBizIncome: number;
  aScenShare: number;
  ashtonRequired: number;   // Ashton personal + his joint share
  totalNetBurn: number;     // monthly drain displayed in the summary (phase-1 combined rate)
  runway: number;           // computed months (Infinity = income covers all obligations)
  isInfinite: boolean;
}

function scenarioJointShare(mode: SplitMode, custom: number): number {
  if (mode === "fifty") return 0.5;
  if (mode === "custom") return Math.max(0, Math.min(1, custom));
  return 0.5;
}

// Two-pot runway simulation.
// Phase 1: biz pot alive → salary+dividend flow to personal; both pots drain independently.
// Phase 2: biz pot exhausted → income stops; personal burns at full ashtonRequired.
// Returns months until personal pot hits 0.
function twoPhaseRunway(
  bizPot: number,
  personalPot: number,
  bizNetFlow: number,    // monthly change in biz pot (neg = draining)
  personalNetFlow: number, // monthly change in personal pot (neg = draining)
  ashtonRequired: number,
): number {
  if (bizNetFlow >= 0) {
    // Business pot not draining — no phase 2 risk from biz
    if (personalNetFlow >= 0) return Infinity;
    return personalPot / (-personalNetFlow);
  }

  // Biz pot draining — compute how long until it empties
  const bizMonths = bizPot / (-bizNetFlow);
  const personalAtBizDeath = personalPot + personalNetFlow * bizMonths;

  if (personalNetFlow >= 0) {
    // Personal is growing during phase 1; after biz dies, income stops
    if (ashtonRequired <= 0) return Infinity;
    return bizMonths + Math.max(0, personalAtBizDeath) / ashtonRequired;
  }

  // Both pots draining
  if (personalAtBizDeath <= 0) {
    // Personal depletes before or at the same time as biz
    return personalPot / (-personalNetFlow);
  }
  // Personal survives biz death; phase 2: no income
  if (ashtonRequired <= 0) return Infinity;
  return bizMonths + personalAtBizDeath / ashtonRequired;
}

function computeScenarioBurn(
  rawScenario: Scenario,
  tax: LedgerState["tax"],
  liveIncome: LedgerState["income"],
  pots: { bizPot: number; personalPot: number },
): ScenarioBurnResult {
  const s = normalizeScenario(rawScenario);

  const liveGrossSalary = tax.salaryTaxRate < 1
    ? liveIncome.ashton.salary / (1 - tax.salaryTaxRate)
    : liveIncome.ashton.salary;

  const b = deriveBiz(
    {
      monthlyRevenue: s.bizRevenue,
      costs: s.bizCosts,
      grossSalary: liveGrossSalary,
      dividendMonthly: liveIncome.ashton.dividend,
    },
    tax,
  );

  const ashtonBizIncome = b.netSalary + b.dividendNet;
  const scenJoint = s.joint.reduce((acc, e) => acc + e.amt, 0);
  const scenAshton = s.ashtonP.reduce((acc, e) => acc + e.amt, 0);

  const aScenShare = s.partnerWorking
    ? scenarioJointShare(s.scenarioSplitMode, s.scenarioSplitCustom)
    : 1.0;

  const ashtonRequired = scenAshton + scenJoint * aScenShare;

  const biz: BizCalc = {
    opCosts: b.opCosts,
    grossSalary: b.netSalary + b.salaryTax,
    salaryTax: b.salaryTax,
    netSalary: b.netSalary,
    preTaxProfit: b.preTaxProfit,
    corpTax: b.corpTax,
    afterCorp: b.afterCorp,
    dividendGross: b.dividendGross,
    dividendTax: b.dividendTax,
    dividendNet: b.dividendNet,
    retained: b.retained,
  };

  // Personal net monthly flow: income from biz minus Ashton's obligations.
  const personalNetFlow = ashtonBizIncome - ashtonRequired;

  if (!s.includeBusiness) {
    // Personal pot only. Salary + dividend from biz offset personal burn.
    const drain = Math.max(0, -personalNetFlow);
    const runway = drain > 0 ? pots.personalPot / drain : Infinity;
    return { biz, ashtonBizIncome, aScenShare, ashtonRequired, totalNetBurn: drain, runway, isInfinite: runway === Infinity };
  }

  // Two-pot model: business and personal tracked separately.
  //   Business pot drains from: opCosts + grossSalary (→ Ashton's personal) + corpTax + dividendGross (incl. divTax withheld)
  //   Personal pot receives:    netSalary + dividendNet
  //   If biz pot empties → no more income → personal burns at full ashtonRequired
  const bizOutflow = b.opCosts + (b.netSalary + b.salaryTax) + b.corpTax + b.dividendGross;
  const bizNetFlow = s.bizRevenue - bizOutflow; // positive = biz pot growing

  const runway = twoPhaseRunway(pots.bizPot, pots.personalPot, bizNetFlow, personalNetFlow, ashtonRequired);

  // Display burn = combined drain during phase 1 (what leaves both pots per month before any depletion)
  const combinedDrain = Math.max(0, (-bizNetFlow) + (-personalNetFlow));
  return { biz, ashtonBizIncome, aScenShare, ashtonRequired, totalNetBurn: combinedDrain, runway, isInfinite: runway === Infinity };
}

// ─── Runway component ─────────────────────────────────────────────────────────

export function Runway({ state, d }: { state: LedgerState; d: Derived }) {
  const { scenarios, setScenarios } = state;
  const [activeId, setActiveId] = useState<string>(scenarios[0].id);
  const rawActive: Scenario = scenarios.find(s => s.id === activeId) || scenarios[0];
  const active = normalizeScenario(rawActive);

  const [modal, setModal] = useState<ModalKind>(null);
  const [modalInput, setModalInput] = useState("");
  const [expTab, setExpTab] = useState<ExpenseTab>("joint");

  const openNew = () => { setModalInput(""); setModal("new"); };
  const openRename = () => { setModalInput(active.name); setModal("rename"); };

  const confirmModal = () => {
    if (!modalInput.trim()) { setModal(null); return; }
    if (modal === "new") {
      const id = "c" + Date.now();
      setScenarios(prev => [...prev, {
        id, name: modalInput.trim(), note: "",
        partnerWorking: true, includeInvest: false, includeBusiness: false,
        joint: state.joint.map(e => ({ id: e.id, label: e.label, amt: e.amt, cat: e.cat })),
        ashtonP: state.ashtonP.map(e => ({ label: e.label, amt: e.amt, cat: e.cat })),
        mariaP: state.mariaP.map(e => ({ label: e.label, amt: e.amt, cat: e.cat })),
        bizRevenue: state.bizRevenue,
        bizCosts: state.bizCosts.map(c => ({ label: c.label, amt: c.amt })),
        scenarioSplitMode: state.splitMode,
        scenarioSplitCustom: state.customSplit,
      }]);
      setActiveId(id);
    } else if (modal === "rename") {
      setScenarios(prev => prev.map(x => x.id === activeId ? { ...x, name: modalInput.trim() } : x));
    }
    setModal(null);
  };

  const del = () => {
    if (scenarios.length <= 1) return;
    const rest = scenarios.filter(x => x.id !== activeId);
    setScenarios(rest);
    setActiveId(rest[0].id);
  };

  const updActive = <K extends keyof Scenario>(k: K, v: Scenario[K]) =>
    setScenarios(prev => prev.map(x => x.id === activeId ? { ...x, [k]: v } : x));

  const updExp = (tab: ExpenseTab, i: number, field: keyof ScenarioExpense, val: string | number) =>
    setScenarios(prev => prev.map(x => {
      if (x.id !== activeId) return x;
      const key = tab === "joint" ? "joint" : tab === "ashton" ? "ashtonP" : "bizCosts";
      const arr = [...(x[key] as ScenarioExpense[])];
      arr[i] = { ...arr[i], [field]: val };
      return { ...x, [key]: arr };
    }));

  const addExp = (tab: ExpenseTab) =>
    setScenarios(prev => prev.map(x => {
      if (x.id !== activeId) return x;
      const key = tab === "joint" ? "joint" : tab === "ashton" ? "ashtonP" : "bizCosts";
      const existing = (x[key] as ScenarioExpense[] | undefined) ?? [];
      return { ...x, [key]: [...existing, { label: "New item", amt: 0, cat: "other" }] };
    }));

  const remExp = (tab: ExpenseTab, i: number) =>
    setScenarios(prev => prev.map(x => {
      if (x.id !== activeId) return x;
      const key = tab === "joint" ? "joint" : tab === "ashton" ? "ashtonP" : "bizCosts";
      const existing = (x[key] as ScenarioExpense[] | undefined) ?? [];
      return { ...x, [key]: existing.filter((_, j) => j !== i) };
    }));

  // Pot = ASHTON'S assets only (Maria manages her own finances independently)
  let pot = d.liquidA;
  if (active.includeInvest) pot += d.personalBrokerageA;
  if (active.includeBusiness) pot += d.businessAssets;

  const bizPot    = active.includeBusiness ? d.businessAssets : 0;
  const personalPot = d.liquidA + (active.includeInvest ? d.personalBrokerageA : 0);

  const burn = computeScenarioBurn(active, state.tax, state.income, { bizPot, personalPot });
  const { biz, ashtonBizIncome, aScenShare, ashtonRequired, totalNetBurn, isInfinite } = burn;
  const runway = isInfinite ? Infinity : Math.floor(burn.runway);

  const scenJoint  = active.joint.reduce((s, e) => s + e.amt, 0);
  const scenAshton = active.ashtonP.reduce((s, e) => s + e.amt, 0);
  const scenBizCosts = active.bizCosts.reduce((s, e) => s + e.amt, 0);

  const currentList: ScenarioExpense[] =
    expTab === "joint" ? active.joint
    : expTab === "ashton" ? active.ashtonP
    : active.bizCosts;
  const currentTotal = currentList.reduce((s, e) => s + e.amt, 0);

  return (
    <>
      <Folio section="Section III" title="Runway" no="III"
        dek="If Ashton's income stops, how long do his reserves last? Maria always handles her own costs + her share of joint." />

      <div className="content">
        {/* Scenario selector */}
        <Panel title="Scenarios" meta={`${scenarios.length} saved`}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {scenarios.map(s => (
              <button key={s.id} onClick={() => setActiveId(s.id)}
                className={`chip ${s.id === activeId ? "on" : ""}`}
                style={{
                  padding: "6px 14px",
                  background: s.id === activeId ? "var(--ink)" : "var(--paper-2)",
                  color: s.id === activeId ? "var(--paper)" : "var(--ink)",
                  border: "1px solid var(--rule)",
                  fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer",
                }}>
                {s.name}
              </button>
            ))}
            <button onClick={openNew} className="chip"
              style={{ padding: "6px 14px", background: "transparent", border: "1px dashed var(--rule)", fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer" }}>
              + new scenario
            </button>
          </div>
          <div className="mt-md italic" style={{ fontSize: 13, color: "var(--ink-3)" }}>
            {active.note || "No notes."}
            <span className="mono" style={{ marginLeft: 12, fontSize: 10 }}>
              {" · "}<button onClick={openRename} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, font: "inherit" }}>rename</button>
              {" · "}<button onClick={del} disabled={scenarios.length <= 1}
                style={{ background: "none", border: "none", color: scenarios.length <= 1 ? "var(--ink-4)" : "inherit", cursor: scenarios.length <= 1 ? "default" : "pointer", padding: 0, font: "inherit" }}>delete</button>
            </span>
          </div>
        </Panel>

        {/* Headline stats */}
        <div className="grid g-2">
          {isInfinite ? (
            <div className="panel ruled" style={{ padding: "16px 20px" }}>
              <div className="smallcaps mb-sm" style={{ color: "var(--ink-3)" }}>Runway — {active.name}</div>
              <div style={{ fontSize: 60, fontFamily: "var(--serif)", color: "var(--moss)", lineHeight: 1 }}>∞</div>
              <div className="italic mt-sm" style={{ fontSize: 13, color: "var(--ink-3)" }}>
                Ashton's income covers his obligations — reserves untouched
              </div>
            </div>
          ) : (
            <Stat label={`Runway — ${active.name}`} value={runway} unit="months" size={60}
              sub={`€${Math.round(totalNetBurn).toLocaleString()}/mo Ashton's net drain`} />
          )}
          <Stat label="Ashton's reserve pot" value={pot} size={38} showDec={false}
            sub={["Ashton liquid", active.includeInvest ? "+ brokerage" : null, active.includeBusiness ? "+ business assets" : null].filter(Boolean).join(" ")} />
        </div>

        {/* Depletion curve */}
        {!isInfinite && (
          <Panel title="Depletion curve" meta={`${runway} months until reserves reach floor`}>
            <DepletionChart
              width={1340}
              months={Math.min(96, runway + 12)}
              monthlyBurn={totalNetBurn}
              startValue={pot}
              targetFloor={5000}
            />
          </Panel>
        )}
        {isInfinite && (
          <Panel title="No depletion" meta="Ashton's cashflow is positive in this scenario">
            <div style={{ padding: "32px 0", textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: 13 }}>
              Income exceeds obligations — reserves growing, not shrinking.
              <br />
              <span style={{ fontSize: 11, marginTop: 8, display: "block" }}>
                Biz income to Ashton €{Math.round(ashtonBizIncome).toLocaleString()}/mo
                {" · "} Ashton's obligations €{Math.round(ashtonRequired).toLocaleString()}/mo
              </span>
            </div>
          </Panel>
        )}

        <div className="grid g-2">
          {/* Settings */}
          <Panel title={`Settings — ${active.name}`} meta="">
            <div style={{ marginBottom: 8 }}><Smallcaps>Business</Smallcaps></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
              <span style={{ flex: 1, fontSize: 13 }}>Monthly revenue</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>€</span>
              <input
                className="cell-input mono"
                type="number"
                value={active.bizRevenue}
                onChange={e => updActive("bizRevenue", parseFloat(e.target.value) || 0)}
                style={{ textAlign: "right", width: 90, padding: "2px 6px" }}
              />
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", paddingBottom: 8, fontStyle: "italic" }}>
              {active.bizRevenue > 0
                ? `Ashton draws €${Math.round(ashtonBizIncome).toLocaleString()}/mo net (salary + dividend)`
                : `Salary + dividend still drawn from business reserves (€${Math.round(ashtonBizIncome).toLocaleString()}/mo net)`}
            </div>

            <hr className="rule" style={{ margin: "10px 0" }} />
            <div style={{ marginBottom: 8 }}><Smallcaps>Joint costs</Smallcaps></div>
            <label className="flex-between" style={{ padding: "8px 0", cursor: "pointer", fontSize: 13 }}>
              <span>Maria is working (covers her share of joint)</span>
              <input type="checkbox" checked={active.partnerWorking}
                onChange={e => updActive("partnerWorking", e.target.checked)} />
            </label>
            {active.partnerWorking ? (
              <>
                <div style={{ marginBottom: 8, marginTop: 4 }}>
                  <Segmented<SplitMode>
                    value={active.scenarioSplitMode}
                    onChange={v => updActive("scenarioSplitMode", v)}
                    options={[
                      { value: "fifty", label: "50 / 50" },
                      { value: "custom", label: "Custom %" },
                    ]}
                  />
                </div>
                {active.scenarioSplitMode === "custom" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0 8px" }}>
                    <span style={{ fontSize: 13 }}>Ashton pays</span>
                    <input
                      className="cell-input mono"
                      type="number" min={0} max={100} step={1}
                      value={Math.round(active.scenarioSplitCustom * 100)}
                      onChange={e => updActive("scenarioSplitCustom", (parseFloat(e.target.value) || 0) / 100)}
                      style={{ textAlign: "right", width: 60, padding: "2px 6px" }}
                    />
                    <span className="mono" style={{ fontSize: 11 }}>% of joint</span>
                  </div>
                )}
                <div style={{ fontSize: 12, color: "var(--ink-3)", fontStyle: "italic" }}>
                  Ashton covers {(aScenShare * 100).toFixed(0)}% of €{Math.round(scenJoint).toLocaleString()}/mo joint
                  {" "}= €{Math.round(scenJoint * aScenShare).toLocaleString()}/mo
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: "var(--ink-3)", fontStyle: "italic", paddingBottom: 8 }}>
                Maria not working — Ashton covers 100% of joint costs (€{Math.round(scenJoint).toLocaleString()}/mo)
              </div>
            )}

            <hr className="rule" style={{ margin: "10px 0" }} />
            <div style={{ marginBottom: 8 }}><Smallcaps>Ashton's pot</Smallcaps></div>
            <label className="flex-between" style={{ padding: "8px 0", cursor: "pointer", fontSize: 13 }}>
              <span>Include brokerage (+€{Math.round(d.personalBrokerageA).toLocaleString()})</span>
              <input type="checkbox" checked={active.includeInvest}
                onChange={e => updActive("includeInvest", e.target.checked)} />
            </label>
            <label className="flex-between" style={{ padding: "8px 0", borderTop: "1px solid var(--rule-soft)", cursor: "pointer", fontSize: 13 }}>
              <span>Include business assets (+€{Math.round(d.businessAssets).toLocaleString()})</span>
              <input type="checkbox" checked={active.includeBusiness}
                onChange={e => updActive("includeBusiness", e.target.checked)} />
            </label>
            <div style={{ fontSize: 12, color: "var(--ink-3)", fontStyle: "italic", paddingTop: 4 }}>
              Base: Ashton liquid €{Math.round(d.liquidA).toLocaleString()} · Total pot €{Math.round(pot).toLocaleString()}
            </div>
          </Panel>

          {/* Burn summary */}
          <Panel title="Burn summary" meta="full calculation chain">
            <table className="table mt-sm">
              <tbody>
                {/* Step 1: Business cashflow */}
                <tr className="subtotal"><td colSpan={2}>Step 1 — Business (monthly)</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 14 }}>Revenue</td>
                  <td className="num">{active.bizRevenue > 0 ? `€${Math.round(active.bizRevenue).toLocaleString()}` : "€0"}</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 14 }}>− Operating costs</td>
                  <td className="num neg">−€{Math.round(biz.opCosts).toLocaleString()}</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 14 }}>= Profit before salary</td>
                  <td className="num">€{Math.round(active.bizRevenue - biz.opCosts).toLocaleString()}</td></tr>

                {biz.grossSalary > 0 ? (
                  <>
                    <tr><td className="italic" style={{ paddingLeft: 14 }}>− Gross salary</td>
                      <td className="num neg">−€{Math.round(biz.grossSalary).toLocaleString()}</td></tr>
                    <tr><td className="italic" style={{ paddingLeft: 22, color: "var(--ink-3)" }}>  Withholding tax</td>
                      <td className="num neg" style={{ color: "var(--ink-3)" }}>−€{Math.round(biz.salaryTax).toLocaleString()}</td></tr>
                    <tr><td className="italic" style={{ paddingLeft: 22, color: "var(--ink-3)" }}>  Net salary to Ashton</td>
                      <td className="num pos" style={{ color: "var(--ink-3)" }}>+€{Math.round(biz.netSalary).toLocaleString()}</td></tr>
                    <tr><td className="italic" style={{ paddingLeft: 14 }}>= Pre-tax profit</td>
                      <td className="num">€{Math.round(biz.preTaxProfit).toLocaleString()}</td></tr>
                    <tr><td className="italic" style={{ paddingLeft: 14 }}>− Corp tax (20%)</td>
                      <td className="num neg">−€{Math.round(biz.corpTax).toLocaleString()}</td></tr>
                    <tr><td className="italic" style={{ paddingLeft: 14 }}>− Dividend declared</td>
                      <td className="num neg">−€{Math.round(biz.dividendGross).toLocaleString()}</td></tr>
                    <tr><td className="italic" style={{ paddingLeft: 22, color: "var(--ink-3)" }}>  Dividend tax</td>
                      <td className="num neg" style={{ color: "var(--ink-3)" }}>−€{Math.round(biz.dividendTax).toLocaleString()}</td></tr>
                    <tr><td className="italic" style={{ paddingLeft: 22, color: "var(--ink-3)" }}>  Net dividend to Ashton</td>
                      <td className="num pos" style={{ color: "var(--ink-3)" }}>+€{Math.round(biz.dividendNet).toLocaleString()}</td></tr>
                    <tr className="subtotal"><td className="italic" style={{ paddingLeft: 14 }}>→ Retained in Oy</td>
                      <td className={`num ${biz.retained >= 0 ? "pos" : "neg"}`}>€{Math.round(biz.retained).toLocaleString()}</td></tr>
                  </>
                ) : (
                  <tr><td className="italic" style={{ paddingLeft: 14, color: "var(--ink-3)" }}>No salary / dividend drawn</td>
                    <td className="num" style={{ color: "var(--ink-3)" }}>—</td></tr>
                )}

                {/* Step 2: Ashton's personal income */}
                <tr className="subtotal"><td colSpan={2}>Step 2 — Ashton receives (monthly)</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 14 }}>Net salary (after withholding)</td>
                  <td className="num pos">+€{Math.round(biz.netSalary).toLocaleString()}</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 14 }}>Net dividend (after dividend tax)</td>
                  <td className="num pos">+€{Math.round(biz.dividendNet).toLocaleString()}</td></tr>
                <tr className="subtotal"><td>Total income to Ashton</td>
                  <td className="num">€{Math.round(ashtonBizIncome).toLocaleString()}</td></tr>

                {/* Step 3: Ashton's obligations */}
                <tr className="subtotal"><td colSpan={2}>Step 3 — Ashton's obligations (monthly)</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 14 }}>Personal spend</td>
                  <td className="num neg">−€{Math.round(scenAshton).toLocaleString()}</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 14 }}>Joint share ({(aScenShare * 100).toFixed(0)}% of €{Math.round(scenJoint).toLocaleString()})</td>
                  <td className="num neg">−€{Math.round(scenJoint * aScenShare).toLocaleString()}</td></tr>
                <tr className="subtotal"><td>Total required</td>
                  <td className="num">€{Math.round(ashtonRequired).toLocaleString()}</td></tr>

                {/* Result */}
                <tr className="total"><td>
                  {active.includeBusiness ? "Net drain (personal + biz combined)" : "Net drain on personal pot"}
                </td>
                  <td className={`num ${isInfinite ? "pos" : ""}`}>
                    {isInfinite
                      ? <span style={{ color: "var(--moss)" }}>€0 — surplus</span>
                      : `€${Math.round(totalNetBurn).toLocaleString()}/mo`}
                  </td></tr>
              </tbody>
            </table>

            {!isInfinite && (
              <table className="table mt-md">
                <thead><tr><th>Milestone</th><th className="num">Balance</th></tr></thead>
                <tbody>
                  <tr><td>Month 6</td><td className="num">€{Math.max(0, Math.round(pot - totalNetBurn * 6)).toLocaleString()}</td></tr>
                  <tr><td>Month 12</td><td className="num">€{Math.max(0, Math.round(pot - totalNetBurn * 12)).toLocaleString()}</td></tr>
                  <tr><td>Month 24</td><td className="num">€{Math.max(0, Math.round(pot - totalNetBurn * 24)).toLocaleString()}</td></tr>
                  <tr className="subtotal"><td>Hit €5k floor</td><td className="num">month {Math.max(0, Math.floor((pot - 5000) / totalNetBurn))}</td></tr>
                  <tr className="total"><td>Zero</td><td className="num">month {runway}</td></tr>
                </tbody>
              </table>
            )}
          </Panel>
        </div>

        {/* Per-scenario expense editor */}
        <Panel title={`Expenses — ${active.name}`} meta="edit independently of live inputs">
          <div className="flex-between mb-md" style={{ alignItems: "center" }}>
            <Segmented<ExpenseTab>
              value={expTab}
              onChange={setExpTab}
              options={[
                { value: "joint",    label: `Joint (€${Math.round(scenJoint).toLocaleString()})` },
                { value: "ashton",   label: `Ashton personal (€${Math.round(scenAshton).toLocaleString()})` },
                { value: "business", label: `Biz costs (€${Math.round(scenBizCosts).toLocaleString()})` },
              ]}
            />
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
              €{Math.round(currentTotal).toLocaleString()}/mo · €{Math.round(currentTotal * 12).toLocaleString()}/yr
            </span>
          </div>
          {expTab === "business" && (
            <div className="italic mb-sm" style={{ fontSize: 12, color: "var(--ink-3)" }}>
              Business operating costs in this scenario. When business assets are included in the pot, these drain them directly.
            </div>
          )}
          <table className="table">
            <thead>
              <tr><th>Item</th><th className="num">Monthly</th><th className="num">Yearly</th><th></th></tr>
            </thead>
            <tbody>
              {currentList.map((e, i) => (
                <tr key={i}>
                  <td>
                    <input className="cell-input" value={e.label}
                      onChange={ev => updExp(expTab, i, "label", ev.target.value)}
                      style={{ minWidth: 200 }} />
                  </td>
                  <td className="num editable">
                    <input className="cell-input mono" value={e.amt}
                      onChange={ev => updExp(expTab, i, "amt", parseFloat(ev.target.value) || 0)}
                      style={{ textAlign: "right", width: 80 }} />
                  </td>
                  <td className="num italic" style={{ color: "var(--ink-3)" }}>€{(e.amt * 12).toLocaleString()}</td>
                  <td><button onClick={() => remExp(expTab, i)} style={{ color: "var(--ink-3)" }}>×</button></td>
                </tr>
              ))}
              <tr className="total">
                <td>Total</td>
                <td className="num">€{Math.round(currentTotal).toLocaleString()}</td>
                <td className="num">€{Math.round(currentTotal * 12).toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <button className="btn mt-md" onClick={() => addExp(expTab)}>+ Add item</button>
        </Panel>

        {/* Side-by-side comparison */}
        <Panel title="Compare scenarios" meta="Ashton's runway, side by side">
          <table className="table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Biz rev</th>
                <th>Joint split</th>
                <th className="num">Ashton spend</th>
                <th className="num">Net drain</th>
                <th className="num">Pot</th>
                <th className="num">Runway</th>
                <th style={{ width: 160 }}>Bar</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map(s => {
                const ns = normalizeScenario(s);
                let sPot = d.liquidA;
                if (ns.includeInvest)    sPot += d.personalBrokerageA;
                if (ns.includeBusiness)  sPot += d.businessAssets;
                const sBizPot      = ns.includeBusiness ? d.businessAssets : 0;
                const sPersonalPot = d.liquidA + (ns.includeInvest ? d.personalBrokerageA : 0);
                const sb = computeScenarioBurn(ns, state.tax, state.income, { bizPot: sBizPot, personalPot: sPersonalPot });
                const sJoint  = ns.joint.reduce((a, e)   => a + e.amt, 0);
                const sAshton = ns.ashtonP.reduce((a, e) => a + e.amt, 0);
                const sRunway = sb.isInfinite ? Infinity : Math.floor(sb.runway);
                const maxRunway = 120;
                return (
                  <tr key={s.id} onClick={() => setActiveId(s.id)}
                    style={{ cursor: "pointer", background: s.id === activeId ? "var(--paper-2)" : "transparent" }}>
                    <td>{s.name}</td>
                    <td className="mono" style={{ fontSize: 11 }}>
                      {ns.bizRevenue > 0 ? `€${Math.round(ns.bizRevenue / 1000).toFixed(1)}k` : "—"}
                    </td>
                    <td className="mono" style={{ fontSize: 11 }}>
                      {ns.partnerWorking ? `${Math.round(sb.aScenShare * 100)}%` : "100%"}
                    </td>
                    <td className="num">€{Math.round(sJoint * sb.aScenShare + sAshton).toLocaleString()}</td>
                    <td className="num">
                      {sb.isInfinite ? <span style={{ color: "var(--moss)" }}>∞</span> : `€${Math.round(sb.totalNetBurn).toLocaleString()}`}
                    </td>
                    <td className="num">€{Math.round(sPot).toLocaleString()}</td>
                    <td className="num" style={{ fontWeight: 600 }}>
                      {sRunway === Infinity ? <span style={{ color: "var(--moss)" }}>∞</span> : `${sRunway} mo`}
                    </td>
                    <td>
                      {sRunway === Infinity
                        ? <div style={{ height: 10, background: "var(--moss)", opacity: 0.6 }} />
                        : <Bar pct={Math.min(100, sRunway / maxRunway * 100)} variant="ink" height={10} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      {modal !== null && (
        <LedgerModal
          title={modal === "new" ? "New scenario — copy of live inputs" : `Rename "${active.name}"`}
          onClose={() => setModal(null)}
        >
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, minWidth: 360 }}>
            <div>
              <div className="smallcaps mb-sm">{modal === "new" ? "Scenario name" : "New name"}</div>
              <input
                autoFocus
                className="cell-input"
                value={modalInput}
                onChange={e => setModalInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") confirmModal(); if (e.key === "Escape") setModal(null); }}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--rule)", background: "var(--paper)", fontFamily: "var(--serif)", fontSize: 15 }}
                placeholder={modal === "new" ? "e.g. Lean + sabbatical" : active.name}
              />
              {modal === "new" && (
                <div className="italic mt-sm" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                  Copies current live inputs. Edit expenses and biz revenue independently per scenario.
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn primary" onClick={confirmModal}>{modal === "new" ? "Create" : "Rename"}</button>
            </div>
          </div>
        </LedgerModal>
      )}
    </>
  );
}
