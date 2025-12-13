import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { YearSelector } from "./YearSelector";
import { AssetChart } from "./AssetChart";

interface Category {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
}

interface ChartData {
  yearMonth: string;
  totalAmount: number;
  status: "completed" | "empty";
  categories: Record<string, number>;
}

interface ChartSectionProps {
  selectedYear: number;
  data: ChartData[];
  categoryList: Category[];
}

export function ChartSection({
  selectedYear,
  data,
  categoryList,
}: ChartSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl">월별 자산 추이</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            {selectedYear}년 자산 변화를 확인하세요
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <YearSelector selectedYear={selectedYear} />
        </div>
      </CardHeader>
      <CardContent>
        <AssetChart data={data} categoryList={categoryList} />

        <div className="flex justify-center pt-6">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            이번 달 자산 입력하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
