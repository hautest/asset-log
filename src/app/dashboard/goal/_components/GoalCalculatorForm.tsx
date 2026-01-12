"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AmountInput } from "@/shared/ui/amount-input";

const goalCalculatorSchema = z.object({
  targetAmount: z.number().min(1, "목표 자산을 입력해주세요"),
  initialCapital: z.number().min(0, "초기자금은 0 이상이어야 합니다"),
  monthlyInvestment: z.number().min(0, "투자 금액은 0 이상이어야 합니다"),
  returnRate: z
    .number()
    .min(0, "수익률은 0 이상이어야 합니다")
    .max(100, "수익률은 100% 이하여야 합니다"),
  returnRateType: z.enum(["annual", "monthly"]),
});

export type GoalCalculatorFormData = z.infer<typeof goalCalculatorSchema>;

interface GoalCalculatorFormProps {
  defaultValues: GoalCalculatorFormData;
  onChange: (data: GoalCalculatorFormData) => void;
}

export function GoalCalculatorForm({
  defaultValues,
  onChange,
}: GoalCalculatorFormProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GoalCalculatorFormData>({
    resolver: zodResolver(goalCalculatorSchema),
    defaultValues,
    mode: "onChange",
  });

  const formData = watch();
  const { returnRateType } = formData;

  useEffect(() => {
    onChange(formData);
  }, [
    formData.targetAmount,
    formData.initialCapital,
    formData.monthlyInvestment,
    formData.returnRate,
    formData.returnRateType,
    onChange,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>목표 설정</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">목표 자산 (원)</Label>
              <Controller
                name="targetAmount"
                control={control}
                render={({ field }) => (
                  <AmountInput
                    id="targetAmount"
                    placeholder="예: 100,000,000"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.targetAmount && (
                <p className="text-sm text-red-500">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialCapital">초기자금 (원)</Label>
              <Controller
                name="initialCapital"
                control={control}
                render={({ field }) => (
                  <AmountInput
                    id="initialCapital"
                    placeholder="예: 10,000,000"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.initialCapital && (
                <p className="text-sm text-red-500">
                  {errors.initialCapital.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyInvestment">
              매달 추가 투자 금액 (원)
            </Label>
            <Controller
              name="monthlyInvestment"
              control={control}
              render={({ field }) => (
                <AmountInput
                  id="monthlyInvestment"
                  placeholder="예: 500,000"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.monthlyInvestment && (
              <p className="text-sm text-red-500">
                {errors.monthlyInvestment.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label id="returnRateTypeLabel">수익률 유형</Label>
            <div
              role="group"
              aria-labelledby="returnRateTypeLabel"
              className="flex gap-2"
            >
              <Button
                type="button"
                variant={returnRateType === "annual" ? "default" : "outline"}
                onClick={() => setValue("returnRateType", "annual")}
                aria-pressed={returnRateType === "annual"}
                className="flex-1"
              >
                연 수익률
              </Button>
              <Button
                type="button"
                variant={returnRateType === "monthly" ? "default" : "outline"}
                onClick={() => setValue("returnRateType", "monthly")}
                aria-pressed={returnRateType === "monthly"}
                className="flex-1"
              >
                월 수익률
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnRate">
              수익률 (%)
              <span className="ml-2 text-xs text-slate-500">
                {returnRateType === "annual"
                  ? "연 수익률은 보통 5-8%가 현실적인 장기 투자 수익률입니다."
                  : "월 수익률은 보통 0.4-0.7%가 현실적입니다."}
              </span>
            </Label>
            <Controller
              name="returnRate"
              control={control}
              render={({ field }) => (
                <Input
                  id="returnRate"
                  type="number"
                  step="0.1"
                  placeholder="예: 8"
                  defaultValue={field.value || ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "" || inputValue === "-") {
                      field.onChange(0);
                      return;
                    }
                    const parsed = parseFloat(inputValue);
                    if (!Number.isNaN(parsed)) {
                      field.onChange(parsed);
                    }
                  }}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.returnRate && (
              <p className="text-sm text-red-500">{errors.returnRate.message}</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
