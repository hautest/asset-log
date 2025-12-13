"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface ChartClickData {
  activePayload?: Array<{
    payload?: {
      yearMonth?: string;
    };
  }>;
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

  const chartConfig = categoryList.reduce((acc, cat) => {
    acc[cat.id] = { label: cat.name, color: cat.color };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <BarChart
        data={chartData}
        onClick={(data) => {
          const chartData = data as ChartClickData;
          if (chartData?.activePayload?.[0]) {
            const yearMonth = chartData.activePayload[0].payload?.yearMonth;
            if (yearMonth) {
              window.location.href = `/assets/${yearMonth}`;
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
          tickFormatter={(value) => `${(value / 10000000).toFixed(0)}천만`}
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
