import { useState } from "react";
import { Folio, Panel, Smallcaps, Stat } from "../primitives.js";
import type { Derived, LedgerState } from "../state.js";
import type { PensionAccount } from "../data.js";

const currentYear = 2026;
const ashtonBirthYear = 1997;
const mariaBirthYear = 1997;
const retirementAge = 65;

function yearsToRetirement(birthYear: number) {
  return retirementAge - (currentYear - birthYear);
}

function projectBalance(bal: number, monthlyContrib: number, years: number, growthRate = 0.05): number {
  let v = bal;
  const mo = years * 12;
  const r = growthRate / 12;
  for (let i = 0; i < mo; i++) v = v * (1 + r) + monthlyContrib;
  return v;
}

export function Retirement({ state, d }: { state: LedgerState; d: Derived }) {
  const { pensions, setPensions } = state;
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState(4000);
  const [returnRate, setReturnRate] = useState(5);
  const [inflationRate, setInflationRate] = useState(2);

  const aYears = yearsToRetirement(ashtonBirthYear);
  const mYears = yearsToRetirement(mariaBirthYear);

  // FI number = 25x annual expenses (4% SWR)
  const fiNumber = d.hhBurn * 12 * 25;
  const fiProgress = d.totalAssets / fiNumber * 100;

  // Project investable assets to retirement
  const realReturn = (returnRate - inflationRate) / 100;
  const monthlySaving = Math.max(0, d.hhSaving);
  const projectedPortfolio = projectBalance(
    d.brokerageAssets + d.liquidAssets,
    monthlySaving,
    aYears,
    realReturn
  );

  // Pension projections
  const upd = (id: string, k: keyof PensionAccount, v: unknown) =>
    setPensions(ps => ps.map(p => p.id === id ? { ...p, [k]: v } : p));

  const ashtonPensions = pensions.filter(p => p.owner === "ashton");
  const mariaPensions = pensions.filter(p => p.owner === "partner");

  const totalPensionBal = pensions.reduce((s, p) => s + p.currentBal, 0);

  // SWR monthly income from portfolio at retirement
  const swrMonthlyIncome = projectedPortfolio * 0.04 / 12;

  // Pension income estimate
  const aPensionMonthly = ashtonPensions.reduce((s, p) => s + p.projectedMonthlyAt65, 0);
  const mPensionMonthly = mariaPensions.reduce((s, p) => s + p.projectedMonthlyAt65, 0);
  const totalPensionMonthly = aPensionMonthly + mPensionMonthly;

  const totalRetirementIncome = swrMonthlyIncome + totalPensionMonthly;
  const retirementGap = targetMonthlyIncome - totalRetirementIncome;

  return (
    <>
      <Folio section="Section V" title="Retirement" no="V"
        dek="Pension accruals, FI number, and the long arc of savings compounding over time." />
      <div className="content">

        <div className="grid g-3">
          <Stat label="FI number (25× annual burn)" value={fiNumber} size={38} showDec={false}
            sub={`${fiProgress.toFixed(1)}% there · 4% withdrawal rule`} />
          <Stat label="Projected portfolio at 65" value={projectedPortfolio} size={38} showDec={false}
            sub={`at ${realReturn > 0 ? "+" : ""}${(realReturn * 100).toFixed(1)}% real return · €${Math.round(monthlySaving).toLocaleString()}/mo saved`} />
          <Stat label="Est. monthly income at 65" value={totalRetirementIncome} size={38} showDec={false}
            sub={`SWR €${Math.round(swrMonthlyIncome).toLocaleString()} + pension €${Math.round(totalPensionMonthly).toLocaleString()}`}
          />
        </div>

        <Panel title="Assumptions" meta="adjust to model different futures">
          <div className="grid g-3" style={{ gap: 20, padding: "4px 0" }}>
            {[
              { label: "Target monthly income at retirement", val: targetMonthlyIncome, set: setTargetMonthlyIncome, min: 1000, max: 15000, step: 100, fmt: (v: number) => `€${v.toLocaleString()}` },
              { label: "Nominal portfolio return", val: returnRate, set: setReturnRate, min: 0, max: 12, step: 0.25, fmt: (v: number) => `${v.toFixed(2)}%` },
              { label: "Inflation rate", val: inflationRate, set: setInflationRate, min: 0, max: 8, step: 0.25, fmt: (v: number) => `${v.toFixed(2)}%` },
            ].map(({ label, val, set, min, max, step, fmt }) => (
              <div key={label}>
                <div className="flex-between mb-sm">
                  <Smallcaps>{label}</Smallcaps>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{fmt(val)}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={val}
                  onChange={e => set(parseFloat(e.target.value))}
                  className="w-full" style={{ accentColor: "var(--rust)" }} />
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid g-2">
          <Panel title="Income gap at retirement" meta="monthly, in today's money">
            <table className="table">
              <tbody>
                <tr><td>Target monthly income</td><td className="num">€{targetMonthlyIncome.toLocaleString()}</td></tr>
                <tr><td>Portfolio income (4% SWR)</td><td className="num pos">+€{Math.round(swrMonthlyIncome).toLocaleString()}</td></tr>
                <tr><td>Pension income (estimated)</td><td className="num pos">+€{Math.round(totalPensionMonthly).toLocaleString()}</td></tr>
                <tr className="total">
                  <td>Gap / surplus</td>
                  <td className={`num ${retirementGap <= 0 ? "pos" : "neg"}`}>
                    {retirementGap <= 0 ? "+" : "−"}€{Math.abs(Math.round(retirementGap)).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="italic mt-md" style={{ fontSize: 12, color: "var(--ink-3)" }}>
              {retirementGap <= 0
                ? `Projections suggest you're on track. Portfolio alone covers target at ${(swrMonthlyIncome / targetMonthlyIncome * 100).toFixed(0)}%.`
                : `Additional saving of €${Math.round(retirementGap / 0.04 * 12 / (aYears * 12)).toLocaleString()}/mo would close the gap.`}
            </div>
          </Panel>

          <Panel title="Timeline" meta={`${aYears} years to 65`}>
            <table className="table">
              <tbody>
                <tr><td>Ashton age now</td><td className="num">{currentYear - ashtonBirthYear}</td></tr>
                <tr><td>Maria age now</td><td className="num">{currentYear - mariaBirthYear}</td></tr>
                <tr><td>Target retirement age</td><td className="num">{retirementAge}</td></tr>
                <tr><td>Years to Ashton&apos;s 65</td><td className="num">{aYears}</td></tr>
                <tr className="subtotal"><td>Current investable assets</td><td className="num">€{Math.round(d.brokerageAssets + d.liquidAssets).toLocaleString()}</td></tr>
                <tr><td>Current pension assets</td><td className="num">€{Math.round(totalPensionBal).toLocaleString()}</td></tr>
                <tr className="total"><td>Total retirement-bound</td><td className="num">€{Math.round(d.brokerageAssets + d.liquidAssets + totalPensionBal).toLocaleString()}</td></tr>
              </tbody>
            </table>
          </Panel>
        </div>

        <Panel title="Pension accounts" meta="click values to edit">
          <table className="table">
            <thead>
              <tr>
                <th>Account</th><th>Owner</th><th>Type</th>
                <th className="num">Monthly contrib</th>
                <th className="num">Current balance</th>
                <th className="num">Est. mo. at 65</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {pensions.map(p => (
                <tr key={p.id}>
                  <td>
                    <input className="cell-input" value={p.label}
                      onChange={e => upd(p.id, "label", e.target.value)} style={{ minWidth: 160 }} />
                  </td>
                  <td className="mono" style={{ fontSize: 10 }}>{p.owner}</td>
                  <td><span className="pill">{p.type}</span></td>
                  <td className="num">
                    <input className="cell-input mono" value={p.monthlyContrib}
                      onChange={e => upd(p.id, "monthlyContrib", parseFloat(e.target.value) || 0)}
                      style={{ textAlign: "right", width: 70 }} />
                  </td>
                  <td className="num">
                    <input className="cell-input mono" value={p.currentBal}
                      onChange={e => upd(p.id, "currentBal", parseFloat(e.target.value) || 0)}
                      style={{ textAlign: "right", width: 80 }} />
                  </td>
                  <td className="num">
                    <input className="cell-input mono" value={p.projectedMonthlyAt65}
                      onChange={e => upd(p.id, "projectedMonthlyAt65", parseFloat(e.target.value) || 0)}
                      style={{ textAlign: "right", width: 70 }} />
                  </td>
                  <td style={{ fontSize: 11, color: "var(--ink-3)", fontStyle: "italic" }}>{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn mt-md" onClick={() => setPensions(ps => [...ps, {
            id: `p${Date.now()}`, label: "New pension", owner: "ashton", type: "private",
            cur: "EUR", currentBal: 0, monthlyContrib: 0, accrualRatePct: 1.5, projectedMonthlyAt65: 0, note: "",
          }])}>+ Add pension account</button>
        </Panel>

      </div>
    </>
  );
}
