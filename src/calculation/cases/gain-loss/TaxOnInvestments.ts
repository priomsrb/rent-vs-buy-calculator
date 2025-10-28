import _ from "lodash";
import type { GainLoss } from "./types";
import { RentInvestment } from "@/calculation/cases/gain-loss/RentInvestment.ts";
import { SurplusInvested } from "@/calculation/cases/gain-loss/SurplusInvested.ts";

export const TaxOnInvestments: GainLoss = {
  key: "taxOnInvestments",
  label: "Tax on investments",
  description: "Tax incurred upon selling all investments",
  color: "rgba(173,117,32,0.8)",

  calculateForYear: ({ year, params, previousBreakdowns }): number => {
    const { numYears } = params;
    if (year < numYears - 1) {
      return 0;
    }

    function calculateCgtForInvestment(investmentKey: string) {
      const investmentReturns = _(previousBreakdowns)
        .map(investmentKey)
        .map((x) => x ?? 0)
        .value();

      // Full tax is applied when selling investments held for <12 months
      const nonDiscountedCapitalGains = investmentReturns[numYears - 1];

      // Half tax is applied when selling investments held for 12+ months
      const discountedCapitalGains =
        0.5 *
        _(investmentReturns)
          .slice(0, numYears - 2)
          .sum();

      const totalCapitalGainsTax =
        -1 * calculateTax(nonDiscountedCapitalGains + discountedCapitalGains);

      return totalCapitalGainsTax;
    }

    return (
      calculateCgtForInvestment(RentInvestment.key) +
      calculateCgtForInvestment(SurplusInvested.key)
    );
  },
};

function calculateTax(amount: number) {
  // TODO: Use actual bracket calculation
  return amount * 0.47;
}
