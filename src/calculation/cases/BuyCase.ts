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
import { TaxOnSurplusInvestments } from "@/calculation/cases/gain-loss/TaxOnInvestments.ts";

export const BuyCase: SimulationCase = {
  key: "buy",
  label: "Buy",
  color: "blue",

  getStartingBalance: (params: EnrichedSimulationParams) => {
    return params.deposit - params.upfrontBuyerCosts;
  },

  getStartingAssets: (params: EnrichedSimulationParams) => {
    // TODO: Make upfront buyer cost be a surplus for the renter, rather than a loss for the buyer?
    //       The buyers initial assets should just be the deposit
    return { homeEquity: params.deposit - params.upfrontBuyerCosts };
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
    TaxOnSurplusInvestments,
  ],
};
