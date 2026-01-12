import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/shared/auth/getSession";
import { GoalCalculatorContainer } from "./_components/GoalCalculatorContainer";

export const metadata: Metadata = {
  title: "목표 자산 계산기",
  robots: { index: false, follow: false },
};

export default async function GoalPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">목표 자산 계산기</h1>
      <GoalCalculatorContainer />
    </div>
  );
}
