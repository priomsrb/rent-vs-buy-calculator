import type { GainLoss } from "@/calculation/cases/gain-loss/types.ts";

export type SimulationCase = {
  key: SimulationCaseKey;
  label: string;
  color: string;

  gainLosses: GainLoss[];
};

export type SimulationCaseKey = "buy" | "rent";
