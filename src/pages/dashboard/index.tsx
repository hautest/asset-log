import { Suspense } from "react";
import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { DashboardHeader } from "./_components/DashboardHeader";
import { StatsCardsSection } from "./_components/StatsCardsSection";
import { ChartSectionContainer } from "./_components/ChartSectionContainer";

export default async function DashboardPage({ query }: { query?: string }) {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const params = new URLSearchParams(query);
  const yearParam = params.get("year");
  const selectedYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <DashboardHeader userName={session.user.name} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<StatsCardsSection.Skeleton />}>
          <StatsCardsSection selectedYear={selectedYear} />
        </Suspense>

        <Suspense fallback={<ChartSectionContainer.Skeleton />}>
          <ChartSectionContainer selectedYear={selectedYear} />
        </Suspense>
      </main>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
