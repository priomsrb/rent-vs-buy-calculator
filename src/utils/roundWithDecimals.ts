export function roundWithDecimals(num: number, decimals: number): number {
  const decimalFactor = Math.pow(10, decimals);
  // const round = num > 0 ? Math.floor : Math.ceil;
  const round = Math.round;
  return round(num * decimalFactor) / decimalFactor;
}
