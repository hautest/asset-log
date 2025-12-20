"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { FiveYearSelector } from "./FiveYearSelector";
import { SalaryChart } from "./SalaryChart";
import { SalaryFormDialog } from "./SalaryFormDialog";
import { SalaryStatsCards } from "./SalaryStatsCards";
import { saveSalary } from "@/features/salary/server-functions/saveSalary";
import type { SalaryData } from "@/features/salary/queries";

interface SalaryPageContentProps {
  startYear: number;
  endYear: number;
  salaries: SalaryData[];
  latestSalary: {
    amount: number;
    year: number;
    growthRate: number | null;
  } | null;
}

function recalculateGrowthRates(salaries: SalaryData[]): SalaryData[] {
  const sorted = [...salaries].sort((a, b) => a.year - b.year);
  return sorted.map((salary, index) => {
    if (index === 0 || salary.amount === 0) {
      return { ...salary, growthRate: null };
    }
    const prevSalary = sorted[index - 1];
    if (!prevSalary || prevSalary.amount === 0) {
      return { ...salary, growthRate: null };
    }
    const growthRate =
      ((salary.amount - prevSalary.amount) / prevSalary.amount) * 100;
    return { ...salary, growthRate };
  });
}

export function SalaryPageContent({
  startYear,
  endYear,
  salaries: initialSalaries,
  latestSalary: initialLatestSalary,
}: SalaryPageContentProps) {
  const [isPending, startTransition] = useTransition();
  const [salaries, setSalaries] = useState<SalaryData[]>(initialSalaries);
  const [latestSalary, setLatestSalary] = useState(initialLatestSalary);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryData | null>(null);

  useEffect(() => {
    setSalaries(initialSalaries);
  }, [initialSalaries]);

  useEffect(() => {
    setLatestSalary(initialLatestSalary);
  }, [initialLatestSalary]);

  const handleBarClick = (year: number) => {
    const salary = salaries.find((s) => s.year === year);
    if (salary) {
      setEditingSalary(salary);
    } else {
      setEditingSalary({
        id: "",
        year,
        amount: 0,
        memo: null,
        growthRate: null,
      });
    }
    setDialogOpen(true);
  };

  const handleAddCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const existingSalary = salaries.find((s) => s.year === currentYear);
    if (existingSalary) {
      setEditingSalary(existingSalary);
    } else {
      setEditingSalary({
        id: "",
        year: currentYear,
        amount: 0,
        memo: null,
        growthRate: null,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (data: {
    year: number;
    amount: number;
    memo?: string;
  }) => {
    startTransition(async () => {
      try {
        const result = await saveSalary(data);
        if (!result) return;

        setSalaries((prev) => {
          const exists = prev.some((s) => s.year === result.year);
          let updated: SalaryData[];
          if (exists) {
            updated = prev.map((s) =>
              s.year === result.year
                ? {
                    ...s,
                    id: result.id,
                    amount: result.amount,
                    memo: result.memo,
                    growthRate: result.growthRate,
                  }
                : s
            );
          } else {
            updated = [
              ...prev,
              {
                id: result.id,
                year: result.year,
                amount: result.amount,
                memo: result.memo,
                growthRate: result.growthRate,
              },
            ];
          }
          // 다음 년도의 growthRate 재계산 후, 업데이트한 년도의 growthRate는 서버 값으로 복원
          const recalculated = recalculateGrowthRates(updated);
          return recalculated.map((s) =>
            s.year === result.year
              ? { ...s, growthRate: result.growthRate }
              : s
          );
        });

        // latestSalary 업데이트
        const latestYear = latestSalary?.year ?? 0;
        if (result.year >= latestYear) {
          // 최신 연봉을 수정한 경우
          setLatestSalary({
            amount: result.amount,
            year: result.year,
            growthRate: result.growthRate,
          });
        } else if (result.year === latestYear - 1 && latestSalary) {
          // 직전년도를 수정한 경우 - latestSalary의 growthRate 재계산
          const newGrowthRate =
            result.amount > 0
              ? ((latestSalary.amount - result.amount) / result.amount) * 100
              : null;
          setLatestSalary({
            ...latestSalary,
            growthRate: newGrowthRate,
          });
        }

        setDialogOpen(false);
        setEditingSalary(null);
        toast.success("연봉이 저장되었습니다");
      } catch {
        toast.error("연봉 저장에 실패했습니다");
      }
    });
  };

  const isEdit = editingSalary !== null && editingSalary.amount > 0;

  return (
    <>
      <SalaryStatsCards salaries={salaries} latestSalary={latestSalary} />
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">연봉 추이</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              {startYear}-{endYear}년 연봉 변화를 확인하세요
            </p>
          </div>
          <FiveYearSelector startYear={startYear} />
        </CardHeader>
        <CardContent>
          <SalaryChart data={salaries} onBarClick={handleBarClick} />

          <div className="flex justify-center pt-6">
            <Button size="lg" className="gap-2" onClick={handleAddCurrentYear}>
              <Plus className="h-5 w-5" />
              올해 연봉 입력하기
            </Button>
          </div>
        </CardContent>
      </Card>

      {editingSalary && (
        <SalaryFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          year={editingSalary.year}
          defaultValues={
            editingSalary.amount > 0
              ? {
                  amount: editingSalary.amount,
                  memo: editingSalary.memo ?? undefined,
                }
              : undefined
          }
          isEdit={isEdit}
          isPending={isPending}
        />
      )}
    </>
  );
}
