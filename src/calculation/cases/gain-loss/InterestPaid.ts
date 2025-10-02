import { GainLoss } from './types';

function amortizationPayment(
  principal: number,
  annualRatePercent: number,
  termYears: number,
): number {
  // n = total number of monthly payments
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
  // n = total number of monthly payments
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

// Don't use InterestPaid. Use MortgagePaid instead. MortgagePaid reflects the actual amount of money that needs to be paid (i.e. the loss). The gain is covered by PrincipalPaid.
export const InterestPaid: GainLoss = {
  key: 'interestPaid',
  label: 'Interest paid',
  color: 'rgba(241, 196, 15, 0.8)',

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
    const monthsPaidEnd = (year + 1) * 12;

    const totalMonths = loanTermYears * 12;
    if (monthsPaidStart >= totalMonths) {
      return 0;
    }

    const balanceStart = remainingBalanceAfterMonths(
      loanAmount,
      interestRate,
      loanTermYears,
      monthsPaidStart,
    );
    const balanceEnd = remainingBalanceAfterMonths(
      loanAmount,
      interestRate,
      loanTermYears,
      monthsPaidEnd,
    );

    const principalPaid = balanceStart - balanceEnd;

    const monthlyPayment = amortizationPayment(
      loanAmount,
      interestRate,
      loanTermYears,
    );
    const numberOfPayments = Math.min(12, totalMonths - monthsPaidStart);
    const totalPayments = monthlyPayment * numberOfPayments;

    const interestPaid = totalPayments - principalPaid;

    return -interestPaid;
  },
};
