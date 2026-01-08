"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Banknote, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { SalaryData } from "@/features/salary/queries";

interface SalaryStatsCardsProps {
  salaries: SalaryData[];
  latestSalary: {
    amount: number;
    year: number;
    growthRate: number | null;
  } | null;
}

export function SalaryStatsCards({
  salaries,
  latestSalary,
}: SalaryStatsCardsProps) {
  const { currentSalary, currentYear, growthRate } = useMemo(() => {
    const allSalaries = [...salaries];
    if (latestSalary && !allSalaries.some((s) => s.year === latestSalary.year)) {
      allSalaries.push({
        id: "",
        year: latestSalary.year,
        amount: latestSalary.amount,
        memo: null,
        growthRate: latestSalary.growthRate,
      });
    }
    const sorted = allSalaries
      .filter((s) => s.amount > 0)
      .sort((a, b) => b.year - a.year);
    const latest = sorted[0];
    if (!latest) {
      return { currentSalary: null, currentYear: null, growthRate: null };
    }

    // 최신 연봉의 growthRate가 null이고, latestSalary에 같은 년도의 growthRate가 있으면 사용
    let finalGrowthRate = latest.growthRate;
    if (
      finalGrowthRate === null &&
      latestSalary &&
      latestSalary.year === latest.year &&
      latestSalary.growthRate !== null
    ) {
      finalGrowthRate = latestSalary.growthRate;
    }

    return {
      currentSalary: latest.amount,
      currentYear: latest.year,
      growthRate: finalGrowthRate,
    };
  }, [salaries, latestSalary]);

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            현재 연봉
          </CardTitle>
          <Banknote className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {currentSalary !== null
              ? formatCurrency(currentSalary)
              : "데이터 없음"}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {currentYear ? `${currentYear}년 기준` : "연봉을 입력해주세요"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            직전년도 대비
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {growthRate !== null ? (
              <>
                {growthRate > 0 ? "+" : ""}
                {growthRate.toFixed(1)}%
              </>
            ) : (
              "데이터 없음"
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {growthRate !== null
              ? growthRate > 0
                ? "상승"
                : growthRate < 0
                  ? "하락"
                  : "변동 없음"
              : "2개 이상의 연봉 필요"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
