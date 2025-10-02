import { SimulationCase, SimulationCaseKey } from './cases/types';
import { EnrichedSimulationParams } from './EnrichedSimulationParams';

export interface CaseBreakdowns {
  [caseKey: string]: CaseBreakdown;
}
export interface CaseBreakdown {
  [breakdownKey: string]: number;
}

export interface GainLoss {
  key: string;
  label: string;
  color: string;

  // Should return the gain (positive) or loss (negative) for this breakdown in the given year
  calculateForYear: (args: {
    params: EnrichedSimulationParams;
    year: number;
    previousBreakdowns: CaseBreakdown[];
  }) => number;
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
