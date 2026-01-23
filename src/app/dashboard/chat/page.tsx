import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatContainerWrapper } from "./_components/ChatContainerWrapper";
import { ChatContainerSkeleton } from "./_components/ChatContainerSkeleton";

export const metadata: Metadata = {
  title: "AI 자산 어시스턴트",
  description: "AI가 내 자산, 포트폴리오, 연봉 데이터를 기반으로 질문에 답변해드립니다. 자산 분석, 투자 조언을 받아보세요.",
  robots: { index: true, follow: true },
};

export default function ChatPage() {
  return (
    <div className="p-4 md:p-6 h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          AI 자산 어시스턴트
        </h1>
        <p className="text-sm text-slate-500">
          내 자산 데이터를 기반으로 질문에 답변해드립니다
        </p>
      </div>
      <Suspense fallback={<ChatContainerSkeleton />}>
        <ChatContainerWrapper />
      </Suspense>
    </div>
  );
}
