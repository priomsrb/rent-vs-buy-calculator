import type { EnrichedSimulationParams } from "../EnrichedSimulationParams";
import type { GainLoss } from "../types";

export type SimulationCase = {
  key: SimulationCaseKey;
  label: string;
  color: string;

  gainLosses: GainLoss[];
  getStartingBalance: (params: EnrichedSimulationParams) => number;
};

export type SimulationCaseKey = "buy" | "rent";
