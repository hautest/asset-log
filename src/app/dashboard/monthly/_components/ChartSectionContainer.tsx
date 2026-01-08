import { getCategories } from "@/features/category/queries";
import { getYearSnapshotsWithAssets } from "@/features/asset/queries";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { ChartSection } from "./ChartSection";

interface ChartSectionContainerProps {
  selectedYear: number;
}

async function ChartSectionContainer({ selectedYear }: ChartSectionContainerProps) {
  const [userCategories, yearData] = await Promise.all([
    getCategories(),
    getYearSnapshotsWithAssets(selectedYear),
  ]);

  return (
    <ChartSection
      selectedYear={selectedYear}
      data={yearData}
      categoryList={userCategories}
    />
  );
}

function ChartSectionSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[400px] w-full" />
        <div className="flex justify-center pt-6">
          <Skeleton className="h-11 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

ChartSectionContainer.Skeleton = ChartSectionSkeleton;

export { ChartSectionContainer };
