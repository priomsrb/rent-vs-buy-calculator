import { Bath, Bed, MapPin } from "lucide-react";
import { useEffect } from "react";

import { BackButton } from "@/components/BackButton.tsx";
import { StepIndicator } from "@/components/StepIndicator";
import { ScreenBackdrop } from "@/components/ui/glass";
import { type PropertyPreset, propertyPresets } from "@/propertyPresets";
import type { PropertyType } from "@/types.tsx";
import { formatMoney } from "@/utils/formatMoney.ts";
import { Link } from "@tanstack/react-router";

import { getPropertyTypeIcon } from "../PropertyTypeIcon";
import { ClickableCard } from "../ui/ClickableCard";
import { CardContent } from "../ui/card";

type PropertyPickerProps = {
  propertyType: PropertyType;
};
export function PropertyPicker(props: PropertyPickerProps) {
  const { propertyType } = props;

  useEffect(() => {
    // Remove previous form data
    localStorage.removeItem("formData");
  });

  return (
    <div
      className={
        "relative flex min-h-screen w-full justify-center overflow-hidden"
      }
    >
      <ScreenBackdrop />
      <div className="z-10 flex h-full w-full flex-col items-center p-8 md:w-400">
        <BackButton to={"/start"} viewTransition={true} draggable={false} />
        <StepIndicator step={2} totalSteps={3} label="Pick a property" />
        <div className="center w-11/12 text-center">
          <div
            className="inline-block"
            style={{ viewTransitionName: `${propertyType}Icon` }}
          >
            {getPropertyTypeIcon(propertyType)}
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            Choose a {props.propertyType}
          </h1>
          <p className="mb-10 text-foreground/60">
            Pick the one closest to your budget — you can fine-tune the price
            and rent on the next step.
          </p>
          <div className="flex w-full flex-col justify-center gap-4 md:flex-row md:flex-wrap md:gap-12">
            {propertyPresets
              .filter((preset) => preset.propertyType === propertyType)
              .map((preset) => (
                <Link
                  to="/start/$presetId/confirm"
                  params={{ presetId: preset.id }}
                  viewTransition={true}
                  draggable={false}
                  key={preset.id}
                >
                  <PropertyChoice {...preset} />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyChoice(props: PropertyPreset) {
  return (
    <ClickableCard className="overflow-hidden rounded-[1.5rem] border-foreground/10 bg-foreground/5 p-0 backdrop-blur-md">
      <CardContent className="p-0">
        <div className="flex md:flex-col">
          <img
            src={props.image}
            className="xs:rounded-l-xl aspect-square w-30 bg-gray-500/20 object-cover md:w-100 md:rounded-t-xl md:rounded-b-none"
            style={{
              viewTransitionName: `${props.id}Image`,
              // @ts-ignore viewTransitionClass not added to react's types yet
              viewTransitionClass: "vertically-align",
            }}
            draggable={false}
          />
          <div className="flex flex-1 flex-col items-start p-4 text-left">
            <p>Buy: {formatMoney(props.propertyPrice)}</p>
            <p>Rent: {formatMoney(props.rentPerWeek)} / week</p>
            <p>
              <MapPin className="inline-block" /> {props.locationDescription}
            </p>
            <p className="flex gap-4">
              <span className="flex gap-1">
                <Bed />
                {props.bedrooms}
              </span>
              <span className="flex gap-1">
                <Bath />
                {props.bathrooms}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </ClickableCard>
  );
}
