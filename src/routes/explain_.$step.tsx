import { Explain } from "@/components/screens/Explain/index.tsx";
import { parseLocalStorage } from "@/utils/localStorage";
import { createFileRoute, redirect } from "@tanstack/react-router";

const STEP_COUNT = 7;

export const Route = createFileRoute("/explain_/$step")({
  beforeLoad: ({ params }) => {
    if (!parseLocalStorage("formData")) {
      throw redirect({ to: "/welcome" });
    }
    const step = parseInt(params.step);
    if (isNaN(step) || step < 1 || step > STEP_COUNT) {
      throw redirect({ to: "/explain/$step", params: { step: "1" } });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { step } = Route.useParams();
  return <Explain step={parseInt(step)} />;
}
