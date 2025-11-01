import type { SimulationCase } from "./types";
import { RentInvestment } from "./gain-loss/RentInvestment";
import { RentMovingCost } from "./gain-loss/RentMovingCost";
import { RentPaid } from "./gain-loss/RentPaid";
import type { EnrichedSimulationParams } from "../EnrichedSimulationParams";
import { SurplusCashflow } from "./gain-loss/SurplusCashflow";
import { SurplusInvested } from "./gain-loss/SurplusInvested";
import {
  TaxOnDepositInvestment,
  TaxOnSurplusInvestments,
} from "@/calculation/cases/gain-loss/TaxOnInvestments.ts";

export const RentCase: SimulationCase = {
  key: "rent",
  label: "Rent",
  color: "green",

  getStartingAssets: (params: EnrichedSimulationParams) => {
    return { investedDeposit: params.initialInvestment };
  },

  gainLosses: [
    // Gains
    RentInvestment,
    SurplusCashflow,
    SurplusInvested,

    // Losses
    RentPaid,
    RentMovingCost,
    TaxOnDepositInvestment,
    TaxOnSurplusInvestments,
  ],
};
