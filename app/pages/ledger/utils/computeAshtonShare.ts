import type { SplitMode } from "../data.js";

export interface AshtonShareParams {
  splitMode: SplitMode;
  customSplit: number;
  /** Ashton's actual net take-home: net salary + net dividend */
  aIncome: number;
  /** Maria's net take-home salary */
  mIncome: number;
  /** Ashton's gross salary + gross dividend (for gross split mode) */
  aGross: number;
  /** Maria's gross salary (for gross split mode) */
  mGross: number;
  /**
   * Business profit retained in the company each month, already after corporate tax
   * but before any personal income tax. Used in gross and net modes to account for
   * the economic capacity Ashton has from accumulated profits.
   */
  retainedBizProfit: number;
  /** Dividend tax rate — used in net mode to adjust retained profit as if paid out */
  dividendTaxRate: number;
  /** Raw (pre-tax) business net = revenue − costs, used only for bizNet mode */
  bizNetLocal: number;
}

/**
 * Compute Ashton's share of joint expenses (0–1) for a given split mode.
 *
 * gross / net modes include:
 *   - Ashton's salary (gross or net)
 *   - Ashton's dividends (gross or net)
 *   - Ashton's retained business profit, adjusted as if paid to him as a dividend
 *     (gross = pre-personal-tax retained; net = retained × (1 − dividendTaxRate))
 *
 * bizNet mode adds the raw business net (revenue − costs) on top of Ashton's net income.
 * fifty / custom modes ignore income entirely.
 */
export function computeAshtonShare(params: AshtonShareParams): number {
  const {
    splitMode, customSplit,
    aIncome, mIncome,
    aGross, mGross,
    retainedBizProfit, dividendTaxRate,
    bizNetLocal,
  } = params;

  if (splitMode === "fifty") return 0.5;
  if (splitMode === "custom") return Math.max(0, Math.min(1, customSplit));

  const positiveRetained = Math.max(0, retainedBizProfit);

  if (splitMode === "gross") {
    // Gross salary + gross dividends + retained profit (already after corp tax, before personal tax)
    const aGrossForSplit = aGross + positiveRetained;
    const total = aGrossForSplit + mGross;
    return total > 0 ? aGrossForSplit / total : 0.5;
  }

  if (splitMode === "bizNet") {
    const aBizContribution = aIncome + Math.max(0, bizNetLocal);
    const total = aBizContribution + mIncome;
    return total > 0 ? aBizContribution / total : 0.5;
  }

  // net mode (default): net salary + net dividend + retained adjusted for dividend tax
  const aNetForSplit = aIncome + positiveRetained * (1 - dividendTaxRate);
  const total = aNetForSplit + mIncome;
  return total > 0 ? aNetForSplit / total : 0.5;
}
