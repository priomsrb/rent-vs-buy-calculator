import _ from "lodash";
import React, { useEffect, useState } from "react";

import type { SimulationResult } from "@/calculation/types.ts";
import { Slider } from "@/components/ui/slider.tsx";

import { GainLossBreakdown } from "./BreakdownChart";

export interface YearlyBreakdownChartProps {
  simulationResult: SimulationResult;
}

export const YearlyBreakdownChart: React.FC<YearlyBreakdownChartProps> = ({
  simulationResult,
}) => {
  const maxYear = simulationResult.numYears - 1;

  const [selectedYear, setSelectedYear] = useState(() => {
    const savedYear = localStorage.getItem("yearlyBreakdown-selectedYear");
    if (savedYear) {
      const year = Number(savedYear);
      return Math.min(year, maxYear);
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem("yearlyBreakdown-selectedYear", String(selectedYear));
  }, [selectedYear]);

  return (
    <div className={"flex h-full w-full flex-col gap-10"}>
      <div className={"flex flex-1"}>
        <div
          className={
            "flex flex-none shrink flex-col justify-around pr-5 text-right"
          }
        >
          <div
            className={"text-lg text-muted-foreground"}
            style={{ writingMode: "sideways-lr" }}
          >
            Gains
          </div>
          <div
            className={"text-lg text-muted-foreground"}
            style={{ writingMode: "sideways-lr" }}
          >
            Losses
          </div>
        </div>
        <div className={"flex-1"}>
          <GainLossBreakdown
            simulationResult={simulationResult}
            year={selectedYear}
          />
        </div>
      </div>
      <div
        className={"flex flex-col items-center"}
        style={{ marginTop: 16, textAlign: "center" }}
      >
        <label
          htmlFor="yearSlider"
          style={{ display: "block", marginBottom: 8 }}
        >
          Year: {selectedYear + 1}
        </label>
        <Slider
          id="yearSlider"
          min={1}
          max={maxYear + 1}
          value={[selectedYear + 1]}
          onValueChange={([value]) => setSelectedYear(value - 1)}
        />
      </div>
    </div>
  );
};
