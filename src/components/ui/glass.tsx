import { twMerge } from "tailwind-merge";

/**
 * Shared building blocks for the app-wide "glass" visual style.
 * All colors derive from theme tokens so they work in light and dark mode.
 */

export function ScreenBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute top-[-20%] left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
    </>
  );
}

export function GlassPanel(props: React.ComponentProps<"div">) {
  return (
    <div {...props} className={twMerge("glass-panel", props.className)}>
      {props.children}
    </div>
  );
}

export function GlassChip(props: React.ComponentProps<"div">) {
  return (
    <div {...props} className={twMerge("glass-chip", props.className)}>
      {props.children}
    </div>
  );
}

export function GradientTitle(props: React.ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={twMerge(
        "gradient-title text-4xl md:text-6xl",
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
}

/* Pill-shaped button styles used for primary/secondary navigation actions */
export const pillPrimaryClass =
  "px-8 py-6 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg";

export const pillOutlineClass =
  "px-8 py-6 text-lg rounded-full backdrop-blur-md bg-foreground/5 border-foreground/10 hover:bg-foreground/10 transition-all duration-300";
