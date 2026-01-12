import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import type { CaseBreakdown } from "@/calculation/types";

export type AssetKey = "homeEquity" | "investedDeposit" | "investedSavings";

export interface GainLoss {
  key: string;
  label: string;
  color: string;
  description?: string | ((params: EnrichedSimulationParams) => string);
  asset?: AssetKey;

  // Should return the gain (positive) or loss (negative) for this breakdown in the given year
  calculateForYear: (args: {
    params: EnrichedSimulationParams;
    year: number;
    previousBreakdowns: CaseBreakdown[];
  }) => number;
}
