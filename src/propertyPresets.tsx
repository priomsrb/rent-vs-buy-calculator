import type { PropertyType } from "@/types";
import p25_house from "@/assets/properties/p25_house.jpg";
import p50_house from "@/assets/properties/p50_house.jpg";
import p75_house from "@/assets/properties/p75_house.jpg";
import p25_unit from "@/assets/properties/p25_unit.jpg";
import p50_unit from "@/assets/properties/p50_unit.jpg";
import p75_unit from "@/assets/properties/p75_unit.jpg";

export type PropertyPreset = {
  propertyType: PropertyType;
  buyPrice: number;
  rentPerWeek: number;
  locationDescription: string;
  bedroomsDescription: string;
  image: string;
};
// TODO: Use realistic prices
export const propertyPresets: PropertyPreset[] = [
  {
    propertyType: "house",
    buyPrice: 550_000,
    rentPerWeek: 500,
    locationDescription: "Regional",
    bedroomsDescription: "3 bed, 1 bath",
    image: p25_house,
  },
  {
    propertyType: "house",
    buyPrice: 1_400_000,
    rentPerWeek: 800,
    locationDescription: "Outer suburbs",
    bedroomsDescription: "3 bed, 1 bath",
    image: p50_house,
  },
  {
    propertyType: "house",
    buyPrice: 1_900_000,
    rentPerWeek: 950,
    locationDescription: "Inner suburbs",
    bedroomsDescription: "3 bed, 1 bath",
    image: p75_house,
  },
  {
    propertyType: "unit",
    buyPrice: 1_400_000,
    rentPerWeek: 1400,
    locationDescription: "Outer suburbs",
    bedroomsDescription: "4 bedrooms",
    image: p25_unit,
  },
  {
    propertyType: "unit",
    buyPrice: 1_400_000,
    rentPerWeek: 1400,
    locationDescription: "Outer suburbs",
    bedroomsDescription: "4 bedrooms",
    image: p50_unit,
  },
  {
    propertyType: "unit",
    buyPrice: 1_400_000,
    rentPerWeek: 1400,
    locationDescription: "Outer suburbs",
    bedroomsDescription: "4 bedrooms",
    image: p75_unit,
  },
];
