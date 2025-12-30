import type { GainLoss } from "./types";

export const RentMovingCost: GainLoss = {
  key: "rentMovingCost",
  label: "Moving costs (rent)",
  color: "rgba(230, 139, 34, 1.0)",

  calculateForYear: ({ params, year }): number => {
    const {
      includeMovingCosts,
      movingCostType,
      numYears,
      rentMoveYearsBetween,
      rentMoveRemovalists,
      rentMoveCleaning,
      rentMoveOverlapWeeks,
      rentPerWeek,
      rentIncreasePercent,
    } = params;

    if (
      !includeMovingCosts ||
      !rentMoveYearsBetween ||
      rentMoveYearsBetween <= 0 ||
      rentMoveYearsBetween >= numYears
    ) {
      return 0;
    }

    const annualRentGrowth = rentIncreasePercent / 100;
    const currentRentGrowth = Math.pow(1 + annualRentGrowth, year);

    const moveOverlapCost = (rentMoveOverlapWeeks || 0) * rentPerWeek;
    const initialMovingCost =
      (rentMoveRemovalists || 0) + (rentMoveCleaning || 0) + moveOverlapCost;
    const costForOneMove = initialMovingCost * currentRentGrowth;

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
