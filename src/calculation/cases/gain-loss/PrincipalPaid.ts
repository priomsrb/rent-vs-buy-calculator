import type { GainLoss } from "./types";

// Re-implementing these from calc.ts to keep the module self-contained.
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

function remainingBalanceAfterMonths(
  principal: number,
  annualRatePercent: number,
  termYears: number,
  monthsPaid: number,
): number {
  // n = total number of payments
  const n = Math.round(termYears * 12);
  // r = monthly interest rate
  const r = Number(annualRatePercent) / 100 / 12;
  if (r === 0) return Math.max(0, principal * (1 - monthsPaid / n));
  const payment = amortizationPayment(principal, annualRatePercent, termYears);
  const balance =
    principal * Math.pow(1 + r, monthsPaid) -
    payment * ((Math.pow(1 + r, monthsPaid) - 1) / r);
  return Math.max(0, balance);
}

export const PrincipalPaid: GainLoss = {
  key: "principalPaid",
  label: "Principal paid",
  color: "rgba(46, 204, 113, 0.8)",
  asset: "homeEquity",

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

    const monthsPaidEnd = (year + 1) * 12;

    const balanceStart = remainingBalanceAfterMonths(
      loanAmount,
      interestRatePercent,
      loanTermYears,
      monthsPaidStart,
    );
    const balanceEnd = remainingBalanceAfterMonths(
      loanAmount,
      interestRatePercent,
      loanTermYears,
      monthsPaidEnd,
    );

    const principalPaid = balanceStart - balanceEnd;

    return principalPaid; // This is a gain, so it's positive
  },
};
