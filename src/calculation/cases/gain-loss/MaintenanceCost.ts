import type { GainLoss } from "./types";

export const MaintenanceCost: GainLoss = {
  key: "maintenanceCost",
  label: "Maintenance",
  color: "rgba(243, 194, 18, 0.8)",

  calculateForYear: ({ params, year }): number => {
    const {
      includeMaintenance,
      maintenanceCostPercent,
      propertyPrice,
      // propertyGrowthPercentage,
    } = params;

    if (!includeMaintenance || !maintenanceCostPercent || !propertyPrice) {
      return 0;
    }

    // const growth = propertyGrowthPercentage
    const growth = 3.5; // Home maintenance usually goes up around 3.5% a year
    const annualPropertyGrowth = growth / 100;
    const maintenanceRate = maintenanceCostPercent / 100;

    const currentPropertyValue =
      propertyPrice * Math.pow(1 + annualPropertyGrowth, year);

    const maintenanceCost = maintenanceRate * currentPropertyValue;

    return -maintenanceCost;
  },
};
