import type { SimulationCase } from "./types";
import { BuyMovingCost } from "./gain-loss/BuyMovingCost";
import { CouncilRatesPaid } from "./gain-loss/CouncilRatesPaid";
import { InsurancePaid } from "./gain-loss/InsurancePaid";
import { MaintenanceCost } from "./gain-loss/MaintenanceCost";
import { MortgagePaid } from "./gain-loss/MortgagePaid";
import { PrincipalPaid } from "./gain-loss/PrincipalPaid";
import { PropertyAppreciation } from "./gain-loss/PropertyAppreciation";
import { StrataPaid } from "./gain-loss/StrataPaid";
import type { EnrichedSimulationParams } from "../EnrichedSimulationParams";
import { SurplusCashflow } from "./gain-loss/SurplusCashflow";
import { SurplusInvested } from "./gain-loss/SurplusInvested";

export const BuyCase: SimulationCase = {
  key: "buy",
  label: "Buy",
  color: "blue",

  getStartingBalance: (params: EnrichedSimulationParams) => {
    return params.deposit - params.upfrontBuyerCosts;
  },

  gainLosses: [
    // Gains
    PropertyAppreciation,
    PrincipalPaid,
    SurplusCashflow,
    SurplusInvested,

    // Losses
    MortgagePaid,
    BuyMovingCost,
    MaintenanceCost,
    CouncilRatesPaid,
    StrataPaid,
    InsurancePaid,
  ],
};
