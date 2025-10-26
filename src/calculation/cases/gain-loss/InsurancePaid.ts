import type { GainLoss } from "./types";

export const InsurancePaid: GainLoss = {
  key: "insurancePaid",
  label: "Insurance",
  color: "rgba(142, 68, 173, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const { includeInsurance, insurancePerYear, propertyGrowthPercentage } =
      params;

    if (!includeInsurance || !insurancePerYear) {
      return 0;
    }

    const currentPropertyGrowth = Math.pow(
      1 + propertyGrowthPercentage / 100,
      year,
    );

    // Cost should be scaled to the property price
    const insuranceCost = insurancePerYear * currentPropertyGrowth;

    return -insuranceCost;
  },
};
