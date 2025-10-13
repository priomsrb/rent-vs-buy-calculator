import { createFileRoute } from "@tanstack/react-router";
import { PropertyConfirmation } from "@/components/screens/PropertyConfirmation.tsx";
import { propertyPresets } from "@/propertyPresets.tsx";
import _ from "lodash";

export const Route = createFileRoute("/start_/$presetId_/confirm")({
  component: RouteComponent,
});

function RouteComponent() {
  const { presetId } = Route.useParams();
  const propertyPreset = _.find(propertyPresets, {
    id: presetId,
  });
  if (!propertyPreset) {
    return <h1>Error: Unknown property preset: {presetId}</h1>;
  }

  return <PropertyConfirmation propertyPreset={propertyPreset} />;
}
