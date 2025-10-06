import type { GainLoss } from "./types";

export const RentPaid: GainLoss = {
  key: "rentPaid",
  label: "Rent",
  color: "rgba(231, 76, 60, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const { rentPerWeek, rentGrowth } = params;
    const startingRentPerYear = rentPerWeek * 52;
    const currentRentGrowth = Math.pow(1 + rentGrowth / 100, year);
    const currentRentPerYear = startingRentPerYear * currentRentGrowth;

    return -currentRentPerYear;
  },
};
