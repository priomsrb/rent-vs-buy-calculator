import { Summary } from "@/components/screens/Summary/index.tsx";
import { parseLocalStorage } from "@/utils/localStorage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/summary")({
  beforeLoad: () => {
    if (!parseLocalStorage("formData")) {
      throw redirect({ to: "/welcome" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Summary />;
}
