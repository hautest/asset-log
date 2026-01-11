import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Check } from "lucide-react";

const BENEFITS = [
  "종목별 비중 설정으로 포트폴리오 구성",
  "과거 데이터 기반 백테스트 분석",
  "최대 낙폭(MDD), 샤프 비율 등 지표 제공",
  "주요 상승/하락 구간 자동 분석",
] as const;

const PORTFOLIO_DATA = [
  { month: "8월", value: 100 },
  { month: "10월", value: 108 },
  { month: "12월", value: 102 },
  { month: "2월", value: 118 },
  { month: "4월", value: 125 },
  { month: "6월", value: 137 },
] as const;

export function PortfolioSection() {
  const maxValue = Math.max(...PORTFOLIO_DATA.map((d) => d.value));
  const minValue = Math.min(...PORTFOLIO_DATA.map((d) => d.value));

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              투자 전략,
              <br />
              백테스트로 검증하세요.
            </h2>
            <p className="mb-8 text-lg text-slate-600">
              나만의 포트폴리오를 구성하고 과거 데이터로 성과를 검증해보세요.
              수익률, 변동성, 최대 낙폭까지 한눈에 분석할 수 있습니다.
            </p>
            <ul className="space-y-4">
              {BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <Badge
                    variant="secondary"
                    className="h-6 w-6 rounded-full bg-blue-100 p-0"
                  >
                    <Check className="h-4 w-4 text-blue-600" />
                  </Badge>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-100/50 to-blue-200/50 blur-2xl" />
              <Card className="relative shadow-lg shadow-slate-200/50">
                <CardHeader className="flex-row items-center justify-between pb-0">
                  <div>
                    <CardTitle className="text-xl">포트폴리오 성과</CardTitle>
                    <CardDescription className="mt-1">
                      백테스트 분석 결과
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    +36.98%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-2">
                    {PORTFOLIO_DATA.map((data, index) => {
                      const barHeight =
                        ((data.value - minValue + 20) / (maxValue - minValue + 20)) * 140;
                      const prevValue = PORTFOLIO_DATA[index - 1]?.value ?? data.value;
                      const isPositive = index > 0 && data.value > prevValue;
                      return (
                        <div
                          key={data.month}
                          className="flex flex-1 flex-col items-center gap-2"
                        >
                          <div
                            className={`w-full rounded-t transition-all ${
                              isPositive
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-slate-400 hover:bg-slate-500"
                            }`}
                            style={{
                              height: `${barHeight}px`,
                            }}
                          />
                          <span className="text-xs text-slate-500">
                            {data.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-slate-50 p-3 text-center">
                      <p className="text-xs text-slate-500">총 수익률</p>
                      <p className="text-lg font-bold text-emerald-600">
                        +36.98%
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 text-center">
                      <p className="text-xs text-slate-500">최대 낙폭</p>
                      <p className="text-lg font-bold text-rose-600">-7.06%</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 text-center">
                      <p className="text-xs text-slate-500">샤프 비율</p>
                      <p className="text-lg font-bold text-blue-600">0.99</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
