import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPortfolioById } from "@/features/portfolio/queries";
import { PortfolioDetail } from "./_components/PortfolioDetail";
import { PortfolioDetailSkeleton } from "./_components/PortfolioDetailSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const portfolio = await getPortfolioById(id);

  if (!portfolio) {
    return {
      title: "포트폴리오를 찾을 수 없습니다",
    };
  }

  return {
    title: portfolio.name,
    description: `${portfolio.name} 포트폴리오 백테스트 결과 및 AI 분석. 자산 배분, 수익률, 리스크를 확인하세요.`,
    robots: { index: true, follow: true },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Suspense fallback={<PortfolioDetailSkeleton />}>
        <PortfolioDetailSection id={id} />
      </Suspense>
    </div>
  );
}

async function PortfolioDetailSection({ id }: { id: string }) {
  const portfolio = await getPortfolioById(id);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioDetail portfolio={portfolio} />;
}
