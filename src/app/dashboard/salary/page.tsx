import type { Metadata } from "next";
import { Suspense } from "react";
import { SalaryChartSection } from "./_components/SalaryChartSection";

export const metadata: Metadata = {
  title: "연봉 추이",
  description:
    "연도별 연봉 변화를 차트로 확인하세요. 연봉 증가율과 추이를 시각화하여 커리어 성장을 한눈에 파악할 수 있습니다.",
  robots: { index: true, follow: true },
};

interface SalaryPageProps {
  searchParams: Promise<{ startYear?: string }>;
}

export default async function SalaryPage({ searchParams }: SalaryPageProps) {
  const params = await searchParams;
  const startYearParam = params.startYear;
  const currentYear = new Date().getFullYear();
  const startYear = startYearParam
    ? parseInt(startYearParam)
    : Math.floor(currentYear / 5) * 5;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">연봉 추이</h1>

      <Suspense fallback={<SalaryChartSection.Skeleton />}>
        <SalaryChartSection startYear={startYear} />
      </Suspense>
    </div>
  );
}
