import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/shared/auth/getSession";
import { StatsCardsSection } from "./_components/StatsCardsSection";
import { ChartSectionContainer } from "./_components/ChartSectionContainer";

export const metadata: Metadata = {
  title: "월별 자산 추이",
  robots: { index: false, follow: false },
};

interface MonthlyPageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function MonthlyPage({ searchParams }: MonthlyPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const yearParam = params.year;
  const selectedYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
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
