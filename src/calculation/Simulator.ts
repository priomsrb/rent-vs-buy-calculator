import { type SimulationResult, type CaseBreakdown } from "./types";
import type { EnrichedSimulationParams } from "./EnrichedSimulationParams";
import type { SimulationCase } from "./cases/types";
import _ from "lodash";
import type {
  AssetKey,
  GainLoss,
} from "@/calculation/cases/gain-loss/types.ts";

export function simulate(
  params: EnrichedSimulationParams,
  cases: SimulationCase[],
): SimulationResult {
  const { numYears } = params;

  const breakdownInfo: Record<GainLoss["key"], GainLoss> = cases
    .flatMap((simulationCase) => simulationCase.gainLosses)
    .reduce((acc, breakdown) => ({ ...acc, [breakdown.key]: breakdown }), {});

  const result: SimulationResult = {
    numYears,
    cases: {},
    breakdownInfo,
  };

  for (let year = 0; year < numYears; year++) {
    for (let simulationCase of cases) {
      result.cases![simulationCase.key] ??= {
        ...simulationCase,
        breakdownByYear: [],
        netWorthByYear: [],
        assetsByYear: [],
      };

      const caseResults = result.cases[simulationCase.key]!;

      const breakdownForYear: CaseBreakdown = {};
      caseResults.breakdownByYear.push(breakdownForYear);
      for (let gainLoss of simulationCase.gainLosses) {
        const gainLossAmount = gainLoss.calculateForYear({
          params,
          year,
          previousBreakdowns: caseResults.breakdownByYear,
        });

        breakdownForYear[gainLoss.key] = gainLossAmount;
      }
    }

    const mostMoneySpentOnACase =
      _(result.cases)
        .map((simulationCase) => {
          const caseResults = result.cases[simulationCase!.key]!;
          const breakdownForYear = caseResults.breakdownByYear[year];
          const moneySpentInYear = _(breakdownForYear)
            .pickBy((_, breakdownKey) => {
              return breakdownInfo[breakdownKey]?.asset === undefined;
            }) // Don't count changes in assets. We only care about actual cash spent
            .filter((x) => x < 0) // Only count losses
            .sum();
          return moneySpentInYear;
        })
        .min() ?? 0;

    for (let simulationCase of cases) {
      const breakdownForYear =
        result.cases[simulationCase!.key]?.breakdownByYear[year];
      const moneySpentInYear = _(breakdownForYear)
        .pickBy(
          (_, breakdownKey) => breakdownInfo[breakdownKey]?.asset === undefined,
        ) // Don't count changes in assets. We only care about actual cash spent
        .filter((x) => x < 0) // Only count losses
        .sum();
      const surplusAmount = moneySpentInYear - mostMoneySpentOnACase;
      if (surplusAmount && breakdownForYear) {
        breakdownForYear["surplusCashflow"] = surplusAmount;
      }
    }

    for (let simulationCase of cases) {
      const caseResults = result.cases[simulationCase!.key]!;
      const breakdownForYear = caseResults.breakdownByYear[year];

      const gainsForYear = _(breakdownForYear)
        .filter((x) => x > 0) // Only count gains
        .sum(); // Sum up the gains

      const assetChangesForYear: Partial<Record<AssetKey, number>> = _(
        breakdownForYear,
      )
        .map((changeInAsset, breakdownKey): [AssetKey, number] | undefined => {
          const asset = breakdownInfo[breakdownKey]?.asset;
          if (asset) {
            return [asset, changeInAsset];
          } else {
            return undefined;
          }
        })
        .compact()
        .reduce(
          (
            result: Partial<Record<AssetKey, number>>,
            [assetKey, changeInAsset],
          ) => ({
            ...result,
            [assetKey]: (result[assetKey] ?? 0) + changeInAsset,
          }),
          {},
        );

      let currentAssets: Partial<Record<AssetKey, number>>;
      let currentNetWorth;
      if (year === 0) {
        currentAssets = simulationCase.getStartingAssets(params);
        currentNetWorth = simulationCase.getStartingBalance(params);
      } else {
        const previousAssets = caseResults.assetsByYear[year - 1];
        // TODO: Fix types
        currentAssets = _(assetChangesForYear)
          .mapValues(
            (assetChange: number, assetKey: AssetKey) =>
              (previousAssets[assetKey] ?? 0) + assetChange,
          )
          .value();

        const previousNetWorth = caseResults.netWorthByYear[year - 1];
        currentNetWorth = previousNetWorth + gainsForYear;
      }

      caseResults.assetsByYear.push(currentAssets);
      caseResults.netWorthByYear.push(currentNetWorth);
    }
  }
  return result;
}
