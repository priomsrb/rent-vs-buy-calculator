import { propertyPresets } from "@/propertyPresets.tsx";
import { CalculationDetails } from "@/components/screens/Results/CalculationDetails/CalculationDetails.tsx";
import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { simulate } from "@/calculation/Simulator.ts";
import type { SimulationResult } from "@/calculation/types.ts";
import { RentCase } from "@/calculation/cases/RentCase.ts";
import { BuyCase } from "@/calculation/cases/BuyCase.ts";
import { ChartNetWorth } from "@/components/ChartNetWorth.tsx";
import { YearlyBreakdownChart } from "@/components/YearlyBreakdownChart.tsx";
import { compactNumber } from "@/utils/compactNumber.ts";
import _ from "lodash";
import { BackButton } from "@/components/BackButton.tsx";
import { roundWithDecimals } from "@/utils/roundWithDecimals.ts";
import { cn } from "@/lib/utils.ts";

type ResultsScreenProps = {
  presetId: string;
};

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
    console.log("ref", ref.current.offsetTop);
    console.log("scroll", window.scrollY);
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

  const rentNetWorth =
    simulationResult.cases.rent?.netWorthByYear[simulationResult.numYears - 1];
  const buyNetWorth =
    simulationResult.cases.buy?.netWorthByYear[simulationResult.numYears - 1];

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
  const winningPercentage = roundWithDecimals(
    (winningAmount / Math.min(rentNetWorth, buyNetWorth)) * 100,
    1,
  );

  const compactWinningAmount = compactNumber(winningAmount, 1);

  return (
    <h2
      ref={ref}
      className={cn([
        "sticky top-0 mb-10 bg-slate-100 py-4 text-center text-2xl shadow-2xl shadow-transparent transition-all dark:bg-slate-900",
        isSticky && "shadow-black/15 dark:shadow-gray-950/65",
      ])}
    >
      {winningOption} comes ${compactWinningAmount} ({winningPercentage}%) ahead
      after {simulationResult?.numYears} years
    </h2>
  );
}

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
  const seriesBuy = yearArrayToMonths(
    simulationResult.cases.buy!.netWorthByYear,
  );
  const seriesRent = yearArrayToMonths(
    simulationResult.cases.rent!.netWorthByYear,
  );
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
      <div className={"h-150 w-11/12"}>
        <YearlyBreakdownChart simulationResult={simulationResult} />
      </div>
    </div>
  );
}

export function ResultsScreen({ presetId }: ResultsScreenProps) {
  const [simulationResult, setSimulationResult] = useState<
    SimulationResult | undefined
  >(undefined);

  const propertyPreset = _.find(propertyPresets, { id: presetId });
  if (!propertyPreset) {
    // TODO: Handle missing preset
    return "Invalid property preset";
  }

  function onSimulationParamsChanged(params: EnrichedSimulationParams) {
    const simulationResult = simulate(
      params,
      [BuyCase, RentCase],
      params.numYears,
    );
    setSimulationResult(simulationResult);
  }

  return (
    <div className={"flex w-screen justify-center md:p-4"}>
      <BackButton
        to={"/start/$presetId/confirm"}
        params={{ presetId: propertyPreset.id }}
        viewTransition={true}
        draggable={false}
        className={"z-10"}
      />
      <div className={"flex w-full flex-col justify-center md:w-350"}>
        <div className="mt-5"></div>
        {/*<PropertyImage preset={preset} />*/}
        {/*<PropertyInfo preset={preset} />*/}
        <div className="flex w-full flex-col md:flex-row-reverse">
          <div className="md:flex-1">
            <h1 className={"m-4 text-center text-3xl"}>Results</h1>
            <KeyResults simulationResult={simulationResult} />
            <div className="mt-10"></div>
            <NetWorthChart simulationResult={simulationResult} />
            <div className="mt-10"></div>
            <BreakdownChart simulationResult={simulationResult} />
          </div>
          <div className={"md:w-100"}>
            <CalculationDetails
              propertyPreset={propertyPreset}
              onSimulationParamsChanged={onSimulationParamsChanged}
            />
          </div>
        </div>
        <div className="mt-10"></div>
      </div>
    </div>
  );
}
