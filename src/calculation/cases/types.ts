import type { EnrichedSimulationParams } from "../EnrichedSimulationParams";
import type {
  AssetKey,
  GainLoss,
} from "@/calculation/cases/gain-loss/types.ts";

export type SimulationCase = {
  key: SimulationCaseKey;
  label: string;
  color: string;

  gainLosses: GainLoss[];
  getStartingBalance: (params: EnrichedSimulationParams) => number;
  getStartingAssets: (
    params: EnrichedSimulationParams,
  ) => Partial<Record<AssetKey, number>>;
};

export type SimulationCaseKey = "buy" | "rent";
