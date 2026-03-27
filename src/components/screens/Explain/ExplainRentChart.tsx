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

export const ExplainRentChart = memo(
  ({
    rent,
    rentDescription,
    moving,
    movingDescription,
  }: {
    rent: number;
    rentDescription?: string;
    moving: number;
    movingDescription?: string;
  }) => {
    const option: EChartsOption = {
      xAxis: {
        type: "category",
        data: ["Rent", "Moving \ncosts"],
        axisLabel: {
          fontSize: 14,
        },
        axisLine: { show: true },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLine: { show: true },
        splitLine: { show: false },
        axisLabel: {
          show: false, // matches screenshot
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
              value: rent,
              name: "Rent",
              itemStyle: { color: "rgba(231, 76, 60, 1.0)" },
              description: rentDescription,
            },
            {
              value: moving,
              name: "Moving \ncosts",
              itemStyle: { color: "rgba(230, 139, 34, 1.0)" },
              description: movingDescription,
            },
          ],
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
      <div className="h-full">
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
