import { Fragment, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Bar, EditableCell, Folio, Panel, Segmented, Smallcaps, Stat, Who } from "../primitives.js";
import { BUSINESS, CATEGORIES, deriveBiz, fmt, fx } from "../data.js";
import type { Derived, LedgerState } from "../state.js";
import type { CategoryKey, Iou, IouEntry, SplitMode, Asset, AssetOwner, Debt } from "../data.js";

const CATEGORY_OPTIONS: { value: CategoryKey; label: string }[] =
  Object.entries(CATEGORIES).map(([k, v]) => ({ value: k as CategoryKey, label: v.label }));

function CategorySelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value || "other"}
      onChange={e => onChange(e.target.value)}
      style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
    >
      {CATEGORY_OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

type InputsSection = "income" | "joint" | "personal" | "business" | "tax" | "assets" | "ious" | "split";

export function Inputs({ state, d }: { state: LedgerState; d: Derived }) {
  const [section, setSection] = useState<InputsSection>("income");

  return (
    <>
      <Folio section="Section IV" title="Inputs" no="IV"
        dek="The one place where the numbers live. Edit here; the whole book updates." />

      <div className="content">
        <div className="panel ruled" style={{ padding: "10px 14px" }}>
          <Segmented<InputsSection>
            value={section}
            onChange={setSection}
            options={[
              { value: "income",   label: "Income" },
              { value: "joint",    label: "Joint expenses" },
              { value: "personal", label: "Personal spending" },
              { value: "business", label: "Business" },
              { value: "tax",      label: "Tax rates" },
              { value: "assets",   label: "Assets & debts" },
              { value: "ious",     label: "IOUs" },
              { value: "split",    label: "Split rules" },
            ]}
          />
        </div>

        {section === "income"   && <IncomeSection state={state} />}
        {section === "joint"    && <JointSection state={state} />}
        {section === "personal" && <PersonalSection state={state} />}
        {section === "business" && <BusinessSection state={state} />}
        {section === "tax"      && <TaxSection state={state} />}
        {section === "assets"   && <AssetsSection state={state} />}
        {section === "ious"     && <IousSection state={state} />}
        {section === "split"    && <SplitSection state={state} d={d} />}
      </div>
    </>
  );
}

function IncomeSection({ state }: { state: LedgerState }) {
  const { income, setIncome, tax } = state;
  const [ashtonMode, setAshtonMode] = useState<"net" | "gross">("net");
  const [mariaMode, setMariaMode] = useState<"net" | "gross">("net");

  // Gross salary field for Ashton (separate from business salary)
  const [ashtonGrossDraft, setAshtonGrossDraft] = useState<number>(
    Math.round(income.ashton.salary / (1 - tax.salaryTaxRate))
  );
  const [mariaGrossDraft, setMariaGrossDraft] = useState<number>(income.partner.gross || income.partner.total);

  const update = (person: "ashton" | "partner", key: string, v: number) => {
    setIncome(i => {
      const updatedPerson = { ...i[person], [key]: v };
      const merged = { ...i, [person]: updatedPerson };
      return {
        ashton: { ...merged.ashton, total: (merged.ashton.salary || 0) + (merged.ashton.dividend || 0) },
        partner: { ...merged.partner, total: merged.partner.salary || 0 },
      };
    });
  };

  const applyAshtonGross = (gross: number) => {
    const netSalary = gross * (1 - tax.salaryTaxRate);
    setAshtonGrossDraft(gross);
    update("ashton", "gross", gross);
    update("ashton", "salary", Math.round(netSalary * 100) / 100);
  };

  const applyMariaGross = (gross: number) => {
    const netSalary = gross * (1 - tax.mariaTaxRate);
    setMariaGrossDraft(gross);
    update("partner", "gross", gross);
    update("partner", "salary", Math.round(netSalary * 100) / 100);
  };

  const ModeToggle = ({ mode, setMode }: { mode: "net" | "gross"; setMode: (m: "net" | "gross") => void }) => (
    <span style={{ display: "flex", gap: 0, border: "1px solid var(--rule-soft)", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em" }}>
      <button onClick={() => setMode("net")} style={{ padding: "2px 7px", background: mode === "net" ? "var(--ink)" : "transparent", color: mode === "net" ? "var(--paper)" : "var(--ink-3)", border: "none" }}>NET</button>
      <button onClick={() => setMode("gross")} style={{ padding: "2px 7px", background: mode === "gross" ? "var(--ink)" : "transparent", color: mode === "gross" ? "var(--paper)" : "var(--ink-3)", border: "none" }}>GROSS</button>
    </span>
  );

  return (
    <div className="grid g-2">
      <Panel
        title="Ashton — income (before personal tax)"
        meta="monthly · EUR · see Tax rates for gates"
        action={<ModeToggle mode={ashtonMode} setMode={setAshtonMode} />}
      >
        <table className="table">
          <tbody>
            {ashtonMode === "gross" ? (
              <>
                <tr>
                  <td>Gross salary (before withholding)</td>
                  <EditableCell value={ashtonGrossDraft} onChange={applyAshtonGross} prefix="€" />
                </tr>
                <tr>
                  <td className="italic" style={{ paddingLeft: 20, fontSize: 11, color: "var(--ink-3)" }}>
                    − salary tax ({(tax.salaryTaxRate * 100).toFixed(1)}%)
                  </td>
                  <td className="num neg" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                    −€{Math.round(ashtonGrossDraft * tax.salaryTaxRate).toLocaleString()}
                  </td>
                </tr>
                <tr className="subtotal">
                  <td>= Net salary (computed)</td>
                  <td className="num">€{Math.round(ashtonGrossDraft * (1 - tax.salaryTaxRate)).toLocaleString()}</td>
                </tr>
              </>
            ) : (
              <tr><td>Net salary (from Oy)</td><EditableCell value={income.ashton.salary} onChange={v => update("ashton", "salary", v)} prefix="€" /></tr>
            )}
            <tr><td>Dividend (declared, gross)</td><EditableCell value={income.ashton.dividend} onChange={v => update("ashton", "dividend", v)} prefix="€" /></tr>
            <tr className="total"><td>Combined</td><td className="num">€{(income.ashton.salary + income.ashton.dividend).toLocaleString()}</td></tr>
            <tr><td className="italic" style={{ fontSize: 11, color: "var(--ink-3)" }}>minus dividend tax ({(tax.dividendTaxRate * 100).toFixed(1)}%)</td>
              <td className="num neg" style={{ fontSize: 11, color: "var(--ink-3)" }}>−€{Math.round(income.ashton.dividend * tax.dividendTaxRate).toLocaleString()}</td></tr>
            <tr className="subtotal"><td>Ashton actual take-home</td>
              <td className="num">€{Math.round(income.ashton.salary + income.ashton.dividend * (1 - tax.dividendTaxRate)).toLocaleString()}</td></tr>
          </tbody>
        </table>
      </Panel>
      <Panel
        title="Maria — income"
        meta="monthly · EUR"
        action={<ModeToggle mode={mariaMode} setMode={setMariaMode} />}
      >
        <table className="table">
          <tbody>
            {mariaMode === "gross" ? (
              <>
                <tr>
                  <td>Gross salary</td>
                  <EditableCell value={mariaGrossDraft} onChange={applyMariaGross} prefix="€" />
                </tr>
                <tr>
                  <td className="italic" style={{ paddingLeft: 20, fontSize: 11, color: "var(--ink-3)" }}>
                    − income tax ({(tax.mariaTaxRate * 100).toFixed(1)}%)
                  </td>
                  <td className="num neg" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                    −€{Math.round(mariaGrossDraft * tax.mariaTaxRate).toLocaleString()}
                  </td>
                </tr>
                <tr className="subtotal">
                  <td>= Net take-home (computed)</td>
                  <td className="num">€{Math.round(mariaGrossDraft * (1 - tax.mariaTaxRate)).toLocaleString()}</td>
                </tr>
              </>
            ) : (
              <tr><td>Salary</td><EditableCell value={income.partner.salary} onChange={v => update("partner", "salary", v)} prefix="€" /></tr>
            )}
            <tr className="total"><td>Total</td><td className="num">€{income.partner.total.toLocaleString()}</td></tr>
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function JointSection({ state }: { state: LedgerState }) {
  const { joint, setJoint } = state;
  const total = joint.reduce((s, x) => s + x.amt, 0);
  const update = (id: string, v: number) => setJoint(js => js.map(j => j.id === id ? { ...j, amt: v } : j));
  const add = () => setJoint(js => [...js, { id: `c${Date.now()}`, label: "New item", amt: 0, cat: "other" }]);
  const updateLabel = (id: string, v: string) => setJoint(js => js.map(j => j.id === id ? { ...j, label: v } : j));
  const updateCat = (id: string, v: string) => setJoint(js => js.map(j => j.id === id ? { ...j, cat: v } : j));
  const remove = (id: string) => setJoint(js => js.filter(j => j.id !== id));

  return (
    <Panel title="Joint expenses" meta={`${joint.length} items · €${Math.round(total).toLocaleString()}/mo`}>
      <div className="table-wrap"><table className="table">
        <thead>
          <tr><th>Item</th><th>Category</th><th className="num">Monthly</th><th className="num">Yearly</th><th></th></tr>
        </thead>
        <tbody>
          {joint.map(j => (
            <tr key={j.id}>
              <td>
                <input className="cell-input" value={j.label}
                  onChange={e => updateLabel(j.id!, e.target.value)}
                  style={{ minWidth: 200 }} />
              </td>
              <td><CategorySelect value={j.cat} onChange={v => updateCat(j.id!, v)} /></td>
              <EditableCell value={j.amt} onChange={v => update(j.id!, v)} prefix="€" />
              <td className="num italic" style={{ color: "var(--ink-3)" }}>€{(j.amt * 12).toLocaleString()}</td>
              <td><button onClick={() => remove(j.id!)} style={{ color: "var(--ink-3)" }}>×</button></td>
            </tr>
          ))}
          <tr className="total">
            <td colSpan={2}>Total</td>
            <td className="num">€{Math.round(total).toLocaleString()}</td>
            <td className="num">€{Math.round(total * 12).toLocaleString()}</td>
            <td></td>
          </tr>
        </tbody>
      </table></div>
      <button className="btn mt-md" onClick={add}>+ Add joint expense</button>
    </Panel>
  );
}

function PersonalSection({ state }: { state: LedgerState }) {
  const { ashtonP, setAshtonP, mariaP, setMariaP } = state;
  return (
    <div className="grid g-2">
      <PersonalList title="Ashton — personal" list={ashtonP} setList={setAshtonP} />
      <PersonalList title="Maria — personal" list={mariaP} setList={setMariaP} />
    </div>
  );
}

function PersonalList({ title, list, setList }: { title: string; list: LedgerState["ashtonP"]; setList: LedgerState["setAshtonP"] }) {
  const total = list.reduce((s, x) => s + x.amt, 0);
  const update = (i: number, v: number) => setList(xs => xs.map((x, j) => j === i ? { ...x, amt: v } : x));
  const updateLabel = (i: number, v: string) => setList(xs => xs.map((x, j) => j === i ? { ...x, label: v } : x));
  const updateCat = (i: number, v: string) => setList(xs => xs.map((x, j) => j === i ? { ...x, cat: v } : x));
  const add = () => setList(xs => [...xs, { label: "New item", amt: 0, cat: "other" }]);
  const remove = (i: number) => setList(xs => xs.filter((_, j) => j !== i));
  return (
    <Panel title={title} meta={`${list.length} · €${Math.round(total).toLocaleString()}/mo`}>
      <div className="table-wrap"><table className="table">
        <thead>
          <tr><th>Item</th><th>Category</th><th className="num">Monthly</th><th></th></tr>
        </thead>
        <tbody>
          {list.map((it, i) => (
            <tr key={i}>
              <td>
                <input className="cell-input" value={it.label}
                  onChange={e => updateLabel(i, e.target.value)} />
              </td>
              <td><CategorySelect value={it.cat} onChange={v => updateCat(i, v)} /></td>
              <EditableCell value={it.amt} onChange={v => update(i, v)} prefix="€" />
              <td><button onClick={() => remove(i)} style={{ color: "var(--ink-3)" }}>×</button></td>
            </tr>
          ))}
          <tr className="total">
            <td colSpan={2}>Total</td>
            <td className="num">€{Math.round(total).toLocaleString()}</td>
            <td></td>
          </tr>
        </tbody>
      </table></div>
      <button className="btn mt-md" onClick={add}>+ Add</button>
    </Panel>
  );
}

function BusinessSection({ state }: { state: LedgerState }) {
  const { bizRevenue, setBizRevenue, bizCosts, setBizCosts } = state;
  const total = bizCosts.reduce((s, c) => s + c.amt, 0);
  const net = bizRevenue - total;
  const update = (i: number, v: number) => setBizCosts(xs => xs.map((x, j) => j === i ? { ...x, amt: v } : x));
  const updateLabel = (i: number, v: string) => setBizCosts(xs => xs.map((x, j) => j === i ? { ...x, label: v } : x));
  const add = () => setBizCosts(xs => [...xs, { label: "New cost", amt: 0 }]);
  const remove = (i: number) => setBizCosts(xs => xs.filter((_, j) => j !== i));

  return (
    <div className="grid g-2-1">
      <Panel title="Business costs" meta={`${bizCosts.length} · €${Math.round(total).toLocaleString()}/mo`}>
        <div className="table-wrap"><table className="table">
          <tbody>
            {bizCosts.map((c, i) => (
              <tr key={i}>
                <td>
                  <input className="cell-input" value={c.label}
                    onChange={e => updateLabel(i, e.target.value)} />
                </td>
                <EditableCell value={c.amt} onChange={v => update(i, v)} prefix="€" />
                <td className="num italic" style={{ color: "var(--ink-3)" }}>€{(c.amt * 12).toLocaleString()}</td>
                <td><button onClick={() => remove(i)} style={{ color: "var(--ink-3)" }}>×</button></td>
              </tr>
            ))}
            <tr className="total">
              <td>Total</td>
              <td className="num">€{Math.round(total).toLocaleString()}</td>
              <td className="num">€{Math.round(total * 12).toLocaleString()}</td>
              <td></td>
            </tr>
          </tbody>
        </table></div>
        <button className="btn mt-md" onClick={add}>+ Add business cost</button>
      </Panel>
      <Panel title="Revenue & summary">
        <table className="table">
          <tbody>
            <tr><td>Monthly revenue</td><EditableCell value={bizRevenue} onChange={setBizRevenue} prefix="€" /></tr>
            <tr><td>Costs</td><td className="num neg">−€{Math.round(total).toLocaleString()}</td></tr>
            <tr className="subtotal"><td>Pre-tax net</td><td className="num">€{Math.round(net).toLocaleString()}</td></tr>
            <tr><td>Corporate tax (~20%)</td><td className="num neg">−€{Math.round(net * 0.20).toLocaleString()}</td></tr>
            <tr className="total"><td>After tax</td><td className="num">€{Math.round(net * 0.80).toLocaleString()}</td></tr>
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function AssetsSection({ state }: { state: LedgerState }) {
  const { assets, setAssets, debts, setDebts } = state;
  const total = assets.reduce((s, a) => s + a.bal * fx[a.cur], 0);
  const totalDebt = debts.reduce((s, d) => s + d.bal * fx[d.cur], 0);
  const upd = (id: string, v: number) => setAssets(as => as.map(a => a.id === id ? { ...a, bal: v } : a));
  const updLabel = (id: string, v: string) => setAssets(as => as.map(a => a.id === id ? { ...a, label: v } : a));
  const updOwner = (id: string, owner: AssetOwner) => setAssets(as => as.map(a => a.id === id ? { ...a, owner } : a));
  const rem = (id: string) => setAssets(as => as.filter(a => a.id !== id));
  const add = () => setAssets(as => [...as, { id: `a${Date.now()}`, label: "New account", type: "cash", scope: "personal", owner: "ashton", cur: "EUR", bal: 0, apy: 0 }]);

  const updDebt = (id: string, v: number) => setDebts(ds => ds.map(d => d.id === id ? { ...d, bal: v } : d));
  const updDebtLabel = (id: string, v: string) => setDebts(ds => ds.map(d => d.id === id ? { ...d, label: v } : d));
  const updDebtOwner = (id: string, owner: AssetOwner) => setDebts(ds => ds.map(d => d.id === id ? { ...d, owner } : d));
  const updDebtCounterparty = (id: string, counterparty: Debt["counterparty"]) =>
    setDebts(ds => ds.map(d => d.id === id ? { ...d, counterparty } : d));
  const remDebt = (id: string) => setDebts(ds => ds.filter(d => d.id !== id));
  const addDebt = () => setDebts(ds => [...ds, { id: `d${Date.now()}`, label: "New debt", owner: "ashton", counterparty: "external", bal: 0, cur: "EUR", rate: 0 }]);

  const updateScope = (id: string, scope: Asset["scope"]) => setAssets(as => as.map(a => a.id === id ? { ...a, scope } : a));
  const updateType = (id: string, type: Asset["type"]) => setAssets(as => as.map(a => a.id === id ? { ...a, type } : a));
  const updateCur = (id: string, cur: string) => setAssets(as => as.map(a => a.id === id ? { ...a, cur } : a));

  return (
    <>
      <Panel title="Assets" meta={`${assets.length} accounts · €${Math.round(total).toLocaleString()} total`}>
        <div className="table-wrap"><table className="table">
          <thead>
            <tr><th>Account</th><th>Owner</th><th>Scope</th><th>Type</th><th>Cur</th><th className="num">Balance</th><th className="num">EUR</th><th></th></tr>
          </thead>
          <tbody>
            {assets.map(a => (
              <tr key={a.id}>
                <td><input className="cell-input" value={a.label} onChange={e => updLabel(a.id, e.target.value)} /></td>
                <td>
                  <select value={a.owner} onChange={e => updOwner(a.id, e.target.value as AssetOwner)} style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10 }}>
                    <option value="ashton">Ashton</option>
                    <option value="partner">Maria</option>
                  </select>
                </td>
                <td>
                  <select value={a.scope} onChange={e => updateScope(a.id, e.target.value as Asset["scope"])} style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10 }}>
                    <option value="personal">personal</option>
                    <option value="business">business</option>
                  </select>
                </td>
                <td>
                  <select value={a.type} onChange={e => updateType(a.id, e.target.value as Asset["type"])} style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10 }}>
                    <option value="cash">cash</option>
                    <option value="hysa">hysa</option>
                    <option value="brokerage">brokerage</option>
                    <option value="receivable">receivable</option>
                    <option value="pension">pension</option>
                  </select>
                </td>
                <td>
                  <select value={a.cur} onChange={e => updateCur(a.id, e.target.value)} style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10 }}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </td>
                <EditableCell value={a.bal} onChange={v => upd(a.id, v)} prefix={a.cur === "CAD" ? "C$" : a.cur === "USD" ? "$" : a.cur === "GBP" ? "£" : "€"} />
                <td className="num italic" style={{ color: "var(--ink-3)" }}>€{Math.round(a.bal * fx[a.cur]).toLocaleString()}</td>
                <td><button onClick={() => rem(a.id)} style={{ color: "var(--ink-3)" }}>×</button></td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={6}>Total</td>
              <td className="num">€{Math.round(total).toLocaleString()}</td>
              <td></td>
            </tr>
          </tbody>
        </table></div>
        <button className="btn mt-md" onClick={add}>+ Add account</button>
      </Panel>

      <Panel title="Debts" meta={`${debts.length} · €${Math.round(totalDebt).toLocaleString()} outstanding`}>
        <div className="italic mb-md" style={{ fontSize: 12, color: "var(--ink-3)" }}>
          Choose who owes the debt and to whom. Debts between Ashton and Maria cancel out in the Joint view but show on each individual's net worth.
        </div>
        <div className="table-wrap"><table className="table">
          <thead>
            <tr>
              <th>Debt</th>
              <th>Owed by</th>
              <th>Owed to</th>
              <th>Cur</th>
              <th className="num">Balance</th>
              <th className="num">Rate</th>
              <th className="num">Annual interest</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {debts.map(debt => {
              const cp = debt.counterparty ?? "external";
              return (
                <tr key={debt.id}>
                  <td><input className="cell-input" value={debt.label} onChange={e => updDebtLabel(debt.id, e.target.value)} /></td>
                  <td>
                    <select value={debt.owner} onChange={e => updDebtOwner(debt.id, e.target.value as AssetOwner)} style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10 }}>
                      <option value="ashton">Ashton</option>
                      <option value="partner">Maria</option>
                    </select>
                  </td>
                  <td>
                    <select value={cp} onChange={e => updDebtCounterparty(debt.id, e.target.value as Debt["counterparty"])} style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10 }}>
                      <option value="external">external</option>
                      <option value="ashton" disabled={debt.owner === "ashton"}>Ashton</option>
                      <option value="partner" disabled={debt.owner === "partner"}>Maria</option>
                    </select>
                  </td>
                  <td className="mono" style={{ fontSize: 10 }}>{debt.cur}</td>
                  <EditableCell value={debt.bal} onChange={v => updDebt(debt.id, v)} prefix={debt.cur === "CAD" ? "C$" : "€"} />
                  <td className="num">{(debt.rate * 100).toFixed(2)}%</td>
                  <td className="num neg">−€{Math.round(debt.bal * fx[debt.cur] * debt.rate).toLocaleString()}</td>
                  <td><button onClick={() => remDebt(debt.id)} style={{ color: "var(--ink-3)" }}>×</button></td>
                </tr>
              );
            })}
            <tr className="total">
              <td colSpan={4}>Total</td>
              <td className="num">€{Math.round(totalDebt).toLocaleString()}</td>
              <td></td>
              <td className="num neg">−€{Math.round(debts.reduce((s, d) => s + d.bal * fx[d.cur] * d.rate, 0)).toLocaleString()}</td>
              <td></td>
            </tr>
          </tbody>
        </table></div>
        <button className="btn mt-md" onClick={addDebt}>+ Add debt</button>
      </Panel>
    </>
  );
}

interface IouRowProps {
  i: Iou;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<string | null>>;
  upd: (id: string, k: keyof Iou, v: unknown) => void;
  rem: (id: string) => void;
  addEntry: (id: string, entry: IouEntry) => void;
}

function IouRow({ i, isOpen, setOpen, upd, rem, addEntry }: IouRowProps) {
  const outstanding = i.principal - i.paid;
  const pct = i.principal ? (i.paid / i.principal * 100) : 0;
  return (
    <Fragment>
      <tr>
        <td>
          <input className="cell-input" value={i.counterparty}
            onChange={e => upd(i.id, "counterparty", e.target.value)} />
          {i.note && <div className="italic" style={{ fontSize: 11, color: "var(--ink-3)" }}>{i.note}</div>}
        </td>
        <td>
          <select value={i.direction} onChange={e => upd(i.id, "direction", e.target.value)}
            style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10 }}>
            <option value="incoming">owes me</option>
            <option value="outgoing">I owe</option>
          </select>
        </td>
        <td className="mono" style={{ fontSize: 10 }}>{i.cur}</td>
        <td className="num mono">{fmt(i.principal, i.cur, { decimals: 0 })}</td>
        <td className="num mono pos">{fmt(i.paid, i.cur, { decimals: 0 })}</td>
        <td className="num mono" style={{ fontWeight: 700 }}>{fmt(outstanding, i.cur, { decimals: 0 })}</td>
        <td style={{ width: 120 }}><Bar pct={pct} variant={i.direction === "incoming" ? "moss" : "rust"} /></td>
        <td className="num mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{pct.toFixed(0)}%</td>
        <td>
          <button onClick={() => setOpen(isOpen ? null : i.id)} className="smallcaps">{isOpen ? "close" : "edit"}</button>
          {" · "}
          <button onClick={() => rem(i.id)} style={{ color: "var(--ink-3)" }}>×</button>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={9} style={{ background: "var(--paper-2)", padding: 14 }}>
            <div className="flex-between" style={{ marginBottom: 10 }}>
              <Smallcaps>Description / note</Smallcaps>
            </div>
            <input className="cell-input" value={i.note || ""}
              placeholder="What is this IOU about? e.g. Rent apartment coverage, cat vet, splitting settlement…"
              onChange={e => upd(i.id, "note", e.target.value)}
              style={{ fontStyle: "italic", padding: "6px 8px", marginBottom: 14, border: "1px solid var(--rule-soft)", background: "var(--paper)" }} />

            <Smallcaps>Ledger — {i.counterparty}</Smallcaps>
            <table className="table mt-sm" style={{ background: "transparent" }}>
              <thead><tr><th>Date</th><th>Label</th><th>Kind</th><th className="num">Amount ({i.cur})</th></tr></thead>
              <tbody>
                {(i.history || []).map((h, idx) => (
                  <tr key={idx}>
                    <td className="mono" style={{ fontSize: 10 }}>{h.d}</td>
                    <td>{h.label}</td>
                    <td><span className="pill">{h.kind}</span></td>
                    <td className={`num ${h.kind === "repaid" ? "pos" : ""}`}>
                      {h.kind === "repaid" ? "+" : ""}{fmt(h.amt, i.cur, { decimals: 2 })}
                    </td>
                  </tr>
                ))}
                <NewEntryRow onAdd={(entry) => addEntry(i.id, entry)} direction={i.direction} />
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

function IousSection({ state }: { state: LedgerState }) {
  const { ious, setIous } = state;
  const [open, setOpen] = useState<string | null>(null);

  const add = () => setIous(is => [...is, { id: `i${Date.now()}`, counterparty: "New person",
    direction: "incoming", cur: "EUR", principal: 0, paid: 0, note: "", history: [] }]);
  const rem = (id: string) => setIous(is => is.filter(i => i.id !== id));
  const upd = (id: string, k: keyof Iou, v: unknown) => setIous(is => is.map(i => i.id === id ? ({ ...i, [k]: v } as Iou) : i));
  const addEntry = (id: string, entry: IouEntry) => setIous(is => is.map(i => {
    if (i.id !== id) return i;
    const h = [...(i.history || []), entry];
    const paid = h.filter(x => x.kind === "repaid").reduce((s, x) => s + x.amt, 0);
    const adj = h.filter(x => x.kind === "adjust").reduce((s, x) => s + x.amt, 0);
    const lent = h.filter(x => x.kind === "lent" || x.kind === "borrowed").reduce((s, x) => s + x.amt, 0);
    return { ...i, history: h, principal: lent + adj, paid };
  }));

  const incoming = ious.filter(i => i.direction === "incoming");
  const outgoing = ious.filter(i => i.direction === "outgoing");
  const incSum = incoming.reduce((s, i) => s + (i.principal - i.paid) * fx[i.cur], 0);
  const outSum = outgoing.reduce((s, i) => s + (i.principal - i.paid) * fx[i.cur], 0);

  return (
    <Fragment>
      <div className="grid g-3">
        <Stat label="They owe me" value={incSum} size={32} showDec={false} sub={`${incoming.length} open · EUR equiv.`} />
        <Stat label="I owe them" value={outSum} size={32} showDec={false} sub={`${outgoing.length} open · EUR equiv.`} />
        <Stat label="Net position" value={incSum - outSum} size={32} showDec={false} sub="incoming − outgoing" />
      </div>

      <Panel title="Money owed between people" meta="click a row to see history">
        <div className="table-wrap"><table className="table">
          <thead>
            <tr>
              <th>Person</th><th>Direction</th><th>Cur</th>
              <th className="num">Lent / borrowed</th>
              <th className="num">Paid back</th>
              <th className="num">Outstanding</th>
              <th>Progress</th>
              <th className="num">%</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ious.map(i => (
              <IouRow key={i.id} i={i} isOpen={open === i.id}
                setOpen={setOpen} upd={upd} rem={rem} addEntry={addEntry} />
            ))}
          </tbody>
        </table></div>
        <button className="btn mt-md" onClick={add}>+ Add IOU</button>
      </Panel>
    </Fragment>
  );
}

function NewEntryRow({ onAdd, direction }: { onAdd: (entry: IouEntry) => void; direction: Iou["direction"] }) {
  const [d, setD] = useState(new Date().toISOString().slice(0, 10));
  const [label, setLabel] = useState("");
  const [amt, setAmt] = useState("");
  const [kind, setKind] = useState<IouEntry["kind"]>("repaid");
  return (
    <tr>
      <td><input className="cell-input mono" style={{ fontSize: 10 }} value={d} onChange={e => setD(e.target.value)} /></td>
      <td><input className="cell-input" placeholder="Label" value={label} onChange={e => setLabel(e.target.value)} /></td>
      <td>
        <select value={kind} onChange={e => setKind(e.target.value as IouEntry["kind"])} style={{ border: 0, background: "transparent", fontFamily: "var(--mono)", fontSize: 10 }}>
          <option value="repaid">repaid</option>
          <option value={direction === "incoming" ? "lent" : "borrowed"}>{direction === "incoming" ? "lent more" : "borrowed more"}</option>
          <option value="adjust">adjust</option>
        </select>
      </td>
      <td>
        <div style={{ display: "flex", gap: 6 }}>
          <input className="cell-input mono" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} style={{ textAlign: "right" }} />
          <button className="btn" style={{ padding: "3px 8px", fontSize: 9 }} onClick={() => {
            const n = parseFloat(amt);
            if (!isNaN(n) && label) { onAdd({ d, label, amt: n, kind }); setLabel(""); setAmt(""); }
          }}>add</button>
        </div>
      </td>
    </tr>
  );
}

function SplitSection({ state, d }: { state: LedgerState; d: Derived }) {
  const { splitMode, setSplitMode, customSplit, setCustomSplit } = state;
  const ashtonPct = Math.round(customSplit * 100);
  const mariaPct = 100 - ashtonPct;
  return (
    <div className="grid g-2">
      <Panel title="Split mode" meta="how joint expenses are divided">
        <Segmented<SplitMode>
          value={splitMode}
          onChange={setSplitMode}
          options={[
            { value: "net",    label: "By net" },
            { value: "gross",  label: "By gross" },
            { value: "bizNet", label: "By biz-net" },
            { value: "fifty",  label: "50 / 50" },
            { value: "custom", label: "Custom" },
          ]}
        />
        <div className="italic mt-md" style={{ fontSize: 13, color: "var(--ink-2)", textWrap: "pretty" as "pretty" }}>
          {splitMode === "net"    && "Split joint expenses by net take-home share. Ashton pays more because his net salary + dividend is higher than Maria's net."}
          {splitMode === "gross"  && "Split by pre-tax gross income — a fairer split when one partner pays a lot more tax."}
          {splitMode === "bizNet" && "Split by what Ashton really earns including retained business profit. He'll pay the largest share because the Oy is growing equity in his name."}
          {splitMode === "fifty"  && "Each partner pays half, regardless of income."}
          {splitMode === "custom" && `Use the slider below to set a fixed ratio.`}
        </div>
        {splitMode === "custom" && (
          <div className="mt-md" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="flex-between" style={{ fontSize: 13 }}>
              <span>Ashton</span>
              <span className="mono" style={{ fontWeight: 700 }}>{ashtonPct}%</span>
            </div>
            <input
              type="range" min={0} max={100} step={1}
              value={ashtonPct}
              onChange={e => setCustomSplit(Number(e.target.value) / 100)}
              style={{ width: "100%", accentColor: "var(--ink)" }}
            />
            <div className="flex-between" style={{ fontSize: 12, color: "var(--ink-3)" }}>
              <span>Maria {mariaPct}%</span>
              <span>Ashton {ashtonPct}%</span>
            </div>
          </div>
        )}
      </Panel>
      <Panel title="Current ratio" meta={splitMode === "fifty" ? "50 / 50" : "by income"}>
        <table className="table">
          <tbody>
            <tr><td><Who who="ashton" label="Ashton" /></td><td className="num">€{Math.round(d.aIncome).toLocaleString()}</td><td className="num">{(d.aShare * 100).toFixed(2)}%</td></tr>
            <tr><td><Who who="partner" label="Maria" /></td><td className="num">€{Math.round(d.mIncome).toLocaleString()}</td><td className="num">{(d.mShare * 100).toFixed(2)}%</td></tr>
          </tbody>
        </table>
        <hr className="rule mt-md mb-md" />
        <Smallcaps>Monthly joint share</Smallcaps>
        <div className="mt-sm flex-between"><span>Ashton</span><span className="mono">€{Math.round(d.jointTotal * d.aShare).toLocaleString()}</span></div>
        <div className="flex-between"><span>Maria</span><span className="mono">€{Math.round(d.jointTotal * d.mShare).toLocaleString()}</span></div>
      </Panel>
    </div>
  );
}

type TaxInputMode = "pct" | "abs";

function TaxRow({ label, k, desc, derived, rate, gross, onRate }: {
  label: string;
  k: string;
  desc: string;
  derived: string;
  rate: number;
  gross: number;
  onRate: (v: number) => void;
}) {
  const [mode, setMode] = useState<TaxInputMode>("pct");
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);

  const displayPct = (rate * 100).toFixed(2);
  const displayAbs = Math.round(rate * gross).toString();

  function commitDraft() {
    const raw = parseFloat(draft);
    if (!isNaN(raw)) {
      if (mode === "pct") onRate(Math.max(0, Math.min(0.95, raw / 100)));
      else if (gross > 0) onRate(Math.max(0, Math.min(0.95, raw / gross)));
    }
    setEditing(false);
  }

  return (
    <tr>
      <td>
        <div>{label}</div>
        <div className="italic" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{desc}</div>
      </td>
      <td style={{ width: 180 }}>
        {mode === "pct" && (
          <input type="range" min={0} max={0.6} step={0.001} value={rate}
            onChange={e => onRate(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--rust)" }} />
        )}
      </td>
      <td className="num" style={{ width: 130 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
          {editing ? (
            <input
              autoFocus
              className="cell-input mono"
              style={{ width: 70, textAlign: "right", fontWeight: 600, fontSize: 13 }}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commitDraft}
              onKeyDown={e => { if (e.key === "Enter") commitDraft(); if (e.key === "Escape") setEditing(false); }}
            />
          ) : (
            <span
              className="mono"
              style={{ fontWeight: 600, fontSize: 13, cursor: "text", borderBottom: "1px dashed var(--rule)" }}
              onClick={() => { setDraft(mode === "pct" ? displayPct : displayAbs); setEditing(true); }}
              title="Click to edit"
            >
              {mode === "pct" ? `${displayPct}%` : `€${displayAbs}`}
            </span>
          )}
          <button
            onClick={() => { setEditing(false); setMode(m => m === "pct" ? "abs" : "pct"); }}
            style={{ fontSize: 9, fontFamily: "var(--mono)", letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "2px 5px", border: "1px solid var(--rule-soft)", background: "var(--paper-2)",
              cursor: "pointer", color: "var(--ink-2)", borderRadius: 2, whiteSpace: "nowrap" }}
            title="Toggle between % rate and € monthly amount"
          >
            {mode === "pct" ? "%" : "€"}
          </button>
        </div>
      </td>
      <td className="num mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{derived}</td>
    </tr>
  );
}

function TaxSection({ state }: { state: LedgerState }) {
  const { tax, setTax, bizRevenue, bizCosts, income } = state;
  const upd = (k: keyof typeof tax, v: number) => setTax(t => ({ ...t, [k]: Math.max(0, Math.min(0.95, v)) }));

  const biz = {
    monthlyRevenue: bizRevenue, costs: bizCosts,
    grossSalary: BUSINESS.grossSalary, dividendMonthly: income.ashton.dividend
  };
  const b = deriveBiz(biz, tax);
  const mGross = income.partner.gross || income.partner.total;
  const mTax = mGross * tax.mariaTaxRate;

  return (
    <>
      <Panel title="Tax rates" meta="separate gates for salary, corporate profit, and dividends">
        <div className="italic mb-md" style={{ fontSize: 13, color: "var(--ink-2)", textWrap: "pretty" as "pretty", maxWidth: 680 }}>
          Each rate taxes a different stream — salary is withheld by the Oy before it reaches Ashton,
          corporate tax applies to pre-tax profit inside the Oy, and dividend tax is paid personally on declared dividends.
          What survives each gate is what actually funds you.
        </div>
        <div className="table-wrap"><table className="table">
          <thead>
            <tr><th>Rate</th><th>Slider</th><th className="num">Value — click to edit</th><th className="num">Current monthly amount</th></tr>
          </thead>
          <tbody>
            <TaxRow k="salaryTaxRate" label="Salary tax (withholding)"
              desc={`Paid by the Oy on Ashton's €${BUSINESS.grossSalary.toLocaleString()} gross salary. Goes directly to state — never enters Ashton's pocket.`}
              derived={`−€${Math.round(b.salaryTax).toLocaleString()} of gross · net €${Math.round(b.netSalary).toLocaleString()}`}
              rate={tax.salaryTaxRate} gross={BUSINESS.grossSalary} onRate={v => upd("salaryTaxRate", v)} />
            <TaxRow k="corpTaxRate" label="Corporate tax"
              desc={`Applied to the Oy's pre-tax profit (revenue − costs − gross salary). Finnish default 20%.`}
              derived={`−€${Math.round(b.corpTax).toLocaleString()} of €${Math.round(b.preTaxProfit).toLocaleString()} profit · after-tax €${Math.round(b.afterCorp).toLocaleString()}`}
              rate={tax.corpTaxRate} gross={b.preTaxProfit} onRate={v => upd("corpTaxRate", v)} />
            <TaxRow k="dividendTaxRate" label="Dividend tax (personal)"
              desc={`Paid by Ashton personally on declared dividends. Finnish unlisted Oy dividends are partially tax-advantaged; 26.25% is a conservative blended rate above the acquisition-cost cap.`}
              derived={`−€${Math.round(b.dividendTax).toLocaleString()} of €${Math.round(b.dividendGross).toLocaleString()} gross · net €${Math.round(b.dividendNet).toLocaleString()}`}
              rate={tax.dividendTaxRate} gross={b.dividendGross} onRate={v => upd("dividendTaxRate", v)} />
            <TaxRow k="mariaTaxRate" label="Maria — income tax + social"
              desc={`Applied to Maria's gross salary. Includes income tax and employee social contributions as a combined effective rate.`}
              derived={`−€${Math.round(mTax).toLocaleString()} of €${Math.round(mGross).toLocaleString()} gross · net €${Math.round(mGross - mTax).toLocaleString()}`}
              rate={tax.mariaTaxRate} gross={mGross} onRate={v => upd("mariaTaxRate", v)} />
          </tbody>
        </table></div>
      </Panel>

      <div className="grid g-2">
        <Panel title="Ashton — total tax paid" meta="per month, across all three gates">
          <table className="table">
            <tbody>
              <tr><td>Salary tax (via Oy)</td><td className="num neg">−€{Math.round(b.salaryTax).toLocaleString()}</td></tr>
              <tr><td>Corporate tax (via Oy)</td><td className="num neg">−€{Math.round(b.corpTax).toLocaleString()}</td></tr>
              <tr><td>Dividend tax (personal)</td><td className="num neg">−€{Math.round(b.dividendTax).toLocaleString()}</td></tr>
              <tr className="total">
                <td>Total</td>
                <td className="num neg">−€{Math.round(b.salaryTax + b.corpTax + b.dividendTax).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="italic">Effective rate on €{bizRevenue.toLocaleString()} revenue</td>
                <td className="num mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                  {(((b.salaryTax + b.corpTax + b.dividendTax) / bizRevenue) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </Panel>

        <Panel title="Where each stream ends up" meta="net to Ashton · net to state · retained">
          <table className="table">
            <tbody>
              <tr><td>Ashton net salary</td><td className="num">€{Math.round(b.netSalary).toLocaleString()}</td></tr>
              <tr><td>Ashton dividend (net)</td><td className="num">€{Math.round(b.dividendNet).toLocaleString()}</td></tr>
              <tr className="subtotal"><td>→ Ashton pocket</td><td className="num">€{Math.round(b.netSalary + b.dividendNet).toLocaleString()}</td></tr>
              <tr><td>Retained in Oy (equity)</td><td className="num pos">€{Math.round(b.retained).toLocaleString()}</td></tr>
              <tr className="total"><td>→ State (all taxes)</td><td className="num neg">€{Math.round(b.salaryTax + b.corpTax + b.dividendTax).toLocaleString()}</td></tr>
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  );
}
