import { ExtraSavings } from "./gain-loss/ExtraSavings";
import { ExtraSavingsInvestment } from "./gain-loss/ExtraSavingsInvestment";
import { RentMovingCost } from "./gain-loss/RentMovingCost";
import { RentPaid } from "./gain-loss/RentPaid";
import { TaxOnExtraSavingsInvestments } from "./gain-loss/TaxOnInvestments.ts";
import type { SimulationCase } from "./types";

export const RentCase: SimulationCase = {
  key: "rent",
  label: "Rent",
  color: "green",

  gainLosses: [
    // Gains
    ExtraSavings,
    ExtraSavingsInvestment,

    // Losses
    RentPaid,
    RentMovingCost,
    TaxOnExtraSavingsInvestments,
  ],
};
