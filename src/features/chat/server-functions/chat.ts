"use server";

import { GoogleGenAI } from "@google/genai";
import { getUserFullContext, type UserFullContext } from "../queries";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function formatFullContext(context: UserFullContext): string {
  let contextStr = "## 사용자 데이터\n\n";

  if (context.assets.snapshots.length > 0) {
    const latest = context.assets.latestSnapshot;
    const oldest = context.assets.snapshots[context.assets.snapshots.length - 1];

    contextStr += `### 1. 자산 현황

#### 기본 정보
- 총 입력된 월: ${context.assets.totalMonths}개월
- 데이터 범위: ${oldest?.yearMonth} ~ ${latest?.yearMonth}
- 사용 중인 카테고리: ${context.assets.categories.map((c) => c.name).join(", ")}

#### 최신 자산 현황 (${latest?.yearMonth})
- 총 자산: ${latest?.totalAmount.toLocaleString()}원
${latest?.categories.map((c) => `- ${c.name}: ${c.amount.toLocaleString()}원`).join("\n")}

#### 월별 자산 히스토리 (최근 12개월)
`;

    const recentSnapshots = context.assets.snapshots.slice(0, 12);
    for (const snapshot of recentSnapshots) {
      contextStr += `
**${snapshot.yearMonth}**
- 총 자산: ${snapshot.totalAmount.toLocaleString()}원
${snapshot.categories.map((c) => `  - ${c.name}: ${c.amount.toLocaleString()}원`).join("\n")}
${snapshot.memo ? `- 메모: ${snapshot.memo}` : ""}
`;
    }

    if (context.assets.snapshots.length >= 2) {
      const latestAmount = context.assets.snapshots[0]?.totalAmount || 0;
      const previousAmount = context.assets.snapshots[1]?.totalAmount || 0;
      const monthlyChange = latestAmount - previousAmount;
      const monthlyChangePercent =
        previousAmount > 0 ? ((monthlyChange / previousAmount) * 100).toFixed(2) : 0;

      contextStr += `
#### 최근 자산 변화
- 전월 대비: ${monthlyChange >= 0 ? "+" : ""}${monthlyChange.toLocaleString()}원 (${monthlyChangePercent}%)
`;
    }
  } else {
    contextStr += "### 1. 자산 현황\n아직 자산 데이터가 입력되지 않았습니다.\n\n";
  }

  if (context.portfolios.length > 0) {
    contextStr += `\n### 2. 주식 포트폴리오

총 ${context.portfolios.length}개의 포트폴리오가 있습니다.

`;
    for (const portfolio of context.portfolios) {
      contextStr += `#### ${portfolio.name}
${portfolio.description ? `설명: ${portfolio.description}\n` : ""}
구성 종목:
${portfolio.items.map((item) => `- ${item.ticker} (${item.name}): ${item.weight}%`).join("\n")}

`;
    }
  } else {
    contextStr += "\n### 2. 주식 포트폴리오\n아직 포트폴리오가 등록되지 않았습니다.\n\n";
  }

  if (context.salaries.length > 0) {
    const latestSalary = context.salaries[context.salaries.length - 1];
    const firstSalary = context.salaries[0];

    contextStr += `\n### 3. 연봉 정보

#### 연봉 히스토리
`;
    for (const sal of context.salaries) {
      if (sal.amount > 0) {
        contextStr += `- ${sal.year}년: ${sal.amount.toLocaleString()}원${sal.memo ? ` (${sal.memo})` : ""}\n`;
      }
    }

    if (context.salaries.length >= 2 && latestSalary && firstSalary && firstSalary.amount > 0) {
      const totalGrowth = latestSalary.amount - firstSalary.amount;
      const totalGrowthPercent = ((totalGrowth / firstSalary.amount) * 100).toFixed(2);
      contextStr += `
#### 연봉 성장
- 최초 기록 (${firstSalary.year}년): ${firstSalary.amount.toLocaleString()}원
- 최신 기록 (${latestSalary.year}년): ${latestSalary.amount.toLocaleString()}원
- 총 성장: ${totalGrowth >= 0 ? "+" : ""}${totalGrowth.toLocaleString()}원 (${totalGrowthPercent}%)
`;
    }
  } else {
    contextStr += "\n### 3. 연봉 정보\n아직 연봉 데이터가 입력되지 않았습니다.\n";
  }

  return contextStr;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const context = await getUserFullContext();

  if (!context) {
    return "로그인이 필요합니다. 로그인 후 다시 시도해주세요.";
  }

  const fullContext = formatFullContext(context);

  const systemPrompt = `당신은 '자산로그' 서비스의 AI 어시스턴트입니다. 사용자의 자산, 포트폴리오, 연봉 데이터를 기반으로 질문에 답변합니다.

${fullContext}

---

## 답변 규칙
1. 사용자의 실제 데이터를 기반으로 정확하게 답변하세요
2. 금액은 항상 원화로 표시하고 천단위 쉼표를 사용하세요
3. 비율이나 변화량을 계산할 때는 정확한 수치를 사용하세요
4. 친근하고 도움이 되는 톤으로 답변하세요
5. 데이터가 없는 질문에는 "해당 데이터가 없습니다"라고 솔직하게 답변하세요
6. 필요시 추가 조언이나 인사이트를 제공하세요
7. 답변은 간결하게 하되, 필요한 정보는 빠짐없이 포함하세요
8. 자산, 포트폴리오, 연봉 데이터를 종합적으로 분석하여 답변할 수 있습니다
9. 이모지는 적절히 사용하되 과하지 않게 해주세요`;

  const conversationHistory = history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      ...conversationHistory,
      { role: "user", parts: [{ text: message }] },
    ],
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text ?? "죄송합니다. 응답을 생성하지 못했습니다.";
}
