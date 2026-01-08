import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/shared/auth/getSession";
import { SalaryChartSection } from "./_components/SalaryChartSection";

export const metadata: Metadata = {
  title: "연봉 추이",
  robots: { index: false, follow: false },
};

interface SalaryPageProps {
  searchParams: Promise<{ startYear?: string }>;
}

export default async function SalaryPage({ searchParams }: SalaryPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

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
