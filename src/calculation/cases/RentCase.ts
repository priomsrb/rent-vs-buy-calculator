import type { EnrichedSimulationParams } from "../EnrichedSimulationParams";
import { ExtraSavings } from "./gain-loss/ExtraSavings";
import { ExtraSavingsInvestment } from "./gain-loss/ExtraSavingsInvestment";
import { RentInvestment } from "./gain-loss/RentInvestment";
import { RentMovingCost } from "./gain-loss/RentMovingCost";
import { RentPaid } from "./gain-loss/RentPaid";
import {
  TaxOnDepositInvestment,
  TaxOnExtraSavingsInvestments,
} from "./gain-loss/TaxOnInvestments.ts";
import type { SimulationCase } from "./types";

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
    ExtraSavings,
    ExtraSavingsInvestment,

    // Losses
    RentPaid,
    RentMovingCost,
    TaxOnDepositInvestment,
    TaxOnExtraSavingsInvestments,
  ],
};
