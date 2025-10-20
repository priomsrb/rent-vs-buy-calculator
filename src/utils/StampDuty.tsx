export function nswStampDuty(propertyPrice: number): number {
  const v = Math.max(0, Number(propertyPrice));

  // Formula adapted from: https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty
  if (v <= 17_000) return v * 0.0125;
  if (v <= 37_000) return 212 + (v - 17_000) * 0.015;
  if (v <= 99_000) return 512 + (v - 37_000) * 0.0175;
  if (v < 372_000) return 1597 + (v - 99_000) * 0.035;
  if (v < 1_240_000) return 11_152 + (v - 372_000) * 0.045;
  return 50_212 + (v - 1_240_000) * 0.055;
}

// Stamp duty for first home buyers
export function nswStampDutyFHB(
  propertyPrice: number,
  opts: { fullExemptMax?: number; concessionMax?: number } = {},
): number {
  const v = Math.max(0, Number(propertyPrice));
  const fullExemptMax = opts.fullExemptMax ?? 800_000;
  const concessionMax = opts.concessionMax ?? 1_000_000;
  if (v <= fullExemptMax) return 0;
  if (v >= concessionMax) return nswStampDuty(v);
  const standardAtConcessionMax = nswStampDuty(concessionMax);
  const t = (v - fullExemptMax) / (concessionMax - fullExemptMax);
  return standardAtConcessionMax * t;
}
