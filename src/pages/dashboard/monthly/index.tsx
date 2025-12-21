import { Suspense } from "react";
import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { Seo } from "@/shared/components/Seo";
import { StatsCardsSection } from "./_components/StatsCardsSection";
import { ChartSectionContainer } from "./_components/ChartSectionContainer";

export default async function MonthlyPage({ query }: { query?: string }) {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const params = new URLSearchParams(query);
  const yearParam = params.get("year");
  const selectedYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="월별 자산 추이" noIndex />
      <h1 className="mb-8 text-2xl font-bold text-slate-900">월별 자산 추이</h1>

      <Suspense fallback={<StatsCardsSection.Skeleton />}>
        <StatsCardsSection selectedYear={selectedYear} />
      </Suspense>

      <Suspense fallback={<ChartSectionContainer.Skeleton />}>
        <ChartSectionContainer selectedYear={selectedYear} />
      </Suspense>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
