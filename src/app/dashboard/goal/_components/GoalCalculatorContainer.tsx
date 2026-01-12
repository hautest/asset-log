"use client";

import { useState, useMemo } from "react";
import {
  GoalCalculatorForm,
  type GoalCalculatorFormData,
} from "./GoalCalculatorForm";
import { GoalResultDisplay } from "./GoalResultDisplay";
import { GoalChart } from "./GoalChart";

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

function convertToMonthlyRate(
  rate: number,
  type: "annual" | "monthly"
): number {
  if (type === "monthly") return rate / 100;
  return Math.pow(1 + rate / 100, 1 / 12) - 1;
}

function calculateGoal(formData: GoalCalculatorFormData): CalculationResult {
  const {
    targetAmount,
    initialCapital,
    monthlyInvestment,
    returnRate,
    returnRateType,
  } = formData;

  const monthlyRate = convertToMonthlyRate(returnRate, returnRateType);

  if (monthlyRate === 0 && monthlyInvestment === 0) {
    if (initialCapital >= targetAmount) {
      return {
        monthsToGoal: 0,
        yearsToGoal: 0,
        remainingMonths: 0,
        chartData: [{ month: 0, amount: initialCapital }],
        isReachable: true,
        totalInvested: initialCapital,
        totalInterest: 0,
      };
    }
    return {
      monthsToGoal: 0,
      yearsToGoal: 0,
      remainingMonths: 0,
      chartData: [],
      isReachable: false,
      errorMessage:
        "수익률과 월 투자금이 모두 0이면 목표를 달성할 수 없습니다.",
      totalInvested: 0,
      totalInterest: 0,
    };
  }

  if (initialCapital >= targetAmount) {
    return {
      monthsToGoal: 0,
      yearsToGoal: 0,
      remainingMonths: 0,
      chartData: [{ month: 0, amount: initialCapital }],
      isReachable: true,
      totalInvested: initialCapital,
      totalInterest: 0,
    };
  }

  const chartData: Array<{ month: number; amount: number }> = [];
  let currentAmount = initialCapital;
  let month = 0;
  const MAX_MONTHS = 1200;

  chartData.push({ month: 0, amount: Math.round(initialCapital) });

  while (currentAmount < targetAmount && month < MAX_MONTHS) {
    month++;
    currentAmount = currentAmount * (1 + monthlyRate) + monthlyInvestment;

    if (month % 3 === 0 || currentAmount >= targetAmount) {
      chartData.push({ month, amount: Math.round(currentAmount) });
    }
  }

  if (month >= MAX_MONTHS) {
    return {
      monthsToGoal: 0,
      yearsToGoal: 0,
      remainingMonths: 0,
      chartData: chartData,
      isReachable: false,
      errorMessage:
        "현재 조건으로는 100년 내에 목표를 달성할 수 없습니다. 수익률이나 월 투자금을 높여보세요.",
      totalInvested: 0,
      totalInterest: 0,
    };
  }

  const yearsToGoal = Math.floor(month / 12);
  const remainingMonths = month % 12;
  const totalInvested = initialCapital + monthlyInvestment * month;
  const finalAmount = Math.round(currentAmount);
  const totalInterest = finalAmount - totalInvested;

  return {
    monthsToGoal: month,
    yearsToGoal,
    remainingMonths,
    chartData,
    isReachable: true,
    totalInvested,
    totalInterest,
  };
}

export function GoalCalculatorContainer() {
  const [formData, setFormData] = useState<GoalCalculatorFormData>({
    targetAmount: 0,
    initialCapital: 0,
    monthlyInvestment: 0,
    returnRate: 0,
    returnRateType: "annual",
  });

  const result = useMemo(() => calculateGoal(formData), [formData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <GoalCalculatorForm defaultValues={formData} onChange={setFormData} />
      </div>
      <div className="space-y-6">
        <GoalResultDisplay
          result={result}
          targetAmount={formData.targetAmount}
        />
        <GoalChart
          data={result.chartData}
          targetAmount={formData.targetAmount}
        />
      </div>
    </div>
  );
}
