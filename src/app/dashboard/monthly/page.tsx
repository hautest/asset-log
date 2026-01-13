import type { Metadata } from "next";
import { Suspense } from "react";
import { StatsCardsSection } from "./_components/StatsCardsSection";
import { ChartSectionContainer } from "./_components/ChartSectionContainer";

export const metadata: Metadata = {
  title: "월별 자산 추이",
  description:
    "월별 자산 변화를 차트로 한눈에 확인하세요. 카테고리별 자산 구성과 총 자산 추이를 시각화하여 자산 관리를 도와드립니다.",
  robots: { index: true, follow: true },
};

interface MonthlyPageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function MonthlyPage({ searchParams }: MonthlyPageProps) {
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
