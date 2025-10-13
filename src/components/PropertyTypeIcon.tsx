import { House, Building, type LucideIcon } from "lucide-react";
import type { PropertyType } from "@/types";

export type PropertyTypeIcon = typeof UnitIcon | typeof HouseIcon;

export function getPropertyTypeIcon(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return <HouseIcon />;
    case "unit":
      return <UnitIcon />;
    default:
      const exhaustiveCheck: never = propertyType;
      return <HouseIcon />;
  }
}

export function UnitIcon() {
  return <BasePropertyTypeIcon Icon={Building} color="#3333DD" />;
}

export function HouseIcon() {
  return <BasePropertyTypeIcon Icon={House} color="green" />;
}

type BasePropertyTypeIconProps = {
  Icon: LucideIcon;
  color: string;
};

export function BasePropertyTypeIcon({
  color,
  Icon,
}: BasePropertyTypeIconProps) {
  return (
    <div
      className="h-15 w-15 overflow-hidden rounded-full border-2 border-white/70 md:m-10 md:scale-150 dark:border-black/40"
      style={{ backgroundColor: color, color }}
    >
      <div className="flex h-full w-full items-center justify-center bg-background/80">
        {<Icon size={32}></Icon>}
      </div>
    </div>
  );
}
