import { BuyMovingCost } from "./gain-loss/BuyMovingCost";
import { CouncilRatesPaid } from "./gain-loss/CouncilRatesPaid";
import { ExtraSavings } from "./gain-loss/ExtraSavings";
import { ExtraSavingsInvestment } from "./gain-loss/ExtraSavingsInvestment";
import { InitialDeposit } from "./gain-loss/InitialDeposit.ts";
import { InsurancePaid } from "./gain-loss/InsurancePaid";
import { MaintenanceCost } from "./gain-loss/MaintenanceCost";
import { MortgagePaid } from "./gain-loss/MortgagePaid";
import { PrincipalPaid } from "./gain-loss/PrincipalPaid";
import { PropertyAppreciation } from "./gain-loss/PropertyAppreciation";
import { PurchaseCost } from "./gain-loss/PurchaseCost.ts";
import { StrataPaid } from "./gain-loss/StrataPaid";
import { TaxOnExtraSavingsInvestments } from "./gain-loss/TaxOnInvestments.ts";
import type { SimulationCase } from "./types";

export const BuyCase: SimulationCase = {
  key: "buy",
  label: "Buy",
  color: "blue",

  gainLosses: [
    // Gains
    PropertyAppreciation,
    PrincipalPaid,
    ExtraSavings,
    ExtraSavingsInvestment,

    // Losses
    InitialDeposit,
    PurchaseCost,
    MortgagePaid,
    MaintenanceCost,
    BuyMovingCost,
    CouncilRatesPaid,
    StrataPaid,
    InsurancePaid,
    TaxOnExtraSavingsInvestments,
  ],
};
