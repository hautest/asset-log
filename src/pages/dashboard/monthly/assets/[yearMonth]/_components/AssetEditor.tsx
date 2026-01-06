"use client";

import { useState } from "react";
import { useRouter, Link } from "waku";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AmountInput } from "@/shared/ui/amount-input";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Trash2 } from "lucide-react";
import { saveAssets } from "@/features/asset/server-functions/saveAssets";
import { getSnapshotAssets } from "@/features/asset/server-functions/getSnapshotAssets";
import { toast } from "sonner";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { AssetCompareDialog } from "./AssetCompareDialog";

interface Category {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
}

interface ExistingAsset {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  memo: string | null;
}

interface SnapshotOption {
  yearMonth: string;
  totalAmount: number;
}

interface AssetEditorProps {
  yearMonth: string;
  categories: Category[];
  existingAssets: ExistingAsset[];
  snapshotMemo: string | null;
  availableSnapshots: SnapshotOption[];
}

interface AssetRow {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  memo: string;
}

export function AssetEditor({
  yearMonth,
  categories,
  existingAssets,
  snapshotMemo,
  availableSnapshots,
}: AssetEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const initialRows: AssetRow[] = categories.map((cat) => {
    const existing = existingAssets.find((a) => a.categoryId === cat.id);
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      amount: existing?.amount ?? 0,
      memo: existing?.memo ?? "",
    };
  });

  const [rows, setRows] = useState<AssetRow[]>(initialRows);
  const [memo, setMemo] = useState(snapshotMemo ?? "");

  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);

  const handleAmountChange = (categoryId: string, value: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.categoryId === categoryId ? { ...row, amount: value } : row
      )
    );
  };

  const handleMemoChange = (categoryId: string, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.categoryId === categoryId ? { ...row, memo: value } : row
      )
    );
  };

  const handleClearRow = (categoryId: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.categoryId === categoryId ? { ...row, amount: 0, memo: "" } : row
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const assetsToSave = rows
        .filter((row) => row.amount > 0)
        .map((row) => ({
          categoryId: row.categoryId,
          amount: row.amount,
          memo: row.memo || undefined,
        }));

      await saveAssets({
        yearMonth,
        assets: assetsToSave,
        memo: memo || undefined,
      });

      toast.success("자산이 저장되었습니다");
      router.back();
    } catch {
      toast.error("자산 저장에 실패했습니다");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <p className="text-sm text-muted-foreground">
          카테고리별로 해당 월의 총 자산 금액을 입력하세요.
        </p>
        <p className="text-sm text-muted-foreground">
          카테고리는{" "}
          <Link to="/my" className="text-primary underline hover:no-underline">
            마이페이지
          </Link>
          에서 추가하거나 순서를 변경할 수 있습니다.
        </p>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>카테고리</TableHead>
              <TableHead>금액 (원)</TableHead>
              <TableHead>메모</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.categoryId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: row.categoryColor }}
                    />
                    <span className="font-medium">{row.categoryName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <AmountInput
                    placeholder="0"
                    value={row.amount}
                    onChange={(value) =>
                      handleAmountChange(row.categoryId, value)
                    }
                    className="w-40"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    placeholder="메모 (선택)"
                    value={row.memo}
                    onChange={(e) =>
                      handleMemoChange(row.categoryId, e.target.value)
                    }
                    className="w-48"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleClearRow(row.categoryId)}
                    disabled={row.amount === 0 && !row.memo}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">합계</span>
            <AssetCompareDialog
              currentYearMonth={yearMonth}
              currentAssets={rows}
              currentTotalAmount={totalAmount}
              availableSnapshots={availableSnapshots}
              getSnapshotAssets={getSnapshotAssets}
            />
          </div>
          <span className="text-xl font-bold">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            전체 메모 (선택)
          </label>
          <Input
            type="text"
            placeholder="이번 달 자산에 대한 메모를 입력하세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleCancel}>
          취소
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "저장 중..." : "저장하기"}
        </Button>
      </CardFooter>
    </Card>
  );
}
