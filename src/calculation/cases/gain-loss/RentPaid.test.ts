import { describe, it, expect } from "vitest";
import { RentPaid } from "./RentPaid";

describe("RentPaid", () => {
  it("calculates rent paid correctly for a given year", () => {
    const params = {
      rentPerWeek: 1000,
      rentIncreasePercentage: 3,
    };

    // Year 0
    let rent = RentPaid.calculateForYear({
      params,
      year: 0,
    });
    let expectedRent = -params.rentPerWeek * 52;
    expect(rent).toBeCloseTo(expectedRent);
    expect(rent).toBeCloseTo(-52000);

    // Year 1
    rent = RentPaid.calculateForYear({
      params,
      year: 1,
    });
    expectedRent =
      -params.rentPerWeek * (1 + params.rentIncreasePercentage / 100) * 52;
    expect(rent).toBeCloseTo(expectedRent);
    expect(rent).toBeCloseTo(-53560);

    // Year 2
    rent = RentPaid.calculateForYear({
      params,
      year: 2,
    });
    expectedRent =
      -params.rentPerWeek *
      Math.pow(1 + params.rentIncreasePercentage / 100, 2) *
      52;
    expect(rent).toBeCloseTo(expectedRent);
    expect(rent).toBeCloseTo(-55166.7999);
  });
});
