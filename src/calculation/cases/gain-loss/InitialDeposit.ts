import { type EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import { formatMoney } from "@/utils/formatMoney";

import type { GainLoss } from "./types";

export const InitialDeposit: GainLoss = {
  key: "initialDeposit",
  label: "Initial deposit",
  color: "rgba(243, 240, 48, 1.0)",

  description: (params: EnrichedSimulationParams) => {
    const { depositPercent } = params;

    return `Initial ${depositPercent}% deposit of the property priced at ${formatMoney(params.propertyPrice)}`;
  },

  calculateForYear: ({ params, year }): number => {
    // This is a one time cost, so it should only be counted in the start of the first year
    if (year === 0) {
      return (-params.depositPercent / 100) * params.propertyPrice;
    }

    return 0;
  },
};
