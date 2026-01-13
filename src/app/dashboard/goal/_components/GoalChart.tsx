"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/shared/utils/formatCurrency";

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

interface GoalChartProps {
  data: Array<{ month: number; amount: number }>;
  targetAmount: number;
}

export function GoalChart({ data, targetAmount }: GoalChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>자산 증가 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] md:h-[400px] items-center justify-center text-slate-500">
            차트를 표시할 데이터가 없습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.amount), targetAmount);
  const yAxisConfig = getYAxisConfig(maxValue);

  const chartConfig = {
    amount: {
      label: "자산",
      color: "hsl(142, 76%, 36%)",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>자산 증가 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[300px] md:h-[400px] w-full"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}개월`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const formatted = value / yAxisConfig.divisor;
                return `${
                  formatted % 1 === 0
                    ? formatted.toFixed(0)
                    : formatted.toFixed(1)
                }${yAxisConfig.suffix}`;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `${value}개월`}
                  formatter={(value) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">자산</span>
                      <span className="font-mono font-medium">
                        {formatCurrency(value)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={{ fill: "var(--color-amount)", r: 3 }}
            />
            <ReferenceLine
              y={targetAmount}
              stroke="hsl(0, 0%, 60%)"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{
                value: "목표",
                position: "insideTopRight",
                fill: "hsl(0, 0%, 40%)",
                fontSize: 12,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
