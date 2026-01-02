import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { compactMoney } from "@/utils/formatMoney";

const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export interface ChartNetWorthProps {
  seriesBuy: number[];
  seriesRent: number[];
}

export const ChartNetWorth: React.FC<ChartNetWorthProps> = ({
  seriesBuy,
  seriesRent,
}) => {
  const labels = useMemo(
    () => seriesBuy.map((_, i) => `${Math.floor(i / 12)}`),
    [seriesBuy],
  );
  const yearlyIndices = useMemo(
    () => labels.map((_, i) => i).filter((i) => i % 12 === 0),
    [labels],
  );
  const yearlyLabels = useMemo(
    () => yearlyIndices.map((i) => Number(labels[i]) + 1),
    [yearlyIndices, labels],
  );
  const yearlyBuy = useMemo(
    () => yearlyIndices.map((i) => seriesBuy[i]),
    [yearlyIndices, seriesBuy],
  );
  const yearlyRent = useMemo(
    () => yearlyIndices.map((i) => seriesRent[i]),
    [yearlyIndices, seriesRent],
  );

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "rgba(80, 80, 80, 0.8)",
        textStyle: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        formatter: (params: any[]) => {
          if (!params || params.length === 0) return "";
          const year = params[0].axisValue;
          const buyItem = params.find(
            (p: any) => p.seriesName === "Buy (net worth)",
          );
          const rentItem = params.find(
            (p: any) => p.seriesName === "Rent (net worth)",
          );

          let content = `<div style="font-weight: bold; margin-bottom: 8px;">Year ${year}</div>`;

          // Sort by value descending
          const sortedParams = [...params].sort((a, b) => b.value - a.value);
          for (const param of sortedParams) {
            content += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color}; margin-right: 8px;"></span>
              <span style="color: ${param.color}">${param.seriesName}: ${aud.format(param.value)}</span>
            </div>`;
          }

          if (buyItem && rentItem) {
            const diff = buyItem.value - rentItem.value;
            const pctDiff =
              rentItem.value !== 0
                ? (diff / Math.abs(rentItem.value)) * 100
                : 0;
            const sign = diff >= 0 ? "+" : "";
            content += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
              Difference: ${sign}${aud.format(diff)} (${sign}${pctDiff.toFixed(1)}%)
            </div>`;
          }

          return content;
        },
      },
      legend: {
        data: ["Buy (net worth)", "Rent (net worth)"],
        bottom: 0,
        textStyle: {
          color: "#888",
        },
      },
      grid: {
        left: 60,
        right: 20,
        top: 20,
        bottom: 70,
      },
      xAxis: {
        type: "category",
        data: yearlyLabels,
        name: "Year",
        nameLocation: "middle",
        nameGap: 25,
        axisLine: {
          lineStyle: {
            color: "#88888888",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#88888833",
          },
        },
        axisLabel: {
          color: "#888",
        },
        nameTextStyle: {
          color: "#888",
        },
      },
      yAxis: {
        type: "value",
        name: "Net worth",
        nameLocation: "middle",
        nameGap: 50,
        min: 0,
        axisLine: {
          lineStyle: {
            color: "#88888888",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#88888833",
          },
        },
        axisLabel: {
          formatter: (value: number) => compactMoney(value, 1),
          color: "#888",
        },
        nameTextStyle: {
          color: "#888",
        },
      },
      series: [
        {
          name: "Buy (net worth)",
          type: "line",
          data: yearlyBuy,
          smooth: 0.2,
          lineStyle: {
            color: "rgba(79,124,255,1)",
            width: 2,
          },
          itemStyle: {
            color: "rgba(79,124,255,1)",
          },
          areaStyle: {
            color: "rgba(79,124,255,0.15)",
          },
        },
        {
          name: "Rent (net worth)",
          type: "line",
          data: yearlyRent,
          smooth: 0.2,
          lineStyle: {
            color: "rgba(46,204,113,1)",
            width: 2,
          },
          itemStyle: {
            color: "rgba(46,204,113,1)",
          },
          areaStyle: {
            color: "rgba(46,204,113,0.15)",
          },
        },
      ],
    }),
    [yearlyLabels, yearlyBuy, yearlyRent],
  );

  return (
    <ReactECharts
      option={option}
      autoResize={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
