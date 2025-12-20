import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { BarChart3, TrendingUp, CalendarDays } from "lucide-react";
import { formatCurrency } from "@/shared/utils/formatCurrency";

interface StatsCardsProps {
  totalAmount: number | null;
  latestMonth: string | null;
  growth: number;
  yearOverYearGrowth: number | null;
}

export function StatsCards({
  totalAmount,
  latestMonth,
  growth,
  yearOverYearGrowth,
}: StatsCardsProps) {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            현재 총 자산
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {totalAmount !== null ? formatCurrency(totalAmount) : "데이터 없음"}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {latestMonth ? `${latestMonth}월 기준` : "자산을 입력해주세요"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            전월 대비
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {growth > 0 ? "+" : ""}
            {growth.toFixed(2)}%
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {growth > 0 ? "증가" : growth < 0 ? "감소" : "변동 없음"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            전년 대비
          </CardTitle>
          <CalendarDays className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {yearOverYearGrowth !== null ? (
              <>
                {yearOverYearGrowth > 0 ? "+" : ""}
                {yearOverYearGrowth.toFixed(2)}%
              </>
            ) : (
              "데이터 없음"
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {yearOverYearGrowth !== null
              ? yearOverYearGrowth > 0
                ? "증가"
                : yearOverYearGrowth < 0
                  ? "감소"
                  : "변동 없음"
              : "전년도 데이터 필요"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
