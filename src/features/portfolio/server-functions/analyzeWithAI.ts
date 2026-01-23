"use server";

import { GoogleGenAI } from "@google/genai";
import type { PortfolioAnalysis } from "../analysis";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export interface AIAnalysisInput {
  analysis: PortfolioAnalysis;
  items: Array<{ ticker: string; name: string; weight: number }>;
  startDate: string;
  endDate: string;
}

export interface AIAnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  characteristics: string[];
  score: number;
  scoreReason: string;
}

export async function analyzeWithAI(
  input: AIAnalysisInput
): Promise<AIAnalysisResult> {
  const { analysis, items, startDate, endDate } = input;

  const prompt = `당신은 전문 포트폴리오 분석가입니다. 아래 포트폴리오 백테스트 결과를 분석해주세요.

## 포트폴리오 구성
${items.map((item) => `- ${item.ticker} (${item.name}): ${item.weight}%`).join("\n")}

## 분석 기간
${startDate} ~ ${endDate}

## 백테스트 결과
- 총 수익률: ${analysis.totalReturnPercent.toFixed(2)}%
- 최대 상승 (Max Gain): ${analysis.maxGainPercent.toFixed(2)}%${analysis.maxGainPeriod ? ` (${analysis.maxGainPeriod.start} ~ ${analysis.maxGainPeriod.end})` : ""}
- 최대 낙폭 (MDD): ${analysis.maxDrawdownPercent.toFixed(2)}%${analysis.maxDrawdownPeriod ? ` (${analysis.maxDrawdownPeriod.start} ~ ${analysis.maxDrawdownPeriod.end})` : ""}
- 변동성 (연율화): ${analysis.volatility.toFixed(2)}%
- Sharpe Ratio: ${analysis.sharpeRatio.toFixed(2)}

## 상승 구간 (상위 3개)
${analysis.riseSegments
  .slice(0, 3)
  .map((s) => `- ${s.startDate} ~ ${s.endDate}: +${s.changePercent.toFixed(2)}% (${s.durationDays}일)`)
  .join("\n") || "없음"}

## 하락 구간 (상위 3개)
${analysis.fallSegments
  .slice(0, 3)
  .map((s) => `- ${s.startDate} ~ ${s.endDate}: ${s.changePercent.toFixed(2)}% (${s.durationDays}일)`)
  .join("\n") || "없음"}

---

다음 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요:

{
  "summary": "포트폴리오에 대한 전체적인 평가와 조언 (2-3문장)",
  "strengths": ["장점1", "장점2", "장점3"],
  "weaknesses": ["단점1", "단점2", "단점3"],
  "characteristics": ["특징1", "특징2", "특징3"],
  "score": 75,
  "scoreReason": "점수를 준 이유 (1문장)"
}

점수 기준:
- 90-100: 매우 우수 (높은 수익률, 낮은 MDD, 높은 Sharpe)
- 70-89: 양호 (적절한 수익률, 관리 가능한 MDD)
- 50-69: 보통 (개선 필요)
- 50 미만: 재검토 필요`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI 응답을 파싱할 수 없습니다");
  }

  const result = JSON.parse(jsonMatch[0]) as AIAnalysisResult;

  return result;
}
