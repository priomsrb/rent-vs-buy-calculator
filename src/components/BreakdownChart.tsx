import ReactECharts from "echarts-for-react";
import type { SimulationResult } from "@/calculation/types.ts";
import _ from "lodash";
import { compactMoney, formatMoney } from "@/utils/formatMoney";
import type { EChartsOption } from "echarts-for-react";

type BreakdownChartProps = EChartsOption;

function getGainLossBreakdownProps(
  simulationResult: SimulationResult,
  year: number,
) {
  const series = Object.values(simulationResult.cases).flatMap(
    (caseValue, caseIndex) =>
      Object.entries(caseValue.breakdownByYear[year]).map(
        ([breakdownKey, breakdownValue]) => {
          const breakdownInfo = simulationResult.breakdownInfo[breakdownKey];
          const data = [];
          data[caseIndex] = Math.round(breakdownValue);
          return {
            name: breakdownInfo.label,
            tooltip: `
            <div class="flex items-center mb-1">
              <div class="w-4 h-4 mr-2 rounded-full inline-block" style="background-color: ${_.escape(breakdownInfo.color)}"></div>
              <b>
                {a}: ${_.escape(formatMoney(Math.abs(breakdownValue)))}
              </b>
            </div>
            ${
              breakdownInfo.description
                ? escapeAndWrapText(breakdownInfo.description)
                : ""
            }
            `,
            type: "bar",
            data,
            stack: "main",
            color: breakdownInfo.color,
          };
        },
      ),
  );

  return {
    // title: {
    //   text: "Breakdown by year",
    // },
    xAxis: {
      data: Object.keys(simulationResult.cases).map((caseName) =>
        _.startCase(caseName),
      ),
      axisLabel: {
        textStyle: {
          fontSize: 20,
        },
      },
    },
    yAxis: {
      min: (value: EChartsOption["yAxis"]) => -Math.max(-value.min, value.max),
      max: (value: EChartsOption["yAxis"]) => Math.max(-value.min, value.max),
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        formatter: (value: number) => `${compactMoney(value)}`,
        textStyle: {
          fontSize: 16,
        },
      },
    },
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "rgba(80, 80, 80, 0.8)",
      textStyle: {
        color: "rgba(255, 255, 255, 0.8)",
      },
    },
    series,
  };
}

export function GainLossBreakdown({
  simulationResult,
  year,
}: {
  simulationResult: SimulationResult | undefined;
  year: number;
}) {
  if (!simulationResult) {
    return null;
  }

  return (
    <BreakdownChart {...getGainLossBreakdownProps(simulationResult, year)} />
  );
}

export function BreakdownChart(props: BreakdownChartProps) {
  return (
    <div className="h-full">
      <ReactECharts
        option={props}
        // notMerge={true}
        // lazyUpdate={true}
        autoResize={true}
        // opts={{ width: "auto", height: 550 }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

function escapeAndWrapText(text: string) {
  const words = _.escape(text).split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line.length + word.length < 40) {
      line += " " + word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);
  return lines.join("<br/>");
}
