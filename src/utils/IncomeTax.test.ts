import { describe, expect, it } from "vitest";
import { getPreTaxIncomeFromPostTax, getTaxForIncome } from "./IncomeTax";

describe("IncomeTax", () => {
  describe("getTaxForIncome", () => {
    it("calculates tax for tax-free threshold", () => {
      expect(getTaxForIncome(10000)).toBe(200);
    });

    it("calculates tax for 19k", () => {
      // (19000 - 18200) * 0.16 = 128
      // Medicare: 19000 * 0.02 = 380
      // Total: 508
      expect(getTaxForIncome(19000)).toBeCloseTo(508, 0);
    });

    it("calculates tax for 100k", () => {
      // 4288 + (100000 - 45000) * 0.3 = 4288 + 16500 = 20788
      // Medicare: 2000
      // Total: 22788
      expect(getTaxForIncome(100000)).toBeCloseTo(22788, 0);
    });
  });

  describe("getPreTaxIncomeFromPostTax", () => {
    it("reverses 100k pre-tax correctly", () => {
      const preTax = 100000;
      const tax = getTaxForIncome(preTax);
      const postTax = preTax - tax;

      expect(getPreTaxIncomeFromPostTax(postTax)).toBeCloseTo(preTax, -1); // Within 10 dollars
    });

    it("reverses 200k pre-tax correctly", () => {
      const preTax = 200000;
      const tax = getTaxForIncome(preTax);
      const postTax = preTax - tax;

      expect(getPreTaxIncomeFromPostTax(postTax)).toBeCloseTo(preTax, -1);
    });

    it("reverses 50k pre-tax correctly", () => {
      const preTax = 50000;
      const tax = getTaxForIncome(preTax);
      const postTax = preTax - tax;

      expect(getPreTaxIncomeFromPostTax(postTax)).toBeCloseTo(preTax, -1);
    });
  });
});
