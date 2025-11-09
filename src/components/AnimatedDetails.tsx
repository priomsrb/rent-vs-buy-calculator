import { twMerge } from "tailwind-merge";

export function AnimatedDetails(
  props: React.DetailsHTMLAttributes<HTMLDetailsElement>,
) {
  return (
    <details
      {...props}
      className={twMerge(
        props.className,
        "overflow-hidden details-content:h-0 details-content:transition-all details-content:transition-discrete details-content:duration-300 open:details-content:h-auto",
      )}
    />
  );
}
