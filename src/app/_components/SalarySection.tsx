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
  "연도별 연봉 기록 및 관리",
  "직전년도 대비 인상률 자동 계산",
  "5년 단위 연봉 추이 차트",
  "메모 기능으로 이직/승진 기록",
] as const;

const SALARY_DATA = [
  { year: 2020, amount: 35, growth: null },
  { year: 2021, amount: 38, growth: 8.6 },
  { year: 2022, amount: 42, growth: 10.5 },
  { year: 2023, amount: 48, growth: 14.3 },
  { year: 2024, amount: 54, growth: 12.5 },
] as const;

export function SalarySection() {
  const maxAmount = Math.max(...SALARY_DATA.map((d) => d.amount));

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-100/50 to-emerald-200/50 blur-2xl" />
              <Card className="relative shadow-lg shadow-slate-200/50">
                <CardHeader className="flex-row items-center justify-between pb-0">
                  <div>
                    <CardTitle className="text-xl">연봉 추이</CardTitle>
                    <CardDescription className="mt-1">
                      2020-2024년 연봉 변화
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700"
                  >
                    +54.3%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-3">
                    {SALARY_DATA.map((data) => {
                      const barHeight = (data.amount / maxAmount) * 160;
                      return (
                        <div
                          key={data.year}
                          className="flex flex-1 flex-col items-center gap-2"
                        >
                          <div
                            className="w-full rounded-t bg-emerald-500 transition-all hover:bg-emerald-600"
                            style={{
                              height: `${barHeight}px`,
                            }}
                          />
                          <span className="text-xs text-slate-500">
                            {data.year}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 p-4">
                    <div>
                      <p className="text-sm text-slate-500">2024년 연봉</p>
                      <p className="text-xl font-bold text-slate-900">
                        7,500만원
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">전년 대비</p>
                      <p className="text-xl font-bold text-emerald-600">
                        +7.5%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              연봉도 자산이다.
              <br />
              성장을 기록하세요.
            </h2>
            <p className="mb-8 text-lg text-slate-600">
              매년 연봉이 얼마나 올랐는지 기억하시나요? 자산로그에서 연봉 추이를
              기록하고 나의 커리어 성장을 한눈에 확인하세요.
            </p>
            <ul className="space-y-4">
              {BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <Badge
                    variant="secondary"
                    className="h-6 w-6 rounded-full bg-emerald-100 p-0"
                  >
                    <Check className="h-4 w-4 text-emerald-600" />
                  </Badge>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
