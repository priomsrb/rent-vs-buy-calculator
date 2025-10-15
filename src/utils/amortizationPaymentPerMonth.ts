export function amortizationPaymentPerMonth(
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
