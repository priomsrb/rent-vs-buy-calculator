import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import type { CaseBreakdown } from "@/calculation/types";

export type AssetKey = "homeEquity" | "investedDeposit" | "investedSavings";

export interface GainLoss {
  key: string;
  label: string;
  color: string;
  description?:
    | string
    | ((params: EnrichedSimulationParams, year: number) => string);
  asset?: AssetKey;

  // Should return the gain (positive) or loss (negative) for this breakdown in the given year
  calculateForYear: (args: {
    params: EnrichedSimulationParams;

    // Year 0 = start of first year (0 days)
    // Year 1 = end of first year (365 days)
    // Year 2 = end of second year (730 days), etc
    year: number;

    previousBreakdowns: CaseBreakdown[];
  }) => number;
}
