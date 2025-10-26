import { type SimulationResult, type CaseBreakdown } from "./types";
import type { EnrichedSimulationParams } from "./EnrichedSimulationParams";
import type { SimulationCase } from "./cases/types";
import _ from "lodash";

export function simulate(
  params: EnrichedSimulationParams,
  cases: SimulationCase[],
): SimulationResult {
  const { numYears } = params;
  const result: SimulationResult = {
    numYears,
    cases: {},
    breakdownInfo: cases
      .flatMap((simulationCase) => simulationCase.gainLosses)
      .reduce((acc, breakdown) => ({ ...acc, [breakdown.key]: breakdown }), {}),
  };

  for (let year = 0; year < numYears; year++) {
    for (let simulationCase of cases) {
      result.cases![simulationCase.key] ??= {
        ...simulationCase,
        breakdownByYear: [],
        netWorthByYear: [],
      };

      const caseResults = result.cases[simulationCase.key]!;

      const breakdownForYear: CaseBreakdown = {};
      for (let gainLoss of simulationCase.gainLosses) {
        const gainLossAmount = gainLoss.calculateForYear({
          params,
          year,
          previousBreakdowns: caseResults.breakdownByYear,
        });

        breakdownForYear[gainLoss.key] = gainLossAmount;
      }
      caseResults.breakdownByYear.push(breakdownForYear);
    }

    const mostMoneySpentOnACase =
      _(result.cases)
        .map((simulationCase) => {
          const caseResults = result.cases[simulationCase!.key]!;
          const breakdownForYear = caseResults.breakdownByYear[year];
          const moneySpentInYear = _(breakdownForYear)
            .filter((x) => x < 0) // Only count losses
            .sum();
          return moneySpentInYear;
        })
        .min() ?? 0;

    for (let simulationCase of cases) {
      const breakdownForYear =
        result.cases[simulationCase!.key]?.breakdownByYear[year];
      const moneySpentInYear = _(breakdownForYear)
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

      let networthForYear;
      if (year === 0) {
        networthForYear = simulationCase.getStartingBalance(params);
      } else {
        const previousNetworth = caseResults.netWorthByYear[year - 1];
        networthForYear = previousNetworth + gainsForYear;
      }

      caseResults.netWorthByYear.push(networthForYear);
    }
  }
  return result;
}
