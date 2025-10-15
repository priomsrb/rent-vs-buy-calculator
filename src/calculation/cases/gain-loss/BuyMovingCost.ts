import type { GainLoss } from "./types";

// Re-implementing from calc.ts
function nswStampDuty(dutiableValue: number): number {
  const v = Math.max(0, Number(dutiableValue));
  if (v <= 16000) return v * 0.0125;
  if (v <= 35000) return 200 + (v - 16000) * 0.015;
  if (v <= 93000) return 485 + (v - 35000) * 0.0175;
  if (v < 351000) return 1500 + (v - 93000) * 0.035;
  if (v < 1168000) return 9805 + (v - 351000) * 0.045;
  return 44095 + (v - 1168000) * 0.055;
}

export const BuyMovingCost: GainLoss = {
  key: "buyMovingCost",
  label: "Moving costs (buy)",
  color: "rgba(230, 139, 34, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const {
      includeMovingCosts,
      movingCostType,
      buyMoveYearsBetween,
      buyMoveRemovalists,
      propertyPrice,
      propertyGrowth,
      agentFeePercent,
      includeLegalFees,
      legalFees,
      pestAndBuildingInspection,
      buyMoveOtherCosts,
      includeStampDuty,
    } = params;

    if (
      !includeMovingCosts ||
      !buyMoveYearsBetween ||
      buyMoveYearsBetween <= 0
    ) {
      return 0;
    }

    // First recurring move happens at the end of `buyMoveYearsBetween` years
    if (movingCostType === "lumpSum") {
      if (year === 0 || (year + 1) % buyMoveYearsBetween !== 0) {
        return 0;
      }
    }

    const yearsToNextMove =
      buyMoveYearsBetween - (year % buyMoveYearsBetween) - 1;
    const nextMovingYear = year + yearsToNextMove;

    const annualPropertyGrowth = propertyGrowth / 100;
    const propertyGrowthWhenMoving = Math.pow(
      1 + annualPropertyGrowth,
      nextMovingYear,
    );

    const stampDuty = includeStampDuty ? nswStampDuty(propertyPrice) : 0;
    const agentFee = (agentFeePercent / 100) * propertyPrice;
    const legal = includeLegalFees ? legalFees : 0;

    const buyMoveOnceOff =
      (stampDuty +
        agentFee +
        legal +
        buyMoveRemovalists +
        buyMoveOtherCosts +
        pestAndBuildingInspection) *
      propertyGrowthWhenMoving;

    let yearlyMovingCost = 0;

    if (movingCostType === "lumpSum") {
      yearlyMovingCost = buyMoveOnceOff;
    } else {
      // averaged
      yearlyMovingCost = buyMoveOnceOff / buyMoveYearsBetween;
    }

    return -yearlyMovingCost;
  },
};
