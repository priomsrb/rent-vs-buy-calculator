import { createFileRoute } from "@tanstack/react-router";
import { Welcome } from "@/components/screens/Welcome.tsx";

export const Route = createFileRoute("/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Welcome />;
}
