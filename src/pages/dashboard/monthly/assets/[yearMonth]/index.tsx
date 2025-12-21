import { Suspense } from "react";
import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { Seo } from "@/shared/components/Seo";
import { AssetEditorSection } from "./_components/AssetEditorSection";

interface AssetDetailPageProps {
  yearMonth: string;
}

const YEAR_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

function isValidYearMonth(yearMonth: string): boolean {
  return YEAR_MONTH_REGEX.test(yearMonth);
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

  if (!isValidYearMonth(yearMonth)) {
    return redirect("/dashboard");
  }

  const pageTitle = `${formatYearMonth(yearMonth)} 자산 등록`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Seo title={pageTitle} noIndex />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">{pageTitle}</h1>

        <Suspense fallback={<AssetEditorSection.Skeleton />}>
          <AssetEditorSection yearMonth={yearMonth} />
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
