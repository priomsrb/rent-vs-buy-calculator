import type { GainLoss } from "./types";

export const StrataPaid: GainLoss = {
  key: "strataPaid",
  label: "Strata",
  color: "rgba(26, 188, 156, 1.0)",

  calculateForYear: ({ params, year }): number => {
    const { includeStrata, strataPerYear, propertyGrowthPercent } = params;

    if (year === 0 || !includeStrata || !strataPerYear) {
      return 0;
    }

    const currentPropertyGrowth = Math.pow(
      1 + propertyGrowthPercent / 100,
      year - 1,
    );

    // Cost should be scaled to the property price
    const strataCost = strataPerYear * currentPropertyGrowth;

    return -strataCost;
  },
};
