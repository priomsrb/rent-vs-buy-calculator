import type { GainLoss } from "./types";

export const CouncilRatesPaid: GainLoss = {
  key: "councilRatesPaid",
  label: "Council rates",
  color: "rgba(52, 152, 219, 1.0)",

  calculateForYear: ({ params, year }): number => {
    const { includeCouncil, councilRatesPerYear, propertyGrowthPercent } =
      params;

    if (!includeCouncil || !councilRatesPerYear) {
      return 0;
    }

    const currentPropertyGrowth = Math.pow(
      1 + propertyGrowthPercent / 100,
      year,
    );

    // Cost should be scaled to the property price
    const councilRatesCost = councilRatesPerYear * currentPropertyGrowth;

    return -councilRatesCost;
  },
};
