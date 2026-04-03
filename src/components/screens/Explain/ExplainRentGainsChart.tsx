import type { EChartsOption } from "echarts-for-react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import _ from "lodash";
import { memo } from "react";

import { centeredTooltipPosition } from "@/utils/chartTooltip";
import { escapeAndWrapText } from "@/utils/escapeAndWrapText";
import { formatMoney } from "@/utils/formatMoney";

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

export const ExplainRentGainsChart = memo(
  ({
    investmentGrowth,
    investmentGrowthDescription,
    extraSavings,
    extraSavingsDescription,
    extraSavingsInvestment,
    extraSavingsInvestmentDescription,
  }: {
    investmentGrowth: number;
    investmentGrowthDescription?: string;
    extraSavings: number;
    extraSavingsDescription?: string;
    extraSavingsInvestment: number;
    extraSavingsInvestmentDescription?: string;
  }) => {
    const option: EChartsOption = {
      xAxis: {
        type: "category",
        data: ["Investment\ngrowth", "Savings", "Savings\ngrowth"],
        axisLabel: {
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.7)",
        },
        axisLine: { show: true },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLine: { show: true },
        splitLine: { show: false },
        axisLabel: {
          show: false,
        },
      },
      grid: {
        top: 30,
        bottom: 50,
        left: 20,
        right: 20,
      },
      tooltip: {
        trigger: "item",
        position: centeredTooltipPosition,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "rgba(80, 80, 80, 0.8)",
        textStyle: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        formatter: (params: any) => {
          return `
            <div class="flex items-center mb-1">
              <div class="w-4 h-4 mr-2 rounded-full inline-block" style="background-color: ${_.escape(params.color)}"></div>
              <b>
                ${_.escape(params.name.replace("\n", " "))}: ${_.escape(formatMoney(params.value))}
              </b>
            </div>
            ${
              params.data.description
                ? escapeAndWrapText(params.data.description)
                : ""
            }
        `;
        },
        extraCssText: "z-index: 20",
      },
      series: [
        {
          name: "Gains",
          type: "bar",
          data: [
            {
              value: investmentGrowth,
              name: "Investment\ngrowth",
              itemStyle: { color: "rgba(39, 174, 96, 1.0)" },
              description: investmentGrowthDescription,
            },
            {
              value: extraSavings,
              name: "Savings",
              itemStyle: { color: "rgba(36, 198, 182, 1.0)" },
              description: extraSavingsDescription,
            },
            {
              value: extraSavingsInvestment,
              name: "Savings\ngrowth",
              itemStyle: { color: "rgba(32, 173, 145, 1.0)" },
              description: extraSavingsInvestmentDescription,
            },
          ],
          barWidth: "40%",
          label: {
            show: true,
            position: "top",
            formatter: (params: any) => formatMoney(params.value),
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 12,
          },
        },
      ],
    };

    return (
      <div className="h-full w-full">
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          autoResize={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  },
);
