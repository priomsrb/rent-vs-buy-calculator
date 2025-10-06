import type { GainLoss } from "./types";

function amortizationPayment(
  principal: number,
  annualRatePercent: number,
  termYears: number,
): number {
  // n = total number of payments
  const n = Math.round(termYears * 12);
  // r = monthly interest rate
  const r = Number(annualRatePercent) / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export const MortgagePaid: GainLoss = {
  key: "mortgagePaid",
  label: "Mortgage",
  color: "rgba(231, 76, 60, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const { propertyPrice, depositPercent, interestRate, loanTermYears } =
      params;

    if (!propertyPrice || !interestRate || !loanTermYears) {
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

    const monthlyPayment = amortizationPayment(
      loanAmount,
      interestRate,
      loanTermYears,
    );

    const numberOfPayments = Math.min(12, totalMonths - monthsPaidStart);
    const totalYearlyPayment = monthlyPayment * numberOfPayments;

    return -totalYearlyPayment;
  },
};
