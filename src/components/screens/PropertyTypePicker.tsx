import { useEffect } from "react";
import { preload } from "react-dom";

import { BackButton } from "@/components/BackButton.tsx";
import { StepIndicator } from "@/components/StepIndicator";
import { ScreenBackdrop } from "@/components/ui/glass";
import { ALL_PROPERTY_IMAGES } from "@/propertyPresets.tsx";
import { type PropertyType, allPropertyTypes } from "@/types";
import { getPropertyTypeName } from "@/utils/PropertyType.tsx";
import { Link } from "@tanstack/react-router";

import { getPropertyTypeIcon } from "../PropertyTypeIcon";
import { ClickableCard } from "../ui/ClickableCard";
import { CardContent } from "../ui/card";

export function PropertyTypePicker() {
  useEffect(() => preloadImages());
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-8">
      <ScreenBackdrop />
      <BackButton to={"/welcome"} viewTransition={true} draggable={false} />
      <div className="z-10 flex h-full w-full flex-col items-center justify-center p-10 text-center">
        <StepIndicator step={1} totalSteps={3} label="Property type" />
        <h2 className="mt-6 mb-2 text-3xl font-bold tracking-tight">
          What kind of place are you looking at?
        </h2>
        <p className="mb-8 text-foreground/60">
          This affects costs like strata, maintenance, and how prices grow.
        </p>
        <div className="flex w-full flex-col gap-8 md:w-200 md:flex-row">
          {allPropertyTypes.map((propertyType) => (
            <PropertyTypeButton key={propertyType} {...{ propertyType }} />
          ))}
        </div>
      </div>
    </div>
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
    <ClickableCard className="flex-1 rounded-[2.5rem] border-foreground/10 bg-foreground/5 backdrop-blur-md">
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
