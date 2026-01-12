import { describe, expect, it } from "vitest";

import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";

import { PropertyAppreciation } from "./PropertyAppreciation";

describe("PropertyAppreciation", () => {
  const params = {
    ...emptySimulationParams,
    includePropertyGrowth: true,
    propertyPrice: 1000000,
    propertyGrowthPercent: 5,
  };

  function calculateForYear(
    year: number,
    additionalParams: Partial<EnrichedSimulationParams> = {},
  ) {
    return PropertyAppreciation.calculateForYear({
      year,
      params: { ...params, ...additionalParams },
      previousBreakdowns: [],
    });
  }

  it("calculates property appreciation correctly for a given year", () => {
    expect(calculateForYear(0)).toBeCloseTo(50000);
    expect(calculateForYear(1)).toBeCloseTo(52500);
    expect(calculateForYear(29)).toBeCloseTo(205806.78);
  });

  it("returns 0 if property growth is not included", () => {
    expect(calculateForYear(0, { includePropertyGrowth: false })).toBeCloseTo(
      0,
    );
  });
});
