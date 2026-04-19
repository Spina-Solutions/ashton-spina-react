import { useEffect, useState } from "react";
import { Bar, Folio, LedgerModal, Panel, Segmented, Smallcaps, Stat } from "../primitives.js";
import { DepletionChart } from "../charts.js";
import type { Derived, LedgerState } from "../state.js";
import type { Scenario, ScenarioExpense } from "../data.js";

type ModalKind = "new" | "rename" | null;
type ExpenseTab = "joint" | "ashton" | "maria";

export function Runway({ state, d }: { state: LedgerState; d: Derived }) {
  const { scenarios, setScenarios } = state;
  const [activeId, setActiveId] = useState<string>(scenarios[0].id);
  const active: Scenario = scenarios.find(s => s.id === activeId) || scenarios[0];

  const [modal, setModal] = useState<ModalKind>(null);
  const [modalInput, setModalInput] = useState("");
  const [expTab, setExpTab] = useState<ExpenseTab>("joint");

  const openNew = () => { setModalInput(""); setModal("new"); };
  const openRename = () => { setModalInput(active.name); setModal("rename"); };

  const confirmModal = () => {
    if (!modalInput.trim()) { setModal(null); return; }
    if (modal === "new") {
      const id = "c" + Date.now();
      // New scenario starts as a copy of the current live spending inputs
      setScenarios(s => [...s, {
        id, name: modalInput.trim(), note: "",
        partnerWorking: true, includeInvest: false, includeBusiness: false,
        joint: state.joint.map(e => ({ id: e.id, label: e.label, amt: e.amt, cat: e.cat })),
        ashtonP: state.ashtonP.map(e => ({ label: e.label, amt: e.amt, cat: e.cat })),
        mariaP: state.mariaP.map(e => ({ label: e.label, amt: e.amt, cat: e.cat })),
      }]);
      setActiveId(id);
    } else if (modal === "rename") {
      setScenarios(s => s.map(x => x.id === activeId ? { ...x, name: modalInput.trim() } : x));
    }
    setModal(null);
  };

  const del = () => {
    if (scenarios.length <= 1) return;
    setScenarios(s => s.filter(x => x.id !== activeId));
    setActiveId(scenarios[0].id);
  };

  // Helper to update a field on the active scenario
  const updActive = <K extends keyof Scenario>(k: K, v: Scenario[K]) =>
    setScenarios(s => s.map(x => x.id === activeId ? { ...x, [k]: v } : x));

  // Expense editing helpers
  const updExp = (tab: ExpenseTab, i: number, field: keyof ScenarioExpense, val: string | number) =>
    setScenarios(s => s.map(x => {
      if (x.id !== activeId) return x;
      const key = tab === "joint" ? "joint" : tab === "ashton" ? "ashtonP" : "mariaP";
      const arr = [...x[key]];
      arr[i] = { ...arr[i], [field]: val };
      return { ...x, [key]: arr };
    }));

  const addExp = (tab: ExpenseTab) =>
    setScenarios(s => s.map(x => {
      if (x.id !== activeId) return x;
      const key = tab === "joint" ? "joint" : tab === "ashton" ? "ashtonP" : "mariaP";
      return { ...x, [key]: [...x[key], { label: "New item", amt: 0, cat: "other" }] };
    }));

  const remExp = (tab: ExpenseTab, i: number) =>
    setScenarios(s => s.map(x => {
      if (x.id !== activeId) return x;
      const key = tab === "joint" ? "joint" : tab === "ashton" ? "ashtonP" : "mariaP";
      return { ...x, [key]: x[key].filter((_, j) => j !== i) };
    }));

  // Compute burn from this scenario's expense snapshot
  const scenJoint = active.joint.reduce((s, e) => s + e.amt, 0);
  const scenAshton = active.ashtonP.reduce((s, e) => s + e.amt, 0);
  const scenMaria = active.mariaP.reduce((s, e) => s + e.amt, 0);
  const scenBurn = scenJoint + scenAshton + scenMaria;
  const partnerIncomeNet = active.partnerWorking ? d.mIncome : 0;
  const netBurn = Math.max(100, scenBurn - partnerIncomeNet);

  let pot = d.liquidAssets;
  if (active.includeInvest) pot += d.brokerageAssets;
  if (active.includeBusiness) pot += d.businessAssets;

  const runway = Math.floor(pot / netBurn);

  const currentList = expTab === "joint" ? active.joint
    : expTab === "ashton" ? active.ashtonP
    : active.mariaP;
  const currentTotal = currentList.reduce((s, e) => s + e.amt, 0);

  return (
    <>
      <Folio section="Section III" title="Runway" no="III"
        dek="If the income stops, how long do the reserves last? Each scenario has its own expense snapshot." />

      <div className="content">
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
              {" · "}<button onClick={del} style={{ background: "none", border: "none", color: scenarios.length <= 1 ? "var(--ink-4)" : "inherit", cursor: scenarios.length <= 1 ? "default" : "pointer", padding: 0, font: "inherit" }} disabled={scenarios.length <= 1}>delete</button>
            </span>
          </div>
        </Panel>

        <div className="grid g-2">
          <Stat label={`Runway — ${active.name}`} value={runway} unit="months" size={60}
            sub={`€${Math.round(netBurn).toLocaleString()}/mo net burn · ${active.partnerWorking ? "Maria working" : "no partner income"}`} />
          <Stat label="Reserve pot" value={pot} size={38} showDec={false}
            sub={["cash + receivables", active.includeInvest ? "+ brokerage" : null, active.includeBusiness ? "+ business" : null].filter(Boolean).join(" ")} />
        </div>

        <Panel title="Depletion curve" meta={`${runway} months until reserves reach zero`}>
          <DepletionChart
            width={1340}
            months={Math.min(96, runway + 12)}
            monthlyBurn={netBurn}
            startValue={pot}
            targetFloor={5000}
          />
        </Panel>

        <div className="grid g-2">
          {/* Scenario settings */}
          <Panel title={`Settings — ${active.name}`} meta={`€${Math.round(scenBurn).toLocaleString()}/mo total spend`}>
            <label className="flex-between" style={{ padding: "10px 0", cursor: "pointer" }}>
              <span>Maria keeps working (€{Math.round(d.mIncome).toLocaleString()}/mo net)</span>
              <input type="checkbox" checked={active.partnerWorking}
                onChange={e => updActive("partnerWorking", e.target.checked)} />
            </label>
            <label className="flex-between" style={{ padding: "10px 0", borderTop: "1px solid var(--rule-soft)", cursor: "pointer" }}>
              <span>Include brokerage (+€{Math.round(d.brokerageAssets).toLocaleString()})</span>
              <input type="checkbox" checked={active.includeInvest}
                onChange={e => updActive("includeInvest", e.target.checked)} />
            </label>
            <label className="flex-between" style={{ padding: "10px 0", borderTop: "1px solid var(--rule-soft)", cursor: "pointer" }}>
              <span>Include business assets (+€{Math.round(d.businessAssets).toLocaleString()})</span>
              <input type="checkbox" checked={active.includeBusiness}
                onChange={e => updActive("includeBusiness", e.target.checked)} />
            </label>
            <hr className="rule" style={{ margin: "14px 0" }} />
            <Smallcaps>Burn summary</Smallcaps>
            <table className="table mt-sm">
              <tbody>
                <tr><td>Joint ({active.joint.length} items)</td><td className="num">€{Math.round(scenJoint).toLocaleString()}</td></tr>
                <tr><td>Ashton personal ({active.ashtonP.length} items)</td><td className="num">€{Math.round(scenAshton).toLocaleString()}</td></tr>
                <tr><td>Maria personal ({active.mariaP.length} items)</td><td className="num">€{Math.round(scenMaria).toLocaleString()}</td></tr>
                <tr className="subtotal"><td>Gross burn</td><td className="num">€{Math.round(scenBurn).toLocaleString()}</td></tr>
                {active.partnerWorking && <tr><td>− Maria income</td><td className="num pos">−€{Math.round(d.mIncome).toLocaleString()}</td></tr>}
                <tr className="total"><td>Net burn</td><td className="num">€{Math.round(netBurn).toLocaleString()}</td></tr>
              </tbody>
            </table>
          </Panel>

          <Panel title="Milestones" meta="along the depletion curve">
            <table className="table">
              <tbody>
                <tr><td>Month 6 balance</td><td className="num">€{Math.max(0, Math.round(pot - netBurn * 6)).toLocaleString()}</td></tr>
                <tr><td>Month 12 balance</td><td className="num">€{Math.max(0, Math.round(pot - netBurn * 12)).toLocaleString()}</td></tr>
                <tr><td>Month 24 balance</td><td className="num">€{Math.max(0, Math.round(pot - netBurn * 24)).toLocaleString()}</td></tr>
                <tr className="subtotal"><td>Hit €5k floor</td><td className="num">month {Math.max(0, Math.floor((pot - 5000) / netBurn))}</td></tr>
                <tr className="total"><td>Zero</td><td className="num">month {runway}</td></tr>
              </tbody>
            </table>
          </Panel>
        </div>

        {/* Per-scenario expense editor */}
        <Panel title={`Expenses — ${active.name}`} meta="edit independently of live inputs">
          <div className="flex-between mb-md" style={{ alignItems: "center" }}>
            <Segmented<ExpenseTab>
              value={expTab}
              onChange={setExpTab}
              options={[
                { value: "joint", label: `Joint (€${Math.round(scenJoint).toLocaleString()})` },
                { value: "ashton", label: `Ashton (€${Math.round(scenAshton).toLocaleString()})` },
                { value: "maria", label: `Maria (€${Math.round(scenMaria).toLocaleString()})` },
              ]}
            />
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
              €{Math.round(currentTotal).toLocaleString()}/mo · €{Math.round(currentTotal * 12).toLocaleString()}/yr
            </span>
          </div>
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
        <Panel title="Compare scenarios" meta="side-by-side runway">
          <table className="table">
            <thead>
              <tr><th>Scenario</th><th>Partner</th><th className="num">Gross burn</th><th className="num">Net burn</th><th className="num">Pot</th><th className="num">Runway</th><th style={{ width: 200 }}>Bar</th></tr>
            </thead>
            <tbody>
              {scenarios.map(s => {
                const sBurn = s.joint.reduce((a, e) => a + e.amt, 0)
                  + s.ashtonP.reduce((a, e) => a + e.amt, 0)
                  + s.mariaP.reduce((a, e) => a + e.amt, 0);
                const sNetBurn = Math.max(100, sBurn - (s.partnerWorking ? d.mIncome : 0));
                let sPot = d.liquidAssets;
                if (s.includeInvest) sPot += d.brokerageAssets;
                if (s.includeBusiness) sPot += d.businessAssets;
                const sRunway = Math.floor(sPot / sNetBurn);
                const maxRunway = 120;
                return (
                  <tr key={s.id} onClick={() => setActiveId(s.id)}
                    style={{ cursor: "pointer", background: s.id === activeId ? "var(--paper-2)" : "transparent" }}>
                    <td>{s.name}</td>
                    <td>{s.partnerWorking ? "working" : "—"}</td>
                    <td className="num">€{Math.round(sBurn).toLocaleString()}</td>
                    <td className="num">€{Math.round(sNetBurn).toLocaleString()}</td>
                    <td className="num">€{Math.round(sPot).toLocaleString()}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{sRunway} mo</td>
                    <td><Bar pct={Math.min(100, sRunway / maxRunway * 100)} variant="ink" height={10} /></td>
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
                  Starts as a copy of your current live spending. Edit expenses in the scenario independently.
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
