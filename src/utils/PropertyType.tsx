import type { PropertyType } from "@/types.tsx";

export function getPropertyTypeName(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return "House";
    case "unit":
      return "Unit";
    default:
      const exhaustiveCheck: never = propertyType;
      console.error(`${exhaustiveCheck} is an invalid property type`);
      return propertyType;
  }
}
