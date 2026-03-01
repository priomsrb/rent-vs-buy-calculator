import { Explain } from "@/components/screens/Explain/index.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/explain")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Explain />;
}
