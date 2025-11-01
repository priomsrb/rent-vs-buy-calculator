import { describe, expect, it } from "vitest";
import { RentMovingCost } from "./RentMovingCost";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";
import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";

describe("RentMovingCost", () => {
  const params = {
    ...emptySimulationParams,
    includeMovingCosts: true,
    numYears: 30,
    rentIncreasePercent: 3,
    rentMoveCleaning: 500,
    rentMoveOverlapWeeks: 2,
    rentMoveRemovalists: 1000,
    rentMoveYearsBetween: 2,
    rentPerWeek: 1000,
  };

  function calculateForYear(
    year: number,
    additionalParams: Partial<EnrichedSimulationParams>,
  ) {
    return RentMovingCost.calculateForYear({
      params: { ...params, ...additionalParams },
      year,
      previousBreakdowns: [],
    });
  }

  it("calculates zero if moving costs are not included", () => {
    expect(
      calculateForYear(0, {
        includeMovingCosts: false,
      }),
    ).toBe(0);
  });

  it("calculates zero if rentMoveYearsBetween is zero or less", () => {
    expect(
      calculateForYear(0, {
        movingCostType: "lumpSum" as const,
        rentMoveYearsBetween: 0,
      }),
    ).toBe(0);
  });

  it("calculates lump sum moving costs correctly", () => {
    const additionalParams = {
      movingCostType: "lumpSum" as const,
    };

    // Year 0: no move
    let cost = calculateForYear(0, additionalParams);
    expect(cost).toBe(0);

    // Year 1: move happens
    let expectedCost =
      -1 *
      (params.rentPerWeek * params.rentMoveOverlapWeeks +
        params.rentMoveRemovalists +
        params.rentMoveCleaning) *
      Math.pow(1 + params.rentIncreasePercent / 100, 1);
    cost = calculateForYear(1, additionalParams);
    expect(cost).toBe(expectedCost);
    expect(cost).toBe(-3605);

    // Year 2: no move
    cost = calculateForYear(2, additionalParams);
    expect(cost).toBe(0);

    // Year 3: move happens
    expectedCost =
      -1 *
      (params.rentPerWeek * params.rentMoveOverlapWeeks +
        params.rentMoveRemovalists +
        params.rentMoveCleaning) *
      Math.pow(1 + params.rentIncreasePercent / 100, 3);

    cost = cost = calculateForYear(3, additionalParams);
    expect(cost).toBe(expectedCost);
    expect(cost).toBe(-3824.5445);
  });

  it("calculates averaged moving costs correctly", () => {
    const additionalParams = {
      movingCostType: "averaged" as const,
    };

    // Year 0
    let expectedCost =
      (-1 *
        (params.rentPerWeek * params.rentMoveOverlapWeeks +
          params.rentMoveRemovalists +
          params.rentMoveCleaning)) /
      params.rentMoveYearsBetween;
    let cost = calculateForYear(0, additionalParams);
    expect(cost).toBe(expectedCost);
    expect(cost).toBe(-1750);

    // Year 1
    expectedCost =
      (-1 *
        (params.rentPerWeek * params.rentMoveOverlapWeeks +
          params.rentMoveRemovalists +
          params.rentMoveCleaning) *
        (1 + params.rentIncreasePercent / 100)) /
      params.rentMoveYearsBetween;
    cost = calculateForYear(1, additionalParams);
    expect(cost).toBe(expectedCost);
    expect(cost).toBe(-1802.5);

    // Year 2
    expectedCost =
      (-1 *
        (params.rentPerWeek * params.rentMoveOverlapWeeks +
          params.rentMoveRemovalists +
          params.rentMoveCleaning) *
        Math.pow(1 + params.rentIncreasePercent / 100, 2)) /
      params.rentMoveYearsBetween;
    cost = calculateForYear(2, additionalParams);
    expect(cost).toBe(expectedCost);
    expect(cost).toBeCloseTo(-1856.575);
  });

  it("Does not have moving cost when years between moves is at maximum", () => {
    const additionalParams = {
      movingCostType: "averaged" as const,
      rentMoveYearsBetween: 30,
    };

    let cost = calculateForYear(0, additionalParams);
    expect(cost).toBe(0);
  });
});
