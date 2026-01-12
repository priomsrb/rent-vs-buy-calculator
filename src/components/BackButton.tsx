import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Link, type LinkComponent } from "@tanstack/react-router";

export const BackButton: LinkComponent<"a"> = (props) => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <Link viewTransition={true} draggable={false} {...props}>
        <Button
          variant={"secondary"}
          className={"px-2 py-5 text-muted-foreground"}
          style={{ viewTransitionName: "backButton" }}
        >
          <ArrowLeft />
        </Button>
      </Link>
    </div>
  );
};
