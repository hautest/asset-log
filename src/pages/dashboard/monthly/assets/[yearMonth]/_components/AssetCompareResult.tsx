"use client";

import { formatCurrency } from "@/shared/utils/formatCurrency";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface AssetRow {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  memo: string;
}

interface AssetCompareResultProps {
  currentYearMonth: string;
  currentAssets: AssetRow[];
  currentTotalAmount: number;
  compareYearMonth: string;
  compareAssets: AssetRow[];
  compareTotalAmount: number;
}

interface CompareItem {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  currentAmount: number;
  compareAmount: number;
  difference: number;
  percentChange: number | null;
}

function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${year}년 ${Number(month)}월`;
}

export function AssetCompareResult({
  currentYearMonth,
  currentAssets,
  currentTotalAmount,
  compareYearMonth,
  compareAssets,
  compareTotalAmount,
}: AssetCompareResultProps) {
  const allCategoryIds = new Set([
    ...currentAssets.map((a) => a.categoryId),
    ...compareAssets.map((a) => a.categoryId),
  ]);

  const compareItems: CompareItem[] = Array.from(allCategoryIds).map(
    (categoryId) => {
      const current = currentAssets.find((a) => a.categoryId === categoryId);
      const compare = compareAssets.find((a) => a.categoryId === categoryId);

      const currentAmount = current?.amount ?? 0;
      const compareAmount = compare?.amount ?? 0;
      const difference = currentAmount - compareAmount;
      const percentChange =
        compareAmount !== 0 ? (difference / compareAmount) * 100 : null;

      return {
        categoryId,
        categoryName: current?.categoryName ?? compare?.categoryName ?? "",
        categoryColor: current?.categoryColor ?? compare?.categoryColor ?? "",
        currentAmount,
        compareAmount,
        difference,
        percentChange,
      };
    }
  );

  const sortedItems = compareItems.sort(
    (a, b) => Math.abs(b.difference) - Math.abs(a.difference)
  );

  const totalDifference = currentTotalAmount - compareTotalAmount;
  const totalPercentChange =
    compareTotalAmount !== 0
      ? (totalDifference / compareTotalAmount) * 100
      : null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatYearMonth(compareYearMonth)}</span>
          <span className="mx-2">→</span>
          <span>{formatYearMonth(currentYearMonth)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">총 자산 변화</span>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {totalDifference > 0 ? (
                <ArrowUp className="h-5 w-5 text-green-600" />
              ) : totalDifference < 0 ? (
                <ArrowDown className="h-5 w-5 text-red-600" />
              ) : (
                <Minus className="h-5 w-5 text-muted-foreground" />
              )}
              <span
                className={`text-xl font-bold ${
                  totalDifference > 0
                    ? "text-green-600"
                    : totalDifference < 0
                      ? "text-red-600"
                      : ""
                }`}
              >
                {totalDifference > 0 ? "+" : ""}
                {formatCurrency(totalDifference)}
              </span>
            </div>
            {totalPercentChange !== null && (
              <span
                className={`text-sm ${
                  totalPercentChange > 0
                    ? "text-green-600"
                    : totalPercentChange < 0
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                ({totalPercentChange > 0 ? "+" : ""}
                {totalPercentChange.toFixed(2)}%)
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>{formatCurrency(compareTotalAmount)}</span>
          <span>{formatCurrency(currentTotalAmount)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          카테고리별 변화
        </h4>
        <div className="space-y-2">
          {sortedItems.map((item) => (
            <div
              key={item.categoryId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.categoryColor }}
                />
                <span className="font-medium">{item.categoryName}</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center justify-end gap-1">
                  {item.difference > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : item.difference < 0 ? (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={`font-semibold tabular-nums ${
                      item.difference > 0
                        ? "text-green-600"
                        : item.difference < 0
                          ? "text-red-600"
                          : ""
                    }`}
                  >
                    {item.difference > 0 ? "+" : ""}
                    {formatCurrency(item.difference)}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  {item.percentChange !== null && (
                    <span
                      className={`tabular-nums ${
                        item.percentChange > 0
                          ? "text-green-600"
                          : item.percentChange < 0
                            ? "text-red-600"
                            : ""
                      }`}
                    >
                      ({item.percentChange > 0 ? "+" : ""}
                      {item.percentChange.toFixed(1)}%)
                    </span>
                  )}
                  <span className="tabular-nums">
                    {formatCurrency(item.compareAmount)} →{" "}
                    {formatCurrency(item.currentAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
