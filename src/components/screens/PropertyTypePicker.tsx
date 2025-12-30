import { Link } from "@tanstack/react-router";
import { CardContent } from "../ui/card";
import { getPropertyTypeIcon } from "../PropertyTypeIcon";
import { ClickableCard } from "../ui/ClickableCard";
import { allPropertyTypes, type PropertyType } from "@/types";
import { BackButton } from "@/components/BackButton.tsx";
import { useEffect } from "react";
import { preload } from "react-dom";
import { ALL_PROPERTY_IMAGES } from "@/propertyPresets.tsx";
import { getPropertyTypeName } from "@/utils/PropertyType.tsx";

export function PropertyTypePicker() {
  useEffect(() => preloadImages());
  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center justify-center p-8">
        <BackButton to={"/welcome"} viewTransition={true} draggable={false} />
        <div className="flex h-full w-full flex-col items-center justify-center p-10 text-center">
          <h2 className="mb-8 text-3xl">Choose a type of property</h2>
          <div className="flex w-full flex-col gap-8 md:w-200 md:flex-row">
            {allPropertyTypes.map((propertyType) => (
              <PropertyTypeButton {...{ propertyType }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function preloadImages() {
  ALL_PROPERTY_IMAGES.forEach((imageUrl) => {
    preload(imageUrl, { as: "image" });
  });
}

type ProperTypeCardProps = {
  propertyType: PropertyType;
};

function PropertyTypeButton({ propertyType }: ProperTypeCardProps) {
  const name = getPropertyTypeName(propertyType);
  const icon = getPropertyTypeIcon(propertyType);
  return (
    // <Card className="flex-1 cursor-pointer transition hover:scale-[1.01] hover:shadow-lg active:scale-[0.98] active:shadow-sm active:inset-shadow-sm">
    <ClickableCard className="flex-1">
      <Link
        to={"/start/$propertyType"}
        params={{ propertyType }}
        viewTransition={true}
        draggable={false}
      >
        <CardContent className="flex flex-col items-center justify-center">
          <div style={{ viewTransitionName: `${propertyType}Icon` }}>
            {icon}
          </div>
          <p
            className="mt-2 text-2xl md:text-5xl"
            style={{ viewTransitionName: `${propertyType}Name` }}
          >
            {name}
          </p>
        </CardContent>
      </Link>
    </ClickableCard>
  );
}
