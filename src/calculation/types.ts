import type { SimulationCase, SimulationCaseKey } from "./cases/types";
import type { GainLoss } from "@/calculation/cases/gain-loss/types.ts";

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
      netWorthByYear: number[];
    };
  };
  breakdownInfo: {
    [breakdownKey: string]: GainLoss;
  };
};
