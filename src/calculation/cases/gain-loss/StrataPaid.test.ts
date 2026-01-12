import { describe, expect, it } from "vitest";

import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";

import { StrataPaid } from "./StrataPaid";

describe("StrataPaid", () => {
  const params = {
    ...emptySimulationParams,
    includeStrata: true,
    strataPerYear: 4000,
    propertyPrice: 1000000,
    propertyGrowthPercent: 3,
  };

  function calculateForYear(
    year: number,
    additionalParams: Partial<EnrichedSimulationParams> = {},
  ) {
    return StrataPaid.calculateForYear({
      year,
      params: { ...params, ...additionalParams },
      previousBreakdowns: [],
    });
  }

  it("calculates strata paid correctly for a given year", () => {
    let cost = calculateForYear(0);
    let expectedCost = -params.strataPerYear;
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-4000);

    cost = calculateForYear(1);
    expectedCost =
      -params.strataPerYear * (1 + params.propertyGrowthPercent / 100);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-4120);

    cost = calculateForYear(2);
    expectedCost =
      -params.strataPerYear *
      Math.pow(1 + params.propertyGrowthPercent / 100, 2);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-4243.6);
  });

  it("returns 0 if strata is not included", () => {
    const cost = calculateForYear(0, { includeStrata: false });
    expect(cost).toBe(0);
  });
});
