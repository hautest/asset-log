"use client";

import { useState, useTransition } from "react";
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

export function SalaryPageContent({
  startYear,
  endYear,
  salaries,
  latestSalary,
}: SalaryPageContentProps) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryData | null>(null);

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
        await saveSalary(data);
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
