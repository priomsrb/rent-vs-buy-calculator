import { Shield, Trophy, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import {
  type SimulationParams,
  getEnrichedSimulationParams,
} from "@/calculation/EnrichedSimulationParams";
import { simulate } from "@/calculation/Simulator";
import { BuyCase } from "@/calculation/cases/BuyCase";
import { RentCase } from "@/calculation/cases/RentCase";
import { ChartNetWorth } from "@/components/ChartNetWorth";
import { basePreset } from "@/components/screens/Results/formPresets";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatMoney } from "@/utils/formatMoney";
import { parseLocalStorage } from "@/utils/localStorage";
import { Link } from "@tanstack/react-router";

function sumAllAssets(assets: Partial<Record<string, number>>): number {
  return (
    Object.values(assets).reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0) ?? 0
  );
}

function yearArrayToMonths(series: number[]): number[] {
  return series.flatMap((val) => Array.from({ length: 12 }, () => val));
}

export function Summary() {
  const existingFormData = parseLocalStorage("formData") ?? {};
  const defaultValues = {
    ...basePreset,
    ...existingFormData,
  } as SimulationParams;

  const simulationParams = useMemo(
    () => getEnrichedSimulationParams({ ...defaultValues }),
    [],
  );

  const simulationResult = useMemo(
    () => simulate(simulationParams, [BuyCase, RentCase]),
    [simulationParams],
  );

  const [year, setYear] = useState(simulationParams.numYears);

  const rentCase = simulationResult.cases.rent!;
  const buyCase = simulationResult.cases.buy!;

  const buyAssets = buyCase.assetsByYear[year - 1] ?? {};
  const rentAssets = rentCase.assetsByYear[year - 1] ?? {};

  const rentNetWorth = sumAllAssets(rentAssets);
  const buyNetWorth = sumAllAssets(buyAssets);

  const { breakdownInfo } = simulationResult;

  const buyExpenses = useMemo(() => {
    const totals: Record<string, number> = {};
    for (let y = 0; y < year; y++) {
      for (const [key, value] of Object.entries(
        buyCase.breakdownByYear[y] ?? {},
      )) {
        if (!breakdownInfo[key]?.asset && value < 0) {
          totals[key] = (totals[key] ?? 0) + value;
        }
      }
    }
    return Object.entries(totals)
      .map(([key, value]) => {
        const info = breakdownInfo[key];
        const desc = info?.description;
        const description =
          typeof desc === "function" ? desc(simulationParams, year) : desc;
        return {
          key,
          label: info?.label ?? key,
          value: Math.abs(value),
          description,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [buyCase, breakdownInfo, year, simulationParams]);

  const rentExpenses = useMemo(() => {
    const totals: Record<string, number> = {};
    for (let y = 0; y < year; y++) {
      for (const [key, value] of Object.entries(
        rentCase.breakdownByYear[y] ?? {},
      )) {
        if (!breakdownInfo[key]?.asset && value < 0) {
          totals[key] = (totals[key] ?? 0) + value;
        }
      }
    }
    return Object.entries(totals)
      .map(([key, value]) => {
        const info = breakdownInfo[key];
        const desc = info?.description;
        const description =
          typeof desc === "function" ? desc(simulationParams, year) : desc;
        return {
          key,
          label: info?.label ?? key,
          value: Math.abs(value),
          description,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [rentCase, breakdownInfo, year, simulationParams]);

  const buyAhead = buyNetWorth >= rentNetWorth;
  const difference = Math.abs(buyNetWorth - rentNetWorth);
  const aheadLabel = buyAhead ? "Buying" : "Renting";
  const AheadIcon = buyAhead ? Shield : Wallet;

  const seriesBuy = yearArrayToMonths(buyCase.assetsByYear.map(sumAllAssets));
  const seriesRent = yearArrayToMonths(rentCase.assetsByYear.map(sumAllAssets));

  const yearLabel = `${year} year${year !== 1 ? "s" : ""}`;

  return (
    <div className="flex w-full justify-center relative min-h-[calc(100vh-80px)]">
      <div className="absolute top-[-20%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col items-center p-6 md:p-10 text-center z-10 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl mx-auto pt-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
            Net Worth Summary
          </h1>
          <p className="text-xl text-white/60">
            Comparing final net worth after {yearLabel} of renting vs. buying.
          </p>
        </div>

        {/* Year slider */}
        <div className="w-full max-w-2xl mx-auto flex items-center gap-6 px-6 bg-white/5 py-4 rounded-2xl border border-white/10">
          <span className="font-medium text-white/80 whitespace-nowrap bg-white/10 px-3 py-1 rounded-full text-sm">
            Year {year}
          </span>
          <Slider
            value={[year]}
            min={1}
            max={simulationParams.numYears}
            step={1}
            onValueChange={([val]: number[]) => setYear(val)}
            className="flex-grow w-full cursor-pointer"
          />
          <span className="font-medium text-white/50 text-sm whitespace-nowrap">
            Year {simulationParams.numYears}
          </span>
        </div>

        {/* Net worth cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          {/* Buyer */}
          <div
            className={`relative rounded-[2.5rem] border p-10 shadow-2xl backdrop-blur-md transition-all duration-300 ${
              buyAhead
                ? "border-blue-500/40 bg-blue-500/10 ring-1 ring-blue-500/30 scale-[1.02]"
                : "border-white/10 bg-white/5"
            }`}
          >
            {buyAhead && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap flex items-center gap-1.5">
                <Trophy size={14} /> Higher net worth
              </div>
            )}
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="p-4 bg-blue-500/20 rounded-full text-blue-400 ring-1 ring-blue-500/30">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Buyer</h2>
              <div className="text-4xl font-extrabold text-white tracking-tight">
                {formatMoney(buyNetWorth)}
              </div>
              <p className="text-sm text-white/50">
                net worth after {yearLabel}
              </p>
              <div className="w-full mt-2 pt-4 border-t border-white/10 space-y-2 text-sm text-left">
                {buyAssets.homeEquity != null && (
                  <div className="flex justify-between items-center text-white/70">
                    <span>Home equity</span>
                    <span className="font-semibold text-white/90">
                      {formatMoney(buyAssets.homeEquity)}
                    </span>
                  </div>
                )}
                {buyAssets.investedSavings != null &&
                  buyAssets.investedSavings > 0 && (
                    <div className="flex justify-between items-center text-white/70">
                      <span>Invested savings</span>
                      <span className="font-semibold text-white/90">
                        {formatMoney(buyAssets.investedSavings)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Renter */}
          <div
            className={`relative rounded-[2.5rem] border p-10 shadow-2xl backdrop-blur-md transition-all duration-300 ${
              !buyAhead
                ? "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/30 scale-[1.02]"
                : "border-white/10 bg-white/5"
            }`}
          >
            {!buyAhead && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-semibold shadow-lg whitespace-nowrap flex items-center gap-1.5">
                <Trophy size={14} /> Higher net worth
              </div>
            )}
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="p-4 bg-green-500/20 rounded-full text-green-400 ring-1 ring-green-500/30">
                <Wallet size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Renter</h2>
              <div className="text-4xl font-extrabold text-white tracking-tight">
                {formatMoney(rentNetWorth)}
              </div>
              <p className="text-sm text-white/50">
                net worth after {yearLabel}
              </p>
              <div className="w-full mt-2 pt-4 border-t border-white/10 space-y-2 text-sm text-left">
                {rentAssets.investedDeposit != null && (
                  <div className="flex justify-between items-center text-white/70">
                    <span>Invested deposit</span>
                    <span className="font-semibold text-white/90">
                      {formatMoney(rentAssets.investedDeposit)}
                    </span>
                  </div>
                )}
                {rentAssets.investedSavings != null &&
                  rentAssets.investedSavings > 0 && (
                    <div className="flex justify-between items-center text-white/70">
                      <span>Invested savings</span>
                      <span className="font-semibold text-white/90">
                        {formatMoney(rentAssets.investedSavings)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Cumulative expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          {/* Buyer expenses */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
            <h3 className="text-lg font-semibold text-white/80 mb-4">
              Buyer — cumulative expenses
            </h3>
            <Accordion type="single" collapsible>
              {buyExpenses.map(({ key, label, value, description }) =>
                description ? (
                  <AccordionItem key={key} value={key} className="border-b-0">
                    <AccordionTrigger className="py-1 text-sm font-normal text-white/70 hover:no-underline hover:text-white/90 gap-2">
                      <div className="flex flex-1 justify-between">
                        <span>{label}</span>
                        <span className="font-semibold text-red-400">
                          -{formatMoney(value)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 text-xs text-white/50 text-left whitespace-pre-line">
                      {description}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div
                    key={key}
                    className="flex justify-between items-center text-sm text-white/70 py-1 pr-5"
                  >
                    <span>{label}</span>
                    <span className="font-semibold text-red-400">
                      -{formatMoney(value)}
                    </span>
                  </div>
                ),
              )}
            </Accordion>
            <div className="flex justify-between items-center pt-3 border-t border-white/10 text-sm font-bold text-white/90">
              <span>Total</span>
              <span className="text-red-400">
                -{formatMoney(buyExpenses.reduce((s, e) => s + e.value, 0))}
              </span>
            </div>
          </div>

          {/* Renter expenses */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
            <h3 className="text-lg font-semibold text-white/80 mb-4">
              Renter — cumulative expenses
            </h3>
            <Accordion type="single" collapsible>
              {rentExpenses.map(({ key, label, value, description }) =>
                description ? (
                  <AccordionItem key={key} value={key} className="border-b-0">
                    <AccordionTrigger className="py-1 text-sm font-normal text-white/70 hover:no-underline hover:text-white/90 gap-2">
                      <div className="flex flex-1 justify-between">
                        <span>{label}</span>
                        <span className="font-semibold text-red-400">
                          -{formatMoney(value)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 text-xs text-white/50 text-left whitespace-pre-line">
                      {description}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div
                    key={key}
                    className="flex justify-between items-center text-sm text-white/70 py-1 pr-5"
                  >
                    <span>{label}</span>
                    <span className="font-semibold text-red-400">
                      -{formatMoney(value)}
                    </span>
                  </div>
                ),
              )}
            </Accordion>
            <div className="flex justify-between items-center pt-3 border-t border-white/10 text-sm font-bold text-white/90">
              <span>Total</span>
              <span className="text-red-400">
                -{formatMoney(rentExpenses.reduce((s, e) => s + e.value, 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Difference callout */}
        <div
          className={`w-full max-w-2xl mx-auto rounded-[2.5rem] border border-white/10 bg-gradient-to-r ${
            buyAhead
              ? "from-blue-500/20 to-purple-500/20"
              : "from-green-500/20 to-teal-500/20"
          } p-10 shadow-2xl backdrop-blur-md flex flex-col items-center space-y-3`}
        >
          <div className="flex items-center gap-3 text-white/60 text-sm font-medium uppercase tracking-widest">
            <AheadIcon size={16} />
            {aheadLabel} is ahead by
          </div>
          <div className="text-5xl font-extrabold text-white tracking-tight">
            {formatMoney(difference)}
          </div>
          <p className="text-white/40 text-base">after {yearLabel}</p>
        </div>

        {/* Net worth chart */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Net Worth Over Time
            </h2>
            <div className="h-80 w-full">
              <ChartNetWorth seriesBuy={seriesBuy} seriesRent={seriesRent} />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between w-full max-w-4xl mx-auto pb-8">
          <Link to="/start" draggable={false}>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg rounded-full backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              Exit
            </Button>
          </Link>
          <Link to="/explain" draggable={false}>
            <Button className="px-8 py-6 text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              See full breakdown
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
