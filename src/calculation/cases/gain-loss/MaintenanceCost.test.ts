import { describe, it, expect } from 'vitest';
import { MaintenanceCost } from './MaintenanceCost';

describe('MaintenanceCost', () => {
  const params = {
    includeMaintenance: true,
    maintenancePercent: 1, // 1%
    propertyPrice: 1000000,
    propertyGrowth: 3, // percentage
  } as any;

  it('calculates maintenance cost correctly for a given year', () => {
    // Year 0
    let cost = MaintenanceCost.calculateForYear({ params, year: 0 });
    let expectedCost =
      -(params.maintenancePercent / 100) * params.propertyPrice;
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-10000);

    // Year 1
    cost = MaintenanceCost.calculateForYear({ params, year: 1 });
    expectedCost =
      -(params.maintenancePercent / 100) *
      params.propertyPrice *
      (1 + params.propertyGrowth / 100);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-10300);

    // Year 2
    cost = MaintenanceCost.calculateForYear({ params, year: 2 });
    expectedCost =
      -(params.maintenancePercent / 100) *
      params.propertyPrice *
      Math.pow(1 + params.propertyGrowth / 100, 2);
    expect(cost).toBeCloseTo(expectedCost);
    expect(cost).toBeCloseTo(-10609);
  });

  it('returns 0 if maintenance is not included', () => {
    const cost = MaintenanceCost.calculateForYear({
      params: { ...params, includeMaintenance: false },
      year: 0,
    });
    expect(cost).toBe(0);
  });
});
