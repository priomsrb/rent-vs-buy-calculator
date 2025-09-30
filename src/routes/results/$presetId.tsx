import { ResultsScreen } from "@/components/screens/Results/Results.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/results/$presetId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { presetId } = Route.useParams();
  return <ResultsScreen presetId={presetId} />;
}
