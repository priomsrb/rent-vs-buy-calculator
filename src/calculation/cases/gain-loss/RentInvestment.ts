import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import { formatMoney } from "@/utils/formatMoney";

import type { GainLoss } from "./types";

export const RentInvestment: GainLoss = {
  key: "rentInvestment",
  label: "Investment growth",
  description: (params: EnrichedSimulationParams) =>
    `The growth from investing the initial deposit + purchase costs of ${formatMoney(params.initialInvestment)}`,
  color: "rgba(39, 174, 96, 1.0)",
  asset: "investedDeposit",

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
