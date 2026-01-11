import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPortfolioById } from "@/features/portfolio/queries";
import { PortfolioDetail } from "./_components/PortfolioDetail";
import { PortfolioDetailSkeleton } from "./_components/PortfolioDetailSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
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
