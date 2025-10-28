import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import type { CaseBreakdown } from "@/calculation/types";

type Asset = "homeEquity" | "investedDeposit" | "investedSurplus";

export interface GainLoss {
  key: string;
  label: string;
  color: string;
  description?: string;
  asset?: Asset;

  // Should return the gain (positive) or loss (negative) for this breakdown in the given year
  calculateForYear: (args: {
    params: EnrichedSimulationParams;
    year: number;
    previousBreakdowns: CaseBreakdown[];
  }) => number;
}
