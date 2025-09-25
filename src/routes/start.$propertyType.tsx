import { PropertyPicker } from "@/components/screens/PropertyPicker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/start/$propertyType")({
  component: RouteComponent,
});

function RouteComponent() {
  const { propertyType } = Route.useParams();
  return <PropertyPicker propertyType={propertyType} />;
}
