import _ from "lodash";

import { ExtraSavingsInvestment } from "@/calculation/cases/gain-loss/ExtraSavingsInvestment.ts";
import { RentInvestment } from "@/calculation/cases/gain-loss/RentInvestment.ts";

import type { GainLoss } from "./types";

export const TaxOnDepositInvestment: GainLoss = {
  key: "taxOnDepositInvestment",
  label: "Tax on deposit investment",
  description: "Tax incurred upon selling the invested deposit",
  color: "rgba(173,117,32,1.0)",
  asset: "investedDeposit",

  calculateForYear: ({ year, params, previousBreakdowns }): number => {
    if (
      params.investmentSellOffOption === "doNotSell" ||
      year < params.numYears - 1
    ) {
      return 0;
    }

    return calculateCgtForInvestment(RentInvestment.key, previousBreakdowns);
  },
};

export const TaxOnExtraSavingsInvestments: GainLoss = {
  key: "taxOnExtraSavingsInvestments",
  label: "Tax on savings investments",
  description: "Tax incurred upon selling all extra savings investments",
  color: "rgba(173,154,32,1.0)",
  asset: "investedSavings",

  calculateForYear: ({ year, params, previousBreakdowns }): number => {
    if (
      params.investmentSellOffOption === "doNotSell" ||
      year < params.numYears - 1
    ) {
      return 0;
    }

    return calculateCgtForInvestment(
      ExtraSavingsInvestment.key,
      previousBreakdowns,
    );
  },
};

function calculateCgtForInvestment(
  investmentKey: string,
  previousBreakdowns: any, // TODO: Fix types
) {
  const investmentReturns = _(previousBreakdowns)
    .map(investmentKey)
    .map((x) => x ?? 0)
    .value();

  const numYears = investmentReturns.length;

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

function calculateTax(amount: number) {
  // TODO: Use actual bracket calculation
  return amount * 0.47;
}
