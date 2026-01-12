import { Welcome } from "@/components/screens/Welcome.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Welcome />;
}
