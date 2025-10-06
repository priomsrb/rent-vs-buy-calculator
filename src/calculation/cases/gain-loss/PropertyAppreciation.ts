import type { GainLoss } from "./types";

export const PropertyAppreciation: GainLoss = {
  key: "propertyAppreciation",
  label: "Property appreciation",
  color: "rgba(39, 174, 96, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const { includePropertyGrowth, propertyPrice, propertyGrowth } = params;

    if (!includePropertyGrowth || !propertyPrice || !propertyGrowth) {
      return 0;
    }

    const annualPropertyGrowth = propertyGrowth / 100;

    const valueAtStartOfYear =
      propertyPrice * Math.pow(1 + annualPropertyGrowth, year);

    const valueAtEndOfYear =
      propertyPrice * Math.pow(1 + annualPropertyGrowth, year + 1);

    const appreciation = valueAtEndOfYear - valueAtStartOfYear;

    return appreciation;
  },
};
