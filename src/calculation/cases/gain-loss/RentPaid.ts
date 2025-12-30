import type { GainLoss } from "./types";

export const RentPaid: GainLoss = {
  key: "rentPaid",
  label: "Rent",
  color: "rgba(231, 76, 60, 1.0)",

  calculateForYear: ({ params, year }): number => {
    const { rentPerWeek, rentIncreasePercent } = params;
    const startingRentPerYear = rentPerWeek * 52;
    const currentRentGrowth = Math.pow(1 + rentIncreasePercent / 100, year);
    const currentRentPerYear = startingRentPerYear * currentRentGrowth;

    return -currentRentPerYear;
  },
};
