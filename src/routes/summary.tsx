import { Summary } from "@/components/screens/Summary/index.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/summary")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Summary />;
}
