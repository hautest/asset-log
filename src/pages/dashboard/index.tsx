import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { getCategoriesByUserId } from "@/features/category/queries";
import { DashboardHeader } from "./_components/DashboardHeader";
import { StatsCards } from "./_components/StatsCards";
import { ChartSection } from "./_components/ChartSection";

const CATEGORY_NAME_MAP: Record<string, string> = {
  stocks: "주식",
  cash: "현금",
  gold: "금",
  bonds: "채권",
  deposit: "보증금",
  realestate: "부동산",
  crypto: "코인",
  savings: "적금",
  pension: "연금",
  loan: "빌려준 돈",
};

// 모킹 데이터: 실제로는 DB에서 가져옴
const MOCK_DATA = {
  2025: [
    {
      yearMonth: "2025-01",
      categories: {
        stocks: 40000000,
        cash: 20000000,
        crypto: 8000000,
        realestate: 10000000,
        gold: 2000000,
      },
    },
    {
      yearMonth: "2025-02",
      categories: {
        stocks: 42000000,
        cash: 20000000,
        crypto: 8000000,
        realestate: 10000000,
        gold: 2000000,
      },
    },
    {
      yearMonth: "2025-03",
      categories: {
        stocks: 43000000,
        cash: 22000000,
        crypto: 9000000,
        realestate: 10000000,
        gold: 2000000,
      },
    },
  ],
  2024: [
    {
      yearMonth: "2024-01",
      categories: {
        stocks: 20000000,
        cash: 15000000,
        crypto: 5000000,
        realestate: 5000000,
      },
    },
    {
      yearMonth: "2024-02",
      categories: {
        stocks: 22000000,
        cash: 15000000,
        crypto: 5000000,
        realestate: 5000000,
      },
    },
    {
      yearMonth: "2024-03",
      categories: {
        stocks: 23000000,
        cash: 15000000,
        crypto: 5500000,
        realestate: 5000000,
      },
    },
    {
      yearMonth: "2024-04",
      categories: {
        stocks: 25000000,
        cash: 15000000,
        crypto: 5000000,
        realestate: 5000000,
      },
    },
    {
      yearMonth: "2024-05",
      categories: {
        stocks: 27000000,
        cash: 15000000,
        crypto: 5000000,
        realestate: 5000000,
      },
    },
    {
      yearMonth: "2024-06",
      categories: {
        stocks: 28000000,
        cash: 15000000,
        crypto: 5500000,
        realestate: 5000000,
      },
    },
    {
      yearMonth: "2024-07",
      categories: {
        stocks: 30000000,
        cash: 15000000,
        crypto: 5000000,
        realestate: 5000000,
      },
    },
    {
      yearMonth: "2024-08",
      categories: {
        stocks: 32000000,
        cash: 15000000,
        crypto: 5000000,
        realestate: 5000000,
      },
    },
    {
      yearMonth: "2024-09",
      categories: {
        stocks: 33000000,
        cash: 16000000,
        crypto: 5000000,
        realestate: 5000000,
        bonds: 3000000,
      },
    },
    {
      yearMonth: "2024-10",
      categories: {
        stocks: 34000000,
        cash: 16000000,
        crypto: 6000000,
        realestate: 5000000,
        bonds: 3000000,
      },
    },
    {
      yearMonth: "2024-11",
      categories: {
        stocks: 35000000,
        cash: 17000000,
        crypto: 6000000,
        realestate: 5000000,
        bonds: 3000000,
      },
    },
    {
      yearMonth: "2024-12",
      categories: {
        stocks: 37000000,
        cash: 15000000,
        crypto: 5000000,
        realestate: 5000000,
      },
    },
  ],
  2023: [
    {
      yearMonth: "2023-01",
      categories: {
        stocks: 15000000,
        cash: 10000000,
        crypto: 3000000,
        savings: 2000000,
      },
    },
    {
      yearMonth: "2023-02",
      categories: {
        stocks: 16000000,
        cash: 11000000,
        crypto: 3000000,
        savings: 2000000,
      },
    },
    {
      yearMonth: "2023-03",
      categories: {
        stocks: 17000000,
        cash: 11000000,
        crypto: 3000000,
        savings: 2000000,
      },
    },
    {
      yearMonth: "2023-04",
      categories: {
        stocks: 17500000,
        cash: 11000000,
        crypto: 3500000,
        savings: 2000000,
      },
    },
    {
      yearMonth: "2023-05",
      categories: {
        stocks: 18000000,
        cash: 12000000,
        crypto: 3000000,
        savings: 2000000,
      },
    },
    {
      yearMonth: "2023-06",
      categories: {
        stocks: 18000000,
        cash: 12000000,
        crypto: 3500000,
        savings: 2500000,
      },
    },
  ],
};

type CategoryData = {
  stocks?: number;
  cash?: number;
  gold?: number;
  bonds?: number;
  deposit?: number;
  realestate?: number;
  crypto?: number;
  savings?: number;
  pension?: number;
  loan?: number;
};

const generateYearData = (year: number) => {
  const existingData = MOCK_DATA[year as keyof typeof MOCK_DATA] || [];
  const dataMap = new Map(existingData.map((d) => [d.yearMonth, d.categories]));

  return Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const yearMonth = `${year}-${month}`;
    const categories = dataMap.get(yearMonth) || {};
    const totalAmount = Object.values(categories).reduce((a, b) => a + b, 0);

    return {
      yearMonth,
      totalAmount,
      status: totalAmount > 0 ? ("completed" as const) : ("empty" as const),
      categories: categories as CategoryData,
    };
  });
};

const calculateGrowth = (snapshots: ReturnType<typeof generateYearData>) => {
  const completedSnapshots = snapshots.filter((s) => s.status === "completed");
  if (completedSnapshots.length < 2) return 0;

  const latest = completedSnapshots[completedSnapshots.length - 1];
  const previous = completedSnapshots[completedSnapshots.length - 2];

  if (previous?.totalAmount === 0) return 0;

  return (
    ((latest?.totalAmount - previous?.totalAmount) / previous?.totalAmount ??
      0) * 100
  );
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { year?: string };
}) {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const selectedYear = searchParams?.year
    ? parseInt(searchParams.year)
    : new Date().getFullYear();

  const userCategories = await getCategoriesByUserId(session.user.id);

  const categoryNameToId = new Map(userCategories.map((c) => [c.name, c.id]));

  const yearDataRaw = generateYearData(selectedYear);

  const yearData = yearDataRaw.map((snapshot) => {
    const convertedCategories: Record<string, number> = {};

    for (const [mockKey, amount] of Object.entries(snapshot.categories)) {
      const categoryName = CATEGORY_NAME_MAP[mockKey];
      const categoryId = categoryName
        ? categoryNameToId.get(categoryName)
        : null;

      if (categoryId) {
        convertedCategories[categoryId] = amount as number;
      }
    }

    return {
      ...snapshot,
      categories: convertedCategories,
    };
  });

  const latestSnapshot = yearData.filter((s) => s.status === "completed").pop();
  const growth = calculateGrowth(yearDataRaw);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <DashboardHeader userName={session.user.name} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <StatsCards
          totalAmount={latestSnapshot?.totalAmount ?? null}
          latestMonth={latestSnapshot?.yearMonth.split("-")[1] ?? null}
          growth={growth}
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
