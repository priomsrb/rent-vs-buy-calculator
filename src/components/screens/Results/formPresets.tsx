import type { SimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import { PropertyGrowthRateOptions } from "@/utils/propertyGrowthRateOptions.ts";
import { InvestmentOptions } from "@/utils/investmentOptions.ts";

const basePreset: Partial<SimulationParams> = {
  propertyPrice: 1000000,
  depositPercent: 20,
  interestRatePercent: 6,
  loanTermYears: 30,
  rentPerWeek: 800,
  rentIncreasePercent: 3.5,
  maintenanceCostGrowthPercent: 3.5,
  councilRatesPerYear: 3000,
  insurancePerYear: 1500,
  legalFees: 2500,
  pestAndBuildingInspection: 500,
  agentFeePercent: 2.0,
  buyMoveOtherCosts: 0,
  numYears: 30,
  sellAtEnd: true,
  includeStampDuty: true,
  includeLMI: true,
  includeLegalFees: true,
  includeCouncil: true,
  includeStrata: true,
  includeMaintenance: true,
  includeInsurance: true,
  includeAgentFee: true,
  includeSellingFixed: true,
  includeInvestSurplus: true,
  includeInvestReturns: true,
  includePropertyGrowth: true,
  includeRentGrowth: true,
  includeRenterInitialCapital: true,
  includeMovingCosts: true,
  isFirstHomeBuyer: true,
  // moving
  rentMoveYearsBetween: 3,
  rentMoveRemovalists: 1500,
  rentMoveCleaning: 300,
  rentMoveConnections: 200,
  rentMoveSupplies: 150,
  rentMoveOverlapWeeks: 1,
  buyMoveYearsBetween: 7,
  buyMoveRemovalists: 2000,
  buyMoveConnections: 300,
  buyMoveSupplies: 200,
  buyMoveMinorRepairs: 800,
  movingCostType: "averaged",
  investmentReturnOption: "sp500_last30Years",
  // TODO: Avoid duplication of return option. We should instead only use investmentGrowthPercent when the option is custom. And otherwise just look up the amount during enrichment
  investmentGrowthPercent: InvestmentOptions["sp500_last30Years"].returnPercent,
  investmentSellOffOption: "doNotSell",
};

export const formPresets = {
  apartment: {
    ...basePreset,
    propertyType: "unit",
    maintenanceCostPercent: 0.2, // Most maintenance is covered by strata
    strataPerYear: 4000,
    propertyGrowthRateOption: "sydney_units_last30Years",
    propertyGrowthPercent:
      PropertyGrowthRateOptions["sydney_units_last30Years"].returnPercent,
    // TODO-research: Update values below according to property type
    rentMoveYearsBetween: 3,
    buyMoveYearsBetween: 7,
    // TODO-research: Consider whether insurance, council rates etc should scale with property price (and be different for unit vs house)
  },
  house: {
    ...basePreset,
    propertyType: "house",
    strataPerYear: 0,
    maintenanceCostPercent: 1.5,
    propertyGrowthRateOption: "sydney_houses_last30Years",
    propertyGrowthPercent:
      PropertyGrowthRateOptions["sydney_houses_last30Years"].returnPercent,
    // TODO-research: Update values below according to property type
    rentMoveYearsBetween: 3,
    buyMoveYearsBetween: 7,
  },
};
