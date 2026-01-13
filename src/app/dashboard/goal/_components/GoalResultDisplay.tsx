"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { Clock, Wallet, TrendingUp } from "lucide-react";

interface CalculationResult {
  monthsToGoal: number;
  yearsToGoal: number;
  remainingMonths: number;
  chartData: Array<{ month: number; amount: number }>;
  isReachable: boolean;
  errorMessage?: string;
  totalInvested: number;
  totalInterest: number;
}

interface GoalResultDisplayProps {
  result: CalculationResult;
  targetAmount: number;
}

export function GoalResultDisplay({
  result,
  targetAmount,
}: GoalResultDisplayProps) {
  const {
    isReachable,
    yearsToGoal,
    remainingMonths,
    errorMessage,
    totalInvested,
    totalInterest,
  } = result;

  const isInitialState = targetAmount === 0;

  const getPeriodText = () => {
    if (yearsToGoal === 0 && remainingMonths === 0) {
      return "이미 달성";
    }

    const parts = [];
    if (yearsToGoal > 0) parts.push(`${yearsToGoal}년`);
    if (remainingMonths > 0) parts.push(`${remainingMonths}개월`);

    return parts.join(" ");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>계산 결과</CardTitle>
      </CardHeader>
      <CardContent aria-live="polite">
        {isInitialState ? (
          <div className="flex h-32 items-center justify-center text-slate-500">
            목표 자산을 입력하면 결과가 표시됩니다.
          </div>
        ) : isReachable ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-600" />
                <p className="text-sm text-slate-600">목표 달성 기간</p>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {getPeriodText()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-slate-600" />
                <p className="text-sm text-slate-600">총 투자 금액</p>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {formatCurrency(totalInvested)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <p className="text-sm text-slate-600">예상 수익</p>
              </div>
              <p className="mt-2 text-xl font-bold text-emerald-600">
                {formatCurrency(totalInterest)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-amber-600">
            <p>{errorMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
