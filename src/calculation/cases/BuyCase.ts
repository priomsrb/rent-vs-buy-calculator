import { TaxOnSurplusInvestments } from "@/calculation/cases/gain-loss/TaxOnInvestments.ts";

import type { EnrichedSimulationParams } from "../EnrichedSimulationParams";
import { BuyMovingCost } from "./gain-loss/BuyMovingCost";
import { CouncilRatesPaid } from "./gain-loss/CouncilRatesPaid";
import { InsurancePaid } from "./gain-loss/InsurancePaid";
import { MaintenanceCost } from "./gain-loss/MaintenanceCost";
import { MortgagePaid } from "./gain-loss/MortgagePaid";
import { PrincipalPaid } from "./gain-loss/PrincipalPaid";
import { PropertyAppreciation } from "./gain-loss/PropertyAppreciation";
import { StrataPaid } from "./gain-loss/StrataPaid";
import { SurplusCashflow } from "./gain-loss/SurplusCashflow";
import { SurplusInvested } from "./gain-loss/SurplusInvested";
import type { SimulationCase } from "./types";

export const BuyCase: SimulationCase = {
  key: "buy",
  label: "Buy",
  color: "blue",

  getStartingAssets: (params: EnrichedSimulationParams) => {
    return { homeEquity: params.deposit };
  },

  gainLosses: [
    // Gains
    PropertyAppreciation,
    PrincipalPaid,
    SurplusCashflow,
    SurplusInvested,

    // Losses
    MortgagePaid,
    MaintenanceCost,
    BuyMovingCost,
    CouncilRatesPaid,
    StrataPaid,
    InsurancePaid,
    TaxOnSurplusInvestments,
  ],
};
