import type { GainLoss } from "./types";

export const RentInvestment: GainLoss = {
  key: "rentInvestment",
  label: "Investment growth",
  color: "rgba(39, 174, 96, 0.8)",

  calculateForYear: ({ year, params }) => {
    const {
      includeInvestReturns,
      investmentGrowthPercentage,
      initialInvestment,
    } = params;

    if (!includeInvestReturns) {
      return 0;
    }

    const previousInvestmentBalance =
      initialInvestment * Math.pow(1 + investmentGrowthPercentage / 100, year);

    return (previousInvestmentBalance * investmentGrowthPercentage) / 100;
  },
};
