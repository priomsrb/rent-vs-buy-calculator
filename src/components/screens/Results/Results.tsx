import { Link } from "@tanstack/react-router";
import { Button } from "../../ui/button.tsx";
import { type PropertyPreset, propertyPresets } from "@/propertyPresets.tsx";
import { Bath, Bed, Building, House, MapPin } from "lucide-react";
import type { PropertyType } from "@/types.tsx";
import { CalculationDetails } from "@/components/screens/Results/CalculationDetails/CalculationDetails.tsx";
import type { EnrichedSimulationParams } from "@/calculation/EnrichedSimulationParams.ts";
import { useState } from "react";
import { simulate } from "@/calculation/Simulator.ts";
import type { SimulationResult } from "@/calculation/types.ts";
import { RentCase } from "@/calculation/cases/RentCase.ts";
import { BuyCase } from "@/calculation/cases/BuyCase.ts";
import { ChartNetWorth } from "@/components/ChartNetWorth.tsx";
import { YearlyBreakdownChart } from "@/components/YearlyBreakdownChart.tsx";
import { compactNumber } from "@/utils/compactNumber.ts";
import _ from "lodash";
import { BackButton } from "@/components/BackButton.tsx";

type ResultsScreenProps = {
  presetId: string;
};

function PropertyImage(props: { preset: PropertyPreset }) {
  return (
    <img
      src={props.preset.image}
      className="h-50 w-96 bg-background object-cover"
      style={{
        viewTransitionName: `${props.preset.id}Image`,
        // @ts-ignore viewTransitionClass not added to react's types yet
        viewTransitionClass: "vertically-align",
      }}
    />
  );
}

type KeyResultsProps = {
  simulationResult: SimulationResult | undefined;
};

function KeyResults({ simulationResult }: KeyResultsProps) {
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

  const compactWinningAmount = compactNumber(winningAmount, 1);

  return (
    <h2
      className={
        "sticky top-0 mb-10 bg-slate-100 py-4 text-center text-3xl shadow-blue-900 dark:bg-slate-900"
      }
    >
      {winningOption} comes ${compactWinningAmount} ahead after{" "}
      {simulationResult?.numYears} years
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
      <div className={"h-100 w-11/12"}>
        <YearlyBreakdownChart simulationResults={simulationResult} />
      </div>
    </div>
  );
}

export function ResultsScreen({ presetId }: ResultsScreenProps) {
  // TODO: Remove if value remains unused
  const [simulationParams, setSimulationParams] = useState<
    EnrichedSimulationParams | undefined
  >(undefined);
  const [simulationResult, setSimulationResult] = useState<
    SimulationResult | undefined
  >(undefined);

  const propertyPreset = _.find(propertyPresets, { id: presetId });
  if (!propertyPreset) {
    // TODO: Handle missing preset
    return "Invalid property preset";
  }

  function onSimulationParamsChanged(params: EnrichedSimulationParams) {
    setSimulationParams(params);
    const simulationResult = simulate(
      params,
      [BuyCase, RentCase],
      params.numYears,
    );
    setSimulationResult(simulationResult);
  }

  return (
    <div className={"flex w-full justify-center"}>
      <BackButton
        to={"/start/$presetId/confirm"}
        params={{ presetId: propertyPreset.id }}
        viewTransition={true}
        draggable={false}
        className={"z-10"}
      />
      <div className={"flex w-full flex-col justify-center md:w-350"}>
        <div className="mt-20"></div>
        {/*<PropertyImage preset={preset} />*/}
        {/*<PropertyInfo preset={preset} />*/}
        {/*<p>Renting comes out $1.5m ahead after 30 years</p>*/}
        {/*<img src={fakeGraph} />*/}
        {/*<img src={fakeBreakdown} />*/}
        <div className="flex w-full flex-col md:flex-row-reverse">
          <div className="md:flex-1">
            <KeyResults simulationResult={simulationResult} />
            <NetWorthChart simulationResult={simulationResult} />
            <BreakdownChart simulationResult={simulationResult} />
          </div>
          <div className={"md:w-100"}>
            <CalculationDetails
              propertyPreset={propertyPreset}
              onSimulationParamsChanged={onSimulationParamsChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyInfo(props: { preset: PropertyPreset }) {
  return (
    <div className="flex flex-1 flex-col items-start p-4">
      {/* TODO: Format money. e.g. $1.5m or $600k */}
      <p>
        <MapPin className="inline-block" /> {props.preset.locationDescription}
      </p>
      <p className="flex gap-2">
        <span className="flex gap-1">
          <Bed />
          {props.preset.bedrooms}
        </span>
        ·
        <span className="flex gap-1">
          <Bath />
          {props.preset.bathrooms}
        </span>
        ·
        <span className="flex gap-1">
          {getIconForPropertyType(props.preset.propertyType)}
          {getNameForPropertyType(props.preset.propertyType)}
        </span>
      </p>
      <p>Buy: ${props.preset.propertyPrice}</p>
      <p>Rent: ${props.preset.rentPerWeek} / week</p>
    </div>
  );
}

function getNameForPropertyType(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return "House";
    case "unit":
      return "Apartment";
    default:
      return propertyType;
  }
}

function getIconForPropertyType(propertyType: PropertyType) {
  switch (propertyType) {
    case "house":
      return <House />;
    case "unit":
      return <Building />;
    default:
      return <House />;
  }
}
