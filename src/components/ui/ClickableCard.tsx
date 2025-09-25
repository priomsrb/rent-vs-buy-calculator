import { twMerge } from "tailwind-merge";
import { Card } from "./card";

export function ClickableCard(props: React.ComponentProps<"div">) {
  const myStyle =
    "cursor-pointer transition hover:scale-[1.01] hover:shadow-lg active:scale-[0.98] active:shadow-sm active:inset-shadow-sm";
  const mergedStyles = twMerge(myStyle, props.className);
  return (
    <Card {...props} className={mergedStyles}>
      {props.children}
    </Card>
  );
}
