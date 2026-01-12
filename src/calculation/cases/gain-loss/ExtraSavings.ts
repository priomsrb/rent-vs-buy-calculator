import type { GainLoss } from "./types";

export const ExtraSavings: GainLoss = {
  key: "extraSavings",
  label: "Extra savings",
  description: "Cash saved by having fewer expenses",
  color: "rgba(36, 198, 182, 1.0)",
  asset: "investedSavings",

  calculateForYear: (): number => {
    // The extra savings is actually calculated in Simulator.ts#simulate()
    return 0;
  },
};
