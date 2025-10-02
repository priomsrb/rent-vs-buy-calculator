import { SimulationCase } from './types';
import { RentInvestment } from './gain-loss/RentInvestment';
import { RentMovingCost } from './gain-loss/RentMovingCost';
import { RentPaid } from './gain-loss/RentPaid';
import { EnrichedSimulationParams } from '../EnrichedSimulationParams';
import { SurplusCashflow } from './gain-loss/SurplusCashflow';
import { SurplusInvested } from './gain-loss/SurplusInvested';

export const RentCase: SimulationCase = {
  key: 'rent',
  label: 'Rent',
  color: 'green',

  getStartingBalance: (params: EnrichedSimulationParams) => {
    return params.initialInvestment;
  },

  gainLosses: [
    // Gains
    RentInvestment,
    SurplusCashflow,
    SurplusInvested,

    // Losses
    RentPaid,
    RentMovingCost,
  ],
};
