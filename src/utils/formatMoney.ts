import { compactNumber } from "./compactNumber";

// Returns money with currency symbol and commas. Uses no decimals by default.
export function formatMoney(number: number, decimals: number = 0) {
  const aud = Intl.NumberFormat("en-AU", {
    currency: "AUD",
    maximumFractionDigits: decimals,
  });
  const sign = number < 0 ? "-" : "";
  return `${sign}$${aud.format(Math.abs(number))}`;
}

export function compactMoney(number: number, decimals: number = 0) {
  const sign = number < 0 ? "-" : "";
  return `${sign}$${compactNumber(Math.abs(number), decimals)}`;
}
