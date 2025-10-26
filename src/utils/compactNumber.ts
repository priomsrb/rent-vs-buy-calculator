import { roundWithDecimals } from "@/utils/roundWithDecimals.ts";

export function compactNumber(amount: number, decimals: number = 0): string {
  const absAmount = Math.abs(amount);
  if (absAmount <= 1000 - Math.pow(10, -decimals)) {
    return `${roundWithDecimals(amount, decimals)}`;
  } else if (absAmount <= 1_000_000 - Math.pow(10, 3 - decimals)) {
    return `${roundWithDecimals(amount / 1000, decimals)}k`;
  } else if (absAmount <= 1_000_000_000 - Math.pow(10, 6 - decimals)) {
    return `${roundWithDecimals(amount / 1_000_000, decimals)}m`;
  } else {
    return `${roundWithDecimals(amount / 1_000_000_000, decimals)}b`;
  }
}
