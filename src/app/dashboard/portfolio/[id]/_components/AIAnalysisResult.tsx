"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Trophy,
} from "lucide-react";
import type { AIAnalysisResult as AIAnalysisResultType } from "@/features/portfolio/server-functions/analyzeWithAI";

interface AIAnalysisResultProps {
  data: AIAnalysisResultType;
}

export function AIAnalysisResult({ data }: AIAnalysisResultProps) {
  const scoreColor = getScoreColor(data.score);
  const scoreLabel = getScoreLabel(data.score);

  return (
    <div className="space-y-4 mt-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Sparkles className="h-5 w-5" />
            AI 분석 리포트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed text-[15px]">
            {data.summary}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-emerald-700 text-base">
              <CheckCircle2 className="h-4 w-4" />
              장점
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3">
              {data.strengths.map((strength, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-700">
                  <span className="text-emerald-500 font-bold shrink-0 w-4 text-center">
                    +
                  </span>
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700 text-base">
              <AlertCircle className="h-4 w-4" />
              단점
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3">
              {data.weaknesses.map((weakness, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-700">
                  <span className="text-red-500 font-bold shrink-0 w-4 text-center">
                    -
                  </span>
                  <span className="leading-relaxed">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-700 text-base">
            <Lightbulb className="h-4 w-4" />
            특징
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-3">
            {data.characteristics.map((char, index) => (
              <li key={index} className="flex gap-3 text-sm text-slate-700">
                <span className="text-amber-500 font-bold shrink-0 w-4 text-center">
                  *
                </span>
                <span className="leading-relaxed">{char}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className={`border-2 ${scoreColor.border} ${scoreColor.cardBg}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${scoreColor.bg} shadow-lg`}
              >
                <Trophy className={`h-10 w-10 ${scoreColor.icon}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">포트폴리오 점수</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-bold ${scoreColor.text}`}>
                    {data.score}
                  </span>
                  <span className="text-lg text-slate-400">/ 100</span>
                </div>
                <p
                  className={`text-sm font-semibold mt-1 ${scoreColor.text}`}
                >
                  {scoreLabel}
                </p>
              </div>
            </div>
            <div className="flex-1 md:border-l md:pl-6 border-slate-200">
              <p className="text-sm text-slate-600 leading-relaxed">
                {data.scoreReason}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 90) {
    return {
      bg: "bg-emerald-100",
      cardBg: "bg-emerald-50/30",
      text: "text-emerald-600",
      icon: "text-emerald-500",
      border: "border-emerald-300",
    };
  }
  if (score >= 70) {
    return {
      bg: "bg-blue-100",
      cardBg: "bg-blue-50/30",
      text: "text-blue-600",
      icon: "text-blue-500",
      border: "border-blue-300",
    };
  }
  if (score >= 50) {
    return {
      bg: "bg-amber-100",
      cardBg: "bg-amber-50/30",
      text: "text-amber-600",
      icon: "text-amber-500",
      border: "border-amber-300",
    };
  }
  return {
    bg: "bg-red-100",
    cardBg: "bg-red-50/30",
    text: "text-red-600",
    icon: "text-red-500",
    border: "border-red-300",
  };
}

function getScoreLabel(score: number) {
  if (score >= 90) return "매우 우수";
  if (score >= 70) return "양호";
  if (score >= 50) return "보통";
  return "재검토 필요";
}
