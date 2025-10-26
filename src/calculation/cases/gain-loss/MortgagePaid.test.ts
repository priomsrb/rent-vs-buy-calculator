import { describe, expect, it } from "vitest";
import { MortgagePaid } from "./MortgagePaid";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";

describe("MortgagePaid", () => {
  const params = {
    ...emptySimulationParams,
    propertyPrice: 1000000,
    depositPercent: 20,
    interestRatePercent: 3, // percent
    loanTermYears: 30,
  };

  function calculateForYear(year: number) {
    return MortgagePaid.calculateForYear({
      params,
      year,
      previousBreakdowns: [],
    });
  }

  // Expected monthly payment taken from here: https://www.calculator.net/amortization-calculator.html?cloanamount=800%2C000&cloanterm=30&cloantermmonth=0&cinterestrate=3&cstartmonth=9&cstartyear=2025&cexma=0&cexmsm=9&cexmsy=2025&cexya=0&cexysm=9&cexysy=2025&cexoa=0&cexosm=9&cexosy=2025&caot=0&xa1=0&xm1=9&xy1=2025&xa2=0&xm2=9&xy2=2025&xa3=0&xm3=9&xy3=2025&xa4=0&xm4=9&xy4=2025&xa5=0&xm5=9&xy5=2025&xa6=0&xm6=9&xy6=2025&xa7=0&xm7=9&xy7=2025&xa8=0&xm8=9&xy8=2025&xa9=0&xm9=9&xy9=2025&xa10=0&xm10=9&xy10=2025&printit=0&x=Calculate#calresult
  it("calculates total mortgage paid correctly for a full year", () => {
    const monthlyPayment = 3372.83;
    const expectedCost = -(monthlyPayment * 12);

    expect(calculateForYear(0)).toBeCloseTo(expectedCost, 0);
    expect(calculateForYear(14)).toBeCloseTo(expectedCost, 0);
    expect(calculateForYear(29)).toBeCloseTo(expectedCost, 0);
  });

  it("returns 0 if loan is already paid off", () => {
    expect(calculateForYear(30)).toBe(0);
    expect(calculateForYear(40)).toBe(0);
  });
});
