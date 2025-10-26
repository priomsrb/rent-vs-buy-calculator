import { describe, it, expect } from "vitest";
import { RentPaid } from "./RentPaid";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";

describe("RentPaid", () => {
  const params = {
    ...emptySimulationParams,
    rentPerWeek: 1000,
    rentIncreasePercentage: 3,
  };
  function calculateForYear(year: number) {
    return RentPaid.calculateForYear({
      params,
      year,
      previousBreakdowns: [],
    });
  }

  it("calculates rent paid correctly for a given year", () => {
    // Year 0
    let rent = calculateForYear(0);
    let expectedRent = -params.rentPerWeek * 52;
    expect(rent).toBeCloseTo(expectedRent);
    expect(rent).toBeCloseTo(-52000);

    // Year 1
    rent = calculateForYear(1);
    expectedRent =
      -params.rentPerWeek * (1 + params.rentIncreasePercentage / 100) * 52;
    expect(rent).toBeCloseTo(expectedRent);
    expect(rent).toBeCloseTo(-53560);

    // Year 2
    rent = calculateForYear(2);
    expectedRent =
      -params.rentPerWeek *
      Math.pow(1 + params.rentIncreasePercentage / 100, 2) *
      52;
    expect(rent).toBeCloseTo(expectedRent);
    expect(rent).toBeCloseTo(-55166.7999);
  });
});
