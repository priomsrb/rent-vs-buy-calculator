import { parseLocalStorage } from "@/utils/localStorage";
import { createFileRoute, redirect } from "@tanstack/react-router";

// The old standalone Summary screen has been merged into the Results screen.
// Redirect any old links there (or to the start of the flow if there's no data yet).
export const Route = createFileRoute("/summary")({
  beforeLoad: () => {
    const formData = parseLocalStorage("formData");
    if (formData?.id) {
      throw redirect({
        to: "/results/$presetId",
        params: { presetId: formData.id },
      });
    }
    throw redirect({ to: "/welcome" });
  },
  component: () => null,
});
