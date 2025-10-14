import { Link, type LinkComponent } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";

export const BackButton: LinkComponent<"a"> = (props) => {
  return (
    <div className="absolute top-5 left-5 z-10">
      <Link viewTransition={true} draggable={false} {...props}>
        <Button
          variant={"secondary"}
          className={"px-2 py-5 text-3xl text-muted-foreground"}
          style={{ viewTransitionName: "backButton" }}
        >
          ←
        </Button>
      </Link>
    </div>
  );
};
