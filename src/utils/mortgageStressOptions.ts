export const MortgageStressOptions = {
  comfortable: {
    label: "Comfortable",
    percentage: 20,
  },
  stressful: {
    label: "Stressful",
    percentage: 30,
  },
  highStress: {
    label: "High stress",
    percentage: 40,
  },
};

export type MortgageStressOptionKey = keyof typeof MortgageStressOptions;
