import _ from "lodash";

/*
To generate the import statements for propertyPresets.tsx, run the follwing bash command:
```
pushd src/assets/properties/
printf '%s\n' "$(ls -1 *.jpg | sed -E 's/^(.*)\.jpg$/import \1 from "@\/assets\/properties\/\1.jpg";/' )" "" "export const ALL_PROPERTY_IMAGES = [" $(ls -1 *.jpg | sed -E 's/^(.*)\.jpg$/  \1,/' ) "];" | awk 'NF'
popd
```
*/
import p25_house from "@/assets/properties/p25_house.jpg";
import p25_unit from "@/assets/properties/p25_unit.jpg";
import p50_house from "@/assets/properties/p50_house.jpg";
import p50_unit from "@/assets/properties/p50_unit.jpg";
import p75_house from "@/assets/properties/p75_house.jpg";
import p75_unit from "@/assets/properties/p75_unit.jpg";
import type { SimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import type { PropertyType } from "@/types";
import { PropertyGrowthRateOptions } from "@/utils/propertyGrowthRateOptions.ts";

export const ALL_PROPERTY_IMAGES = [
  p25_house,
  p50_house,
  p75_house,
  p25_unit,
  p50_unit,
  p75_unit,
];

export type PropertyPresetId =
  | "regionalHouse"
  | "outerSuburbsHouse"
  | "innerSuburbsHouse"
  | "outerSuburbsUnit"
  | "largeApartment"
  | "innerCityUnit";

export type PropertyPreset = Partial<SimulationParams> & {
  id: PropertyPresetId;
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

export function getPropertyPreset(presetId: string): PropertyPreset {
  // TODO: Using any because _.find has a strange return type
  const propertyPreset: any = _.find(propertyPresets, {
    id: presetId,
  });

  if (!propertyPreset) {
    throw new Error(`Unknown property preset: ${presetId}`);
  }
  return propertyPreset;
}
