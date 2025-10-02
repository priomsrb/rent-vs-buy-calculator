import { SimulationResult } from '@/calc';
import { EnrichedSimulationParams } from '../../EnrichedSimulationParams';
import { CaseBreakdown } from '@/calculation/types';

export interface GainLoss {
  key: string;
  label: string;
  color: string;

  calculateForYear: (args: {
    params: EnrichedSimulationParams;
    year: number;
    previousBreakdowns: CaseBreakdown[];
  }) => number;
}
