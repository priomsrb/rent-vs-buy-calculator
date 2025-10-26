import { Link } from "@tanstack/react-router";
import { CardContent } from "../ui/card";
import { getPropertyTypeIcon } from "../PropertyTypeIcon";
import { ClickableCard } from "../ui/ClickableCard";
import { allPropertyTypes, type PropertyType } from "@/types";
import { BackButton } from "@/components/BackButton.tsx";

export function PropertyTypePicker() {
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

function getPropertyTypeName(propertyType: PropertyType) {
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
