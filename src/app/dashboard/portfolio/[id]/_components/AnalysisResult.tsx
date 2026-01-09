"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PortfolioAnalysis } from "@/features/portfolio/analysis";

interface PriceData {
  date: string;
  close: number;
}

interface AnalysisData {
  analysis: PortfolioAnalysis;
  portfolioPrices: PriceData[];
  stockPrices: Record<string, PriceData[]>;
  items: Array<{ ticker: string; name: string; weight: number }>;
}

interface AnalysisResultProps {
  data: AnalysisData;
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export function AnalysisResult({ data }: AnalysisResultProps) {
  const { analysis, portfolioPrices, stockPrices, items } = data;

  const chartData = portfolioPrices.map((p) => {
    const point: Record<string, number | string> = {
      date: p.date,
      portfolio: p.close,
    };

    for (const ticker of Object.keys(stockPrices)) {
      const tickerPrices = stockPrices[ticker];
      if (!tickerPrices) continue;

      const stockPrice = tickerPrices.find((sp) => sp.date === p.date);
      if (stockPrice) {
        const firstPrice = tickerPrices[0]?.close || 1;
        point[ticker] = (stockPrice.close / firstPrice) * 100;
      }
    }

    return point;
  });

  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 수익률"
          value={`${analysis.totalReturnPercent >= 0 ? "+" : ""}${analysis.totalReturnPercent.toFixed(2)}%`}
          icon={analysis.totalReturnPercent >= 0 ? TrendingUp : TrendingDown}
          color={analysis.totalReturnPercent >= 0 ? "emerald" : "red"}
        />
        <StatCard
          title="최대 상승"
          value={`+${analysis.maxGainPercent.toFixed(2)}%`}
          icon={TrendingUp}
          color="emerald"
          subtitle={
            analysis.maxGainPeriod
              ? `${analysis.maxGainPeriod.start} ~ ${analysis.maxGainPeriod.end}`
              : undefined
          }
        />
        <StatCard
          title="최대 낙폭 (MDD)"
          value={`-${analysis.maxDrawdownPercent.toFixed(2)}%`}
          icon={TrendingDown}
          color="red"
          subtitle={
            analysis.maxDrawdownPeriod
              ? `${analysis.maxDrawdownPeriod.start} ~ ${analysis.maxDrawdownPeriod.end}`
              : undefined
          }
        />
        <StatCard
          title="변동성 (연율)"
          value={`${analysis.volatility.toFixed(2)}%`}
          icon={Activity}
          color="blue"
          subtitle={`Sharpe: ${analysis.sharpeRatio.toFixed(2)}`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            포트폴리오 성과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={(value) => `${value.toFixed(0)}`}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString("ko-KR")}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(2)}`,
                    name === "portfolio" ? "포트폴리오" : name,
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === "portfolio" ? "포트폴리오" : value
                  }
                />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                {items.map((item, index) => (
                  <Line
                    key={item.ticker}
                    type="monotone"
                    dataKey={item.ticker}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={1}
                    strokeOpacity={0.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
              주요 상승 구간
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.riseSegments.length === 0 ? (
              <p className="text-slate-500 text-sm">상승 구간이 없습니다</p>
            ) : (
              <div className="space-y-3">
                {analysis.riseSegments.slice(0, 5).map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-emerald-700">
                        {segment.startDate} ~ {segment.endDate}
                      </p>
                      <p className="text-xs text-emerald-600">
                        {segment.durationDays}일간
                      </p>
                    </div>
                    <p className="text-lg font-bold text-emerald-600">
                      +{segment.changePercent.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-5 w-5" />
              주요 하락 구간
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.fallSegments.length === 0 ? (
              <p className="text-slate-500 text-sm">하락 구간이 없습니다</p>
            ) : (
              <div className="space-y-3">
                {analysis.fallSegments.slice(0, 5).map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-red-700">
                        {segment.startDate} ~ {segment.endDate}
                      </p>
                      <p className="text-xs text-red-600">
                        {segment.durationDays}일간
                      </p>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      {segment.changePercent.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "emerald" | "red" | "blue" | "orange";
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };

  const valueColorClasses = {
    emerald: "text-emerald-600",
    red: "text-red-600",
    blue: "text-blue-600",
    orange: "text-orange-600",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
