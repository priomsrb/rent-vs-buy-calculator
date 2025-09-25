import { PropertyTypePicker } from "@/components/screens/PropertyTypePicker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PropertyTypePicker />;
}
