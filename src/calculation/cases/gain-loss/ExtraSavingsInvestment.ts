import _ from "lodash";

import { ExtraSavings } from "./ExtraSavings";
import type { GainLoss } from "./types";

export const ExtraSavingsInvestment: GainLoss = {
  key: "extraSavingsInvestment",
  label: "Savings investment growth",
  description: "The growth from investing previous savings",
  color: "rgba(32, 173, 145, 1.0)",
  asset: "investedSavings",

  calculateForYear: ({ params, previousBreakdowns }): number => {
    const { includeInvestSurplus, investmentGrowthPercent } = params;

    if (!includeInvestSurplus) {
      return 0;
    }

    let totalExtraSavings = _(previousBreakdowns)
      .map(ExtraSavings.key)
      .map((x) => x ?? 0)
      .sum();
    let totalSavingsGrowth = _(previousBreakdowns)
      .map(ExtraSavingsInvestment.key)
      .map((x) => x ?? 0)
      .sum();

    const totalSavings = totalExtraSavings + totalSavingsGrowth;

    return totalSavings * (investmentGrowthPercent / 100);
  },
};
