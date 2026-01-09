"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Trash2, ArrowRight } from "lucide-react";
import { deletePortfolio } from "@/features/portfolio/server-functions/deletePortfolio";
import { toast } from "sonner";

interface PortfolioItem {
  id: string;
  ticker: string;
  name: string;
  weight: number;
}

interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  items: PortfolioItem[];
  createdAt: Date;
}

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export function PortfolioList({ portfolios }: PortfolioListProps) {
  if (portfolios.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-slate-500 mb-4">
            아직 생성된 포트폴리오가 없습니다
          </p>
          <p className="text-sm text-slate-400">
            새 포트폴리오를 만들어 분석을 시작하세요
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 포트폴리오를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deletePortfolio(id);
      toast.success("포트폴리오가 삭제되었습니다");
    } catch (error) {
      toast.error("삭제에 실패했습니다");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {portfolios.map((portfolio) => (
        <Card key={portfolio.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{portfolio.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-red-500"
                onClick={() => handleDelete(portfolio.id, portfolio.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {portfolio.description && (
              <p className="text-sm text-slate-500">{portfolio.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {portfolio.items.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-600">
                    {item.ticker}{" "}
                    <span className="text-slate-400">({item.name})</span>
                  </span>
                  <span className="font-medium text-slate-900">
                    {item.weight}%
                  </span>
                </div>
              ))}
              {portfolio.items.length > 5 && (
                <p className="text-xs text-slate-400">
                  +{portfolio.items.length - 5}개 더보기
                </p>
              )}
            </div>
            <Link href={`/dashboard/portfolio/${portfolio.id}`}>
              <Button variant="outline" className="w-full">
                분석하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
