import { describe, it, expect } from 'vitest';
import { RentMovingCost } from './RentMovingCost';

describe('RentMovingCost', () => {
  const baseParams = {
    rentPerWeek: 1000,
    rentGrowth: 3, // percentage
    rentMoveYearsBetween: 2,
    rentMoveRemovalists: 1000,
    rentMoveCleaning: 500,
    rentMoveOverlapWeeks: 2,
    includeMovingCosts: true,
  };

  it('calculates zero if moving costs are not included', () => {
    const params = {
      ...baseParams,
      includeMovingCosts: false,
      movingCostType: 'lumpSum',
    };
    const cost = RentMovingCost.calculateForYear({ params, year: 1 });
    expect(cost).toBe(0);
  });

  it('calculates zero if rentMoveYearsBetween is zero or less', () => {
    const params = {
      ...baseParams,
      movingCostType: 'lumpSum',
      rentMoveYearsBetween: 0,
    };
    const cost = RentMovingCost.calculateForYear({ params, year: 0 });
    expect(cost).toBe(0);
  });

  it('calculates lump sum moving costs correctly', () => {
    const params = {
      ...baseParams,
      movingCostType: 'lumpSum',
    };

    // Year 0: no move
    let cost = RentMovingCost.calculateForYear({ params, year: 0 });
    expect(cost).toBe(0);

    // Year 1: move happens
    let expectedCost =
      -1 *
      (params.rentPerWeek * params.rentMoveOverlapWeeks +
        params.rentMoveRemovalists +
        params.rentMoveCleaning) *
      Math.pow(1 + params.rentGrowth / 100, 1);
    cost = RentMovingCost.calculateForYear({ params, year: 1 });
    expect(cost).toBe(expectedCost);
    expect(cost).toBe(-3605);

    // Year 2: no move
    cost = RentMovingCost.calculateForYear({ params, year: 2 });
    expect(cost).toBe(0);

    // Year 3: move happens
    expectedCost =
      -1 *
      (params.rentPerWeek * params.rentMoveOverlapWeeks +
        params.rentMoveRemovalists +
        params.rentMoveCleaning) *
      Math.pow(1 + params.rentGrowth / 100, 3);

    cost = RentMovingCost.calculateForYear({ params, year: 3 });
    expect(cost).toBe(expectedCost);
    expect(cost).toBe(-3824.5445);
  });

  it('calculates averaged moving costs correctly', () => {
    const params = {
      ...baseParams,
      movingCostType: 'averaged',
    };

    // Year 0
    let expectedCost =
      (-1 *
        (params.rentPerWeek * params.rentMoveOverlapWeeks +
          params.rentMoveRemovalists +
          params.rentMoveCleaning)) /
      params.rentMoveYearsBetween;
    let cost = RentMovingCost.calculateForYear({ params, year: 0 });
    expect(cost).toBe(expectedCost);
    expect(cost).toBe(-1750);

    // Year 1
    expectedCost =
      (-1 *
        (params.rentPerWeek * params.rentMoveOverlapWeeks +
          params.rentMoveRemovalists +
          params.rentMoveCleaning) *
        (1 + params.rentGrowth / 100)) /
      params.rentMoveYearsBetween;
    cost = RentMovingCost.calculateForYear({ params, year: 1 });
    expect(cost).toBe(expectedCost);
    expect(cost).toBe(-1802.5);

    // Year 2
    expectedCost =
      (-1 *
        (params.rentPerWeek * params.rentMoveOverlapWeeks +
          params.rentMoveRemovalists +
          params.rentMoveCleaning) *
        Math.pow(1 + params.rentGrowth / 100, 2)) /
      params.rentMoveYearsBetween;
    cost = RentMovingCost.calculateForYear({ params, year: 2 });
    expect(cost).toBe(expectedCost);
    expect(cost).toBeCloseTo(-1856.575);
  });
});
