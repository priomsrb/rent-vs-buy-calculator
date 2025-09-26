import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/calculate")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Link to={"/start"}>
        {" "}
        <Button>Back</Button>
      </Link>
      <div>Hello "/calculate"!</div>
    </>
  );
}
