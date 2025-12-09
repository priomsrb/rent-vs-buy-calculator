import { roundWithDecimals } from "@/utils/roundWithDecimals.ts";

export const InvestmentOptions = {
  asx100_last30Years: {
    label: "Australian stocks - last 30 years",
    returnPercent: 9.8,
    sourceUrl:
      "https://www.canstar.com.au/investor-hub/australian-share-performance-30-years/",
  },
  sp500_last30Years: {
    label: "US stocks - last 30 years",
    returnPercent: 10.3,
    sourceUrl:
      "https://tradethatswing.com/average-historical-stock-market-returns-for-sp-500-5-year-up-to-150-year-averages/",
  },
  global_last30Years: {
    label: "Global stocks - last 30 years",
    // Using values from Nov 1995 to Nov 2025. Equals 8.1%
    returnPercent: roundWithDecimals(
      (Math.pow(898_686 / 87_015, 1 / 30) - 1) * 100,
      1,
    ),
    sourceUrl:
      "https://curvo.eu/backtest/en/market-index/msci-world?currency=usd",
  },
  sp500_last100Years: {
    label: "US stocks - last 100 years",
    returnPercent: 10.4,
    sourceUrl:
      "https://tradethatswing.com/average-historical-stock-market-returns-for-sp-500-5-year-up-to-150-year-averages/",
  },
  global_last100Years: {
    label: "Global stocks - last 100 years",
    returnPercent: 7.3,
    sourceUrl:
      "https://www.ch.vanguard/content/dam/intl/europe/documents/en/return-book-eu-en.pdf#page=34",
  },
  custom: {
    label: "Custom",
    // Values below are unused
    returnPercent: 0,
    sourceUrl: "",
  },
};

export type InvestmentOptionKey = keyof typeof InvestmentOptions;
