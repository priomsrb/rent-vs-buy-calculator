import type { PropertyType } from "@/types";
import p25_house from "@/assets/properties/p25_house.jpg";
import p50_house from "@/assets/properties/p50_house.jpg";
import p75_house from "@/assets/properties/p75_house.jpg";
import p25_unit from "@/assets/properties/p25_unit.jpg";
import p50_unit from "@/assets/properties/p50_unit.jpg";
import p75_unit from "@/assets/properties/p75_unit.jpg";

export type PropertyPreset = {
  id: string;
  propertyType: PropertyType;
  buyPrice: number;
  rentPerWeek: number;
  locationDescription: string;
  bedrooms: number;
  bathrooms: number;
  image: string;
};
// TODO: Use realistic prices
export const propertyPresets: PropertyPreset[] = [
  {
    id: "regionalHouse",
    propertyType: "house",
    buyPrice: 550_000,
    rentPerWeek: 500,
    locationDescription: "Regional",
    bedrooms: 3,
    bathrooms: 1,
    image: p25_house,
  },
  {
    id: "outerSuburbsHouse",
    propertyType: "house",
    buyPrice: 1_400_000,
    rentPerWeek: 800,
    locationDescription: "Outer suburbs",
    bedrooms: 3,
    bathrooms: 1,
    image: p50_house,
  },
  {
    id: "innerSuburbsHouse",
    propertyType: "house",
    buyPrice: 1_900_000,
    rentPerWeek: 950,
    locationDescription: "Inner suburbs",
    bedrooms: 3,
    bathrooms: 1,
    image: p75_house,
  },
  {
    id: "outerSuburbsUnit",
    propertyType: "unit",
    buyPrice: 550_000,
    rentPerWeek: 650,
    locationDescription: "Outer suburbs",
    bedrooms: 2,
    bathrooms: 1,
    image: p25_unit,
  },
  {
    id: "innerSuburbsUnit",
    propertyType: "unit",
    buyPrice: 1_000_000,
    rentPerWeek: 800,
    locationDescription: "Inner suburbs",
    bedrooms: 2,
    bathrooms: 1,
    image: p50_unit,
  },
  {
    id: "innerCityUnit",
    propertyType: "unit",
    buyPrice: 1_500_000,
    rentPerWeek: 1500,
    locationDescription: "Inner city",
    bedrooms: 2,
    bathrooms: 1,
    image: p75_unit,
  },
];
