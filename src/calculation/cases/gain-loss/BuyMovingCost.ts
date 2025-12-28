import type { GainLoss } from "./types";
import { nswStampDuty } from "@/utils/StampDuty.tsx";
import type { SimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";

export const MAX_MOVING_YEARS = 30;

export const BuyMovingCost: GainLoss = {
  key: "buyMovingCost",
  label: "Moving costs (buy)",
  color: "rgba(230, 139, 34, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const { buyMoveYearsBetween, includeMovingCosts, movingCostType } = params;

    if (
      !includeMovingCosts ||
      !buyMoveYearsBetween ||
      buyMoveYearsBetween <= 0 ||
      buyMoveYearsBetween >= MAX_MOVING_YEARS
    ) {
      return 0;
    }

    // First recurring move happens at the end of `buyMoveYearsBetween` years
    if (movingCostType === "lumpSum") {
      if (year === 0 || (year + 1) % buyMoveYearsBetween !== 0) {
        return 0;
      }
    }

    const buyMoveOnceOff = getOnceOffMovingCost({ year, params });

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

export function getOnceOffMovingCost({
  year,
  params,
}: {
  year: number;
  params: SimulationParams;
}) {
  const {
    buyMoveYearsBetween,
    propertyGrowthPercent,
    includeStampDuty,
    propertyPrice,
    agentFeePercent,
    includeLegalFees,
    legalFees,
    buyMoveRemovalists,
    pestAndBuildingInspection,
    buyMoveOtherCosts,
  } = params;

  const yearsToNextMove =
    buyMoveYearsBetween - (year % buyMoveYearsBetween) - 1;
  const nextMovingYear = year + yearsToNextMove;

  const annualPropertyGrowth = propertyGrowthPercent / 100;
  const priceGrowthOfNextProperty = Math.pow(
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
      pestAndBuildingInspection +
      buyMoveOtherCosts) *
    priceGrowthOfNextProperty;
  return buyMoveOnceOff;
}
