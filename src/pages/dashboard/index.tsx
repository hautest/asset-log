import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { getCategories } from "@/features/category/queries";
import { getYearSnapshotsWithAssets } from "@/features/asset/queries";
import { DashboardHeader } from "./_components/DashboardHeader";
import { StatsCards } from "./_components/StatsCards";
import { ChartSection } from "./_components/ChartSection";

interface MonthData {
  yearMonth: string;
  totalAmount: number;
  status: "completed" | "empty";
  categories: Record<string, number>;
}

const calculateGrowth = (snapshots: MonthData[]) => {
  const completedSnapshots = snapshots.filter((s) => s.status === "completed");
  if (completedSnapshots.length < 2) return 0;

  const latest = completedSnapshots[completedSnapshots.length - 1];
  const previous = completedSnapshots[completedSnapshots.length - 2];

  if (!latest || !previous || previous.totalAmount === 0) return 0;

  return ((latest.totalAmount - previous.totalAmount) / previous.totalAmount) * 100;
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

export default async function DashboardPage({ query }: { query?: string }) {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const params = new URLSearchParams(query);
  const yearParam = params.get("year");
  const selectedYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

  const [userCategories, yearData, previousYearData] = await Promise.all([
    getCategories(),
    getYearSnapshotsWithAssets(selectedYear),
    getYearSnapshotsWithAssets(selectedYear - 1),
  ]);

  const latestSnapshot = yearData.filter((s) => s.status === "completed").pop();
  const growth = calculateGrowth(yearData);
  const yearOverYearGrowth = calculateYearOverYearGrowth(yearData, previousYearData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <DashboardHeader userName={session.user.name} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <StatsCards
          totalAmount={latestSnapshot?.totalAmount ?? null}
          latestMonth={latestSnapshot?.yearMonth.split("-")[1] ?? null}
          growth={growth}
          yearOverYearGrowth={yearOverYearGrowth}
        />

        <ChartSection
          selectedYear={selectedYear}
          data={yearData}
          categoryList={userCategories}
        />
      </main>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
