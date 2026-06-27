import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/explain")({
  beforeLoad: () => {
    throw redirect({ to: "/explain/$step", params: { step: "1" } });
  },
  component: () => null,
});
