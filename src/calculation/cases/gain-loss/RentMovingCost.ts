import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import { formatMoney } from "@/utils/formatMoney";

import type { GainLoss } from "./types";

export const RentMovingCost: GainLoss = {
  key: "rentMovingCost",
  label: "Moving costs (rent)",
  color: "rgba(230, 139, 34, 1.0)",
  description: (params, year) => {
    const { moveOverlapCost, removalistsCost, cleaningCost } =
      getCalculatedValues(params, year);

    return `Costs associated with moving including:
  - Movers: ${formatMoney(removalistsCost)}
  - Cleaning: ${formatMoney(cleaningCost)}
  - Overlapping rent: ${formatMoney(moveOverlapCost)} (${params.rentMoveOverlapWeeks} week${params.rentMoveOverlapWeeks === 1 ? "" : "s"})

  Averaged by moving every ${params.rentMoveYearsBetween} year${params.rentMoveYearsBetween === 1 ? "" : "s"}.`;
  },

  calculateForYear: ({ params, year }): number => {
    const {
      includeMovingCosts,
      movingCostType,
      numYears,
      rentMoveYearsBetween,
    } = params;

    if (
      !includeMovingCosts ||
      !rentMoveYearsBetween ||
      rentMoveYearsBetween <= 0 ||
      rentMoveYearsBetween >= numYears
    ) {
      return 0;
    }

    const { costForOneMove } = getCalculatedValues(params, year);

    let yearlyRentMovingCosts = 0;

    if (movingCostType === "lumpSum") {
      // Move every rentMoveYearsBetween years.
      if ((year - 1) % rentMoveYearsBetween === 0) {
        yearlyRentMovingCosts = -costForOneMove;
      }
    } else {
      // averaged
      // The cost is spread over the years. We use the cost calculated with the
      // rent at the start of the current year as an approximation.
      const yearlyPortion = costForOneMove / rentMoveYearsBetween;
      yearlyRentMovingCosts = -yearlyPortion;
    }

    return yearlyRentMovingCosts;
  },
};

function getCalculatedValues(params: EnrichedSimulationParams, year: number) {
  const {
    rentMoveYearsBetween,
    rentMoveRemovalists,
    rentMoveCleaning,
    rentMoveOverlapWeeks,
    rentPerWeek,
    rentIncreasePercent,
  } = params;

  const annualRentGrowth = rentIncreasePercent / 100;
  const currentRentGrowth = Math.pow(1 + annualRentGrowth, year);

  const moveOverlapCost =
    rentMoveOverlapWeeks * rentPerWeek * currentRentGrowth;
  const removalistsCost = rentMoveRemovalists * currentRentGrowth;
  const cleaningCost = rentMoveCleaning * currentRentGrowth;
  const costForOneMove = removalistsCost + cleaningCost + moveOverlapCost;

  return {
    moveOverlapCost,
    removalistsCost,
    cleaningCost,
    costForOneMove,
    yearlyPortion: costForOneMove / rentMoveYearsBetween,
  };
}
