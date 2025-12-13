"use client";

import { useRouter } from "waku";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

function getActiveIndex(data: unknown): number | null {
  if (typeof data !== "object" || data === null || !("activeIndex" in data)) {
    return null;
  }

  const index = Number(data.activeIndex);
  return Number.isNaN(index) ? null : index;
}

function getYAxisConfig(maxValue: number) {
  if (maxValue >= 100000000) {
    return { divisor: 100000000, suffix: "억" };
  }
  if (maxValue >= 10000000) {
    return { divisor: 10000000, suffix: "천만" };
  }
  if (maxValue >= 1000000) {
    return { divisor: 1000000, suffix: "백만" };
  }
  if (maxValue >= 10000) {
    return { divisor: 10000, suffix: "만" };
  }
  return { divisor: 1, suffix: "원" };
}

interface Category {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
}

interface AssetChartProps {
  data: Array<{
    yearMonth: string;
    totalAmount: number;
    status: "completed" | "empty";
    categories: Record<string, number>;
  }>;
  categoryList: Category[];
}

export function AssetChart({ data, categoryList }: AssetChartProps) {
  const router = useRouter();

  const chartData = data.map((snapshot) => {
    const [, month] = snapshot.yearMonth.split("-");
    return {
      month: `${month}월`,
      yearMonth: snapshot.yearMonth,
      status: snapshot.status,
      ...snapshot.categories,
      totalAmount: snapshot.totalAmount,
    };
  });

  const maxValue = Math.max(...data.map((d) => d.totalAmount), 0);
  const yAxisConfig = getYAxisConfig(maxValue);

  const chartConfig = categoryList.reduce((acc, cat) => {
    acc[cat.id] = { label: cat.name, color: cat.color };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <BarChart
        data={chartData}
        onClick={(clickData) => {
          const activeIndex = getActiveIndex(clickData);
          if (activeIndex !== null) {
            const item = chartData[activeIndex];
            if (item) {
              router.push(`/assets/${item.yearMonth}`);
            }
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const formatted = value / yAxisConfig.divisor;
            return `${formatted % 1 === 0 ? formatted.toFixed(0) : formatted.toFixed(1)}${yAxisConfig.suffix}`;
          }}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: "hsl(215 20% 95%)" }}
        />
        {categoryList.map((category) => (
          <Bar
            key={category.id}
            dataKey={category.id}
            stackId="a"
            fill={category.color}
            radius={[0, 0, 0, 0]}
            className="cursor-pointer"
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
