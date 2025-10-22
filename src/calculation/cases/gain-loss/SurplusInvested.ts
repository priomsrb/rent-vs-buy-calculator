import _ from "lodash";
import type { GainLoss } from "./types";
import { SurplusCashflow } from "./SurplusCashflow";

export const SurplusInvested: GainLoss = {
  key: "surplusInvested",
  label: "Surplus investment growth",
  description: "The growth from investing previous surplus amounts",
  color: "rgba(32, 173, 145, 0.8)",

  calculateForYear: ({ params, previousBreakdowns }): number => {
    const { includeInvestSurplus, investmentGrowthPercentage } = params;

    if (!includeInvestSurplus) {
      return 0;
    }

    let totalSurplusCash = _(previousBreakdowns).map(SurplusCashflow.key).sum();
    let totalSurplusGrowth = _(previousBreakdowns)
      .map(SurplusInvested.key)
      .sum();

    const totalSurplus = totalSurplusCash + totalSurplusGrowth;

    return totalSurplus * (investmentGrowthPercentage / 100);
  },
};
