import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Wallet, BarChart3, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "숨은 자산까지 한눈에",
    description:
      "전세 보증금, 빌려준 돈, 해외 자산 등 마이데이터가 놓친 모든 자산을 직접 기록하세요.",
  },
  {
    icon: BarChart3,
    title: "자산 흐름 시각화",
    description:
      "월별 자산 변화를 차트로 확인하고, 클릭 한 번으로 상세 내역을 조회하세요.",
  },
  {
    icon: TrendingUp,
    title: "성장 추이 파악",
    description:
      "작년 대비, 지난달 대비 내 자산이 얼마나 늘었는지 한눈에 확인하세요.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="bg-slate-50/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            왜 자산로그인가요?
          </h2>
          <p className="text-lg text-slate-600">
            기존 자산 관리 앱이 해결하지 못한 문제를 해결합니다
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group gap-0 py-0 transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50"
            >
              <CardHeader className="p-8 pb-0">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-3">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
