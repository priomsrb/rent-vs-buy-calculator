import { describe, it, expect } from "vitest";
import { PrincipalPaid } from "./PrincipalPaid";

describe("PrincipalPaid", () => {
  const params = {
    propertyPrice: 1000000,
    depositPercent: 20,
    interestRatePercent: 3, // percentage
    loanTermYears: 30,
  } as any;

  // Expected values taken from here: https://www.calculator.net/amortization-calculator.html?cloanamount=800%2C000&cloanterm=30&cloantermmonth=0&cinterestrate=3&cstartmonth=9&cstartyear=2025&cexma=0&cexmsm=9&cexmsy=2025&cexya=0&cexysm=9&cexysy=2025&cexoa=0&cexosm=9&cexosy=2025&caot=0&xa1=0&xm1=9&xy1=2025&xa2=0&xm2=9&xy2=2025&xa3=0&xm3=9&xy3=2025&xa4=0&xm4=9&xy4=2025&xa5=0&xm5=9&xy5=2025&xa6=0&xm6=9&xy6=2025&xa7=0&xm7=9&xy7=2025&xa8=0&xm8=9&xy8=2025&xa9=0&xm9=9&xy9=2025&xa10=0&xm10=9&xy10=2025&printit=0&x=Calculate#calresult
  it("calculates principal paid correctly for a given year", () => {
    // Year 0
    let gain = PrincipalPaid.calculateForYear({ params, year: 0 });
    let expectedGain = 16702.4;
    expect(gain).toBeCloseTo(expectedGain, 2);

    // Year 1
    gain = PrincipalPaid.calculateForYear({ params, year: 1 });
    expectedGain = 17210.42;
    expect(gain).toBeCloseTo(expectedGain, 2);

    // Last year of loan (Year 29)
    gain = PrincipalPaid.calculateForYear({ params, year: 29 });
    expectedGain = 39823.89;
    expect(gain).toBeCloseTo(expectedGain, 2);
  });

  it("returns 0 if loan is already paid off", () => {
    const gain = PrincipalPaid.calculateForYear({ params, year: 30 });
    expect(gain).toBe(0);
  });
});
