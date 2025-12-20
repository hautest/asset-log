import { Suspense } from "react";
import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { SalaryChartSection } from "./_components/SalaryChartSection";

interface SalaryPageProps {
  query?: string;
}

export default async function SalaryPage({ query }: SalaryPageProps) {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const params = new URLSearchParams(query);
  const startYearParam = params.get("startYear");
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

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
