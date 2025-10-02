import { describe, it, expect } from 'vitest';
import { InsurancePaid } from './InsurancePaid';

describe('InsurancePaid', () => {
  const params = {
    includeInsurance: true,
    insurance: 2000,
    propertyPrice: 1000000,
    propertyGrowth: 3, // percentage
  } as any;

  it('calculates insurance paid correctly for a given year', () => {
    // Year 0
    let cost = InsurancePaid.calculateForYear({ params, year: 0 });
    let expectedCost = -params.insurance;
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-2000);

    // Year 1
    cost = InsurancePaid.calculateForYear({ params, year: 1 });
    expectedCost = -params.insurance * (1 + params.propertyGrowth / 100);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-2060);

    // Year 2
    cost = InsurancePaid.calculateForYear({ params, year: 2 });
    expectedCost =
      -params.insurance * Math.pow(1 + params.propertyGrowth / 100, 2);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-2121.8);
  });

  it('returns 0 if insurance is not included', () => {
    const cost = InsurancePaid.calculateForYear({
      params: { ...params, includeInsurance: false },
      year: 0,
    });
    expect(cost).toBe(0);
  });
});
