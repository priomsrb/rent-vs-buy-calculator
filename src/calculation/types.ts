import type {
  AssetKey,
  GainLoss,
} from "@/calculation/cases/gain-loss/types.ts";

import type { SimulationCase, SimulationCaseKey } from "./cases/types";

export interface CaseBreakdowns {
  [caseKey: string]: CaseBreakdown;
}
export interface CaseBreakdown {
  [breakdownKey: string]: number;
}

export type SimulationResult = {
  numYears: number;
  cases: {
    [key in SimulationCaseKey]?: SimulationCase & {
      breakdownByYear: CaseBreakdown[];
      assetsByYear: Partial<Record<AssetKey, number>>[];
    };
  };
  breakdownInfo: {
    [breakdownKey: string]: GainLoss;
  };
};
