export function roundWithDecimals(num: number, decimals: number): number {
  const decimalFactor = Math.pow(10, decimals);
  return Math.round(num * decimalFactor) / decimalFactor;
}
