import { describe, expect, it } from "vitest";

import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";

import { MaintenanceCost } from "./MaintenanceCost";

describe("MaintenanceCost", () => {
  const params = {
    ...emptySimulationParams,
    includeMaintenance: true,
    maintenanceCostPercent: 1,
    propertyPrice: 1000000,
    maintenanceCostGrowthPercent: 3.5,
  };

  function calculateForYear(
    year: number,
    additionalParams: Partial<EnrichedSimulationParams> = {},
  ) {
    return MaintenanceCost.calculateForYear({
      params: { ...params, ...additionalParams },
      year,
      previousBreakdowns: [],
    });
  }

  it("calculates maintenance cost correctly for a given year", () => {
    // Year 0
    let cost = calculateForYear(0);
    let expectedCost =
      -(params.maintenanceCostPercent / 100) * params.propertyPrice;
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-10000);

    // Year 1
    cost = calculateForYear(1);
    expectedCost =
      -(params.maintenanceCostPercent / 100) *
      params.propertyPrice *
      (1 + params.maintenanceCostGrowthPercent / 100);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-10350);

    // Year 2
    cost = calculateForYear(2);
    expectedCost =
      -(params.maintenanceCostPercent / 100) *
      params.propertyPrice *
      Math.pow(1 + params.maintenanceCostGrowthPercent / 100, 2);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-10712.25);
  });

  it("returns 0 if maintenance is not included", () => {
    const cost = calculateForYear(0, { includeMaintenance: false });
    expect(cost).toBe(0);
  });
});
