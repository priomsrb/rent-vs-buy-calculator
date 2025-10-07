export function compactNumber(amount: number, decimals: number = 0): string {
  const absAmount = Math.abs(amount);
  if (absAmount < 1000) {
    return `${roundWithDecimals(amount, decimals)}`;
  } else if (absAmount < 1_000_000) {
    return `${roundWithDecimals(amount / 1000, decimals)}k`;
  } else if (absAmount < 1_000_000_000) {
    return `${roundWithDecimals(amount / 1_000_000, decimals)}m`;
  } else {
    return `${roundWithDecimals(amount / 1_000_000_000, decimals)}b`;
  }
}

function roundWithDecimals(num: number, decimals: number): number {
  const decimalFactor = Math.pow(10, decimals);
  const round = num > 0 ? Math.floor : Math.ceil;
  return round(num * decimalFactor) / decimalFactor;
}
