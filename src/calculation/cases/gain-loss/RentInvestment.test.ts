import { describe, expect, it } from "vitest";
import { RentInvestment } from "./RentInvestment";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";

describe("RentInvestment", () => {
  it("calculates investment for the 3 years", () => {
    const params = {
      ...emptySimulationParams,
      initialInvestment: 100_000,
      includeInvestReturns: true,
      investmentGrowthPercentage: 10,
    };

    function assertForYear(year: number, expectedValue: number) {
      expect(
        RentInvestment.calculateForYear({
          params,
          year,
        }),
      ).toBeCloseTo(expectedValue);
    }

    assertForYear(0, 10_000);
    assertForYear(1, 11_000);
    assertForYear(2, 12_100);
  });

  it("returns 0 if includeInvestReturns is false", () => {
    const params = {
      ...emptySimulationParams,
      initialInvestment: 100_000,
      includeInvestReturns: false,
      investmentGrowthPercentage: 10, // 10%
    };

    expect(
      RentInvestment.calculateForYear({
        params,
        year: 0,
      }),
    ).toBe(0);
  });
});
