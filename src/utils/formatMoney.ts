export function formatMoney(number: number, decimals: number = 0) {
  const aud = Intl.NumberFormat("en-AU", {
    currency: "AUD",
    maximumFractionDigits: decimals,
  });
  return `$${aud.format(number)}`;
}
