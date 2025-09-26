import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { propertyPresets } from "@/propertyPresets";
import { MapPin, Bed, Bath, Building, House } from "lucide-react";
import type { PropertyType } from "@/types";
import { getPropertyTypeIcon } from "../PropertyTypeIcon";

type ResultsScreenProps = {
  presetId: string;
};

export function ResultsScreen({ presetId }: ResultsScreenProps) {
  const preset = propertyPresets.find((preset) => preset.id === presetId);
  if (!preset) {
    // TODO: Handle missing preset
    return "Invalid property preset";
  }
  return (
    <>
      <Link
        to={"/start/$propertyType"}
        params={{ propertyType: preset.propertyType }}
        viewTransition={true}
      >
        {" "}
        <Button>Back</Button>
      </Link>

      <div className="">
        <img
          src={preset.image}
          className="h-50 w-96 bg-background object-cover"
          style={{
            viewTransitionName: `${preset.id}Image`,
            // @ts-ignore viewTransitionClass not added to react's types yet
            viewTransitionClass: "vertically-align",
          }}
        />
      </div>
      <div className="flex flex-1 flex-col items-start p-4">
        {/* TODO: Format money. e.g. $1.5m or $600k */}
        <p>
          <MapPin className="inline-block" /> {preset.locationDescription}
        </p>
        <p className="flex gap-2">
          <span className="flex gap-1">
            <Bed />
            {preset.bedrooms}
          </span>
          ·
          <span className="flex gap-1">
            <Bath />
            {preset.bathrooms}
          </span>
          ·
          <span className="flex gap-1">
            {getIconForPropertyType(preset.propertyType)}
            {getNameForPropertyType(preset.propertyType)}
          </span>
        </p>
        <p>Buy: ${preset.buyPrice}</p>
        <p>Rent: ${preset.rentPerWeek} / week</p>
      </div>
    </>
  );
}

function getNameForPropertyType(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return "House";
    case "unit":
      return "Apartment";
    default:
      return propertyType;
  }
}

function getIconForPropertyType(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return <House />;
    case "unit":
      return <Building />;
    default:
      return <House />;
  }
}
