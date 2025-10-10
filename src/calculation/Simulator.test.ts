import { describe, it, expect } from "vitest";
import { simulate } from "./Simulator";
import { BuyCase } from "./cases/BuyCase";
import { RentCase } from "./cases/RentCase";
import { getEnrichedSimulationParams } from "./EnrichedSimulationParams";

const testParams = getEnrichedSimulationParams({
  agentFeePercent: 2,
  buyMoveConnections: 100,
  buyMoveMinorRepairs: 500,
  buyMoveRemovalists: 1000,
  buyMoveSupplies: 100,
  buyMoveYearsBetween: 5,
  councilRatesPerYear: 1500,
  depositPercent: 20,
  numYears: 30,
  includeCouncil: true,
  includeInsurance: true,
  includeInvestReturns: true,
  includeInvestSurplus: true,
  includeLegalFees: true,
  includeMaintenance: true,
  includeMovingCosts: true,
  includePropertyGrowth: true,
  includeRenterInitialCapital: true,
  includeStampDuty: true,
  includeStrata: true,
  insurancePerYear: 2000,
  interestRatePercent: 3, // percentage
  investmentGrowthPercentage: 10, // 10%
  legalFees: 2000,
  loanTermYears: 30,
  maintenanceCostPercent: 1, // 1%
  movingCostType: "averaged",
  propertyGrowth: 5,
  propertyPrice: 1_000_000,
  rentIncreasePercentage: 3, // percentage
  rentMoveCleaning: 500,
  rentMoveOverlapWeeks: 2,
  rentMoveRemovalists: 1000,
  rentMoveYearsBetween: 2,
  rentPerWeek: 1000,
  sellAtEnd: true,
  buyMoveOtherCosts: 0,
  strataPerYear: 4000,
});

describe("Simulator", () => {
  it("should simulate for the correct number of years", () => {
    const numYears = 5;
    const results = simulate(testParams, [RentCase, BuyCase], numYears);
    expect(results).toMatchSnapshot();
  });
});
