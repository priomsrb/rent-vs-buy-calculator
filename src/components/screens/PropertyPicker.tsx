import { Link } from "@tanstack/react-router";
import { getPropertyTypeIcon } from "../PropertyTypeIcon";
import { Button } from "../ui/button";
import { Bath, Bed, MapPin } from "lucide-react";
import { CardContent } from "../ui/card";
import { ClickableCard } from "../ui/ClickableCard";
import { type PropertyPreset, propertyPresets } from "@/propertyPresets";
import { formatMoney } from "@/utils/formatMoney.ts";

type PropertyPickerProps = {
  propertyType: "unit" | "house";
};
export function PropertyPicker(props: PropertyPickerProps) {
  const { propertyType } = props;
  return (
    <div className={"flex w-full justify-center"}>
      <div className="flex h-full w-full flex-col items-center p-8 md:w-300">
        {/*<div className={"flex w-full flex-col justify-center md:w-300"}>*/}

        <div className="mb-8 w-full">
          <Link to={"/start"} viewTransition={true} draggable={false}>
            <Button>← Change property type</Button>
          </Link>
        </div>
        <h1 className="center w-11/12 text-center">
          <div
            className="inline-block"
            style={{ viewTransitionName: `${propertyType}Icon` }}
          >
            {getPropertyTypeIcon(propertyType)}
          </div>
          <p className="mb-10 text-4xl">
            Choose a{" "}
            <div
              className="inline-block"
              // style={{ viewTransitionName: `${propertyType}Name` }}
            >
              {props.propertyType}
            </div>
          </p>
          <div className="flex w-full flex-col justify-center gap-4 md:flex-row md:gap-12">
            {propertyPresets
              .filter((preset) => preset.propertyType === propertyType)
              .map((preset) => (
                <Link
                  to="/results/$presetId"
                  params={{ presetId: preset.id }}
                  viewTransition={true}
                  draggable={false}
                >
                  <PropertyChoice {...preset} />
                </Link>
              ))}
          </div>
        </h1>
      </div>
    </div>
  );
}

function PropertyChoice(props: PropertyPreset) {
  return (
    <ClickableCard className="overflow-hidden p-0">
      <CardContent className="p-0">
        <div className="flex md:flex-col">
          <img
            src={props.image}
            className="h-auto w-30 rounded-l-xl object-cover md:w-100 md:rounded-t-xl"
            style={{
              viewTransitionName: `${props.id}Image`,
              // @ts-ignore viewTransitionClass not added to react's types yet
              viewTransitionClass: "vertically-align",
            }}
            draggable={false}
          />
          <div className="flex flex-1 flex-col items-start p-4">
            <p>Buy: {formatMoney(props.propertyPrice)}</p>
            <p>Rent: ${props.rentPerWeek} / week</p>
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
