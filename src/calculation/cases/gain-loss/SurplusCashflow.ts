import type { GainLoss } from "./types";

export const SurplusCashflow: GainLoss = {
  key: "surplusCashflow",
  label: "Surplus cashflow",
  description: "Extra cash saved by having less expenses",
  color: "rgba(36, 198, 182, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const { includeInvestSurplus } = params;

    // The surplus is actually calculated in Simulator.ts#simulate()
    return 0;
  },
};
