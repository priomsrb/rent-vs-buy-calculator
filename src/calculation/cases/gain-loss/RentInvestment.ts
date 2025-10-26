import type { GainLoss } from "./types";

export const RentInvestment: GainLoss = {
  key: "rentInvestment",
  label: "Investment growth",
  color: "rgba(39, 174, 96, 0.8)",

  calculateForYear: ({ year, params }) => {
    const { includeInvestReturns, investmentGrowthPercent, initialInvestment } =
      params;

    if (!includeInvestReturns) {
      return 0;
    }

    const previousInvestmentBalance =
      initialInvestment * Math.pow(1 + investmentGrowthPercent / 100, year);

    return (previousInvestmentBalance * investmentGrowthPercent) / 100;
  },
};
