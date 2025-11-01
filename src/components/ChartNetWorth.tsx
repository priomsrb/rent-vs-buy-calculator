import React, { useEffect, useMemo, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { compactNumber } from "@/utils/compactNumber.ts";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const labels = useMemo(
    () => seriesBuy.map((_, i) => `${Math.floor(i / 12)}`),
    [seriesBuy],
  );
  const yearlyIndices = useMemo(
    () => labels.map((_, i) => i).filter((i) => i % 12 === 0),
    [labels],
  );
  const yearlyLabels = useMemo(
    () => yearlyIndices.map((i) => labels[i]),
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

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const data = {
      labels: yearlyLabels,
      datasets: [
        {
          label: "Buy (net worth)",
          data: yearlyBuy,
          borderColor: "rgba(79,124,255,1)",
          backgroundColor: "rgba(79,124,255,0.15)",
          tension: 0.2,
        },
        {
          label: "Rent (net worth)",
          data: yearlyRent,
          borderColor: "rgba(46,204,113,1)",
          backgroundColor: "rgba(46,204,113,0.15)",
          tension: 0.2,
        },
      ],
    } as const;

    const options = {
      // responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          title: { display: true, text: "Year" },
          border: {
            color: "#88888888",
          },
          grid: {
            color: "#88888833",
          },
          beforeFit: function (axis: any) {
            // This is required to make sure the last tick is always displayed
            const lastTick = axis.ticks[axis.ticks.length - 1];
            if (lastTick.value === axis.max) {
              return;
            }
            const newLastTick = { ...lastTick };
            newLastTick.value = axis.max;
            newLastTick.label = Number(data.labels[data.labels.length - 1]) + 1;
            axis.ticks.push(newLastTick);
          },
          ticks: {
            callback: (v: string) => Number(v) + 1,
          },
        },
        y: {
          min: 0,
          border: {
            color: "#88888888",
          },
          grid: {
            color: "#88888833",
          },
          title: { display: true, text: "Net worth" },
          ticks: {
            callback: (v: any) => `$${compactNumber(Number(v), 1)}`,
            includeBounds: true,
          },
        },
      },
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          position: "nearest",
          itemSort: (a: any, b: any) => b.parsed.y - a.parsed.y,
          callbacks: {
            title: (items: any[]) =>
              items && items.length ? `Year ${items[0].label}` : "",
            label: (ctx: any) =>
              `${ctx.dataset.label}: ${aud.format(ctx.parsed.y)}`,
            labelColor: (ctx: any) => ({
              backgroundColor: ctx.dataset.label.startsWith("Buy")
                ? "#4f7cff"
                : "#2ecc71",
              borderColor: ctx.dataset.label.startsWith("Buy")
                ? "#4f7cff"
                : "#2ecc71",
            }),
            labelTextColor: (ctx: any) =>
              ctx.dataset.label.startsWith("Buy") ? "#4f7cff" : "#2ecc71",
            footer: (items: any[]) => {
              const buyItem = items.find((i: any) =>
                i.dataset.label.startsWith("Buy"),
              );
              const rentItem = items.find((i: any) =>
                i.dataset.label.startsWith("Rent"),
              );
              if (!buyItem || !rentItem) return "";
              const diff = buyItem.parsed.y - rentItem.parsed.y;
              const pctDiff =
                rentItem.parsed.y !== 0
                  ? (diff / Math.abs(rentItem.parsed.y)) * 100
                  : 0;
              const sign = diff >= 0 ? "+" : "";
              return [
                `Difference: ${sign}${aud.format(diff)} (${sign}${pctDiff.toFixed(1)}%)`,
              ];
            },
          },
        },
      },
    } as const;

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: { ...data },
        options: { ...options },
      });
      return;
    }

    // Update in place for smooth transitions
    const chart = chartRef.current;
    chart.options = { ...chart.options, ...options } as any;
    chart.data.labels = yearlyLabels as any;
    if (chart.data.datasets.length !== data.datasets.length) {
      chart.data.datasets = data.datasets as any;
    } else {
      chart.data.datasets.forEach((ds: any, i: number) => {
        const nd = (data.datasets as any)[i];
        ds.label = nd.label;
        ds.data = nd.data;
        ds.borderColor = nd.borderColor;
        ds.backgroundColor = nd.backgroundColor;
        ds.tension = nd.tension;
      });
    }
    chart.update("active");

    return () => {};
  }, [yearlyLabels, yearlyBuy, yearlyRent]);

  return <canvas ref={canvasRef} />;
};
