export function compactNumber(amount: number) {
  if (amount < 1000) {
    return Math.round(amount);
  } else if (amount < 1_000_000) {
    return `${Math.round((amount / 1000) * 10) / 10}k`;
  } else if (amount < 1_000_000_000) {
    return `${Math.round((amount / 1_000_000) * 10) / 10}m`;
  } else {
    return `${Math.round((amount / 1_000_000_000) * 10) / 10}b`;
  }
}
