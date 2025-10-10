import { describe, it, expect } from "vitest";
import { CouncilRatesPaid } from "./CouncilRatesPaid";

describe("CouncilRatesPaid", () => {
  const params = {
    includeCouncil: true,
    councilRatesPerYear: 1500,
    propertyGrowth: 3, // percentage
  } as any;

  it("calculates council rates paid correctly for a given year", () => {
    // Year 0
    let cost = CouncilRatesPaid.calculateForYear({ params, year: 0 });
    let expectedCost = -params.councilRatesPerYear;
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-1500);

    // Year 1
    cost = CouncilRatesPaid.calculateForYear({ params, year: 1 });
    expectedCost =
      -params.councilRatesPerYear * (1 + params.propertyGrowth / 100);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-1545);

    // Year 2
    cost = CouncilRatesPaid.calculateForYear({ params, year: 2 });
    expectedCost =
      -params.councilRatesPerYear *
      Math.pow(1 + params.propertyGrowth / 100, 2);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-1591.35);
  });

  it("returns 0 if council rates are not included", () => {
    const cost = CouncilRatesPaid.calculateForYear({
      params: { ...params, includeCouncil: false },
      year: 0,
    });
    expect(cost).toBe(0);
  });
});
