import type { Metadata } from "next";
import { GoalCalculatorContainer } from "./_components/GoalCalculatorContainer";

export const metadata: Metadata = {
  title: "목표 자산 계산기",
  description:
    "목표 자산 달성까지 필요한 기간을 계산해보세요. 초기 자본, 월 투자금, 예상 수익률을 입력하면 목표 달성 시점을 시뮬레이션합니다.",
  robots: { index: true, follow: true },
};

export default function GoalPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">목표 자산 계산기</h1>
      <GoalCalculatorContainer />
    </div>
  );
}
