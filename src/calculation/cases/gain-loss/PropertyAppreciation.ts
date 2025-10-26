import type { GainLoss } from "./types";

export const PropertyAppreciation: GainLoss = {
  key: "propertyAppreciation",
  label: "Property appreciation",
  description: "How much the value of the property has increased this year.",
  color: "rgba(39, 174, 96, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const { includePropertyGrowth, propertyPrice, propertyGrowthPercentage } =
      params;

    if (!includePropertyGrowth || !propertyPrice || !propertyGrowthPercentage) {
      return 0;
    }

    const annualPropertyGrowth = propertyGrowthPercentage / 100;

    const valueAtStartOfYear =
      propertyPrice * Math.pow(1 + annualPropertyGrowth, year);

    const valueAtEndOfYear =
      propertyPrice * Math.pow(1 + annualPropertyGrowth, year + 1);

    const appreciation = valueAtEndOfYear - valueAtStartOfYear;

    return appreciation;
  },
};
