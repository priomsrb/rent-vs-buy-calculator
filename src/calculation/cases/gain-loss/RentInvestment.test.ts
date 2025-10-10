import { describe, it, expect } from "vitest";
import { RentInvestment } from "./RentInvestment";

describe("RentInvestment", () => {
  it("calculates investment for the first year", () => {
    const params = {
      initialInvestment: 100_000,
      includeInvestReturns: true,
      investmentGrowthPercentage: 10, // 10%
    };

    const investment = RentInvestment.calculateForYear({
      params,
      year: 0,
    });

    expect(investment).toBeCloseTo(10_000);
  });

  it("calculates investment for the second year", () => {
    const params = {
      initialInvestment: 100_000,
      includeInvestReturns: true,
      investmentGrowthPercentage: 10, // 10%
    };

    const investment = RentInvestment.calculateForYear({
      params,
      year: 1,
    });

    expect(investment).toBeCloseTo(11_000);
  });

  it("returns 0 if includeInvestReturns is false", () => {
    const params = {
      initialInvestment: 100_000,
      includeInvestReturns: false,
      investmentGrowthPercentage: 10, // 10%
    } as any;

    const investment = RentInvestment.calculateForYear({
      params,
      year: 0,
    });

    expect(investment).toBe(0);
  });
});
