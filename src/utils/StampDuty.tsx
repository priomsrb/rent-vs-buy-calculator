import _ from "lodash";

const brackets2019 = [14_000, 30_000, 80_000, 300_000, 1_000_000];
const brackets2025 = [17_000, 37_000, 99_000, 372_000, 1_240_000];

export function nswStampDuty(propertyPrice: number): number {
  return getStampDutyForBrackets(propertyPrice, brackets2025);
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

function getStampDutyForBrackets(value: number, brackets: number[]) {
  // Formula adapted from: https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty
  let fixedAmounts = [];
  fixedAmounts[0] = brackets[0] * 0.0125;
  fixedAmounts[1] = fixedAmounts[0] + (brackets[1] - brackets[0]) * 0.015;
  fixedAmounts[2] = fixedAmounts[1] + (brackets[2] - brackets[1]) * 0.0175;
  fixedAmounts[3] = fixedAmounts[2] + (brackets[3] - brackets[2]) * 0.035;
  fixedAmounts[4] = fixedAmounts[3] + (brackets[4] - brackets[3]) * 0.045;
  fixedAmounts = fixedAmounts.map((x) => Math.floor(x));

  const stampDuty = (() => {
    if (value <= brackets[0]) return value * 0.0125;
    if (value <= brackets[1])
      return fixedAmounts[0] + (value - brackets[0]) * 0.015;
    if (value <= brackets[2])
      return fixedAmounts[1] + (value - brackets[1]) * 0.0175;
    if (value <= brackets[3])
      return fixedAmounts[2] + (value - brackets[2]) * 0.035;
    if (value <= brackets[4])
      return fixedAmounts[3] + (value - brackets[3]) * 0.045;

    return fixedAmounts[4] + (value - brackets[4]) * 0.055;
  })();

  return Math.round(stampDuty);
}

// TODO: Remove if this stays unused
export function nswStampDutyForYear(
  propertyPrice: number,
  year: number,
): number {
  const bracketGrowthPerYear = _(brackets2019)
    .zip(brackets2025)
    .map(([oldValue, newValue]) =>
      Math.pow(newValue! / oldValue!, 1 / (2025 - 2019)),
    )
    .value();

  const bracketsForYear = _.zip(brackets2019, bracketGrowthPerYear).map(
    ([bracket2019, bracketGrowthForYear]) =>
      bracket2019! * Math.pow(bracketGrowthForYear!, year - 2019),
  );

  return getStampDutyForBrackets(propertyPrice, bracketsForYear);
}
