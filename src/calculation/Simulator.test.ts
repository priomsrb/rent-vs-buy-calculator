import { describe, expect, it } from "vitest";

import { getEnrichedSimulationParams } from "./EnrichedSimulationParams";
import { simulate } from "./Simulator";
import { BuyCase } from "./cases/BuyCase";
import { RentCase } from "./cases/RentCase";

const testParams = getEnrichedSimulationParams({
  agentFeePercent: 2,
  buyMoveConnections: 100,
  buyMoveMinorRepairs: 500,
  buyMoveOtherCosts: 1000,
  buyMoveRemovalists: 1000,
  buyMoveSupplies: 100,
  buyMoveYearsBetween: 5,
  councilRatesPerYear: 1500,
  depositPercent: 20,
  includeAgentFee: true,
  includeCouncil: true,
  includeInsurance: true,
  includeInvestReturns: true,
  includeInvestSurplus: true,
  includeLMI: true,
  includeLegalFees: true,
  includeMaintenance: true,
  includeMovingCosts: true,
  includePropertyGrowth: true,
  includeRentGrowth: true,
  includeRenterInitialCapital: true,
  includeSellingFixed: true,
  includeStampDuty: true,
  includeStrata: true,
  insurancePerYear: 2000,
  interestRatePercent: 3,
  investmentGrowthPercent: 10,
  investmentReturnOption: "sp500_last30Years",
  investmentSellOffOption: "doNotSell",
  isFirstHomeBuyer: true,
  legalFees: 2000,
  loanTermYears: 30,
  maintenanceCostGrowthPercent: 3.5,
  maintenanceCostPercent: 1,
  mortgageStressOption: "comfortable",
  movingCostType: "averaged",
  numYears: 5,
  pestAndBuildingInspection: 0,
  propertyGrowthPercent: 5,
  propertyGrowthRateOption: "sydney_houses_last30Years",
  propertyPrice: 1_000_000,
  rentIncreasePercent: 3,
  rentMoveCleaning: 500,
  rentMoveConnections: 0,
  rentMoveOverlapWeeks: 2,
  rentMoveRemovalists: 1000,
  rentMoveSupplies: 0,
  rentMoveYearsBetween: 2,
  rentPerWeek: 1000,
  sellAtEnd: true,
  strataPerYear: 4000,
  numIncomeEarners: "single",
});

describe("Simulator", () => {
  it("should simulate for the correct number of years", () => {
    const results = simulate(testParams, [RentCase, BuyCase]);
    expect(results).toMatchSnapshot();
  });
});
