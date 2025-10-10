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
      propertyGrowth,
    } = params;

    if (!includeMaintenance || !maintenanceCostPercent || !propertyPrice) {
      return 0;
    }

    const annualPropertyGrowth = propertyGrowth / 100;
    const maintenanceRate = maintenanceCostPercent / 100;

    const currentPropertyValue =
      propertyPrice * Math.pow(1 + annualPropertyGrowth, year);

    const maintenanceCost = maintenanceRate * currentPropertyValue;

    return -maintenanceCost;
  },
};
