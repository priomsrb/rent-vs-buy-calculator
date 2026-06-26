import { Explain } from "@/components/screens/Explain/index.tsx";
import { parseLocalStorage } from "@/utils/localStorage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explain")({
  beforeLoad: () => {
    if (!parseLocalStorage("formData")) {
      throw redirect({ to: "/welcome" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Explain />;
}
