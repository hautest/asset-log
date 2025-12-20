"use client";

import { ChartContainer, ChartTooltip } from "@/shared/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import type { SalaryData } from "@/features/salary/queries";
import { formatCurrency } from "@/shared/utils/formatCurrency";

function getYearFromClickData(data: unknown): number | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  // activePayload에서 추출 시도
  if ("activePayload" in data && Array.isArray(data.activePayload)) {
    const firstPayload = data.activePayload[0];
    if (
      typeof firstPayload === "object" &&
      firstPayload !== null &&
      "payload" in firstPayload
    ) {
      const payload = firstPayload.payload;
      if (
        typeof payload === "object" &&
        payload !== null &&
        "yearNum" in payload
      ) {
        return (payload as { yearNum: number }).yearNum;
      }
    }
  }

  // activeLabel에서 추출 시도 (예: "2024년" -> 2024)
  if ("activeLabel" in data && typeof data.activeLabel === "string") {
    const match = data.activeLabel.match(/(\d+)년/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}

function formatYAxisValue(value: number): string {
  if (value >= 100000000) {
    const formatted = value / 100000000;
    return `${
      formatted % 1 === 0 ? formatted.toFixed(0) : formatted.toFixed(1)
    }억`;
  }
  if (value >= 10000) {
    const formatted = value / 10000;
    return `${
      formatted % 1 === 0 ? formatted.toFixed(0) : formatted.toFixed(0)
    }만원`;
  }
  return `${value}원`;
}

interface SalaryChartProps {
  data: SalaryData[];
  onBarClick: (year: number) => void;
}

export function SalaryChart({ data, onBarClick }: SalaryChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 50000000);
  const minBarHeight = maxAmount * 0.02;

  const chartData = data.map((item) => ({
    year: `${item.year}년`,
    yearNum: item.year,
    displayAmount: item.amount === 0 ? minBarHeight : item.amount,
    actualAmount: item.amount,
    isEmpty: item.amount === 0,
    memo: item.memo,
    growthRate: item.growthRate,
  }));

  const chartConfig = {
    displayAmount: { label: "연봉", color: "#10b981" },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart
        data={chartData}
        onClick={(clickData) => {
          const year = getYearFromClickData(clickData);
          if (year) {
            onBarClick(year);
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={60}
          tickFormatter={formatYAxisValue}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (!active || !payload || !payload[0]) return null;
            const data = payload[0].payload as {
              isEmpty: boolean;
              actualAmount: number;
              memo: string | null;
              year: string;
              growthRate: number | null;
            };
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="font-medium">{data.year}</div>
                <div className="text-sm text-muted-foreground">
                  연봉: {data.isEmpty ? "미입력" : formatCurrency(data.actualAmount)}
                </div>
                {data.growthRate !== null && (
                  <div className={`text-sm ${data.growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                    전년 대비: {data.growthRate > 0 ? "+" : data.growthRate < 0 ? "-" : ""}{Math.abs(data.growthRate).toFixed(1)}%
                  </div>
                )}
                {data.memo && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    메모: {data.memo}
                  </div>
                )}
              </div>
            );
          }}
          cursor={{ fill: "hsl(215 20% 95%)" }}
        />
        <Bar
          dataKey="displayAmount"
          radius={[4, 4, 0, 0]}
          className="cursor-pointer"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isEmpty ? "transparent" : "#10b981"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
