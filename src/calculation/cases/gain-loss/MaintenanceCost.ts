import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams";

import type { GainLoss } from "./types";

export const MaintenanceCost: GainLoss = {
  key: "maintenanceCost",
  label: "Maintenance",
  color: "rgba(243, 194, 18, 1.0)",

  description: (params: EnrichedSimulationParams) => {
    const { maintenanceCostPercent, maintenanceCostGrowthPercent } = params;

    return `Includes repairs and maintenance of the property and fittings.
Costs around ${maintenanceCostPercent}% of property value, growing at ${maintenanceCostGrowthPercent}% per year.`;
  },

  calculateForYear: ({ params, year }): number => {
    const { includeMaintenance, maintenanceCostPercent, propertyPrice } =
      params;

    if (!includeMaintenance || !maintenanceCostPercent || !propertyPrice) {
      return 0;
    }

    // const growth = propertyGrowthPercent
    const growth = 3.5; // Home maintenance usually goes up around 3.5% a year
    const annualPropertyGrowth = growth / 100;
    const maintenanceRate = maintenanceCostPercent / 100;

    const currentPropertyValue =
      propertyPrice * Math.pow(1 + annualPropertyGrowth, year);

    const maintenanceCost = maintenanceRate * currentPropertyValue;

    return -maintenanceCost;
  },
};
