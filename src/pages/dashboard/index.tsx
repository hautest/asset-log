import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Link } from "waku";
import { BarChart3, Plus, TrendingUp, Settings } from "lucide-react";
import { YearSelector } from "./_components/YearSelector";
import { AssetChart } from "./_components/AssetChart";
import { LogoutButton } from "./_components/LogoutButton";
import { getCategoriesByUserId } from "@/features/category/queries";

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: 0,
  }).format(amount);
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

  const categoryNameToId = new Map(
    userCategories.map((c) => [c.name, c.id])
  );

  const yearDataRaw = generateYearData(selectedYear);

  const yearData = yearDataRaw.map((snapshot) => {
    const convertedCategories: Record<string, number> = {};

    for (const [mockKey, amount] of Object.entries(snapshot.categories)) {
      const categoryName = CATEGORY_NAME_MAP[mockKey];
      const categoryId = categoryName ? categoryNameToId.get(categoryName) : null;

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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              자산로그
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/my"
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 transition-colors hover:bg-slate-200"
            >
              <Settings className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                {session.user.name}
              </span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                현재 총 자산
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {latestSnapshot
                  ? formatCurrency(latestSnapshot.totalAmount)
                  : "데이터 없음"}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {latestSnapshot
                  ? `${latestSnapshot.yearMonth.split("-")[1]}월 기준`
                  : "자산을 입력해주세요"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                전월 대비
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {growth > 0 ? "+" : ""}
                {growth.toFixed(2)}%
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {growth > 0 ? "증가" : growth < 0 ? "감소" : "변동 없음"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
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
            <AssetChart data={yearData} categoryList={userCategories} />

            {/* Action Button */}
            <div className="flex justify-center pt-6">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                이번 달 자산 입력하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
