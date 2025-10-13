export function formatMoney(number: number) {
  const aud = Intl.NumberFormat("en-AU", {
    currency: "AUD",
  });
  return `$${aud.format(number)}`;
}
