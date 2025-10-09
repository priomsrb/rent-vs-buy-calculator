import { Link } from "@tanstack/react-router";
import { CardContent } from "../ui/card";
import {
  HouseIcon,
  UnitIcon,
  type PropertyTypeIcon,
} from "../PropertyTypeIcon";
import { ClickableCard } from "../ui/ClickableCard";
import type { PropertyType } from "@/types";
import { Button } from "@/components/ui/button.tsx";

export function PropertyTypePicker() {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center p-8">
        <div className="mb-8 w-full">
          <Link to={"/welcome"} viewTransition={true} draggable={false}>
            <Button>← Back</Button>
          </Link>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center p-10 text-center">
          {/*<h1 className="mb-10 text-4xl font-bold md:text-6xl">*/}
          {/*  Sydney Buy vs Rent Calculator*/}
          {/*</h1>*/}
          {/*<p className="mb-10 text-xl text-gray-500">*/}
          {/*  Compare the financial outcomes of buying vs renting in Sydney*/}
          {/*</p>*/}
          <h2 className="mb-8 text-3xl">Choose a type of property</h2>
          <div className="flex w-full flex-col gap-8 md:w-200 md:flex-row">
            {/* TODO: Replace with generic map statement */}
            <PropertyTypeButton
              name="Unit"
              propertyType="unit"
              Icon={UnitIcon}
            />
            <PropertyTypeButton
              name="House"
              propertyType="house"
              Icon={HouseIcon}
            />
          </div>
        </div>
      </div>
    </>
  );
}

type ProperTypeCardProps = {
  name: string;
  propertyType: PropertyType;
  Icon: PropertyTypeIcon;
};

function PropertyTypeButton({ name, propertyType, Icon }: ProperTypeCardProps) {
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
            <Icon />
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
