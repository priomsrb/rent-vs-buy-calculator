export const MEDICARE_LEVY_RATE = 0.02;

export function getTaxForIncome(preTaxIncome: number): number {
  let taxPayable = 0;
  // Medicare levy
  // Note: This is a simplification. Low income earners pay less medicare levy.
  // For the purpose of "buying a house", we assume income is high enough.
  const medicareLevy = preTaxIncome * MEDICARE_LEVY_RATE;

  // 2024-2025 Resident Tax Rates
  // https://www.ato.gov.au/rates/individual-income-tax-rates/
  if (preTaxIncome <= 18200) {
    taxPayable = 0;
  } else if (preTaxIncome <= 45000) {
    taxPayable = (preTaxIncome - 18200) * 0.16;
  } else if (preTaxIncome <= 135000) {
    taxPayable = 4288 + (preTaxIncome - 45000) * 0.3;
  } else if (preTaxIncome <= 190000) {
    taxPayable = 31288 + (preTaxIncome - 135000) * 0.37;
  } else {
    taxPayable = 51638 + (preTaxIncome - 190000) * 0.45;
  }

  return taxPayable + medicareLevy;
}

// Iterative approach to find pre-tax income since the function is not easily invertible due to discrete brackets and medicare considerations
export function getPreTaxIncomeFromPostTax(postTaxIncome: number): number {
  // Initial guess: assume flat 30% tax as starting point
  let low = postTaxIncome;
  let high = postTaxIncome * 2;

  // Binary search
  for (let i = 0; i < 50; i++) {
    // 50 iterations is plenty for precision
    const mid = (low + high) / 2;
    const estimatedPostTax = mid - getTaxForIncome(mid);

    if (Math.abs(estimatedPostTax - postTaxIncome) < 1) {
      return Math.round(mid);
    }

    if (estimatedPostTax < postTaxIncome) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.round((low + high) / 2);
}
