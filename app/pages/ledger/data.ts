/* Seed data + type definitions for the Ledger. */

export const fx: Record<string, number> = { EUR: 1.0, USD: 0.91, GBP: 1.17, CAD: 0.68 };

export const PEOPLE = {
  ashton: { name: "Ashton", short: "AS" },
  partner: { name: "Maria", short: "MA" },
};

export type CategoryKey =
  | "housing" | "food" | "utilities" | "transit" | "media" | "health"
  | "loans" | "savings" | "insurance" | "gifts" | "education" | "other";

export const CATEGORIES: Record<string, { label: string; color: string }> = {
  housing:   { label: "Housing",            color: "#1A1714" },
  food:      { label: "Food",               color: "#8B5A3C" },
  utilities: { label: "Utilities",          color: "#6B7458" },
  transit:   { label: "Transit",            color: "#A68A5B" },
  media:     { label: "Media & subs",       color: "#4A6B7E" },
  health:    { label: "Health & body",      color: "#9B4D3A" },
  loans:     { label: "Loan repayment",     color: "#3A4B5E" },
  savings:   { label: "Savings & vacation", color: "#2D6154" },
  insurance: { label: "Insurance",          color: "#7C6E8F" },
  gifts:     { label: "Gifts & family",     color: "#8F6A4A" },
  education: { label: "Education",          color: "#4B7C6E" },
  other:     { label: "Other",              color: "#555" },
};

export interface TaxRates {
  salaryTaxRate: number;
  corpTaxRate: number;
  dividendTaxRate: number;
  mariaTaxRate: number;
}

export const TAX: TaxRates = {
  salaryTaxRate: 0.242,
  corpTaxRate: 0.20,
  dividendTaxRate: 0.2625,
  mariaTaxRate: 0.241,
};

export interface BizCost { label: string; amt: number; }

export interface Business {
  companyName: string;
  monthlyRevenue: number;
  yearlyRevenue: number;
  grossSalary: number;
  dividendMonthly: number;
  costs: BizCost[];
}

export const BUSINESS: Business = {
  companyName: "Ashton's Oy",
  monthlyRevenue: 11100,
  yearlyRevenue: 133200,
  grossSalary: 5999.00,
  dividendMonthly: 1737.29,
  costs: [
    { label: "YEL (pension)",          amt: 854.79 },
    { label: "Cursor",                 amt:  40.00 },
    { label: "Banking costs",          amt:  16.43 },
    { label: "Accountant",             amt: 220.00 },
    { label: "AWS",                    amt: 300.00 },
    { label: "ChatGPT personal",       amt:  20.00 },
    { label: "ChatGPT tokens",         amt:  40.00 },
    { label: "Linear",                 amt:  35.26 },
    { label: "Algolia",                amt:  40.00 },
    { label: "Google Ads",             amt:  90.00 },
    { label: "Google One",             amt:   9.99 },
    { label: "Sentry",                 amt:  26.00 },
    { label: "Ahrefs",                 amt:  26.99 },
    { label: "EdenRed service fee",    amt:   6.00 },
    { label: "EdenRed sports benefit", amt:  33.33 },
    { label: "EdenRed lunch benefit",  amt:  60.00 },
    { label: "Elisa internet",         amt:  78.00 },
    { label: "Unemployment fund",      amt:  75.00 },
  ],
};

export function deriveBiz(biz: { monthlyRevenue: number; costs: BizCost[]; grossSalary: number; dividendMonthly: number }, tax: TaxRates) {
  const opCosts = biz.costs.reduce((s, c) => s + c.amt, 0);
  const salaryTax = biz.grossSalary * tax.salaryTaxRate;
  const netSalary = biz.grossSalary - salaryTax;
  const preTaxProfit = biz.monthlyRevenue - opCosts - biz.grossSalary;
  const corpTax = Math.max(0, preTaxProfit * tax.corpTaxRate);
  const afterCorp = preTaxProfit - corpTax;
  const dividendGross = biz.dividendMonthly;
  const dividendTax = dividendGross * tax.dividendTaxRate;
  const dividendNet = dividendGross - dividendTax;
  const retained = afterCorp - dividendGross;
  return { opCosts, salaryTax, netSalary, preTaxProfit, corpTax, afterCorp,
           dividendGross, dividendTax, dividendNet, retained };
}

export interface Income {
  ashton: { gross: number; salary: number; dividend: number; personalTax: number; total: number };
  partner: { gross: number; salary: number; personalTax: number; total: number };
}

export const INCOME: Income = {
  ashton:  { gross: 6283.29, salary: 4546.00, dividend: 1737.29, personalTax: 0, total: 6283.29 },
  partner: { gross: 5540.00, salary: 4205.00, personalTax: 1335.00, total: 4205.00 },
};

export interface Expense { id?: string; label: string; amt: number; cat?: CategoryKey | string; }

export const JOINT_EXPENSES: Expense[] = [
  { id: "rent",    label: "Rent",            amt: 2074.00, cat: "housing" },
  { id: "groc",    label: "Groceries",       amt: 1600.00, cat: "food" },
  { id: "elec",    label: "Electricity",     amt:  120.00, cat: "utilities" },
  { id: "net",     label: "Internet",        amt:   50.00, cat: "utilities" },
  { id: "ins",     label: "Insurances",      amt:   20.00, cat: "insurance" },
  { id: "fuel",    label: "Fuel",            amt:   70.00, cat: "transit" },
  { id: "carm",    label: "Car maintenance", amt:   17.50, cat: "transit" },
  { id: "dis",     label: "Disney+",         amt:   13.99, cat: "media" },
  { id: "hbo",     label: "HBO Max",         amt:    5.00, cat: "media" },
  { id: "prime",   label: "Amazon Prime",    amt:   10.00, cat: "media" },
  { id: "appletv", label: "Apple TV",        amt:    8.00, cat: "media" },
  { id: "netflix", label: "Netflix",         amt:   12.00, cat: "media" },
];

export const ASHTON_PERSONAL: Expense[] = [
  { label: "Phone plan",            amt:  36.00, cat: "utilities" },
  { label: "Medical costs",         amt:  56.00, cat: "health" },
  { label: "Banking",               amt:   4.00, cat: "other" },
  { label: "Hygiene products",      amt: 100.00, cat: "health" },
  { label: "Gym membership",        amt:  63.00, cat: "health" },
  { label: "YouTube Premium",       amt:  14.99, cat: "media" },
  { label: "Yousician",             amt:  14.99, cat: "media" },
  { label: "Greenpeace",            amt:  10.00, cat: "gifts" },
  { label: "DuoCards",              amt:   3.33, cat: "education" },
  { label: "Macrofactor",           amt:   6.16, cat: "health" },
  { label: "Parcel",                amt:   0.41, cat: "other" },
  { label: "Flighty",               amt:   4.19, cat: "other" },
  { label: "Patreon",               amt:  18.84, cat: "media" },
  { label: "Apple One",             amt:  20.95, cat: "media" },
  { label: "AppleCare",             amt:  19.48, cat: "other" },
  { label: "SCMP",                  amt:   4.99, cat: "media" },
  { label: "Dreaming Spanish",      amt:   6.99, cat: "education" },
  { label: "Helsinki AB transport", amt:  60.10, cat: "transit" },
  { label: "DUO loan repayment",    amt:  20.92, cat: "loans" },
  { label: "OSAP",                  amt:  65.89, cat: "loans" },
  { label: "Vacation fund",         amt: 300.00, cat: "savings" },
  { label: "Gifts",                 amt: 100.00, cat: "gifts" },
  { label: "Domi full-time costs",  amt: 768.00, cat: "gifts" },
  { label: "Google One",            amt:   8.33, cat: "media" },
];

export const MARIA_PERSONAL: Expense[] = [
  { label: "Phone plans",           amt:  20.00, cat: "utilities" },
  { label: "Parking",               amt:  98.00, cat: "transit" },
  { label: "Car insurance",         amt:  90.00, cat: "insurance" },
  { label: "Banking",               amt:   4.00, cat: "other" },
  { label: "Beauty supplies",       amt: 100.00, cat: "health" },
  { label: "Gym membership",        amt:  55.00, cat: "health" },
  { label: "Phone payment",         amt:  36.00, cat: "other" },
  { label: "Podme",                 amt:  11.99, cat: "media" },
  { label: "Helsinki AB transport", amt:  61.00, cat: "transit" },
  { label: "Student loan payments", amt: 225.00, cat: "loans" },
  { label: "Vacation",              amt: 300.00, cat: "savings" },
  { label: "Dentist",               amt: 300.00, cat: "health" },
  { label: "Gifts",                 amt: 100.00, cat: "gifts" },
  { label: "Work lunches",          amt: 100.00, cat: "food" },
  { label: "DUO loan repayment",    amt:   6.00, cat: "loans" },
  { label: "Union fee",             amt:  25.00, cat: "other" },
];

export type AssetType = "cash" | "hysa" | "brokerage" | "receivable" | "pension";
export type AssetScope = "personal" | "business";
export type AssetOwner = "ashton" | "partner";

export interface Asset {
  id: string;
  label: string;
  type: AssetType;
  scope: AssetScope;
  owner: AssetOwner;
  cur: string;
  bal: number;
  apy: number | null;
}

export const ASSETS: Asset[] = [
  { id: "bmo",           label: "BMO",                  type: "cash",      scope: "personal", owner: "ashton",  cur: "CAD", bal:  6500.00, apy: 0.000 },
  { id: "op_personal",   label: "OP Personal",          type: "cash",      scope: "personal", owner: "ashton",  cur: "EUR", bal:  2500.00, apy: 0.000 },
  { id: "lightyear_p",   label: "Lightyear — Personal", type: "brokerage", scope: "personal", owner: "ashton",  cur: "EUR", bal:     0.03, apy: null },
  { id: "wise",          label: "Wise",                 type: "cash",      scope: "personal", owner: "ashton",  cur: "EUR", bal:   651.00, apy: 0.000 },
  { id: "swiss_pension", label: "Swiss pension",        type: "pension",   scope: "personal", owner: "ashton",  cur: "EUR", bal: 30000.00, apy: null },
  { id: "op_biz",        label: "OP Business",          type: "cash",      scope: "business", owner: "ashton",  cur: "EUR", bal: 10195.00, apy: 0.000 },
  { id: "op_biz_invest", label: "OP Business — Invest", type: "brokerage", scope: "business", owner: "ashton",  cur: "EUR", bal:     0.00, apy: null },
  { id: "lightyear_b",   label: "Lightyear — Business", type: "brokerage", scope: "business", owner: "ashton",  cur: "EUR", bal: 96034.00, apy: null },
  { id: "op_maria",      label: "OP (Maria)",           type: "cash",      scope: "personal", owner: "partner", cur: "EUR", bal:  3200.00, apy: 0.000 },
  { id: "nordea_maria",  label: "Nordea savings",       type: "hysa",      scope: "personal", owner: "partner", cur: "EUR", bal:  8400.00, apy: 0.025 },
  { id: "varma_pension", label: "TyEL pension (est.)",  type: "pension",   scope: "personal", owner: "partner", cur: "EUR", bal: 14000.00, apy: null },
];

export type DebtCounterparty = "external" | "ashton" | "partner";

export interface Debt {
  id: string;
  label: string;
  owner: AssetOwner;
  counterparty?: DebtCounterparty;
  bal: number;
  cur: string;
  rate: number;
}

export const DEBTS: Debt[] = [
  { id: "osap",       label: "Canada-Ontario Student Loan (OSAP)", owner: "ashton",  counterparty: "external", bal:  9900.00, cur: "CAD", rate: 0.050 },
  { id: "duo",        label: "DUO student loan",                   owner: "ashton",  counterparty: "external", bal:  5000.00, cur: "EUR", rate: 0.050 },
  { id: "biz_loan",   label: "Business Loan",                      owner: "ashton",  counterparty: "external", bal:  2000.00, cur: "EUR", rate: 0.000 },
  { id: "maria_duo",  label: "DUO (Maria)",                        owner: "partner", counterparty: "external", bal:  1800.00, cur: "EUR", rate: 0.028 },
  { id: "maria_fi",   label: "Kela student loan",                  owner: "partner", counterparty: "external", bal: 12400.00, cur: "EUR", rate: 0.019 },
];

export interface IouEntry { d: string; label: string; amt: number; kind: "lent" | "borrowed" | "repaid" | "adjust"; }

export interface Iou {
  id: string;
  counterparty: string;
  direction: "incoming" | "outgoing";
  cur: string;
  principal: number;
  paid: number;
  note: string;
  history: IouEntry[];
}

export const IOUS: Iou[] = [
  { id: "bethany", counterparty: "Bethany", direction: "incoming", cur: "CAD",
    principal: 44500.00, paid: 13120.00, note: "Rent apt + cat vet + Taylor/Shayna adjustments",
    history: [
      { d: "2023-09-01", label: "Rent apartment",    amt: 40000.00, kind: "lent" },
      { d: "2023-11-12", label: "Cat vet bills",     amt:  4500.00, kind: "lent" },
      { d: "2024-02-03", label: "Payment to Taylor", amt:  -120.00, kind: "adjust" },
      { d: "2024-08-01", label: "Shayna repaid",     amt:  3000.00, kind: "repaid" },
      { d: "2025-03-15", label: "Bethany repaid",    amt: 10000.00, kind: "repaid" },
    ]
  },
];

export type SplitMode = "gross" | "net" | "bizNet" | "fifty" | "custom";

export const SETTINGS = {
  splitMode: "net" as SplitMode,
  ashtonPortionCustom: 0.60,
  homeCurrency: "EUR",
  runwayFloor: 5000,
};

export interface PensionAccount {
  id: string;
  label: string;
  owner: "ashton" | "partner";
  type: "YEL" | "TyEL" | "private" | "state";
  cur: string;
  currentBal: number;
  monthlyContrib: number;
  accrualRatePct: number;
  projectedMonthlyAt65: number;
  note: string;
}

export const PENSIONS: PensionAccount[] = [
  {
    id: "yel_ashton",
    label: "YEL (Elo) — Ashton",
    owner: "ashton",
    type: "YEL",
    cur: "EUR",
    currentBal: 0,
    monthlyContrib: 854.79,
    accrualRatePct: 1.5,
    projectedMonthlyAt65: 0,
    note: "Finnish self-employed pension. YEL income set at ~€50k/yr. Vesting immediate.",
  },
  {
    id: "swiss_pension_acc",
    label: "Swiss pillar 2 — Ashton",
    owner: "ashton",
    type: "private",
    cur: "EUR",
    currentBal: 30000,
    monthlyContrib: 0,
    accrualRatePct: 0,
    projectedMonthlyAt65: 0,
    note: "Locked in Swiss pillar 2 from previous employment. Accessible at retirement.",
  },
  {
    id: "tyel_maria",
    label: "TyEL — Maria",
    owner: "partner",
    type: "TyEL",
    cur: "EUR",
    currentBal: 14000,
    monthlyContrib: 0,
    accrualRatePct: 1.5,
    projectedMonthlyAt65: 0,
    note: "Finnish earnings-related pension. Accrues 1.5% of annual earnings per year.",
  },
];

export interface ScenarioExpense { id?: string; label: string; amt: number; cat?: string; }

export interface Scenario {
  id: string;
  name: string;
  note: string;
  partnerWorking: boolean;
  includeInvest: boolean;
  includeBusiness: boolean;
  // Per-scenario snapshots of expenses — edit independently of live inputs
  joint: ScenarioExpense[];
  ashtonP: ScenarioExpense[];
  mariaP: ScenarioExpense[];
}

function snap(expenses: Expense[]): ScenarioExpense[] {
  return expenses.map(e => ({ id: e.id, label: e.label, amt: e.amt, cat: e.cat }));
}

export const SCENARIOS: Scenario[] = [
  {
    id: "current", name: "Current spend", note: "Status quo — mirrors live inputs",
    partnerWorking: true, includeInvest: false, includeBusiness: false,
    joint: snap(JOINT_EXPENSES), ashtonP: snap(ASHTON_PERSONAL), mariaP: snap(MARIA_PERSONAL),
  },
  {
    id: "lean", name: "Lean mode", note: "Cut discretionary, keep essentials",
    partnerWorking: true, includeInvest: false, includeBusiness: false,
    joint: snap(JOINT_EXPENSES), ashtonP: snap(ASHTON_PERSONAL), mariaP: snap(MARIA_PERSONAL),
  },
  {
    id: "solo_lean", name: "Solo lean", note: "No partner income, draw on investments",
    partnerWorking: false, includeInvest: true, includeBusiness: true,
    joint: snap(JOINT_EXPENSES), ashtonP: snap(ASHTON_PERSONAL), mariaP: snap(MARIA_PERSONAL),
  },
  {
    id: "baby", name: "Baby year", note: "Lower income, higher costs",
    partnerWorking: false, includeInvest: false, includeBusiness: false,
    joint: snap(JOINT_EXPENSES), ashtonP: snap(ASHTON_PERSONAL), mariaP: snap(MARIA_PERSONAL),
  },
  {
    id: "sabbatical", name: "Sabbatical", note: "Stop working, live off pot",
    partnerWorking: false, includeInvest: true, includeBusiness: true,
    joint: snap(JOINT_EXPENSES), ashtonP: snap(ASHTON_PERSONAL), mariaP: snap(MARIA_PERSONAL),
  },
];

export const NET_WORTH_HISTORY = [
  { m: "May '25", v: 122400 }, { m: "Jun '25", v: 126800 }, { m: "Jul '25", v: 130900 },
  { m: "Aug '25", v: 133600 }, { m: "Sep '25", v: 137200 }, { m: "Oct '25", v: 139800 },
  { m: "Nov '25", v: 142400 }, { m: "Dec '25", v: 144900 }, { m: "Jan '26", v: 146900 },
  { m: "Feb '26", v: 148700 }, { m: "Mar '26", v: 150000 }, { m: "Apr '26", v: 151406 },
];

export function fmt(n: number, cur = "EUR", opts: { decimals?: number; signed?: boolean } = {}) {
  const { decimals = 0, signed = false } = opts;
  const sign = signed && n > 0 ? "+" : "";
  const v = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const sym = cur === "EUR" ? "€" : cur === "USD" ? "$" : cur === "GBP" ? "£" : cur === "CAD" ? "C$" : "";
  return `${sign}${n < 0 ? "−" : ""}${sym}${v}`;
}

export function fmtFig(n: number, cur = "EUR") {
  const neg = n < 0;
  const abs = Math.abs(n);
  const whole = Math.floor(abs).toLocaleString("en-US");
  const dec = (abs % 1).toFixed(2).slice(1);
  const sym = cur === "EUR" ? "€" : cur === "USD" ? "$" : cur === "GBP" ? "£" : cur === "CAD" ? "C$" : "€";
  return { sym, whole: (neg ? "−" : "") + whole, dec };
}
