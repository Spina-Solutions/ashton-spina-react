import type { Dispatch, SetStateAction } from "react";
import type {
  Asset, BizCost, Debt, Expense, Income, Iou, PensionAccount, Scenario, SplitMode, TaxRates
} from "./data.js";

export interface LedgerState {
  income: Income;
  setIncome: Dispatch<SetStateAction<Income>>;
  joint: Expense[];
  setJoint: Dispatch<SetStateAction<Expense[]>>;
  ashtonP: Expense[];
  setAshtonP: Dispatch<SetStateAction<Expense[]>>;
  mariaP: Expense[];
  setMariaP: Dispatch<SetStateAction<Expense[]>>;
  assets: Asset[];
  setAssets: Dispatch<SetStateAction<Asset[]>>;
  debts: Debt[];
  setDebts: Dispatch<SetStateAction<Debt[]>>;
  ious: Iou[];
  setIous: Dispatch<SetStateAction<Iou[]>>;
  bizCosts: BizCost[];
  setBizCosts: Dispatch<SetStateAction<BizCost[]>>;
  bizRevenue: number;
  setBizRevenue: Dispatch<SetStateAction<number>>;
  splitMode: SplitMode;
  setSplitMode: Dispatch<SetStateAction<SplitMode>>;
  tax: TaxRates;
  setTax: Dispatch<SetStateAction<TaxRates>>;
  scenarios: Scenario[];
  setScenarios: Dispatch<SetStateAction<Scenario[]>>;
  dashView: "joint" | "ashton" | "partner";
  setDashView: Dispatch<SetStateAction<"joint" | "ashton" | "partner">>;
  amtPeriod: "monthly" | "annual";
  setAmtPeriod: Dispatch<SetStateAction<"monthly" | "annual">>;
  pensions: PensionAccount[];
  setPensions: Dispatch<SetStateAction<PensionAccount[]>>;
}

export interface Derived {
  jointTotal: number;
  aPersonal: number;
  mPersonal: number;
  aIncome: number;
  mIncome: number;
  aGross: number;
  mGross: number;
  aShare: number;
  mShare: number;
  aBurn: number;
  mBurn: number;
  hhBurn: number;
  hhIncome: number;
  hhSaving: number;
  personalAssets: number;
  personalAssetsA: number;
  personalAssetsM: number;
  businessAssets: number;
  liquidAssets: number;
  liquidA: number;
  liquidM: number;
  brokerageAssets: number;
  pensionAssets: number;
  totalAssets: number;
  totalDebt: number;
  externalDebt: number;
  debtA: number;
  debtM: number;
  debtAClaim: number;
  debtMClaim: number;
  netWorth: number;
  netWorthA: number;
  netWorthM: number;
  bizCostTotal: number;
  bizNet: number;
  iouIncoming: number;
  iouOutgoing: number;
  iouNet: number;
}
