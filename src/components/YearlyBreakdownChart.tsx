import React, { useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import type { SimulationResult } from "@/calculation/types.ts";
import { compactNumber } from "@/utils/compactNumber.ts";
import { Slider } from "@/components/ui/slider.tsx";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  annotationPlugin,
);

// @ts-ignore
Tooltip.positioners.followMouse = function (elements, eventPosition) {
  return {
    x: eventPosition.x,
    y: eventPosition.y,
  };
};

const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export interface YearlyBreakdownChartProps {
  simulationResult: SimulationResult;
}

function splitIntoLines(text: string, lineLength: number = 40) {
  const descriptionWords = text.split(" ");
  const descriptionLines = [""];
  let currentLineIndex = 0;

  for (let i = 0; i < descriptionWords.length; i++) {
    const currentLine = descriptionLines[currentLineIndex];
    const currentWord = descriptionWords[i];
    if (currentLine.length + currentWord.length <= lineLength) {
      descriptionLines[currentLineIndex] += ` ${currentWord}`;
    } else {
      descriptionLines.push(currentWord);
      currentLineIndex++;
    }
  }
  return descriptionLines;
}

export const YearlyBreakdownChart: React.FC<YearlyBreakdownChartProps> = ({
  simulationResult,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const maxYear = simulationResult.numYears - 1;

  const [selectedYear, setSelectedYear] = useState(() => {
    const savedYear = localStorage.getItem("yearlyBreakdown-selectedYear");
    if (savedYear) {
      const year = Number(savedYear);
      return Math.min(year, maxYear);
    }
    return 0;
  });

  const maxAbsValue = useMemo(() => {
    const caseBreakdownsForYear = _.mapValues(
      simulationResult.cases,
      (simulationCase) => simulationCase?.breakdownByYear[selectedYear],
    );
    const largestSumOfGains =
      _(caseBreakdownsForYear)
        .mapValues((breakdowns) =>
          _(breakdowns)
            .filter((gainOrLoss) => gainOrLoss > 0)
            .sum(),
        )
        .values()
        .max() ?? 0;
    const largestSumOfLosses =
      _(caseBreakdownsForYear)
        .mapValues((breakdowns) =>
          _(breakdowns)
            .filter((gainOrLoss) => gainOrLoss < 0)
            .sum(),
        )
        .values()
        .min() ?? 0;

    const max = Math.max(largestSumOfGains, Math.abs(largestSumOfLosses));
    return max;
    // return max * 1.1; // Add some padding
  }, [selectedYear]);

  useEffect(() => {
    localStorage.setItem("yearlyBreakdown-selectedYear", String(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    function getBreakdownColor(breakdownKey: string) {
      return simulationResult.breakdownInfo[breakdownKey].color;
    }

    function getBreakdownLabel(breakdownKey: string) {
      const breakdown = simulationResult.breakdownInfo[breakdownKey];
      return breakdown.label;
    }

    const data = {
      labels: Object.values(simulationResult.cases).map(
        (simulationCase) => simulationCase.label,
      ),

      datasets: Object.entries(simulationResult.cases).flatMap(
        ([_, { breakdownByYear }]) => {
          return Object.entries(breakdownByYear[0]).map(([breakdownKey, _]) => {
            return {
              label: getBreakdownLabel(breakdownKey),
              description:
                simulationResult.breakdownInfo[breakdownKey].description,
              data: [],
              backgroundColor: getBreakdownColor(breakdownKey),
              // stack: caseKey,
            };
          });
        },
      ),
    };

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0,
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
            ticks: {
              autoSkip: false,
              font: {
                size: 20,
              },
            },
          },
          y: {
            stacked: true,
            min: -maxAbsValue,
            max: maxAbsValue,
            ticks: {
              callback: (v: any) => `$${compactNumber(Number(v))}`,
              font: {
                size: 15,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            // caretPadding: 100,
            // xAlign: "center",
            // @ts-ignore
            position: "followMouse",
            // position: "nearest",
            // yAlign: "top",
            usePointStyle: true,
            bodyFont: {
              size: 18,
            },
            footerFont: {
              size: 14,
            },
            padding: 10,
            borderColor: "rgba(255,255,255,0.5)",
            borderWidth: 1,

            callbacks: {
              title: (ctx: any) => {
                if (ctx.length === 0) return "";
                const stack = ctx[0].dataset.stack;
                if (stack === "buy-breakdown" || stack === "buy-net") {
                  const isLoss = ctx[0].parsed.y < 0;
                  return isLoss ? "Buy losses" : "Buy gains";
                } else if (stack === "rent-breakdown" || stack === "rent-net") {
                  const isLoss = ctx[0].parsed.y < 0;
                  return isLoss ? "Rent losses" : "Rent gains";
                }
                return "";
              },
              label: (ctx: any) => {
                const value = ctx.parsed.y;
                return `${ctx.dataset.label}: ${aud.format(value)}`;
              },
              footer(tooltipItems: TooltipItem<"bar">[]) {
                // @ts-ignore
                const description = tooltipItems[0].dataset?.description || "";
                if (!description) {
                  return undefined;
                }
                return splitIntoLines(description);
              },
            },
          },
          annotation: {
            annotations: {
              line1: {
                type: "line",
                yMin: 0,
                yMax: 0,
                borderColor: "rgb(180, 180, 255)",
                borderWidth: 1,
              },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;

    let datasetIndex = 0;

    Object.entries(simulationResult.cases).forEach(
      ([_, { breakdownByYear }], caseIndex) => {
        return Object.entries(breakdownByYear[selectedYear] ?? []).forEach(
          ([_, gainOrLoss]) => {
            chart.data.datasets[datasetIndex].data = [];
            chart.data.datasets[datasetIndex].data[caseIndex] = gainOrLoss;
            datasetIndex++;
          },
        );
      },
    );

    if (chart.options.scales?.y) {
      chart.options.scales.y.min = -maxAbsValue;
      chart.options.scales.y.max = maxAbsValue;
    }

    chart.update("active");
  }, [maxAbsValue, simulationResult, selectedYear]);

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
          <canvas ref={canvasRef} />
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
          className={"lg:mx-10 lg:w-150"}
        />
      </div>
    </div>
  );
};
