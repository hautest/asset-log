import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { getCategoriesByUserId } from "@/features/category/queries";
import { getSnapshotByYearMonth } from "@/features/asset/queries";
import { Link } from "waku";
import { AppHeader } from "@/shared/components/AppHeader";
import { AssetEditor } from "./_components/AssetEditor";

interface AssetDetailPageProps {
  yearMonth: string;
}

function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${year}년 ${Number(month)}월`;
}

export default async function AssetDetailPage({
  yearMonth,
}: AssetDetailPageProps) {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const [categories, snapshot] = await Promise.all([
    getCategoriesByUserId(session.user.id),
    getSnapshotByYearMonth(session.user.id, yearMonth),
  ]);

  const existingAssets = snapshot?.assets ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AppHeader
        rightNode={
          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            대시보드
          </Link>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">
          {formatYearMonth(yearMonth)} 자산 등록
        </h1>

        <AssetEditor
          yearMonth={yearMonth}
          categories={categories}
          existingAssets={existingAssets}
          snapshotMemo={snapshot?.memo ?? null}
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
