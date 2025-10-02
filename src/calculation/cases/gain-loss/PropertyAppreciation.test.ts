import { describe, it, expect } from 'vitest';
import { PropertyAppreciation } from './PropertyAppreciation';

describe('PropertyAppreciation', () => {
  const params = {
    includePropertyGrowth: true,
    propertyPrice: 1000000,
    propertyGrowth: 5, // percentage
  } as any;

  it('calculates property appreciation correctly for a given year', () => {
    // Year 0
    let gain = PropertyAppreciation.calculateForYear({ params, year: 0 });
    let expectedGain = 50000;
    expect(gain).toBeCloseTo(expectedGain);

    // Year 1
    gain = PropertyAppreciation.calculateForYear({ params, year: 1 });
    expectedGain = 52500;
    expect(gain).toBeCloseTo(expectedGain);

    // Year 29
    gain = PropertyAppreciation.calculateForYear({ params, year: 29 });
    expectedGain = 205806.78;
    expect(gain).toBeCloseTo(expectedGain);
  });

  it('returns 0 if property growth is not included', () => {
    const gain = PropertyAppreciation.calculateForYear({
      params: { ...params, includePropertyGrowth: false },
      year: 0,
    });
    expect(gain).toBe(0);
  });
});
