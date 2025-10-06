import type { EnrichedSimulationParams } from "../EnrichedSimulationParams";
import type { GainLoss } from "../types";
import { RentCase } from "./RentCase";
import { BuyCase } from "./BuyCase";

export type SimulationCase = {
  key: SimulationCaseKey;
  label: string;
  color: string;

  gainLosses: GainLoss[];
  getStartingBalance: (params: EnrichedSimulationParams) => number;
};

export type SimulationCaseKey = "buy" | "rent";
