import { describe, it, expect } from "vitest";

// Helper function that mirrors the inline calculation in the page
function calculateDuties(
  baseValueBDT: number,
  rates: { cd: number; sd: number; vat: number; ait: number; rd: number }
) {
  const cdAmount = baseValueBDT * (rates.cd / 100);
  const sdAmount = (baseValueBDT + cdAmount) * (rates.sd / 100);
  const vatAmount = (baseValueBDT + cdAmount + sdAmount) * (rates.vat / 100);
  const aitAmount = baseValueBDT * (rates.ait / 100);
  const rdAmount = baseValueBDT * (rates.rd / 100);

  const totalTaxAmount = cdAmount + sdAmount + vatAmount + aitAmount + rdAmount;
  const grandTotalAmount = baseValueBDT + totalTaxAmount;

  return { cdAmount, sdAmount, vatAmount, aitAmount, rdAmount, totalTaxAmount, grandTotalAmount };
}

describe("Duty Calculator Logic", () => {
  it("calculates duties correctly based on NBR formulas", () => {
    const baseValue = 1000;
    const rates = { cd: 10, sd: 20, vat: 15, ait: 5, rd: 3 };

    const result = calculateDuties(baseValue, rates);

    expect(result.cdAmount).toBe(100); // 10% of 1000
    expect(result.sdAmount).toBe(220); // 20% of 1100 (1000 + 100)
    expect(result.vatAmount).toBe(198); // 15% of 1320 (1100 + 220)
    expect(result.aitAmount).toBe(50); // 5% of 1000
    expect(result.rdAmount).toBe(30); // 3% of 1000

    expect(result.totalTaxAmount).toBe(100 + 220 + 198 + 50 + 30);
    expect(result.grandTotalAmount).toBe(1000 + 598);
  });
});
