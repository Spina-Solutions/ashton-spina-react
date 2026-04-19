import { useEffect, useRef, useState } from "react";
import { Folio, LedgerModal, Panel, Smallcaps } from "../primitives.js";
import { BUSINESS, CATEGORIES, deriveBiz } from "../data.js";
import type { Expense } from "../data.js";
import type { Derived, LedgerState } from "../state.js";

export function Flow({ state, d }: { state: LedgerState; d: Derived }) {
  const { bizRevenue, bizCosts, tax } = state;
  const [byCategory, setByCategory] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("ledger.flowByCat") === "1";
  });
  useEffect(() => { localStorage.setItem("ledger.flowByCat", byCategory ? "1" : "0"); }, [byCategory]);

  const mult = state.amtPeriod === "annual" ? 12 : 1;
  const periodLabel = state.amtPeriod === "annual" ? "/yr" : "/mo";

  const biz = {
    monthlyRevenue: bizRevenue, costs: bizCosts,
    grossSalary: BUSINESS.grossSalary, dividendMonthly: state.income.ashton.dividend,
  };
  const b = deriveBiz(biz, tax);

  // Maria's net take-home is the source of truth; gross is re-derived so Flow always
  // reflects current salary + tax-rate state (previously a stale partner.gross field
  // made Dashboard / Flow numbers diverge from the salary the user just typed).
  const mNet = state.income.partner.salary || 0;
  const mGross = tax.mariaTaxRate < 1 ? mNet / (1 - tax.mariaTaxRate) : mNet;
  const mTax = mGross - mNet;

  const ashtonNet = b.netSalary + b.dividendNet;
  const jointTotal = d.jointTotal;
  const aJointShare = jointTotal * d.aShare;
  const mJointShare = jointTotal * d.mShare;
  const aLeftover = Math.max(0, ashtonNet - aJointShare - d.aPersonal);
  const mLeftover = Math.max(0, mNet - mJointShare - d.mPersonal);

  const [fullscreen, setFullscreen] = useState(false);

  const svgProps: FullFlowProps = {
    bizRevenue: bizRevenue * mult, bizCostTotal: b.opCosts * mult, grossSalary: BUSINESS.grossSalary * mult,
    salaryTax: b.salaryTax * mult, netSalary: b.netSalary * mult,
    preTaxProfit: b.preTaxProfit * mult, corpTax: b.corpTax * mult, afterCorp: b.afterCorp * mult,
    dividendGross: b.dividendGross * mult, dividendTax: b.dividendTax * mult, dividendNet: b.dividendNet * mult,
    retained: b.retained * mult, ashtonNet: ashtonNet * mult,
    mGross: mGross * mult, mTax: mTax * mult, mNet: mNet * mult,
    aJointShare: aJointShare * mult, mJointShare: mJointShare * mult,
    aPersonal: d.aPersonal * mult, mPersonal: d.mPersonal * mult,
    aLeftover: aLeftover * mult, mLeftover: mLeftover * mult,
    jointTotal: jointTotal * mult, byCategory,
    joint: state.joint, ashtonP: state.ashtonP, mariaP: state.mariaP,
    aShare: d.aShare, mShare: d.mShare,
  };

  return (
    <>
      <Folio section="Section II" title="Money flow" no="II"
        dek="From business revenue through three tax gates (salary, corporate, dividend) to the things the money actually does." />

      <div className="content">
        <Panel title={`${state.amtPeriod === "annual" ? "Yearly" : "Monthly"} cashflow — April`}
          meta={`Biz €${Math.round(bizRevenue * mult).toLocaleString()}${periodLabel} in · Ashton net €${Math.round(ashtonNet * mult).toLocaleString()}${periodLabel} · Maria net €${Math.round(mNet * mult).toLocaleString()}${periodLabel}`}
          action={
            <button className="btn" style={{ padding: "3px 10px", fontSize: 9 }} onClick={() => setFullscreen(true)}>
              ⤢ Fullscreen
            </button>
          }>
          <div className="flex-between mb-md" style={{ alignItems: "center" }}>
            <Smallcaps>{byCategory ? "with category breakdown" : "simple destinations"}</Smallcaps>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12 }}>
              <input type="checkbox" checked={byCategory}
                onChange={e => setByCategory(e.target.checked)} />
              <span className="smallcaps">Split destinations by category</span>
            </label>
          </div>
          <FullFlow {...svgProps} />
        </Panel>

        {fullscreen && (
          <LedgerModal title="Monthly cashflow — April" wide onClose={() => setFullscreen(false)}>
            <div style={{ padding: 16, height: "100%", overflow: "auto" }}>
              <FullFlow {...svgProps} />
            </div>
          </LedgerModal>
        )}

        <div className="grid g-2">
          <Panel title="Business — Ashton's Oy" meta={`€${Math.round(bizRevenue * mult).toLocaleString()}${periodLabel} in`}>
            <table className="table">
              <tbody>
                <tr><td>Gross revenue</td><td className="num">€{Math.round(bizRevenue * mult).toLocaleString()}</td></tr>
                <tr><td className="italic">Operating costs</td><td className="num neg">−€{Math.round(b.opCosts * mult).toLocaleString()}</td></tr>
                <tr><td className="italic">Gross salary booked to Ashton</td><td className="num neg">−€{Math.round(BUSINESS.grossSalary * mult).toLocaleString()}</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 20 }}>→ Salary tax ({(tax.salaryTaxRate * 100).toFixed(1)}%) to state</td><td className="num neg">−€{Math.round(b.salaryTax * mult).toLocaleString()}</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 20 }}>→ Net salary to Ashton</td><td className="num">€{Math.round(b.netSalary * mult).toLocaleString()}</td></tr>
                <tr className="subtotal"><td>Pre-tax profit</td><td className="num">€{Math.round(b.preTaxProfit * mult).toLocaleString()}</td></tr>
                <tr><td>Corporate tax ({(tax.corpTaxRate * 100).toFixed(0)}%)</td><td className="num neg">−€{Math.round(b.corpTax * mult).toLocaleString()}</td></tr>
                <tr className="subtotal"><td>After-tax profit</td><td className="num">€{Math.round(b.afterCorp * mult).toLocaleString()}</td></tr>
                <tr><td>Dividend declared</td><td className="num neg">−€{Math.round(b.dividendGross * mult).toLocaleString()}</td></tr>
                <tr className="total"><td>Retained in Oy</td><td className={`num ${b.retained >= 0 ? "pos" : "neg"}`}>€{Math.round(b.retained * mult).toLocaleString()}</td></tr>
              </tbody>
            </table>
          </Panel>

          <Panel title="Ashton — take-home (two streams)" meta={`€${Math.round(ashtonNet * mult).toLocaleString()}${periodLabel}`}>
            <table className="table">
              <tbody>
                <tr><td>Net salary (after {(tax.salaryTaxRate * 100).toFixed(1)}% withholding)</td><td className="num">€{Math.round(b.netSalary * mult).toLocaleString()}</td></tr>
                <tr><td>Dividend declared</td><td className="num">€{Math.round(b.dividendGross * mult).toLocaleString()}</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 20 }}>− dividend tax ({(tax.dividendTaxRate * 100).toFixed(1)}%)</td><td className="num neg">−€{Math.round(b.dividendTax * mult).toLocaleString()}</td></tr>
                <tr><td className="italic" style={{ paddingLeft: 20 }}>= dividend net</td><td className="num">€{Math.round(b.dividendNet * mult).toLocaleString()}</td></tr>
                <tr className="subtotal"><td>Spendable</td><td className="num">€{Math.round(ashtonNet * mult).toLocaleString()}</td></tr>
                <tr><td>Share of joint ({(d.aShare * 100).toFixed(0)}%)</td><td className="num neg">−€{Math.round(aJointShare * mult).toLocaleString()}</td></tr>
                <tr><td>Personal spend</td><td className="num neg">−€{Math.round(d.aPersonal * mult).toLocaleString()}</td></tr>
                <tr className="total"><td>Surplus</td><td className={`num ${aLeftover >= 0 ? "pos" : "neg"}`}>€{Math.round(aLeftover * mult).toLocaleString()}</td></tr>
              </tbody>
            </table>
          </Panel>
        </div>

        <Panel title="Maria — salary → spendable" meta={`€${Math.round(mGross * mult).toLocaleString()}${periodLabel} gross`}>
          <table className="table">
            <tbody>
              <tr><td>Gross salary</td><td className="num">€{Math.round(mGross * mult).toLocaleString()}</td></tr>
              <tr><td className="italic">Income tax + social contributions ({(tax.mariaTaxRate * 100).toFixed(1)}%)</td><td className="num neg">−€{Math.round(mTax * mult).toLocaleString()}</td></tr>
              <tr className="subtotal"><td>Net take-home</td><td className="num">€{Math.round(mNet * mult).toLocaleString()}</td></tr>
              <tr><td>Share of joint ({(d.mShare * 100).toFixed(0)}%)</td><td className="num neg">−€{Math.round(mJointShare * mult).toLocaleString()}</td></tr>
              <tr><td>Personal spend</td><td className="num neg">−€{Math.round(d.mPersonal * mult).toLocaleString()}</td></tr>
              <tr className="total"><td>Surplus</td><td className={`num ${mLeftover >= 0 ? "pos" : "neg"}`}>€{Math.round(mLeftover * mult).toLocaleString()}</td></tr>
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  );
}

interface FullFlowProps {
  bizRevenue: number; bizCostTotal: number; grossSalary: number;
  salaryTax: number; netSalary: number;
  preTaxProfit: number; corpTax: number; afterCorp: number;
  dividendGross: number; dividendTax: number; dividendNet: number; retained: number;
  ashtonNet: number;
  mGross: number; mTax: number; mNet: number;
  aJointShare: number; mJointShare: number;
  aPersonal: number; mPersonal: number; aLeftover: number; mLeftover: number;
  jointTotal: number;
  byCategory: boolean;
  joint: Expense[]; ashtonP: Expense[]; mariaP: Expense[];
  aShare: number; mShare: number;
}

interface FlowNode { id: string; label: string; value: number; color: string; x: number; y: number; h: number; sources?: Record<string, number>; }
interface LinkDef { from: string; to: string; value: number; color: string; }

const FLOW_COL_ORDER_KEY = "ledger.flowColOrders";

function FullFlow(props: FullFlowProps) {
  const {
    bizRevenue, bizCostTotal, grossSalary, salaryTax, netSalary,
    preTaxProfit, corpTax, afterCorp, dividendGross, dividendTax, dividendNet, retained,
    ashtonNet,
    mGross, mTax, mNet,
    aJointShare, mJointShare, aPersonal, mPersonal, aLeftover, mLeftover, jointTotal,
    byCategory, joint, ashtonP, mariaP, aShare, mShare,
  } = props;

  const [hovered, setHovered] = useState<{ from: string; to: string; value: number; color: string; x: number; y: number } | null>(null);
  // colOrders stores the user-dragged order for each reorderable column key.
  // Persisted so a drag survives route changes (Flow unmounts when the user switches pages).
  const [colOrders, setColOrders] = useState<Record<string, string[]>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(FLOW_COL_ORDER_KEY);
      return raw ? JSON.parse(raw) as Record<string, string[]> : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(FLOW_COL_ORDER_KEY, JSON.stringify(colOrders));
  }, [colOrders]);
  const [dragging, setDragging] = useState<{ colKey: string; nodeId: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 1360;
  const pad = 36;
  const headerPad = 36;
  const nodeW = 14;
  const GAP = 10;
  const total = bizRevenue + mGross;

  // Scale is independent of canvas height — avoids circular dependency
  const vScale = (v: number) => Math.max(3, v / total * 480);

  // Sum of scaled heights for a column, with gaps between items
  const colH = (...vals: number[]) => {
    const pos = vals.filter(v => v > 0);
    return pos.map(vScale).reduce((a, b) => a + b, 0) + Math.max(0, pos.length - 1) * GAP;
  };

  // Compute minimum height needed for each stream so nodes never overlap
  const topStreamH = Math.max(
    colH(bizRevenue),
    colH(bizCostTotal, grossSalary, Math.max(0, preTaxProfit)),
    colH(salaryTax, netSalary, corpTax, Math.max(0, afterCorp)),
    colH(dividendGross, Math.max(0, retained)),
    colH(dividendTax, dividendNet),
    colH(ashtonNet),
  );
  const botStreamH = Math.max(colH(mGross), colH(mTax, mNet), colH(mNet));
  const destStreamH = colH(jointTotal, aPersonal, aLeftover, mPersonal, mLeftover);

  const COL = {
    TAX: "#8B3A2E", BIZ: "#5A6B4A", COST: "#B08A3E",
    ASHTON: "#2A2A27", MARIA: "#6B6864", JOINT: "#B5583A", SAVE: "#5A6B4A",
  };

  const col = [pad, W * 0.18, W * 0.38, W * 0.56, W * 0.74, W - pad - nodeW - 120];

  function stack(items: Omit<FlowNode, "x" | "y" | "h">[], x: number, topStart: number): FlowNode[] {
    let y = topStart;
    return items.map(it => {
      const h = vScale(it.value);
      const n: FlowNode = { ...it, x, y, h };
      y += h + 10;
      return n;
    });
  }

  const topY = pad + headerPad;
  const botY = topY + topStreamH + 40;

  const getOrder = (key: string, defaults: string[]) => colOrders[key] ?? defaults;

  // Item definitions for each reorderable column
  const t1Items: Record<string, Omit<FlowNode, "x" | "y" | "h">> = {
    biz_costs: { id: "biz_costs", label: "Operating costs", value: bizCostTotal, color: COL.COST },
    gross_sal: { id: "gross_sal", label: "Gross salary (Ashton)", value: grossSalary, color: COL.ASHTON },
    pre_profit: { id: "pre_profit", label: "Pre-tax profit", value: Math.max(0, preTaxProfit), color: COL.BIZ },
  };
  const t2Items: Record<string, Omit<FlowNode, "x" | "y" | "h">> = {
    sal_tax: { id: "sal_tax", label: "Salary tax → state", value: salaryTax, color: COL.TAX },
    net_sal: { id: "net_sal", label: "Net salary", value: netSalary, color: COL.ASHTON },
    corp_tax: { id: "corp_tax", label: "Corporate tax → state", value: corpTax, color: COL.TAX },
    after_corp: { id: "after_corp", label: "After-tax profit", value: Math.max(0, afterCorp), color: COL.BIZ },
  };
  const t3Items: Record<string, Omit<FlowNode, "x" | "y" | "h">> = {
    div_gross: { id: "div_gross", label: "Dividend (gross)", value: dividendGross, color: COL.ASHTON },
    retained: { id: "retained", label: "Retained in Oy", value: Math.max(0, retained), color: COL.SAVE },
  };
  const t4Items: Record<string, Omit<FlowNode, "x" | "y" | "h">> = {
    div_tax: { id: "div_tax", label: "Dividend tax → state", value: dividendTax, color: COL.TAX },
    div_net: { id: "div_net", label: "Dividend (net)", value: dividendNet, color: COL.ASHTON },
  };
  const destItemDefs: Record<string, Omit<FlowNode, "x" | "y" | "h">> = {
    joint:  { id: "joint",  label: "Joint expenses",  value: jointTotal, color: COL.JOINT },
    a_pers: { id: "a_pers", label: "Ashton personal",  value: aPersonal,  color: COL.COST },
    a_save: { id: "a_save", label: "Ashton surplus",   value: aLeftover,  color: COL.SAVE },
    m_pers: { id: "m_pers", label: "Maria personal",   value: mPersonal,  color: COL.COST },
    m_save: { id: "m_save", label: "Maria surplus",    value: mLeftover,  color: COL.SAVE },
  };

  // Columns where drag-reorder is enabled
  const draggableCols: Record<string, { items: Record<string, Omit<FlowNode, "x"|"y"|"h">>; defaults: string[] }> = {
    t1:    { items: t1Items,    defaults: ["biz_costs", "gross_sal", "pre_profit"] },
    t2:    { items: t2Items,    defaults: ["sal_tax", "net_sal", "corp_tax", "after_corp"] },
    t3:    { items: t3Items,    defaults: ["div_gross", "retained"] },
    t4:    { items: t4Items,    defaults: ["div_tax", "div_net"] },
    dests: { items: destItemDefs, defaults: ["joint", "a_pers", "a_save", "m_pers", "m_save"] },
  };

  const t0 = stack([{ id: "biz_rev", label: "Business revenue", value: bizRevenue, color: COL.BIZ }], col[0], topY);
  const t1 = stack(getOrder("t1", draggableCols.t1.defaults).map(id => t1Items[id]).filter(Boolean), col[1], topY);
  const t2 = stack(getOrder("t2", draggableCols.t2.defaults).map(id => t2Items[id]).filter(Boolean), col[2], topY);
  const t3 = stack(getOrder("t3", draggableCols.t3.defaults).map(id => t3Items[id]).filter(Boolean), col[3], topY);
  const t4 = stack(getOrder("t4", draggableCols.t4.defaults).map(id => t4Items[id]).filter(Boolean), col[4], topY);
  const t5 = stack([{ id: "a_pool", label: "Ashton spendable", value: ashtonNet, color: COL.ASHTON }], col[5], topY);

  const b0 = stack([{ id: "m_gross", label: "Maria gross salary", value: mGross, color: COL.MARIA }], col[0], botY);
  const b1 = stack([
    { id: "m_tax", label: "Income tax → state", value: mTax, color: COL.TAX },
    { id: "m_net", label: "Net take-home", value: mNet, color: COL.MARIA },
  ], col[1], botY);
  const b5 = stack([{ id: "m_pool", label: "Maria spendable", value: mNet, color: COL.MARIA }], col[5], botY);

  const destX = col[5] + 180;
  const destStart = topY + 20;
  const dests = stack(
    getOrder("dests", draggableCols.dests.defaults).map(id => destItemDefs[id]).filter(Boolean),
    destX, destStart,
  );

  const catX = destX + 260;
  let cats: FlowNode[] = [];
  if (byCategory) {
    const agg: Record<string, { value: number; sources: Record<string, number> }> = {};
    const add = (catId: string, source: string, val: number) => {
      if (val <= 0) return;
      if (!agg[catId]) agg[catId] = { value: 0, sources: { joint: 0, a_pers: 0, m_pers: 0 } };
      agg[catId].value += val;
      agg[catId].sources[source] = (agg[catId].sources[source] || 0) + val;
    };
    (joint || []).forEach(j => add(j.cat || "other", "joint", j.amt));
    (ashtonP || []).forEach(e => add(e.cat || "other", "a_pers", e.amt));
    (mariaP || []).forEach(e => add(e.cat || "other", "m_pers", e.amt));
    add("savings", "a_save", aLeftover);
    add("savings", "m_save", mLeftover);
    const rows = Object.entries(agg)
      .map(([id, v]) => ({ id: `cat_${id}`, rawId: id, ...v }))
      .sort((a, b) => b.value - a.value);
    cats = stack(rows.map(r => {
      const meta = CATEGORIES[r.rawId] || { label: r.rawId, color: "#888" };
      return { id: r.id, label: meta.label, value: r.value, color: meta.color || "#888", sources: r.sources };
    }), catX, destStart);
  }

  // Compute final canvas height after all nodes are placed
  const catColumnH = cats.length ? (cats[cats.length - 1].y + cats[cats.length - 1].h - topY) : 0;
  const H = Math.max(botY + botStreamH, topY + destStreamH, topY + catColumnH) + pad;

  const allNodes: FlowNode[] = [...t0, ...t1, ...t2, ...t3, ...t4, ...t5, ...b0, ...b1, ...b5, ...dests, ...cats];
  const byId: Record<string, FlowNode> = {};
  allNodes.forEach(n => { if (!byId[n.id]) byId[n.id] = n; });

  // Map column key → current node array (for drag midpoint computation)
  const colNodeMap: Record<string, FlowNode[]> = { t1, t2, t3, t4, dests };
  if (cats.length) colNodeMap.cats = cats;

  function getSvgY(clientY: number): number {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    return (clientY - rect.top) / rect.height * H;
  }

  function handleNodeMouseDown(colKey: string, nodeId: string, e: React.MouseEvent) {
    e.preventDefault();
    setDragging({ colKey, nodeId });
  }

  function handleSvgMouseMove(e: React.MouseEvent) {
    if (!dragging) return;
    const y = getSvgY(e.clientY);
    const nodes = colNodeMap[dragging.colKey];
    if (!nodes) return;
    const def = draggableCols[dragging.colKey];
    const currentOrder = getOrder(dragging.colKey, def?.defaults ?? []);
    const dragIdx = currentOrder.indexOf(dragging.nodeId);
    // Find which slot the mouse is over (based on node midpoints in current order)
    let newIdx = nodes.length - 1;
    for (let i = 0; i < nodes.length; i++) {
      if (y < nodes[i].y + nodes[i].h / 2) { newIdx = i; break; }
    }
    if (newIdx !== dragIdx && newIdx >= 0 && newIdx < currentOrder.length) {
      const next = [...currentOrder];
      next.splice(dragIdx, 1);
      next.splice(newIdx, 0, dragging.nodeId);
      setColOrders(prev => ({ ...prev, [dragging.colKey]: next }));
    }
  }

  const links: LinkDef[] = [
    { from: "biz_rev", to: "biz_costs", value: bizCostTotal, color: COL.COST },
    { from: "biz_rev", to: "gross_sal", value: grossSalary, color: COL.ASHTON },
    { from: "biz_rev", to: "pre_profit", value: Math.max(0, preTaxProfit), color: COL.BIZ },
    { from: "gross_sal", to: "sal_tax", value: salaryTax, color: COL.TAX },
    { from: "gross_sal", to: "net_sal", value: netSalary, color: COL.ASHTON },
    { from: "pre_profit", to: "corp_tax", value: corpTax, color: COL.TAX },
    { from: "pre_profit", to: "after_corp", value: Math.max(0, afterCorp), color: COL.BIZ },
    { from: "after_corp", to: "div_gross", value: dividendGross, color: COL.ASHTON },
    { from: "after_corp", to: "retained", value: Math.max(0, retained), color: COL.SAVE },
    { from: "div_gross", to: "div_tax", value: dividendTax, color: COL.TAX },
    { from: "div_gross", to: "div_net", value: dividendNet, color: COL.ASHTON },
    { from: "net_sal", to: "a_pool", value: netSalary, color: COL.ASHTON },
    { from: "div_net", to: "a_pool", value: dividendNet, color: COL.ASHTON },
    { from: "m_gross", to: "m_tax", value: mTax, color: COL.TAX },
    { from: "m_gross", to: "m_net", value: mNet, color: COL.MARIA },
    { from: "m_net", to: "m_pool", value: mNet, color: COL.MARIA },
    { from: "a_pool", to: "joint", value: aJointShare, color: COL.JOINT },
    { from: "a_pool", to: "a_pers", value: aPersonal, color: COL.COST },
    { from: "a_pool", to: "a_save", value: aLeftover, color: COL.SAVE },
    { from: "m_pool", to: "joint", value: mJointShare, color: COL.JOINT },
    { from: "m_pool", to: "m_pers", value: mPersonal, color: COL.COST },
    { from: "m_pool", to: "m_save", value: mLeftover, color: COL.SAVE },
  ];

  if (byCategory) {
    cats.forEach(cat => {
      const src = cat.sources || {};
      // Single merged link for joint (avoids duplicate ribbons)
      if ((src.joint || 0) > 0) {
        links.push({ from: "joint", to: cat.id, value: src.joint || 0, color: cat.color });
      }
      if ((src.a_pers || 0) > 0) links.push({ from: "a_pers", to: cat.id, value: src.a_pers, color: cat.color });
      if ((src.m_pers || 0) > 0) links.push({ from: "m_pers", to: cat.id, value: src.m_pers, color: cat.color });
      if ((src.a_save || 0) > 0) links.push({ from: "a_save", to: cat.id, value: src.a_save, color: cat.color });
      if ((src.m_save || 0) > 0) links.push({ from: "m_save", to: cat.id, value: src.m_save, color: cat.color });
    });
  }

  // --- Sorted-offset algorithm to minimise ribbon crossings ---
  const validLinks = links.filter(l => l.value > 0 && byId[l.from] && byId[l.to]);

  const srcGroups: Record<string, LinkDef[]> = {};
  const dstGroups: Record<string, LinkDef[]> = {};
  validLinks.forEach(l => {
    (srcGroups[l.from] ??= []).push(l);
    (dstGroups[l.to] ??= []).push(l);
  });

  // Sort each source group by destination centre y (barycenter) — top to bottom
  Object.values(srcGroups).forEach(g =>
    g.sort((a, b) => (byId[a.to].y + byId[a.to].h / 2) - (byId[b.to].y + byId[b.to].h / 2))
  );
  // Sort each dest group by source centre y — top to bottom
  Object.values(dstGroups).forEach(g =>
    g.sort((a, b) => (byId[a.from].y + byId[a.from].h / 2) - (byId[b.from].y + byId[b.from].h / 2))
  );

  // Assign source offsets (in source-sorted order)
  const srcOff: Record<string, number> = {};
  const linkMeta = new Map<LinkDef, { sY: number; dY: number; h: number }>();

  Object.values(srcGroups).forEach(g => {
    g.forEach(l => {
      const h = vScale(l.value);
      if (srcOff[l.from] === undefined) srcOff[l.from] = 0;
      linkMeta.set(l, { sY: byId[l.from].y + srcOff[l.from], dY: 0, h });
      srcOff[l.from] += h;
    });
  });

  // Assign dest offsets (in dest-sorted order)
  const dstOff: Record<string, number> = {};
  Object.values(dstGroups).forEach(g => {
    g.forEach(l => {
      const meta = linkMeta.get(l);
      if (!meta) return;
      if (dstOff[l.to] === undefined) dstOff[l.to] = 0;
      meta.dY = byId[l.to].y + dstOff[l.to];
      dstOff[l.to] += meta.h;
    });
  });

  // Build ribbon objects
  const ribbons = validLinks.map(l => {
    const meta = linkMeta.get(l);
    if (!meta) return null;
    const { sY, dY, h } = meta;
    const x0 = byId[l.from].x + nodeW;
    const x1 = byId[l.to].x;
    const mx = (x0 + x1) / 2;
    const path = `M ${x0},${sY} C ${mx},${sY} ${mx},${dY} ${x1},${dY} L ${x1},${dY + h} C ${mx},${dY + h} ${mx},${sY + h} ${x0},${sY + h} Z`;
    return {
      path, color: l.color, from: l.from, to: l.to, value: l.value,
      centerX: (x0 + x1) / 2,
      centerY: (sY + dY) / 2 + h / 2,
    };
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));

  // Find which draggable column (if any) contains this node
  const nodeColKey = (nodeId: string) =>
    Object.entries(draggableCols).find(([, def]) => def.defaults.includes(nodeId))?.[0] ?? null;

  const renderNode = (n: FlowNode) => {
    const labelX = n.x + nodeW + 10;
    const labelY = n.y + n.h / 2;
    const labelText = n.label;
    const amtText = `€${Math.round(n.value).toLocaleString()}`;
    const labelW = Math.max(labelText.length * 7.2, amtText.length * 7.5) + 16;
    const labelH = 30;
    const colKey = nodeColKey(n.id);
    const isDraggable = colKey !== null;
    const isDragging = dragging?.nodeId === n.id;

    return (
      <g key={n.id}>
        <rect x={n.x} y={n.y} width={nodeW} height={n.h} fill={n.color} rx={1}
          style={{ cursor: isDraggable ? (isDragging ? "grabbing" : "grab") : "default" }}
          opacity={isDragging ? 0.5 : 1}
          onMouseDown={isDraggable && colKey ? (e) => handleNodeMouseDown(colKey, n.id, e) : undefined}
        />
        <rect x={labelX - 2} y={labelY - labelH / 2}
          width={labelW} height={labelH}
          fill="var(--paper)" stroke="var(--rule-soft)" strokeWidth={0.5}
          rx={2} opacity={0.96} />
        <text x={labelX + 6} y={labelY - 3}
          style={{ fontFamily: "var(--serif)", fontSize: 12.5, fill: "var(--ink)", fontWeight: 500 }}>
          {labelText}
        </text>
        <text x={labelX + 6} y={labelY + 11}
          style={{ fontFamily: "var(--mono)", fontSize: 10.5, fill: n.color, fontWeight: 600 }}>
          {amtText}
        </text>
      </g>
    );
  };

  const headerLabels = [
    { x: col[0], label: "SOURCE" },
    { x: col[1], label: "BIZ STAGES" },
    { x: col[2], label: "FIRST TAX GATES" },
    { x: col[3], label: "PROFIT SPLIT" },
    { x: col[4], label: "DIVIDEND TAX" },
    { x: col[5], label: "SPENDABLE" },
    { x: destX, label: "DESTINATION" },
  ];
  if (byCategory) headerLabels.push({ x: catX, label: "CATEGORY" });

  const svgW = byCategory ? W + 400 : W + 140;

  return (
    <svg ref={svgRef} className="chart" viewBox={`0 0 ${svgW} ${H}`}
      style={{ maxWidth: "100%", cursor: dragging ? "grabbing" : undefined }}
      onMouseMove={handleSvgMouseMove}
      onMouseUp={() => setDragging(null)}
      onMouseLeave={() => setDragging(null)}>
      {headerLabels.map((h, i) => (
        <text key={i} x={h.x} y={pad + 10}
          style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.14em", fill: "var(--ink-3)" }}>
          {h.label}
        </text>
      ))}
      <line x1={pad} y1={botY - 10} x2={destX + 20} y2={botY - 10}
        stroke="var(--rule-soft)" strokeDasharray="3 3" />
      <text x={pad + 4} y={botY - 14}
        style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.14em", fill: "var(--ink-3)" }}>
        ASHTON&apos;S OY STREAM
      </text>
      <text x={pad + 4} y={botY + 12}
        style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.14em", fill: "var(--ink-3)" }}>
        MARIA SALARY STREAM
      </text>

      {ribbons.map((r, i) => (
        <path key={i} d={r.path} fill={r.color}
          opacity={hovered && hovered.from === r.from && hovered.to === r.to ? 0.75 : 0.35}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setHovered({ from: r.from, to: r.to, value: r.value, color: r.color, x: r.centerX, y: r.centerY })}
          onMouseLeave={() => setHovered(null)}
        />
      ))}

      {Object.values(byId).map(renderNode)}

      {hovered && (() => {
        const fromNode = byId[hovered.from];
        const toNode = byId[hovered.to];
        const tx = Math.min(hovered.x, svgW - 210);
        const ty = Math.max(hovered.y - 30, topY);
        return (
          <g>
            <rect x={tx} y={ty} width={200} height={52} fill="var(--paper)" stroke="var(--rule)" strokeWidth={1} rx={2} opacity={0.97} />
            <text x={tx + 8} y={ty + 15} style={{ fontFamily: "var(--serif)", fontSize: 11, fill: "var(--ink)" }}>
              {fromNode?.label ?? hovered.from} → {toNode?.label ?? hovered.to}
            </text>
            <text x={tx + 8} y={ty + 30} style={{ fontFamily: "var(--mono)", fontSize: 12, fill: hovered.color, fontWeight: 600 }}>
              €{Math.round(hovered.value).toLocaleString()}
            </text>
            <text x={tx + 8} y={ty + 44} style={{ fontFamily: "var(--italic)", fontStyle: "italic", fontSize: 10, fill: "var(--ink-3)" }}>
              {((hovered.value / total) * 100).toFixed(1)}% of total inflow
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
