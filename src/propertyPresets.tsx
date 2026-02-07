import _ from "lodash";

/*
To generate the import statements for propertyPresets.tsx, run the follwing bash command:
```
pushd src/assets/properties/
printf '%s\n' "$(ls -1 *.jpg | sed -E 's/^(.*)\.jpg$/import \1 from "@\/assets\/properties\/\1.jpg";/' )" "" "export const ALL_PROPERTY_IMAGES = [" $(ls -1 *.jpg | sed -E 's/^(.*)\.jpg$/  \1,/' ) "];" | awk 'NF'
popd
```
*/
import house_0_75m from "@/assets/properties/house_0_75m.jpg";
import house_1_0m from "@/assets/properties/house_1_0m.jpg";
import house_1_6m from "@/assets/properties/house_1_6m.jpg";
import house_1_9m from "@/assets/properties/house_1_9m.jpg";
import house_1_25m from "@/assets/properties/house_1_25m.jpg";
import house_2_3m from "@/assets/properties/house_2_3m.jpg";
import house_3_0m from "@/assets/properties/house_3_0m.jpg";
import p25_unit from "@/assets/properties/p25_unit.jpg";
import p50_unit from "@/assets/properties/p50_unit.jpg";
import p75_unit from "@/assets/properties/p75_unit.jpg";
import type { SimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import type { PropertyType } from "@/types";

export const ALL_PROPERTY_IMAGES = [
  house_0_75m,
  house_1_0m,
  house_1_25m,
  house_1_6m,
  house_1_9m,
  house_2_3m,
  house_3_0m,
  p25_unit,
  p50_unit,
  p75_unit,
];

export type PropertyPresetId =
  | "house_0_75m"
  | "house_1_0m"
  | "house_1_25m"
  | "house_1_6m"
  | "house_1_9m"
  | "house_2_3m"
  | "house_3_0m"
  | "p25_unit"
  | "p50_unit"
  | "p75_unit";

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
    id: "house_0_75m",
    propertyType: "house",
    propertyPrice: 750_000,
    rentPerWeek: 520,
    locationDescription: "North-Western suburbs",
    bedrooms: 2,
    bathrooms: 1,
    image: house_0_75m,
  },
  {
    id: "house_1_0m",
    propertyType: "house",
    propertyPrice: 1_000_000,
    rentPerWeek: 700,
    locationDescription: "North-Western suburbs",
    bedrooms: 3,
    bathrooms: 1,
    image: house_1_0m,
  },
  {
    id: "house_1_25m",
    propertyType: "house",
    propertyPrice: 1_250_000,
    rentPerWeek: 750,
    locationDescription: "Western suburbs",
    bedrooms: 3,
    bathrooms: 1,
    image: house_1_25m,
  },
  {
    id: "house_1_6m",
    propertyType: "house",
    propertyPrice: 1_600_000,
    rentPerWeek: 1050,
    locationDescription: "Western suburbs",
    bedrooms: 4,
    bathrooms: 2,
    image: house_1_6m,
  },
  {
    id: "house_1_9m",
    propertyType: "house",
    propertyPrice: 1_900_000,
    rentPerWeek: 1400,
    locationDescription: "Western suburbs",
    bedrooms: 5,
    bathrooms: 3,
    image: house_1_9m,
  },
  {
    id: "house_2_3m",
    propertyType: "house",
    propertyPrice: 2_300_000,
    rentPerWeek: 800,
    locationDescription: "Inner suburbs",
    bedrooms: 2,
    bathrooms: 1,
    image: house_2_3m,
  },
  {
    id: "house_3_0m",
    propertyType: "house",
    propertyPrice: 3_000_000,
    rentPerWeek: 1650,
    locationDescription: "Inner suburbs",
    bedrooms: 3,
    bathrooms: 2,
    image: house_3_0m,
  },
  {
    id: "p25_unit",
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
    id: "p50_unit",
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
    id: "p75_unit",
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
