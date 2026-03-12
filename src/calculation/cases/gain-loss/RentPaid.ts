import { formatMoney } from "@/utils/formatMoney";

import type { GainLoss } from "./types";

export const RentPaid: GainLoss = {
  key: "rentPaid",
  label: "Rent",
  color: "rgba(231, 76, 60, 1.0)",
  description: (params, year) => {
    const annualRentGrowth = params.rentIncreasePercent / 100;
    const currentRentGrowth = Math.pow(1 + annualRentGrowth, year);
    const currentRent = params.rentPerWeek * currentRentGrowth;

    return `Weekly rent: ${formatMoney(currentRent)}`;
  },

  calculateForYear: ({ params, year }): number => {
    const { rentPerWeek, rentIncreasePercent } = params;
    const startingRentPerYear = rentPerWeek * 52;
    const currentRentGrowth = Math.pow(1 + rentIncreasePercent / 100, year);
    const currentRentPerYear = startingRentPerYear * currentRentGrowth;

    return -currentRentPerYear;
  },
};
