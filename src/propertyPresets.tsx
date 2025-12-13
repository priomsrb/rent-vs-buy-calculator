import type { PropertyType } from "@/types";
import p25_house from "@/assets/properties/p25_house.jpg";
import p50_house from "@/assets/properties/p50_house.jpg";
import p75_house from "@/assets/properties/p75_house.jpg";
import p25_unit from "@/assets/properties/p25_unit.jpg";
import p50_unit from "@/assets/properties/p50_unit.jpg";
import p75_unit from "@/assets/properties/p75_unit.jpg";
import type { SimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import { PropertyGrowthRateOptions } from "@/utils/propertyGrowthRateOptions.ts";

export type PropertyPreset = Partial<SimulationParams> & {
  id: string;
  propertyPrice: number;
  rentPerWeek: number;
  propertyType: PropertyType;
  locationDescription: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
};

// TODO-research: Use realistic prices
export const propertyPresets: PropertyPreset[] = [
  {
    id: "regionalHouse",
    propertyType: "house",
    propertyPrice: 550_000,
    rentPerWeek: 500,
    locationDescription: "Regional",
    bedrooms: 3,
    bathrooms: 1,
    image: p25_house,
    propertyGrowthRateOption: "australian_regional_houses_last30Years",
    propertyGrowthPercent:
      PropertyGrowthRateOptions["australian_regional_houses_last30Years"]
        .returnPercent,
  },
  {
    id: "outerSuburbsHouse",
    propertyType: "house",
    propertyPrice: 1_400_000,
    rentPerWeek: 800,
    locationDescription: "Outer suburbs",
    bedrooms: 4,
    bathrooms: 2,
    image: p50_house,
  },
  {
    id: "innerSuburbsHouse",
    propertyType: "house",
    propertyPrice: 1_900_000,
    rentPerWeek: 950,
    locationDescription: "Inner suburbs",
    bedrooms: 3,
    bathrooms: 2,
    image: p75_house,
  },
  {
    id: "outerSuburbsUnit",
    propertyType: "unit",
    propertyPrice: 550_000,
    rentPerWeek: 650,
    locationDescription: "Outer suburbs",
    bedrooms: 2,
    bathrooms: 1,
    image: p25_unit,
    strataPerYear: 1000 * 4,
  },
  {
    id: "largeApartment",
    propertyType: "unit",
    propertyPrice: 950_000,
    rentPerWeek: 800,
    locationDescription: "Outer suburbs",
    bedrooms: 3,
    bathrooms: 2,
    image: p50_unit,
    strataPerYear: 1800 * 4,
  },
  {
    id: "innerCityUnit",
    propertyType: "unit",
    propertyPrice: 1_500_000,
    rentPerWeek: 1500,
    locationDescription: "Inner city",
    bedrooms: 2,
    bathrooms: 1,
    image: p75_unit,
    strataPerYear: 2500 * 4,
  },
];
