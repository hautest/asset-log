"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { useEffect, useRef } from "react";
import { Shuffle } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, "카테고리 이름을 입력하세요"),
  color: z.string().min(1, "색상을 선택하세요"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => void;
  defaultValues?: CategoryFormData;
  isEdit?: boolean;
}

const PRESET_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#8b5cf6",
  "#f97316",
  "#ec4899",
  "#06b6d4",
  "#a855f7",
  "#14b8a6",
  "#f59e0b",
] as const;

const DEFAULT_COLOR = PRESET_COLORS[0];

function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 60;
  const lightness = Math.floor(Math.random() * 20) + 45;
  return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEdit,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      color: defaultValues?.color ?? DEFAULT_COLOR,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        color: defaultValues?.color ?? DEFAULT_COLOR,
      });
    }
  }, [open, defaultValues, reset]);

  const selectedColor = watch("color");
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  const handleRandomColor = () => {
    const randomColor = generateRandomColor();
    setValue("color", randomColor, { shouldValidate: true, shouldDirty: true });
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("color", e.target.value, { shouldValidate: true, shouldDirty: true });
  };

  const isPresetColor = PRESET_COLORS.includes(
    selectedColor as (typeof PRESET_COLORS)[number]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "카테고리 수정" : "새 카테고리 추가"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" placeholder="예: 부동산" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>색상</Label>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`색상 선택: ${color}`}
                  aria-pressed={selectedColor === color}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === color
                      ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setValue("color", color, { shouldValidate: true, shouldDirty: true })
                  }
                />
              ))}
              <div className="relative">
                <button
                  type="button"
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                    !isPresetColor && selectedColor
                      ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                      : "border-dashed border-slate-300"
                  }`}
                  style={{
                    backgroundColor:
                      !isPresetColor && selectedColor
                        ? selectedColor
                        : undefined,
                  }}
                  onClick={() => colorInputRef.current?.click()}
                >
                  {(isPresetColor || !selectedColor) && (
                    <span className="text-xs text-slate-400">+</span>
                  )}
                </button>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={selectedColor || DEFAULT_COLOR}
                  onChange={handleColorPickerChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              <button
                type="button"
                onClick={handleRandomColor}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-slate-300 transition-transform hover:scale-110 hover:border-slate-400"
                title="랜덤 색상"
                aria-label="랜덤 색상 생성"
              >
                <Shuffle className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <input type="hidden" {...register("color")} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit">{isEdit ? "수정" : "추가"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
