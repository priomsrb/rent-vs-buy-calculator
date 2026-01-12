import _ from "lodash";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import { simulate } from "@/calculation/Simulator.ts";
import { BuyCase } from "@/calculation/cases/BuyCase.ts";
import { RentCase } from "@/calculation/cases/RentCase.ts";
import { SurplusCashflow } from "@/calculation/cases/gain-loss/SurplusCashflow.ts";
import { emptySimulationParams } from "@/calculation/cases/gain-loss/testConstants.ts";
import type { AssetKey } from "@/calculation/cases/gain-loss/types.ts";
import type { SimulationResult } from "@/calculation/types.ts";
import { BackButton } from "@/components/BackButton.tsx";
import { ChartNetWorth } from "@/components/ChartNetWorth.tsx";
import { YearlyBreakdownChart } from "@/components/YearlyBreakdownChart.tsx";
import {
  CalculationDetails,
  CalculationDetailsDrawer,
  type CalculationDetailsProps,
} from "@/components/screens/Results/CalculationDetails/CalculationDetails.tsx";
import ProsAndCons from "@/components/screens/Results/ProsAndCons.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { cn } from "@/lib/utils.ts";
import { type PropertyPreset } from "@/propertyPresets.tsx";
import { compactNumber } from "@/utils/compactNumber.ts";
import { compactMoney } from "@/utils/formatMoney";
import { roundWithDecimals } from "@/utils/roundWithDecimals.ts";

type ResultsScreenProps = {
  propertyPreset: PropertyPreset;
};

export function ResultsScreen({ propertyPreset }: ResultsScreenProps) {
  const [simulationResult, setSimulationResult] = useState<
    SimulationResult | undefined
  >(undefined);

  const [simulationParams, setSimulationParams] =
    useState<EnrichedSimulationParams>(emptySimulationParams);

  const onSimulationParamsChanged = useCallback(
    (params: EnrichedSimulationParams) => {
      const simulationResult = simulate(params, [BuyCase, RentCase]);
      setSimulationResult(simulationResult);
      setSimulationParams(params);
    },
    [],
  );

  return (
    <div className={"flex w-full justify-center"}>
      <BackButton
        to={"/start/$presetId/confirm"}
        params={{ presetId: propertyPreset.id }}
        viewTransition={true}
        draggable={false}
        className={"z-30"}
      />
      <div className={"flex w-full flex-col justify-center md:w-350"}>
        <div className="mt-5"></div>
        <div className="flex w-full flex-col md:flex-row-reverse">
          <div className="md:flex-1">
            <h1 className={"m-4 text-center text-3xl"}>Results</h1>
            <KeyResults simulationResult={simulationResult} />
            <div className="mt-10"></div>
            <NetWorthChart simulationResult={simulationResult} />
            <div className="mt-10"></div>
            <BreakdownChart simulationResult={simulationResult} />
            <div className="mt-10"></div>
            <ProsAndCons simulationParams={simulationParams} />
            <div className="mt-10"></div>
          </div>
          <CalculationDetailsSection
            propertyPreset={propertyPreset}
            onSimulationParamsChanged={onSimulationParamsChanged}
          />
        </div>
      </div>
    </div>
  );
}

type KeyResultsProps = {
  simulationResult: SimulationResult | undefined;
};

function KeyResults({ simulationResult }: KeyResultsProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = useCallback(() => {
    if (!ref.current) {
      return;
    }
    if (Math.abs(window.scrollY - ref.current.offsetTop) > 1) {
      setIsSticky(false);
    } else {
      setIsSticky(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!simulationResult) {
    return null;
  }

  const rentNetWorth = sumAssets(
    simulationResult.cases.rent!.assetsByYear[simulationResult.numYears - 1],
  );
  const buyNetWorth = sumAssets(
    simulationResult.cases.buy!.assetsByYear[simulationResult.numYears - 1],
  );
  const amountInvestedPerMonth =
    (simulationResult.cases.rent?.breakdownByYear[0][SurplusCashflow.key] ||
      0) / 12;

  if (rentNetWorth === undefined || buyNetWorth === undefined) {
    return null;
  }

  let winningOption;
  if (rentNetWorth > buyNetWorth) {
    winningOption = "Renting";
  } else {
    winningOption = "Buying";
  }

  const winningAmount = Math.abs(rentNetWorth - buyNetWorth);
  const winningPercent = roundWithDecimals(
    (winningAmount / Math.min(rentNetWorth, buyNetWorth)) * 100,
    1,
  );

  const compactWinningAmount = compactNumber(winningAmount, 1);

  const Highlight = ({ children }: { children: ReactNode }) => {
    return <span className={"text-positive-foreground"}>{children}</span>;
  };

  return (
    <h2
      ref={ref}
      className={cn([
        "sticky top-0 z-30 mb-10 bg-slate-100 py-4 text-center text-2xl shadow-2xl shadow-transparent dark:bg-slate-900",
        isSticky && "shadow-black/15 dark:shadow-gray-950/65",
      ])}
      data-testid={KEY_RESULTS_MESSAGE_TESTID}
    >
      <Highlight>{winningOption}</Highlight> comes{" "}
      <Highlight>
        ${compactWinningAmount} ({winningPercent}%)
      </Highlight>{" "}
      ahead after {simulationResult?.numYears} years
      {winningOption === "Renting" && (
        <>
          ,<br />
          assuming{" "}
          <Highlight>{compactMoney(amountInvestedPerMonth, 1)}</Highlight> is
          invested every month{" "}
        </>
      )}
    </h2>
  );
}

export const KEY_RESULTS_MESSAGE_TESTID = "key-results-message";

function NetWorthChart({
  simulationResult,
}: {
  simulationResult: SimulationResult | undefined;
}) {
  if (!simulationResult) {
    return null;
  }
  function yearArrayToMonths(series: number[]): number[] {
    return series.flatMap((val) => Array.from({ length: 12 }, () => val));
  }

  const seriesBuyNetAssets =
    simulationResult.cases.buy!.assetsByYear.map(sumAssets);
  const seriesBuy = yearArrayToMonths(seriesBuyNetAssets);
  const seriesRentNetAssets =
    simulationResult.cases.rent!.assetsByYear.map(sumAssets);
  const seriesRent = yearArrayToMonths(seriesRentNetAssets);
  return (
    <div
      className={
        "flex w-full flex-col items-center justify-center border py-6 pr-4"
      }
    >
      <h1 className={"mt-0 mb-4 text-3xl"}>Net worth</h1>
      <div className={"h-100 w-11/12"}>
        <ChartNetWorth seriesBuy={seriesBuy} seriesRent={seriesRent} />
      </div>
    </div>
  );
}

function BreakdownChart({
  simulationResult,
}: {
  simulationResult: SimulationResult | undefined;
}) {
  const [breakdownType, setBreakdownType] = useState<string>("gainLoss");
  if (!simulationResult) {
    return null;
  }
  return (
    <div
      className={
        "flex w-full flex-col items-center justify-center border py-6 pr-4"
      }
    >
      <h1 className={"mt-0 mb-4 text-3xl"}>Breakdown by year</h1>
      <Select
        name={"breakdownType"}
        value={breakdownType}
        onValueChange={(value: string) => setBreakdownType(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="gainLoss">Gains & Losses</SelectItem>
            <SelectItem value="assets">Asset breakdown</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className={"h-150 w-11/12"}>
        <YearlyBreakdownChart simulationResult={simulationResult} />
      </div>
    </div>
  );
}

function sumAssets(assets: Partial<Record<AssetKey, number>>): number {
  return _.reduce(assets, (result, value) => result + (value ?? 0), 0);
}

function CalculationDetailsSection({
  propertyPreset,
  onSimulationParamsChanged,
}: CalculationDetailsProps) {
  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <div
        className={cn(
          "hidden md:block",
          "sticky top-0 mt-10 overflow-y-auto md:h-screen md:w-100 md:self-start",
        )}
      >
        <CalculationDetails
          propertyPreset={propertyPreset}
          onSimulationParamsChanged={onSimulationParamsChanged}
        />
      </div>

      {/* Mobile drawer - hidden on desktop */}
      <CalculationDetailsDrawer
        propertyPreset={propertyPreset}
        onSimulationParamsChanged={onSimulationParamsChanged}
      />
    </>
  );
}
