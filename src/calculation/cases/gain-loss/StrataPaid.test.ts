import { describe, it, expect } from 'vitest';
import { StrataPaid } from './StrataPaid';

describe('StrataPaid', () => {
  const params = {
    includeStrata: true,
    strata: 4000,
    propertyPrice: 1000000,
    propertyGrowth: 3, // percentage
  } as any;

  it('calculates strata paid correctly for a given year', () => {
    // Year 0
    let cost = StrataPaid.calculateForYear({ params, year: 0 });
    let expectedCost = -params.strata;
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-4000);

    // Year 1
    cost = StrataPaid.calculateForYear({ params, year: 1 });
    expectedCost = -params.strata * (1 + params.propertyGrowth / 100);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-4120);

    // Year 2
    cost = StrataPaid.calculateForYear({ params, year: 2 });
    expectedCost =
      -params.strata * Math.pow(1 + params.propertyGrowth / 100, 2);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-4243.6);
  });

  it('returns 0 if strata is not included', () => {
    const cost = StrataPaid.calculateForYear({
      params: { ...params, includeStrata: false },
      year: 0,
    });
    expect(cost).toBe(0);
  });
});
