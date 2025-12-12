import { roundWithDecimals } from "@/utils/roundWithDecimals.ts";

function getAnnualGrowthPercent(totalGrowth: number, numYears: number) {
  return roundWithDecimals(
    (Math.pow(totalGrowth / 100 + 1, 1 / numYears) - 1) * 100,
    1,
  );
}

export const PropertyGrowthRateOptions = {
  sydney_houses_last30Years: {
    label: "Sydney houses - last 30 years",
    group: "Houses",
    returnPercent: getAnnualGrowthPercent(507.0, 30), // 6.2%
    sourceUrl:
      "https://web.archive.org/web/20221018140637/https://www.corelogic.com.au/__data/assets/pdf_file/0015/12237/220829_CoreLogic_Pulse_30years_Finalv2.pdf#page=3",
  },
  australian_capital_houses_last30Years: {
    label: "Australian capital houses - last 30 years",
    group: "Houses",
    returnPercent: getAnnualGrowthPercent(453.1, 30), // 5.87%
    sourceUrl:
      "https://web.archive.org/web/20221018140637/https://www.corelogic.com.au/__data/assets/pdf_file/0015/12237/220829_CoreLogic_Pulse_30years_Finalv2.pdf#page=2",
  },
  australian_regional_houses_last30Years: {
    label: "Australian regional houses - last 30 years",
    group: "Houses",
    returnPercent: getAnnualGrowthPercent(313.9, 30), // 5.0%
    sourceUrl:
      "https://web.archive.org/web/20221018140637/https://www.corelogic.com.au/__data/assets/pdf_file/0015/12237/220829_CoreLogic_Pulse_30years_Finalv2.pdf#page=2",
  },
  sydney_units_last30Years: {
    label: "Sydney units - last 30 years",
    group: "Apartments",
    // Comes to about 6.2%
    returnPercent: getAnnualGrowthPercent(340.1, 30), // 5.1%
    sourceUrl:
      "https://web.archive.org/web/20221018140637/https://www.corelogic.com.au/__data/assets/pdf_file/0015/12237/220829_CoreLogic_Pulse_30years_Finalv2.pdf#page=3",
  },
  australian_capital_units_last30Years: {
    label: "Australian capital units - last 30 years",
    group: "Apartments",
    returnPercent: getAnnualGrowthPercent(306.7, 30), // 4.8%
    sourceUrl:
      "https://web.archive.org/web/20221018140637/https://www.corelogic.com.au/__data/assets/pdf_file/0015/12237/220829_CoreLogic_Pulse_30years_Finalv2.pdf#page=2",
  },
  australian_regional_units_last30Years: {
    label: "Australian regional units - last 30 years",
    group: "Apartments",
    returnPercent: getAnnualGrowthPercent(212.7, 30), // 3.9%
    sourceUrl:
      "https://web.archive.org/web/20221018140637/https://www.corelogic.com.au/__data/assets/pdf_file/0015/12237/220829_CoreLogic_Pulse_30years_Finalv2.pdf#page=2",
  },
  // TODO: Add these values. Also separate between houses and units
  // global_houses_last30Years: {
  //   label: "Global houses - last 30 years",
  //   group: "Houses",
  //   returnPercent: 6,
  //   sourceUrl: "https://google.com",
  // },
  // global_units_last30Years: {
  //   label: "Global units - last 30 years",
  //   group: "Apartments",
  //   returnPercent: 6,
  //   sourceUrl: "https://google.com",
  // },
  // australia_last100Years: {
  //   label: "Australia - last 100 years",
  //   returnPercent: 6,
  //   sourceUrl: "https://google.com",
  // },
  // global_last100Years: {
  //   label: "Global - last 100 years",
  //   returnPercent: 6,
  //   sourceUrl: "https://google.com",
  // },
  custom: {
    label: "Custom",
    group: "Custom",
    // Values below are unused
    returnPercent: 0,
    sourceUrl: "",
  },
};

export type PropertyGrowthRateOptionKey =
  keyof typeof PropertyGrowthRateOptions;
