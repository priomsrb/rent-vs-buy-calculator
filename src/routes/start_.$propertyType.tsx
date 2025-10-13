import { PropertyPicker } from "@/components/screens/PropertyPicker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/start_/$propertyType")({
  component: RouteComponent,
});

function RouteComponent() {
  const { propertyType } = Route.useParams();
  if (propertyType !== "house" && propertyType !== "unit") {
    return <h1>Error: Unknown property type: {propertyType}</h1>;
  }

  return <PropertyPicker propertyType={propertyType} />;
}
