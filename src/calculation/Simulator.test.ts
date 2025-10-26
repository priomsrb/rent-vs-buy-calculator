import { describe, it, expect } from "vitest";
import { simulate } from "./Simulator";
import { BuyCase } from "./cases/BuyCase";
import { RentCase } from "./cases/RentCase";
import { getEnrichedSimulationParams } from "./EnrichedSimulationParams";

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
  investmentGrowthPercentage: 10,
  isFirstHomeBuyer: true,
  legalFees: 2000,
  loanTermYears: 30,
  maintenanceCostPercent: 1,
  maintenanceCostGrowthPercent: 3.5,
  movingCostType: "averaged",
  numYears: 30,
  pestAndBuildingInspection: 0,
  propertyGrowthPercentage: 5,
  propertyPrice: 1_000_000,
  rentIncreasePercentage: 3,
  rentMoveCleaning: 500,
  rentMoveConnections: 0,
  rentMoveOverlapWeeks: 2,
  rentMoveRemovalists: 1000,
  rentMoveSupplies: 0,
  rentMoveYearsBetween: 2,
  rentPerWeek: 1000,
  sellAtEnd: true,
  strataPerYear: 4000,
});

describe("Simulator", () => {
  it("should simulate for the correct number of years", () => {
    const numYears = 5;
    const results = simulate(testParams, [RentCase, BuyCase], numYears);
    expect(results).toMatchSnapshot();
  });
});
