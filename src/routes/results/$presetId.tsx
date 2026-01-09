import { ResultsScreen } from "@/components/screens/Results/Results.tsx";
import { getPropertyPreset } from "@/propertyPresets";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/results/$presetId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { presetId } = Route.useParams();
  return <ResultsScreen propertyPreset={getPropertyPreset(presetId)} />;
}
