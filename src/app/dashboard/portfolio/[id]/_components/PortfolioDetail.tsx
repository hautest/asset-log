"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { DatePicker } from "@/shared/ui/date-picker";
import { ArrowLeft, Pencil, Loader2, Activity } from "lucide-react";
import { PortfolioFormDialog } from "../../_components/PortfolioFormDialog";
import { analyzePortfolioAction } from "@/features/portfolio/server-functions/analyzePortfolio";
import { toast } from "sonner";
import { AnalysisResult } from "./AnalysisResult";
import type { PortfolioAnalysis } from "@/features/portfolio/analysis";
import { useRouter } from "next/navigation";

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

interface PriceData {
  date: string;
  close: number;
}

interface AnalysisData {
  analysis: PortfolioAnalysis;
  portfolioPrices: PriceData[];
  stockPrices: Record<string, PriceData[]>;
  items: Array<{ ticker: string; name: string; weight: number }>;
}

interface PortfolioDetailProps {
  portfolio: Portfolio;
}

export function PortfolioDetail({ portfolio }: PortfolioDetailProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    getDefaultStartDate()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(getDefaultEndDate());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const router = useRouter();

  const handleAnalyze = async () => {
    if (!startDate || !endDate) {
      toast.error("분석 기간을 선택하세요");
      return;
    }

    if (startDate >= endDate) {
      toast.error("시작일은 종료일보다 이전이어야 합니다");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzePortfolioAction({
        portfolioId: portfolio.id,
        startDate: formatDateToString(startDate),
        endDate: formatDateToString(endDate),
      });
      setAnalysisData(result);
      toast.success("분석이 완료되었습니다");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "분석에 실패했습니다";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {portfolio.name}
          </h1>
          {portfolio.description && (
            <p className="text-sm text-slate-500">{portfolio.description}</p>
          )}
        </div>
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          수정
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              종목 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{portfolio.items.length}개</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              최대 비중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {Math.max(...portfolio.items.map((i) => i.weight))}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              생성일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Date(portfolio.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>포트폴리오 구성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.ticker}</p>
                  <p className="text-sm text-slate-500">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">
                    {item.weight}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>백테스트 분석</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>시작일</Label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="시작일 선택"
              />
            </div>
            <div className="space-y-2">
              <Label>종료일</Label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="종료일 선택"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    분석 실행
                  </>
                )}
              </Button>
            </div>
          </div>

          {analysisData && <AnalysisResult data={analysisData} />}
        </CardContent>
      </Card>

      <PortfolioFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        portfolio={{
          id: portfolio.id,
          name: portfolio.name,
          description: portfolio.description,
          items: portfolio.items.map((i) => ({
            ticker: i.ticker,
            name: i.name,
            weight: i.weight,
          })),
        }}
      />
    </>
  );
}

function getDefaultStartDate(): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

function getDefaultEndDate(): Date {
  return new Date();
}

function formatDateToString(date: Date): string {
  return date.toISOString().split("T")[0] ?? "";
}
