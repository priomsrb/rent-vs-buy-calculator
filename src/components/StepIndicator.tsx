import { cn } from "@/lib/utils";

type StepIndicatorProps = {
  step: number;
  totalSteps: number;
  label?: string;
  className?: string;
};

/**
 * Small "Step X of Y" chip with progress dots, shown at the top of each
 * screen in a multi-step flow so users always know where they are.
 */
export function StepIndicator({
  step,
  totalSteps,
  label,
  className,
}: StepIndicatorProps) {
  return (
    <div
      className={cn("glass-chip gap-3", className)}
      aria-label={`Step ${step} of ${totalSteps}${label ? `: ${label}` : ""}`}
    >
      <span className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              i + 1 === step
                ? "w-5 bg-primary"
                : i + 1 < step
                  ? "bg-primary/50"
                  : "bg-foreground/20",
            )}
          />
        ))}
      </span>
      <span className="whitespace-nowrap">
        Step {step} of {totalSteps}
        {label && <span className="text-foreground/60"> — {label}</span>}
      </span>
    </div>
  );
}
