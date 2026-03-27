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

export const ExplainBuyChart = memo(
  ({
    mortgage,
    mortgageDescription,
    maintenance,
    maintenanceDescription,
    strata,
    strataDescription,
    councilRates,
    councilRatesDescription,
    insurance,
    insuranceDescription,
    moving,
    movingDescription,
  }: {
    mortgage: number;
    mortgageDescription?: string;
    maintenance: number;
    maintenanceDescription?: string;
    strata: number;
    strataDescription?: string;
    councilRates: number;
    councilRatesDescription?: string;
    insurance: number;
    insuranceDescription?: string;
    moving: number;
    movingDescription?: string;
  }) => {
    const option: EChartsOption = {
      xAxis: {
        type: "category",
        data: [
          "Mortgage",
          "Maintenance",
          "Strata",
          "Council\nrates",
          "Insurance",
          "Moving\ncosts",
        ].filter(
          (_, i) =>
            [mortgage, maintenance, strata, councilRates, insurance, moving][
              i
            ] > 0 || i === 0,
        ),
        axisLabel: {
          fontSize: 12,
          interval: 0,
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
        top: 20,
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
          name: "Expenses",
          type: "bar",
          data: [
            {
              value: mortgage,
              name: "Mortgage",
              itemStyle: { color: "rgba(231, 76, 60, 1.0)" },
              description: mortgageDescription,
            },
            {
              value: maintenance,
              name: "Maintenance",
              itemStyle: { color: "rgba(155, 89, 182, 1.0)" },
              description: maintenanceDescription,
            },
            {
              value: strata,
              name: "Strata",
              itemStyle: { color: "rgba(46, 204, 113, 1.0)" },
              description: strataDescription,
            },
            {
              value: councilRates,
              name: "Council\nrates",
              itemStyle: { color: "rgba(52, 152, 219, 1.0)" },
              description: councilRatesDescription,
            },
            {
              value: insurance,
              name: "Insurance",
              itemStyle: { color: "rgba(241, 196, 15, 1.0)" }, // Yellow
              description: insuranceDescription,
            },
            {
              value: moving,
              name: "Moving\ncosts",
              itemStyle: { color: "rgba(230, 139, 34, 1.0)" }, // Orange
              description: movingDescription,
            },
          ].filter((d) => d.value > 0 || d.name === "Mortgage"),
          barWidth: "40%",
          label: {
            show: true,
            position: "top",
            formatter: (params: any) => formatMoney(params.value),
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
