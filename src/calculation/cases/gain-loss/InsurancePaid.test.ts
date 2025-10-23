import { describe, it, expect } from "vitest";
import { InsurancePaid } from "./InsurancePaid";
import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";

describe("InsurancePaid", () => {
  const params = {
    includeInsurance: true,
    insurancePerYear: 2000,
    propertyPrice: 1000000,
    propertyGrowth: 3, // percentage
  } as any;

  function calculateForYear(
    year: number,
    additionalParams: Partial<EnrichedSimulationParams> = {},
  ) {
    return InsurancePaid.calculateForYear({
      params: { ...params, ...additionalParams },
      year,
      previousBreakdowns: [],
    });
  }

  it("calculates insurance paid correctly for a given year", () => {
    // Year 0
    let cost = calculateForYear(0);
    let expectedCost = -params.insurancePerYear;
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-2000);

    // Year 1
    cost = calculateForYear(1);
    expectedCost = -params.insurancePerYear * (1 + params.propertyGrowth / 100);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-2060);

    // Year 2
    cost = calculateForYear(2);
    expectedCost =
      -params.insurancePerYear * Math.pow(1 + params.propertyGrowth / 100, 2);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-2121.8);
  });

  it("returns 0 if insurance is not included", () => {
    const cost = calculateForYear(0, {
      includeInsurance: false,
    });
    expect(cost).toBe(0);
  });
});
