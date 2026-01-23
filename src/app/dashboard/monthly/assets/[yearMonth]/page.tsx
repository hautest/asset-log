import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/shared/auth/getSession";
import { AssetEditorSection } from "./_components/AssetEditorSection";

const YEAR_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

function isValidYearMonth(yearMonth: string): boolean {
  return YEAR_MONTH_REGEX.test(yearMonth);
}

function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${year}년 ${Number(month)}월`;
}

interface AssetDetailPageProps {
  params: Promise<{ yearMonth: string }>;
}

export async function generateMetadata({
  params,
}: AssetDetailPageProps): Promise<Metadata> {
  const { yearMonth } = await params;
  const title = isValidYearMonth(yearMonth)
    ? `${formatYearMonth(yearMonth)} 자산 등록`
    : "자산 등록";

  return {
    title,
    description: `${title} - 자산로그에서 월별 자산을 기록하고 관리하세요`,
    robots: { index: true, follow: true },
  };
}

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { yearMonth } = await params;

  if (!isValidYearMonth(yearMonth)) {
    redirect("/dashboard");
  }

  const pageTitle = `${formatYearMonth(yearMonth)} 자산 등록`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">{pageTitle}</h1>

        <Suspense fallback={<AssetEditorSection.Skeleton />}>
          <AssetEditorSection yearMonth={yearMonth} />
        </Suspense>
      </main>
    </div>
  );
}
