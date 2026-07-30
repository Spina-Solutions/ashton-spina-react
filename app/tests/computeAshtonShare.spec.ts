import { describe, it, expect } from "vitest";
import { computeAshtonShare } from "../pages/ledger/utils/computeAshtonShare.js";
import type { AshtonShareParams } from "../pages/ledger/utils/computeAshtonShare.js";

const BASE: AshtonShareParams = {
  splitMode: "net",
  customSplit: 0.6,
  aIncome: 4000,      // net salary + net dividend
  mIncome: 4000,      // Maria's net salary
  aGross: 5500,       // gross salary + gross dividend
  mGross: 5500,       // Maria's gross salary
  retainedBizProfit: 2000,
  dividendTaxRate: 0.2625,
  bizNetLocal: 5000,
};

describe("computeAshtonShare — fixed modes", () => {
  it("returns 0.5 for fifty mode regardless of income", () => {
    expect(computeAshtonShare({ ...BASE, splitMode: "fifty" })).toBe(0.5);
  });

  it("returns customSplit for custom mode", () => {
    expect(computeAshtonShare({ ...BASE, splitMode: "custom", customSplit: 0.7 })).toBeCloseTo(0.7);
  });

  it("clamps custom split to 0 when negative", () => {
    expect(computeAshtonShare({ ...BASE, splitMode: "custom", customSplit: -0.1 })).toBe(0);
  });

  it("clamps custom split to 1 when above 1", () => {
    expect(computeAshtonShare({ ...BASE, splitMode: "custom", customSplit: 1.5 })).toBe(1);
  });
});

describe("computeAshtonShare — net mode", () => {
  it("with no retained profit: aShare = aIncome / (aIncome + mIncome)", () => {
    const result = computeAshtonShare({ ...BASE, splitMode: "net", retainedBizProfit: 0 });
    expect(result).toBeCloseTo(4000 / (4000 + 4000));
  });

  it("includes retained profit adjusted by dividend tax", () => {
    // aNetForSplit = 4000 + 2000 * (1 - 0.2625) = 4000 + 1475 = 5475
    // total = 5475 + 4000 = 9475
    const expected = 5475 / 9475;
    expect(computeAshtonShare({ ...BASE, splitMode: "net" })).toBeCloseTo(expected);
  });

  it("higher retained raises Ashton's share", () => {
    const low = computeAshtonShare({ ...BASE, splitMode: "net", retainedBizProfit: 500 });
    const high = computeAshtonShare({ ...BASE, splitMode: "net", retainedBizProfit: 3000 });
    expect(high).toBeGreaterThan(low);
  });

  it("ignores negative retained (floors at 0)", () => {
    const zero = computeAshtonShare({ ...BASE, splitMode: "net", retainedBizProfit: 0 });
    const neg = computeAshtonShare({ ...BASE, splitMode: "net", retainedBizProfit: -500 });
    expect(neg).toBeCloseTo(zero);
  });

  it("returns 0.5 when both net incomes + retained are zero", () => {
    const result = computeAshtonShare({
      ...BASE,
      splitMode: "net",
      aIncome: 0,
      mIncome: 0,
      retainedBizProfit: 0,
    });
    expect(result).toBe(0.5);
  });

  it("returns 1 when Maria income is 0 and Ashton has income", () => {
    const result = computeAshtonShare({ ...BASE, splitMode: "net", mIncome: 0 });
    expect(result).toBe(1);
  });

  it("applies real-world dividend tax rate of 26.25%", () => {
    const retained = 1000;
    const divTax = 0.2625;
    const aNetForSplit = 4000 + retained * (1 - divTax);
    const expected = aNetForSplit / (aNetForSplit + 4000);
    expect(computeAshtonShare({ ...BASE, splitMode: "net", retainedBizProfit: retained, dividendTaxRate: divTax })).toBeCloseTo(expected);
  });
});

describe("computeAshtonShare — gross mode", () => {
  it("with no retained profit: aShare = aGross / (aGross + mGross)", () => {
    const result = computeAshtonShare({ ...BASE, splitMode: "gross", retainedBizProfit: 0 });
    expect(result).toBeCloseTo(5500 / (5500 + 5500));
  });

  it("includes retained profit (pre-personal-tax) in gross", () => {
    // aGrossForSplit = 5500 + 2000 = 7500
    // total = 7500 + 5500 = 13000
    const expected = 7500 / 13000;
    expect(computeAshtonShare({ ...BASE, splitMode: "gross" })).toBeCloseTo(expected);
  });

  it("higher retained raises Ashton's gross share", () => {
    const low = computeAshtonShare({ ...BASE, splitMode: "gross", retainedBizProfit: 500 });
    const high = computeAshtonShare({ ...BASE, splitMode: "gross", retainedBizProfit: 3000 });
    expect(high).toBeGreaterThan(low);
  });

  it("ignores negative retained (floors at 0)", () => {
    const zero = computeAshtonShare({ ...BASE, splitMode: "gross", retainedBizProfit: 0 });
    const neg = computeAshtonShare({ ...BASE, splitMode: "gross", retainedBizProfit: -1000 });
    expect(neg).toBeCloseTo(zero);
  });

  it("returns 0.5 when both gross values are zero", () => {
    const result = computeAshtonShare({
      ...BASE,
      splitMode: "gross",
      aGross: 0,
      mGross: 0,
      retainedBizProfit: 0,
    });
    expect(result).toBe(0.5);
  });

  it("Ashton's share exceeds 0.5 when retained pushes him above Maria's gross", () => {
    const result = computeAshtonShare({
      ...BASE,
      splitMode: "gross",
      aGross: 4000,
      mGross: 5000,
      retainedBizProfit: 2000, // 4000 + 2000 = 6000 > 5000
    });
    expect(result).toBeGreaterThan(0.5);
  });
});

describe("computeAshtonShare — bizNet mode", () => {
  it("adds raw business net to Ashton's income", () => {
    // aBizContribution = 4000 + 5000 = 9000; total = 9000 + 4000 = 13000
    const expected = 9000 / 13000;
    expect(computeAshtonShare({ ...BASE, splitMode: "bizNet" })).toBeCloseTo(expected);
  });

  it("ignores negative bizNetLocal (floors at 0)", () => {
    const result = computeAshtonShare({ ...BASE, splitMode: "bizNet", bizNetLocal: -1000 });
    expect(result).toBeCloseTo(4000 / (4000 + 4000));
  });

  it("does not use retainedBizProfit", () => {
    const withRetained = computeAshtonShare({ ...BASE, splitMode: "bizNet", retainedBizProfit: 9999 });
    const withoutRetained = computeAshtonShare({ ...BASE, splitMode: "bizNet", retainedBizProfit: 0 });
    expect(withRetained).toBeCloseTo(withoutRetained);
  });
});

describe("computeAshtonShare — realistic values", () => {
  it("net mode with real-world figures", () => {
    const result = computeAshtonShare({
      splitMode: "net",
      customSplit: 0.6,
      aIncome: 5828,     // net salary + net dividend
      mIncome: 4205,     // Maria's net salary
      aGross: 7736,      // gross salary + dividend
      mGross: 5540,      // Maria's gross salary
      retainedBizProfit: 1800,
      dividendTaxRate: 0.2625,
      bizNetLocal: 2000,
    });
    // aNetForSplit = 5828 + 1800 * (1 - 0.2625) = 5828 + 1327.5 = 7155.5
    // total = 7155.5 + 4205 = 11360.5
    const expected = 7155.5 / 11360.5;
    expect(result).toBeCloseTo(expected, 4);
    expect(result).toBeGreaterThan(0.5);
  });

  it("gross mode with real-world figures", () => {
    const result = computeAshtonShare({
      splitMode: "gross",
      customSplit: 0.6,
      aIncome: 5828,
      mIncome: 4205,
      aGross: 7736,
      mGross: 5540,
      retainedBizProfit: 1800,
      dividendTaxRate: 0.2625,
      bizNetLocal: 2000,
    });
    // aGrossForSplit = 7736 + 1800 = 9536; total = 9536 + 5540 = 15076
    const expected = 9536 / 15076;
    expect(result).toBeCloseTo(expected, 4);
  });
});
