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

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  annotationPlugin,
);

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
  simulationResults: SimulationResult;
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
  simulationResults,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const maxYear = simulationResults.numYears - 1;

  const [selectedYear, setSelectedYear] = useState(() => {
    const savedYear = localStorage.getItem("yearlyBreakdown-selectedYear");
    if (savedYear) {
      const year = Number(savedYear);
      return Math.min(year, maxYear);
    }
    return 0;
  });

  const maxAbsValue = useMemo(() => {
    const yearBreakdowns = Object.values(simulationResults.cases).flatMap(
      // (simulationCase) => simulationCase.breakdownByYear[selectedYear],
      (simulationCase) =>
        Object.values(simulationCase.breakdownByYear[selectedYear] ?? []),
    );
    const caseBreakdownsForYear = _.mapValues(
      simulationResults.cases,
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

    const gainColors = [
      "rgba(46, 204, 113, 0.8)", // Green
      "rgba(52, 152, 219, 0.8)", // Blue
      "rgba(155, 89, 182, 0.8)", // Purple
      "rgba(26, 104, 53, 0.8)", // Dark Green
    ];
    const lossColors = [
      "rgba(231, 76, 60, 0.8)", // Red
      "rgba(241, 196, 15, 0.8)", // Yellow
      "rgba(230, 126, 34, 0.8)", // Orange
      "rgba(192, 57, 43, 0.8)", // Dark Red
      "rgba(142, 68, 173, 0.8)", // Purple
      "rgba(127, 140, 141, 0.8)", // Gray
    ];

    function getBreakdownColor(breakdownKey: string) {
      return simulationResults.breakdownInfo[breakdownKey].color;
    }

    function getBreakdownLabel(breakdownKey: string) {
      const breakdown = simulationResults.breakdownInfo[breakdownKey];
      return breakdown.label;
    }

    const data = {
      labels: Object.values(simulationResults.cases).map(
        (simulationCase) => simulationCase.label,
      ),

      datasets: Object.entries(simulationResults.cases).flatMap(
        ([caseKey, { breakdownByYear }]) => {
          return Object.entries(breakdownByYear[0]).map(
            ([breakdownKey, gainOrLoss]) => {
              return {
                label: getBreakdownLabel(breakdownKey),
                description:
                  simulationResults.breakdownInfo[breakdownKey].description,
                data: [],
                backgroundColor: getBreakdownColor(breakdownKey),
                // stack: caseKey,
              };
            },
          );
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
            },
          },
          y: {
            stacked: true,
            min: -maxAbsValue,
            max: maxAbsValue,
            ticks: {
              callback: (v: any) => `$${compactNumber(Number(v))}`,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: "bottom" as const,
          },
          tooltip: {
            // caretPadding: 100,
            // xAlign: "center",
            position: "followMouse",
            // position: "nearest",
            // yAlign: "top",
            usePointStyle: true,
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

    Object.entries(simulationResults.cases).forEach(
      ([caseKey, { breakdownByYear }], caseIndex) => {
        return Object.entries(breakdownByYear[selectedYear] ?? []).forEach(
          ([breakdownKey, gainOrLoss]) => {
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
  }, [maxAbsValue, simulationResults, selectedYear]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1 }}>
        <canvas ref={canvasRef} />
      </div>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <label
          htmlFor="yearSlider"
          style={{ display: "block", marginBottom: 8 }}
        >
          Year: {selectedYear + 1}
        </label>
        <input
          id="yearSlider"
          type="range"
          min="1"
          max={maxYear + 1}
          value={selectedYear + 1}
          onChange={(e) => setSelectedYear(Number(e.target.value) - 1)}
          style={{ width: "100%", maxWidth: 400 }}
        />
      </div>
    </div>
  );
};

function getMaxAbsValue(values: number[]) {
  return values.reduce(
    (previous, current) => Math.max(previous, Math.abs(current)),
    0,
  );
}
