import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";
import type { CaseBreakdown } from "@/calculation/types";

export interface GainLoss {
  key: string;
  label: string;
  color: string;
  description?: string;

  calculateForYear: (args: {
    params: EnrichedSimulationParams;
    year: number;
    previousBreakdowns: CaseBreakdown[];
  }) => number;
}
