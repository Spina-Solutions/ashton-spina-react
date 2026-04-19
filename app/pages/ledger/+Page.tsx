import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType, Dispatch, SetStateAction } from "react";
import {
  ASHTON_PERSONAL, ASSETS, BUSINESS, DEBTS, INCOME, IOUS, JOINT_EXPENSES,
  MARIA_PERSONAL, PENSIONS, SCENARIOS, SETTINGS, TAX, fx,
} from "./data.js";
import type {
  Asset, BizCost, Debt, Expense, Income, Iou, PensionAccount, Scenario, SplitMode, TaxRates,
} from "./data.js";
import type { Derived, LedgerState } from "./state.js";
import { useLedgerSync } from "./useLedgerSync.js";
import type { LedgerStatePayload } from "../../ts-rest/contract.js";
import { Dashboard } from "./screens/Dashboard.js";
import { Flow } from "./screens/Flow.js";
import { Runway } from "./screens/Runway.js";
import { Inputs } from "./screens/Inputs.js";
import { Retirement } from "./screens/Retirement.js";

type RouteId = "dashboard" | "flow" | "runway" | "retirement" | "inputs";

interface RouteDef {
  id: RouteId;
  label: string;
  no: "I" | "II" | "III" | "IV" | "V";
  component: ComponentType<{ state: LedgerState; d: Derived }>;
}

const ROUTES: RouteDef[] = [
  { id: "dashboard",  label: "Dashboard",  no: "I",   component: Dashboard },
  { id: "flow",       label: "Money flow", no: "II",  component: Flow },
  { id: "runway",     label: "Runway",     no: "III", component: Runway },
  { id: "retirement", label: "Retirement", no: "V",   component: Retirement },
  { id: "inputs",     label: "Inputs",     no: "IV",  component: Inputs },
];

import type { SyncStatus } from "./useLedgerSync.js";

function SyncBadge({ status, lastSaved, onRefresh }: { status: SyncStatus; lastSaved: string | null; onRefresh: () => void }) {
  const dot: Record<SyncStatus, { label: string; color: string }> = {
    loading: { label: "loading…",  color: "var(--ink-3)" },
    idle:    { label: lastSaved ? `saved ${new Date(lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "local only", color: "var(--ink-4)" },
    saving:  { label: "saving…",   color: "var(--ochre)" },
    saved:   { label: "saved",     color: "var(--moss)" },
    error:   { label: "sync error", color: "var(--crimson)" },
  };
  const { label, color } = dot[status];
  return (
    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", color }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
      <span>{label.toUpperCase()}</span>
      <button
        onClick={onRefresh}
        title="Pull latest from the server (useful if you edited on another device)"
        style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", color: "var(--ink-3)", textDecoration: "underline", cursor: "pointer" }}
      >
        REFRESH
      </button>
    </div>
  );
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  return (v as unknown as T) ?? fallback;
}

export default function LedgerPage() {
  const [route, setRoute] = useState<RouteId>(() => readLocal<RouteId>("ledger.route", "dashboard"));
  const [income, setIncome] = useState<Income>(INCOME);
  const [joint, setJoint] = useState<Expense[]>(JOINT_EXPENSES);
  const [ashtonP, setAshtonP] = useState<Expense[]>(ASHTON_PERSONAL);
  const [mariaP, setMariaP] = useState<Expense[]>(MARIA_PERSONAL);
  const [assets, setAssets] = useState<Asset[]>(ASSETS);
  const [debts, setDebts] = useState<Debt[]>(DEBTS);
  const [ious, setIous] = useState<Iou[]>(IOUS);
  const [bizCosts, setBizCosts] = useState<BizCost[]>(BUSINESS.costs);
  const [bizRevenue, setBizRevenue] = useState<number>(BUSINESS.monthlyRevenue);
  const [splitMode, setSplitMode] = useState<SplitMode>(SETTINGS.splitMode);
  const [customSplit, setCustomSplit] = useState<number>(SETTINGS.ashtonPortionCustom);
  const [scenarios, setScenarios] = useState<Scenario[]>(SCENARIOS);
  const [tax, setTax] = useState<TaxRates>(TAX);
  const [dashView, setDashView] = useState<"joint" | "ashton" | "partner">(
    () => readLocal<"joint" | "ashton" | "partner">("ledger.dashView", "joint")
  );
  const [amtPeriod, setAmtPeriod] = useState<"monthly" | "annual">(
    () => readLocal<"monthly" | "annual">("ledger.amtPeriod", "monthly")
  );
  const [pensions, setPensions] = useState<PensionAccount[]>(PENSIONS);

  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("ledger.route", route); }, [route]);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("ledger.dashView", dashView); }, [dashView]);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("ledger.amtPeriod", amtPeriod); }, [amtPeriod]);

  // Serialisable payload — everything that lives in DynamoDB (UI prefs stay in localStorage)
  const syncPayload = useMemo<LedgerStatePayload>(() => ({
    income: income as LedgerStatePayload["income"],
    joint, ashtonP, mariaP, assets, debts, ious,
    bizCosts, bizRevenue,
    splitMode, customSplit,
    tax: tax as LedgerStatePayload["tax"],
    scenarios, pensions,
  }), [income, joint, ashtonP, mariaP, assets, debts, ious, bizCosts, bizRevenue, splitMode, customSplit, tax, scenarios, pensions]);

  // Apply loaded state from DynamoDB
  const onLoad = useCallback((s: LedgerStatePayload) => {
    setIncome(s.income as Income);
    setJoint(s.joint as Expense[]);
    setAshtonP(s.ashtonP as Expense[]);
    setMariaP(s.mariaP as Expense[]);
    setAssets(s.assets as Asset[]);
    setDebts(s.debts as Debt[]);
    setIous(s.ious as Iou[]);
    setBizCosts(s.bizCosts as BizCost[]);
    setBizRevenue(s.bizRevenue);
    setSplitMode(s.splitMode as SplitMode);
    if (typeof (s as Record<string, unknown>).customSplit === "number") setCustomSplit((s as Record<string, unknown>).customSplit as number);
    setTax(s.tax as TaxRates);
    setScenarios(s.scenarios as Scenario[]);
    if (s.pensions) setPensions(s.pensions as PensionAccount[]);
  }, []);

  const { status: syncStatus, lastSaved, reload } = useLedgerSync(syncPayload, onLoad);

  const state: LedgerState = {
    income, setIncome,
    joint, setJoint,
    ashtonP, setAshtonP,
    mariaP, setMariaP,
    assets, setAssets,
    debts, setDebts,
    ious, setIous,
    bizCosts, setBizCosts,
    bizRevenue, setBizRevenue,
    splitMode, setSplitMode,
    customSplit, setCustomSplit,
    tax, setTax,
    scenarios, setScenarios,
    dashView, setDashView: setDashView as Dispatch<SetStateAction<"joint" | "ashton" | "partner">>,
    amtPeriod, setAmtPeriod,
    pensions, setPensions,
  };

  const derived: Derived = useMemo(() => {
    const jointTotal = joint.reduce((s, x) => s + x.amt, 0);
    const aPersonal = ashtonP.reduce((s, x) => s + x.amt, 0);
    const mPersonal = mariaP.reduce((s, x) => s + x.amt, 0);
    const aDividendNet = income.ashton.dividend * (1 - tax.dividendTaxRate);
    const aIncome = income.ashton.salary + aDividendNet;
    // partner.salary is the source of truth for Maria's net take-home — editable in both
    // net and gross modes in the Income section. Gross is derived from it + tax rate so
    // Dashboard and Flow always reflect the latest salary edit.
    const mIncome = income.partner.salary || 0;
    const mGrossSalary = tax.mariaTaxRate < 1 ? mIncome / (1 - tax.mariaTaxRate) : mIncome;
    const aGross = tax.salaryTaxRate < 1 ? (income.ashton.salary / (1 - tax.salaryTaxRate)) + income.ashton.dividend : aIncome;
    const mGross = mGrossSalary;
    const bizNetLocal = bizRevenue - bizCosts.reduce((s, c) => s + c.amt, 0);
    let aShare: number;
    if (splitMode === "fifty") aShare = 0.5;
    else if (splitMode === "gross") aShare = aGross / (aGross + mGross);
    else if (splitMode === "bizNet") {
      const aBizContribution = aIncome + Math.max(0, bizNetLocal);
      aShare = aBizContribution / (aBizContribution + mIncome);
    }
    else if (splitMode === "custom") aShare = customSplit;
    else aShare = aIncome / (aIncome + mIncome);
    const mShare = 1 - aShare;
    const aBurn = aPersonal + jointTotal * aShare;
    const mBurn = mPersonal + jointTotal * mShare;
    const hhBurn = jointTotal + aPersonal + mPersonal;
    const hhIncome = aIncome + mIncome;
    const hhSaving = hhIncome - hhBurn;

    const personalAssets = assets.filter(a => a.scope === "personal").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const personalAssetsA = assets.filter(a => a.scope === "personal" && a.owner === "ashton").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const personalAssetsM = assets.filter(a => a.scope === "personal" && a.owner === "partner").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const businessAssets = assets.filter(a => a.scope === "business").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const liquidAssets = assets.filter(a => a.type === "cash" || a.type === "hysa" || a.type === "receivable").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const liquidA = assets.filter(a => (a.type === "cash" || a.type === "hysa") && a.owner === "ashton").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const liquidM = assets.filter(a => (a.type === "cash" || a.type === "hysa") && a.owner === "partner").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const brokerageAssets = assets.filter(a => a.type === "brokerage").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const pensionAssets = assets.filter(a => a.type === "pension").reduce((s, a) => s + a.bal * fx[a.cur], 0);
    const totalAssets = personalAssets + businessAssets;
    // Debts can be owed to an outside party ("external") or to the other partner.
    // Internal debts cancel at the household level but still shift each person's net worth.
    const eurBal = (dd: Debt) => dd.bal * fx[dd.cur];
    const isInternal = (dd: Debt) => dd.counterparty === "ashton" || dd.counterparty === "partner";
    const debtA = debts.filter(dd => dd.owner === "ashton").reduce((s, dd) => s + eurBal(dd), 0);
    const debtM = debts.filter(dd => dd.owner === "partner").reduce((s, dd) => s + eurBal(dd), 0);
    // Claims = money the OTHER partner owes this person via an internal debt.
    const debtAClaim = debts.filter(dd => dd.owner === "partner" && dd.counterparty === "ashton").reduce((s, dd) => s + eurBal(dd), 0);
    const debtMClaim = debts.filter(dd => dd.owner === "ashton" && dd.counterparty === "partner").reduce((s, dd) => s + eurBal(dd), 0);
    const externalDebt = debts.filter(dd => !isInternal(dd)).reduce((s, dd) => s + eurBal(dd), 0);
    const totalDebt = debts.reduce((s, dd) => s + eurBal(dd), 0);
    const iouIncoming = ious.filter(i => i.direction === "incoming").reduce((s, i) => s + (i.principal - i.paid) * fx[i.cur], 0);
    const iouOutgoing = ious.filter(i => i.direction === "outgoing").reduce((s, i) => s + (i.principal - i.paid) * fx[i.cur], 0);
    const iouNet = iouIncoming - iouOutgoing;
    // Household net worth only deducts external debts — inter-partner debts cancel.
    const netWorth = totalAssets - externalDebt + iouNet;
    const netWorthA = personalAssetsA + businessAssets - debtA + debtAClaim + iouNet;
    const netWorthM = personalAssetsM - debtM + debtMClaim;

    const bizCostTotal = bizCosts.reduce((s, c) => s + c.amt, 0);
    const bizNetFinal = bizRevenue - bizCostTotal;

    return {
      jointTotal, aPersonal, mPersonal, aIncome, mIncome, aGross, mGross, aShare, mShare, aBurn, mBurn,
      hhBurn, hhIncome, hhSaving,
      personalAssets, personalAssetsA, personalAssetsM, businessAssets,
      liquidAssets, liquidA, liquidM, brokerageAssets, pensionAssets,
      totalAssets, totalDebt, externalDebt,
      debtA, debtM, debtAClaim, debtMClaim,
      netWorth, netWorthA, netWorthM,
      bizCostTotal, bizNet: bizNetFinal,
      iouIncoming, iouOutgoing, iouNet,
    };
  }, [income, joint, ashtonP, mariaP, assets, debts, ious, bizCosts, bizRevenue, splitMode, tax]);

  const currentRoute = ROUTES.find(r => r.id === route) || ROUTES[0];
  const Active = currentRoute.component;

  const mult = amtPeriod === "annual" ? 12 : 1;
  const periodLabel = amtPeriod === "annual" ? "/yr" : "/mo";

  return (
    <div className="ledger-root">
      <div className="app">
        <aside className="sidebar">
          <div className="masthead">
            <div className="crest">ashtonspina.com /vault</div>
            <h1>The Ledger</h1>
            <div className="edition">
              <span>APR 2026</span>
              <span>№ I of XII</span>
            </div>
          </div>

          <nav className="nav">
            <div className="nav-section-label">Views</div>
            <ul>
              {ROUTES.filter(r => r.id !== "inputs").map(r => (
                <li key={r.id} className={r.id === route ? "active" : ""}
                  onClick={() => setRoute(r.id)}>
                  <span className="nav-label">{r.label}</span>
                  <span className="nav-num">{r.no}</span>
                </li>
              ))}
            </ul>
            <div className="nav-section-label" style={{ marginTop: 20 }}>Edit</div>
            <ul>
              <li className={route === "inputs" ? "active" : ""}
                onClick={() => setRoute("inputs")}>
                <span className="nav-label">Inputs</span>
                <span className="nav-num">IV</span>
              </li>
            </ul>
          </nav>

          <div>
            <div className="nav-section-label">April, at a glance</div>
            <div className="flex-col gap-sm" style={{ fontSize: 12.5 }}>
              <div className="flex-between">
                <span className="italic">Household income</span>
                <span className="mono">
                  €{Math.round(derived.hhIncome * mult).toLocaleString()}
                  <span style={{ fontSize: 9, color: "var(--ink-4)", fontFamily: "var(--mono)", marginLeft: 2 }}>{periodLabel}</span>
                </span>
              </div>
              <div className="flex-between">
                <span className="italic">Combined burn</span>
                <span className="mono">
                  €{Math.round(derived.hhBurn * mult).toLocaleString()}
                  <span style={{ fontSize: 9, color: "var(--ink-4)", fontFamily: "var(--mono)", marginLeft: 2 }}>{periodLabel}</span>
                </span>
              </div>
              <div className="flex-between">
                <span className="italic">Net saving</span>
                <span className={`mono ${derived.hhSaving > 0 ? "pos" : "neg"}`}>
                  €{Math.round(derived.hhSaving * mult).toLocaleString()}
                  <span style={{ fontSize: 9, color: "var(--ink-4)", fontFamily: "var(--mono)", marginLeft: 2 }}>{periodLabel}</span>
                </span>
              </div>
              <hr className="rule" style={{ margin: "6px 0" }} />
              <div className="flex-between"><span className="italic">Net worth</span><span className="mono">€{Math.round(derived.netWorth).toLocaleString()}</span></div>
              <div className="flex-between mt-sm" style={{ fontSize: 11 }}>
                <span className="italic">Show as</span>
                <span style={{ display: "flex", gap: 0, border: "1px solid var(--rule-soft)", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em" }}>
                  <button onClick={() => setAmtPeriod("monthly")} style={{ padding: "2px 7px", background: amtPeriod === "monthly" ? "var(--ink)" : "transparent", color: amtPeriod === "monthly" ? "var(--paper)" : "var(--ink-3)", border: "none" }}>MO</button>
                  <button onClick={() => setAmtPeriod("annual")} style={{ padding: "2px 7px", background: amtPeriod === "annual" ? "var(--ink)" : "transparent", color: amtPeriod === "annual" ? "var(--paper)" : "var(--ink-3)", border: "none" }}>YR</button>
                </span>
              </div>
            </div>
          </div>

          <div className="footer-note">
            &ldquo;Annual income twenty pounds, annual expenditure nineteen nineteen and six, result happiness.&rdquo;
            <div className="smallcaps mt-sm">— Mr. Micawber</div>
            <SyncBadge status={syncStatus} lastSaved={lastSaved} onRefresh={reload} />
          </div>
        </aside>

        <main className="main" key={route}>
          {/* Shown only on tablet/mobile — replaces sidebar nav */}
          <div className="mobile-header">
            <div className="mobile-header-bar">
              <div className="mobile-title">The Ledger</div>
              <div className="mobile-edition">APR 2026</div>
            </div>
            <div className="mobile-tabs">
              {ROUTES.filter(r => r.id !== "inputs").map(r => (
                <button key={r.id} className={r.id === route ? "active" : ""}
                  onClick={() => setRoute(r.id)}>
                  {r.label}
                </button>
              ))}
              <button className={route === "inputs" ? "active" : ""} onClick={() => setRoute("inputs")}>
                Edit
              </button>
            </div>
          </div>
          <Active state={state} d={derived} />
        </main>
      </div>
    </div>
  );
}
