"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { GitCompare } from "lucide-react";
import { AssetCompareResult } from "./AssetCompareResult";

interface SnapshotOption {
  yearMonth: string;
  totalAmount: number;
}

interface AssetRow {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  memo: string;
}

interface AssetCompareDialogProps {
  currentYearMonth: string;
  currentAssets: AssetRow[];
  currentTotalAmount: number;
  availableSnapshots: SnapshotOption[];
  getSnapshotAssets: (yearMonth: string) => Promise<AssetRow[]>;
}

function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${year}년 ${Number(month)}월`;
}

export function AssetCompareDialog({
  currentYearMonth,
  currentAssets,
  currentTotalAmount,
  availableSnapshots,
  getSnapshotAssets,
}: AssetCompareDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>("");
  const [compareAssets, setCompareAssets] = useState<AssetRow[] | null>(null);
  const [compareTotalAmount, setCompareTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!selectedYearMonth) return;

    setIsLoading(true);
    try {
      const assets = await getSnapshotAssets(selectedYearMonth);
      setCompareAssets(assets);
      const total = assets.reduce((sum, a) => sum + a.amount, 0);
      setCompareTotalAmount(total);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedYearMonth("");
    setCompareAssets(null);
    setCompareTotalAmount(0);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      handleReset();
    }
  };

  if (availableSnapshots.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <GitCompare className="mr-2 h-4 w-4" />
          비교하기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>자산 비교</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium">
                비교할 월 선택
              </label>
              <Select
                value={selectedYearMonth}
                onValueChange={setSelectedYearMonth}
              >
                <SelectTrigger>
                  <SelectValue placeholder="비교할 월을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {availableSnapshots.map((snapshot) => (
                    <SelectItem
                      key={snapshot.yearMonth}
                      value={snapshot.yearMonth}
                    >
                      {formatYearMonth(snapshot.yearMonth)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleCompare}
              disabled={!selectedYearMonth || isLoading}
            >
              {isLoading ? "불러오는 중..." : "비교"}
            </Button>
          </div>

          {compareAssets && (
            <AssetCompareResult
              currentYearMonth={currentYearMonth}
              currentAssets={currentAssets}
              currentTotalAmount={currentTotalAmount}
              compareYearMonth={selectedYearMonth}
              compareAssets={compareAssets}
              compareTotalAmount={compareTotalAmount}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
