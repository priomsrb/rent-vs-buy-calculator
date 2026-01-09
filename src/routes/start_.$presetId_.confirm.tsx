import { createFileRoute } from "@tanstack/react-router";
import { PropertyConfirmation } from "@/components/screens/PropertyConfirmation.tsx";
import {
  getPropertyPreset,
  type PropertyPresetId,
} from "@/propertyPresets.tsx";

export const Route = createFileRoute("/start_/$presetId_/confirm")({
  component: RouteComponent,
});

function RouteComponent() {
  const { presetId: presetIdRaw } = Route.useParams();
  const presetId = presetIdRaw as PropertyPresetId;

  return <PropertyConfirmation propertyPreset={getPropertyPreset(presetId)} />;
}
