import type { Metadata } from "next";
import { Suspense } from "react";
import { getPortfolios } from "@/features/portfolio/queries";
import { PortfolioList } from "./_components/PortfolioList";
import { PortfolioListSkeleton } from "./_components/PortfolioListSkeleton";
import { CreatePortfolioButton } from "./_components/CreatePortfolioButton";

export const metadata: Metadata = {
  title: "포트폴리오 분석",
  description:
    "나만의 투자 포트폴리오를 구성하고 백테스트 분석을 수행하세요. 자산 배분 전략을 시뮬레이션하여 최적의 투자 비율을 찾아보세요.",
  robots: { index: true, follow: true },
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">포트폴리오 분석</h1>
          <p className="text-sm text-slate-500">
            포트폴리오를 구성하고 백테스트 분석을 수행하세요
          </p>
        </div>
        <CreatePortfolioButton />
      </div>

      <Suspense fallback={<PortfolioListSkeleton />}>
        <PortfolioListSection />
      </Suspense>
    </div>
  );
}

async function PortfolioListSection() {
  const portfolios = await getPortfolios();
  return <PortfolioList portfolios={portfolios} />;
}
