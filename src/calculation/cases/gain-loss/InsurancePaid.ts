import type { GainLoss } from "./types";

export const InsurancePaid: GainLoss = {
  key: "insurancePaid",
  label: "Insurance",
  color: "rgba(142, 68, 173, 1.0)",

  calculateForYear: ({ params, year }): number => {
    const { includeInsurance, insurancePerYear, propertyGrowthPercent } =
      params;

    if (year === 0 || !includeInsurance || !insurancePerYear) {
      return 0;
    }

    const currentPropertyGrowth = Math.pow(
      1 + propertyGrowthPercent / 100,
      year - 1,
    );

    // Cost should be scaled to the property price
    const insuranceCost = insurancePerYear * currentPropertyGrowth;

    return -insuranceCost;
  },
};
