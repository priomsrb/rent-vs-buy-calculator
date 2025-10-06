import type { GainLoss } from "./types";

export const RentInvestment: GainLoss = {
  key: "rentInvestment",
  label: "Investment growth",
  color: "rgba(39, 174, 96, 0.8)",

  calculateForYear: ({ year, params }) => {
    const { includeInvestReturns, investReturn, initialInvestment } = params;

    if (!includeInvestReturns) {
      return 0;
    }

    const previousInvestmentBalance =
      initialInvestment * Math.pow(1 + investReturn / 100, year);

    console.log({ initialInvestment, previousInvestmentBalance, investReturn });
    return (previousInvestmentBalance * investReturn) / 100;
  },
};
