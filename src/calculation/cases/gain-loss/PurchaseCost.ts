import { type EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import { formatMoney } from "@/utils/formatMoney";

import type { GainLoss } from "./types";

export const PurchaseCost: GainLoss = {
  key: "purchaseCost",
  label: "Purchase Cost",
  color: "rgba(243, 194, 18, 1.0)",

  description: (params: EnrichedSimulationParams) => {
    const { pestAndBuildingInspection, stampDuty, lmi, legalFees } = params;

    return `Costs for the initial purchase of the home. Includes:
    - Stamp duty: ${formatMoney(stampDuty)}
    - LMI: ${formatMoney(lmi)}
    - Legal fees: ${formatMoney(legalFees)}
    - Pest & build inspection: ${formatMoney(pestAndBuildingInspection)}`;
  },

  calculateForYear: ({ params, year }): number => {
    if (year > 0) {
      // This is a one time cost, so it should only be counted in the first year
      // For purchase costs for the buyer's next property see BuyMovingCost
      return 0;
    }

    return -params.upfrontBuyerCosts;
    // return 0;
  },
};
