import type { GainLoss } from "./types";
import { amortizationPaymentPerMonth } from "@/utils/amortizationPaymentPerMonth";

export const MortgagePaid: GainLoss = {
  key: "mortgagePaid",
  label: "Mortgage",
  color: "rgba(231, 76, 60, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const {
      propertyPrice,
      depositPercent,
      interestRatePercent,
      loanTermYears,
    } = params;

    if (!propertyPrice || !interestRatePercent || !loanTermYears) {
      return 0;
    }

    const loanAmount = propertyPrice * (1 - (depositPercent || 0) / 100);
    if (loanAmount <= 0) {
      return 0;
    }

    const monthsPaidStart = year * 12;
    const totalMonths = loanTermYears * 12;

    if (monthsPaidStart >= totalMonths) {
      return 0;
    }

    const monthlyPayment = amortizationPaymentPerMonth(
      loanAmount,
      interestRatePercent,
      loanTermYears,
    );

    const numberOfPayments = Math.min(12, totalMonths - monthsPaidStart);
    const totalYearlyPayment = monthlyPayment * numberOfPayments;

    return -totalYearlyPayment;
  },
};
