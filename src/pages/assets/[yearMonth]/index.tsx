import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";

interface AssetDetailPageProps {
  yearMonth: string;
}

export default async function AssetDetailPage({
  yearMonth,
}: AssetDetailPageProps) {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {yearMonth} 자산 상세
        </h1>
        <p className="mt-4 text-slate-600">이 페이지는 준비 중입니다.</p>
      </main>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
