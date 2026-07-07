import {
  ChartNoAxesCombined as ChartIcon,
  House as HouseIcon,
  Scale as ScaleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GlassPanel,
  GradientTitle,
  ScreenBackdrop,
  pillPrimaryClass,
} from "@/components/ui/glass";
import { Link } from "@tanstack/react-router";

export function Welcome() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-6 text-center md:p-10">
      <ScreenBackdrop />
      <div className="z-10 flex w-full max-w-4xl flex-col items-center space-y-10">
        <div className="space-y-4">
          <p className="text-xl font-bold text-foreground/50">Own or Rent?</p>
          <GradientTitle>Sydney Property Calculator</GradientTitle>
          <h2 className="mx-auto max-w-2xl text-xl font-light text-foreground/60 md:text-2xl">
            Not sure whether to buy a home or keep renting? See which one leaves
            you better off financially.
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <HowItWorksCard
            icon={<HouseIcon size={32} />}
            step={1}
            title="Pick a property"
            description="Choose a typical Sydney house or unit that matches your budget."
          />
          <HowItWorksCard
            icon={<ScaleIcon size={32} />}
            step={2}
            title="We compare both paths"
            description="We simulate 30 years of buying it vs renting it while investing your savings."
          />
          <HowItWorksCard
            icon={<ChartIcon size={32} />}
            step={3}
            title="See who comes out ahead"
            description="Get a clear verdict, charts, and a step-by-step explanation of the numbers."
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link to={"/start"} draggable={false}>
            <Button className={pillPrimaryClass}>Get started</Button>
          </Link>
          <p className="text-sm text-foreground/40">
            Takes about a minute. No sign-up needed.
          </p>
        </div>
      </div>
    </div>
  );
}

function HowItWorksCard({
  icon,
  step,
  title,
  description,
}: {
  icon: React.ReactNode;
  step: number;
  title: string;
  description: string;
}) {
  return (
    <GlassPanel className="flex flex-col items-center space-y-3 p-8">
      <div className="rounded-full bg-primary/10 p-4 text-primary ring-1 ring-primary/20">
        {icon}
      </div>
      <p className="text-sm font-semibold tracking-widest text-foreground/40 uppercase">
        Step {step}
      </p>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        {description}
      </p>
    </GlassPanel>
  );
}
