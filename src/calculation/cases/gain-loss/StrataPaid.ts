import { GainLoss } from './types';

export const StrataPaid: GainLoss = {
  key: 'strataPaid',
  label: 'Strata',
  color: 'rgba(26, 188, 156, 0.8)',

  calculateForYear: ({ params, year }): number => {
    const { includeStrata, strata, propertyGrowth } = params;

    if (!includeStrata || !strata) {
      return 0;
    }

    const currentPropertyGrowth = Math.pow(1 + propertyGrowth / 100, year);

    // Cost should be scaled to the property price
    const strataCost = strata * currentPropertyGrowth;

    return -strataCost;
  },
};
