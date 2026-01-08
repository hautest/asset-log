import { getYearSnapshotsWithAssets, getAllCompletedSnapshots } from "@/features/asset/queries";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { StatsCards } from "./StatsCards";

interface MonthData {
  yearMonth: string;
  totalAmount: number;
  status: "completed" | "empty";
  categories: Record<string, number>;
}

interface StatsCardsSectionProps {
  selectedYear: number;
}

const calculateGrowth = (
  currentSnapshots: MonthData[],
  previousYearSnapshots: MonthData[]
) => {
  const completedSnapshots = currentSnapshots.filter(
    (s) => s.status === "completed"
  );
  if (completedSnapshots.length === 0) return 0;

  const latest = completedSnapshots[completedSnapshots.length - 1];
  if (!latest) return 0;

  if (completedSnapshots.length >= 2) {
    const previous = completedSnapshots[completedSnapshots.length - 2];
    if (!previous || previous.totalAmount === 0) return 0;
    return (
      ((latest.totalAmount - previous.totalAmount) / previous.totalAmount) * 100
    );
  }

  const latestMonth = parseInt(latest.yearMonth.split("-")[1] ?? "0");
  if (latestMonth === 1) {
    const previousDecember = previousYearSnapshots.find(
      (s) => s.yearMonth.endsWith("-12") && s.status === "completed"
    );
    if (!previousDecember || previousDecember.totalAmount === 0) return 0;
    return (
      ((latest.totalAmount - previousDecember.totalAmount) /
        previousDecember.totalAmount) *
      100
    );
  }

  return 0;
};

const calculateYearOverYearGrowth = (
  currentYearSnapshots: MonthData[],
  previousYearSnapshots: MonthData[]
) => {
  const currentLatest = currentYearSnapshots
    .filter((s) => s.status === "completed")
    .pop();
  const previousLatest = previousYearSnapshots
    .filter((s) => s.status === "completed")
    .pop();

  if (!currentLatest || !previousLatest || previousLatest.totalAmount === 0) {
    return null;
  }

  return (
    ((currentLatest.totalAmount - previousLatest.totalAmount) /
      previousLatest.totalAmount) *
    100
  );
};

async function StatsCardsSection({ selectedYear }: StatsCardsSectionProps) {
  const [yearData, previousYearData, allSnapshots] = await Promise.all([
    getYearSnapshotsWithAssets(selectedYear),
    getYearSnapshotsWithAssets(selectedYear - 1),
    getAllCompletedSnapshots(),
  ]);

  const latestSnapshot = allSnapshots[0];
  const growth = calculateGrowth(yearData, previousYearData);
  const yearOverYearGrowth = calculateYearOverYearGrowth(
    yearData,
    previousYearData
  );

  return (
    <StatsCards
      totalAmount={latestSnapshot?.totalAmount ?? null}
      latestYearMonth={latestSnapshot?.yearMonth ?? null}
      growth={growth}
      yearOverYearGrowth={yearOverYearGrowth}
    />
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-2 h-3 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

StatsCardsSection.Skeleton = StatsCardsSkeleton;

export { StatsCardsSection };
