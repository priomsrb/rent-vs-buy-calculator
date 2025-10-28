import _ from "lodash";
import type { GainLoss } from "./types";
import { SurplusCashflow } from "./SurplusCashflow";

export const SurplusInvested: GainLoss = {
  key: "surplusInvested",
  label: "Surplus investment growth",
  description: "The growth from investing previous surplus amounts",
  color: "rgba(32, 173, 145, 0.8)",
  asset: "investedSurplus",

  calculateForYear: ({ params, previousBreakdowns }): number => {
    const { includeInvestSurplus, investmentGrowthPercent } = params;

    if (!includeInvestSurplus) {
      return 0;
    }

    let totalSurplusCash = _(previousBreakdowns)
      .map(SurplusCashflow.key)
      .map((x) => x ?? 0)
      .sum();
    let totalSurplusGrowth = _(previousBreakdowns)
      .map(SurplusInvested.key)
      .map((x) => x ?? 0)
      .sum();

    const totalSurplus = totalSurplusCash + totalSurplusGrowth;

    return totalSurplus * (investmentGrowthPercent / 100);
  },
};
