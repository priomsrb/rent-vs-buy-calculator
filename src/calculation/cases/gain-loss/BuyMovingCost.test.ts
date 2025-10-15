import { describe, it, expect } from "vitest";
import { BuyMovingCost } from "./BuyMovingCost";

describe("BuyMovingCost", () => {
  const params = {
    includeMovingCosts: true,
    movingCostType: "lumpSum",
    buyMoveYearsBetween: 5,
    buyMoveRemovalists: 1000,
    buyMoveConnections: 100,
    buyMoveSupplies: 100,
    buyMoveMinorRepairs: 500,
    propertyPrice: 1000000,
    propertyGrowth: 5,
    agentFeePercent: 2,
    includeLegalFees: true,
    buyMoveOtherCosts: 1000,
    pestAndBuildingInspection: 500,
    legalFees: 2000,
    includeStampDuty: true,
  } as any;

  const COST_OF_FIRST_MOVE = -77196.8;
  const COST_OF_SECOND_MOVE = -98524.85;

  it("calculates lump sum moving costs correctly for a moving year", () => {
    let cost = BuyMovingCost.calculateForYear({ params, year: 0 });
    expect(cost).toBe(0);

    cost = BuyMovingCost.calculateForYear({ params, year: 1 });
    expect(cost).toBe(0);

    cost = BuyMovingCost.calculateForYear({ params, year: 2 });
    expect(cost).toBe(0);

    cost = BuyMovingCost.calculateForYear({ params, year: 3 });
    expect(cost).toBe(0);

    // Move happens at year 4 (which is the end of the 5th year, year is 0-indexed)
    cost = BuyMovingCost.calculateForYear({ params, year: 4 });
    expect(cost).toBeCloseTo(COST_OF_FIRST_MOVE, 2);

    cost = BuyMovingCost.calculateForYear({ params, year: 5 });
    expect(cost).toBe(0);

    // 2nd move
    cost = BuyMovingCost.calculateForYear({ params, year: 9 });
    expect(cost).toBeCloseTo(COST_OF_SECOND_MOVE, 2);
  });

  it("calculates averaged moving costs correctly", () => {
    const averagedParams = { ...params, movingCostType: "averaged" };
    // Cost is based on property value at year 4, but spread over 5 years
    let expectedCost = COST_OF_FIRST_MOVE / 5;

    let cost = BuyMovingCost.calculateForYear({
      params: averagedParams,
      year: 0,
    });
    expect(cost).toBeCloseTo(expectedCost, 0);

    cost = BuyMovingCost.calculateForYear({
      params: averagedParams,
      year: 4,
    });
    expect(cost).toBeCloseTo(expectedCost, 0);

    expectedCost = COST_OF_SECOND_MOVE / 5;
    cost = BuyMovingCost.calculateForYear({ params: averagedParams, year: 5 });
    expect(cost).toBeCloseTo(expectedCost, 0);
  });

  it("returns 0 if moving costs are not included", () => {
    const cost = BuyMovingCost.calculateForYear({
      params: { ...params, includeMovingCosts: false },
      year: 4,
    });
    expect(cost).toBe(0);
  });
});
