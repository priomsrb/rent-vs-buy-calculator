import { describe, expect, it } from "vitest";

import { getTaxForIncome } from "@/utils/IncomeTax";

import {
  type SimulationParams,
  getEnrichedSimulationParams,
} from "./EnrichedSimulationParams";

describe("getEnrichedSimulationParams", () => {
  const baseParams: SimulationParams = {
    propertyPrice: 1000000,
    depositPercent: 20,
    interestRatePercent: 5,
    loanTermYears: 30,
    rentPerWeek: 500,
    rentIncreasePercent: 3,
    councilRatesPerYear: 2000,
    strataPerYear: 3000,
    maintenanceCostPercent: 1,
    maintenanceCostGrowthPercent: 3,
    insurancePerYear: 1000,
    legalFees: 2000,
    pestAndBuildingInspection: 500,
    agentFeePercent: 2,
    buyMoveOtherCosts: 0,
    investmentGrowthPercent: 7,
    numYears: 30,
    sellAtEnd: true,
    isFirstHomeBuyer: false,
    rentMoveYearsBetween: 2,
    rentMoveRemovalists: 500,
    rentMoveCleaning: 300,
    rentMoveConnections: 100,
    rentMoveSupplies: 50,
    rentMoveOverlapWeeks: 1,
    buyMoveYearsBetween: 10,
    buyMoveRemovalists: 1000,
    buyMoveConnections: 200,
    buyMoveSupplies: 100,
    buyMoveMinorRepairs: 200,
    movingCostType: "averaged",
    propertyGrowthRateOption: "sydney_houses_last30Years",
    investmentReturnOption: "sp500_last30Years",
    investmentSellOffOption: "doNotSell",
    mortgageStressOption: "comfortable",
    numIncomeEarners: "single",
    propertyGrowthPercent: 5,
  };

  it("calculates required pre-tax income for single earner", () => {
    const params = getEnrichedSimulationParams({
      ...baseParams,
      numIncomeEarners: "single",
    });

    const postTaxIncome = params.requiredAnnualPostTaxIncome;
    const preTaxIncome = params.requiredAnnualPreTaxIncome;

    // Verify pre-tax income results in roughly the correct post-tax income
    // Note: there's a small margin of error due to rounding/search in getPreTaxIncomeFromPostTax
    const estimatedTax = getTaxForIncome(preTaxIncome);
    expect(preTaxIncome - estimatedTax).toBeCloseTo(postTaxIncome, -1);
  });

  it("calculates required pre-tax income for dual earners", () => {
    const params = getEnrichedSimulationParams({
      ...baseParams,
      numIncomeEarners: "dual",
    });

    const totalPostTaxIncomeNeeded = params.requiredAnnualPostTaxIncome;
    // For dual income, we assume equal split
    const postTaxPerPerson = totalPostTaxIncomeNeeded / 2;

    // The pre-tax income returned is the TOTAL combined pre-tax income
    const returnedTotalPreTax = params.requiredAnnualPreTaxIncome;
    const preTaxPerPerson = returnedTotalPreTax / 2;

    // Verify per-person tax calculation
    const estimatedTaxPerPerson = getTaxForIncome(preTaxPerPerson);
    expect(preTaxPerPerson - estimatedTaxPerPerson).toBeCloseTo(
      postTaxPerPerson,
      -1,
    );

    // Logic check: With progressive tax, earning same total amount as two people
    // should result in LESS total tax paid than one person, meaning
    // required PRE-TAX income should be LOWER for dual income than single income
    // for the same required POST-tax income.
    const singleParams = getEnrichedSimulationParams({
      ...baseParams,
      numIncomeEarners: "single",
    });

    expect(singleParams.requiredAnnualPostTaxIncome).toBe(
      totalPostTaxIncomeNeeded,
    );
    expect(returnedTotalPreTax).toBeLessThan(
      singleParams.requiredAnnualPreTaxIncome,
    );
  });
});
