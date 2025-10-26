import { describe, it, expect } from "vitest";
import { CouncilRatesPaid } from "./CouncilRatesPaid";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";
import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";

describe("CouncilRatesPaid", () => {
  const params = {
    ...emptySimulationParams,
    includeCouncil: true,
    councilRatesPerYear: 1500,
    propertyGrowthPercentage: 3, // percentage
  };

  function calculateForYear(
    year: number,
    additionalParams: Partial<EnrichedSimulationParams> = {},
  ) {
    return CouncilRatesPaid.calculateForYear({
      params: { ...params, ...additionalParams },
      year,
      previousBreakdowns: [],
    });
  }

  it("calculates council rates paid correctly for a given year", () => {
    // Year 0
    let cost = calculateForYear(0);
    let expectedCost = -params.councilRatesPerYear;
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-1500);

    // Year 1
    cost = calculateForYear(1);
    expectedCost =
      -params.councilRatesPerYear * (1 + params.propertyGrowthPercentage / 100);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-1545);

    // Year 2
    cost = calculateForYear(2);
    expectedCost =
      -params.councilRatesPerYear *
      Math.pow(1 + params.propertyGrowthPercentage / 100, 2);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-1591.35);
  });

  it("returns 0 if council rates are not included", () => {
    const cost = calculateForYear(0, { includeCouncil: false });
    expect(cost).toBe(0);
  });
});
