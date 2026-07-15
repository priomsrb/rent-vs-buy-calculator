import { House, Trophy, Wallet } from "lucide-react";
import { useState } from "react";

import type { AssetKey } from "@/calculation/cases/gain-loss/types.ts";
import type { SimulationResult } from "@/calculation/types.ts";
import { GlassPanel } from "@/components/ui/glass";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/utils/formatMoney";

function sumAssets(assets: Partial<Record<AssetKey, number>>): number {
  return Object.values(assets).reduce((sum, val) => sum + (val ?? 0), 0);
}

type NetWorthCardsProps = {
  simulationResult: SimulationResult;
};

/**
 * Side-by-side Buyer vs Renter net worth cards with a year slider,
 * so users can see how the comparison evolves over time.
 */
export function NetWorthCards({ simulationResult }: NetWorthCardsProps) {
  const [year, setYear] = useState(simulationResult.numYears);

  const buyAssets = simulationResult.cases.buy?.assetsByYear[year] ?? {};
  const rentAssets = simulationResult.cases.rent?.assetsByYear[year] ?? {};

  const buyNetWorth = sumAssets(buyAssets);
  const rentNetWorth = sumAssets(rentAssets);
  const buyAhead = buyNetWorth >= rentNetWorth;

  const yearLabel = `year ${year}`;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4">
      <div className="glass-inset mx-auto flex w-full max-w-2xl items-center gap-6 px-6 py-4">
        <span className="glass-chip px-3 py-1 text-sm whitespace-nowrap">
          Year {year}
        </span>
        <Slider
          value={[year]}
          min={0}
          max={simulationResult.numYears}
          step={1}
          onValueChange={([val]: number[]) => setYear(val)}
          className="w-full flex-grow cursor-pointer"
        />
        <span className="text-sm font-medium whitespace-nowrap text-foreground/50">
          Year {simulationResult.numYears}
        </span>
      </div>

      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <PersonCard
          title="If you buy"
          icon={<House size={32} />}
          netWorth={buyNetWorth}
          yearLabel={yearLabel}
          isAhead={buyAhead}
          color="blue"
          assetRows={[
            { label: "Home equity", value: buyAssets.homeEquity },
            { label: "Invested savings", value: buyAssets.investedSavings },
          ]}
        />
        <PersonCard
          title="If you rent & invest"
          icon={<Wallet size={32} />}
          netWorth={rentNetWorth}
          yearLabel={yearLabel}
          isAhead={!buyAhead}
          color="green"
          assetRows={[
            { label: "Invested deposit", value: rentAssets.investedDeposit },
            { label: "Invested savings", value: rentAssets.investedSavings },
          ]}
        />
      </div>
    </div>
  );
}

type PersonCardProps = {
  title: string;
  icon: React.ReactNode;
  netWorth: number;
  yearLabel: string;
  isAhead: boolean;
  color: "blue" | "green";
  assetRows: { label: string; value: number | undefined }[];
};

function PersonCard({
  title,
  icon,
  netWorth,
  yearLabel,
  isAhead,
  color,
  assetRows,
}: PersonCardProps) {
  const colorClasses = {
    blue: {
      ahead: "border-blue-500/40 bg-blue-500/10 ring-1 ring-blue-500/30",
      badge: "bg-blue-500",
      iconWrap:
        "bg-blue-500/20 text-blue-600 ring-blue-500/30 dark:text-blue-400",
    },
    green: {
      ahead: "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/30",
      badge: "bg-green-500",
      iconWrap:
        "bg-green-500/20 text-green-600 ring-green-500/30 dark:text-green-400",
    },
  }[color];

  return (
    <GlassPanel
      className={cn(
        "relative p-10 transition-all duration-300",
        isAhead && cn(colorClasses.ahead, "scale-[1.02]"),
      )}
    >
      {isAhead && (
        <div
          className={cn(
            "absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-white shadow-lg",
            colorClasses.badge,
          )}
        >
          <Trophy size={14} /> Higher net worth
        </div>
      )}
      <div className="flex w-full flex-col items-center space-y-4">
        <div className={cn("rounded-full p-4 ring-1", colorClasses.iconWrap)}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-4xl font-extrabold tracking-tight">
          {formatMoney(netWorth)}
        </div>
        <p className="text-sm text-foreground/50">net worth at {yearLabel}</p>
        <div className="mt-2 w-full space-y-2 border-t border-foreground/10 pt-4 text-left text-sm">
          {assetRows.map(
            ({ label, value }) =>
              value != null &&
              value > 0 && (
                <div
                  key={label}
                  className="flex items-center justify-between text-foreground/70"
                >
                  <span>{label}</span>
                  <span className="font-semibold text-foreground/90">
                    {formatMoney(value)}
                  </span>
                </div>
              ),
          )}
        </div>
      </div>
    </GlassPanel>
  );
}
