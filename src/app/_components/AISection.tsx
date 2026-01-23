import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Bot, ChartPie, MessageCircle, Sparkles } from "lucide-react";

const AI_FEATURES = [
  {
    icon: ChartPie,
    title: "포트폴리오 AI 분석",
    description:
      "내 포트폴리오의 자산 배분, 리스크, 성장 가능성을 AI가 분석하고 개선점을 제안해드려요.",
  },
  {
    icon: MessageCircle,
    title: "AI 자산 상담",
    description:
      "자산 관리에 대한 궁금증을 AI에게 물어보세요. 맞춤형 조언을 받을 수 있어요.",
  },
] as const;

export function AISection() {
  return (
    <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
            <Sparkles className="h-4 w-4" />
            <span>NEW</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            AI가 자산 관리를 도와드려요
          </h2>
          <p className="text-lg text-slate-600">
            복잡한 자산 분석과 재테크 고민, AI와 함께 해결하세요
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {AI_FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group relative gap-0 overflow-hidden border-emerald-100 py-0 transition-all hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-100/50 transition-transform group-hover:scale-150" />
              <CardHeader className="relative p-8 pb-0">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200">
                  <feature.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative p-8 pt-3">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-lg shadow-slate-200/50">
            <Bot className="h-5 w-5 text-emerald-600" />
            <span className="text-sm text-slate-600">
              Google Gemini 기반의 AI가 실시간으로 분석해드려요
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
