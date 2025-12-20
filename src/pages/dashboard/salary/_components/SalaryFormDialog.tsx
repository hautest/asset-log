"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { AmountInput } from "@/shared/ui/amount-input";
import { useEffect, useRef } from "react";

const salarySchema = z.object({
  year: z
    .number({ error: "연도를 입력해주세요" })
    .min(1950, "1950년 이후만 입력 가능합니다")
    .max(new Date().getFullYear(), "미래 연도는 입력할 수 없습니다"),
  amount: z
    .number({ error: "연봉을 입력해주세요" })
    .min(0, "금액은 0 이상이어야 합니다"),
  memo: z.string().optional(),
});

type SalaryFormData = z.infer<typeof salarySchema>;

interface SalaryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SalaryFormData) => void;
  year: number;
  defaultValues?: {
    amount: number;
    memo?: string;
  };
  isEdit?: boolean;
  isPending?: boolean;
}

export function SalaryFormDialog({
  open,
  onOpenChange,
  onSubmit,
  year,
  defaultValues,
  isEdit,
  isPending,
}: SalaryFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SalaryFormData>({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      year,
      amount: defaultValues?.amount ?? 0,
      memo: defaultValues?.memo ?? "",
    },
  });

  const prevOpenRef = useRef(false);

  useEffect(() => {
    // open이 false에서 true로 바뀔 때만 reset
    if (open && !prevOpenRef.current) {
      reset({
        year,
        amount: defaultValues?.amount ?? 0,
        memo: defaultValues?.memo ?? "",
      });
    }
    prevOpenRef.current = open;
  }, [open, year, defaultValues, reset]);

  const handleFormSubmit = (data: SalaryFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {year}년 연봉 {isEdit ? "수정" : "추가"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="amount">연봉 (원)</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <AmountInput
                  id="amount"
                  placeholder="예: 50,000,000"
                  value={field.value}
                  onChange={field.onChange}
                  className="text-left"
                />
              )}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">메모 (선택)</Label>
            <Textarea
              id="memo"
              placeholder="예: 첫 직장 입사"
              {...register("memo")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "저장 중..." : isEdit ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
