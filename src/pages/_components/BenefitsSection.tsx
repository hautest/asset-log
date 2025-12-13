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
  "마이데이터 연동 없이 모든 자산 관리",
  "직관적인 월별 자산 차트",
  "카테고리별 자산 분류",
  "언제든 수정 가능한 유연한 입력",
] as const;

const CHART_DATA = [
  { total: 40, stocks: 15, cash: 10, crypto: 8, realestate: 7 },
  { total: 45, stocks: 17, cash: 11, crypto: 9, realestate: 8 },
  { total: 42, stocks: 16, cash: 10, crypto: 8, realestate: 8 },
  { total: 50, stocks: 19, cash: 12, crypto: 10, realestate: 9 },
  { total: 55, stocks: 21, cash: 13, crypto: 11, realestate: 10 },
  { total: 52, stocks: 20, cash: 12, crypto: 10, realestate: 10 },
  { total: 60, stocks: 23, cash: 14, crypto: 12, realestate: 11 },
  { total: 65, stocks: 25, cash: 15, crypto: 13, realestate: 12 },
  { total: 70, stocks: 27, cash: 16, crypto: 14, realestate: 13 },
  { total: 68, stocks: 26, cash: 16, crypto: 13, realestate: 13 },
  { total: 75, stocks: 29, cash: 17, crypto: 15, realestate: 14 },
  { total: 80, stocks: 31, cash: 18, crypto: 16, realestate: 15 },
] as const;

export function BenefitsSection() {
  return (
    <section className="bg-slate-50/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              엑셀은 이제 그만.
              <br />
              자산 관리를 쉽게.
            </h2>
            <p className="mb-8 text-lg text-slate-600">
              매번 엑셀을 열어 자산을 계산하셨나요? 이제 자산로그에서 월 1회
              입력만으로 자산 흐름을 한눈에 파악하세요.
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
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-100/50 to-emerald-200/50 blur-2xl" />
            <Card className="relative shadow-lg shadow-slate-200/50">
              <CardHeader className="flex-row items-center justify-between pb-0">
                <div>
                  <CardTitle className="text-xl">월별 자산 추이</CardTitle>
                  <CardDescription className="mt-1">
                    2024년 자산 변화를 확인하세요
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700"
                >
                  +12.5%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 items-end justify-between gap-2">
                  {CHART_DATA.map((data, i) => (
                    <div
                      key={i}
                      className="flex flex-1 flex-col-reverse overflow-hidden rounded-t"
                      style={{ height: `${data.total}%` }}
                    >
                      <div
                        className="w-full bg-[hsl(220,70%,50%)]"
                        style={{
                          height: `${(data.stocks / data.total) * 100}%`,
                        }}
                      />
                      <div
                        className="w-full bg-[hsl(142,71%,45%)]"
                        style={{
                          height: `${(data.cash / data.total) * 100}%`,
                        }}
                      />
                      <div
                        className="w-full bg-[hsl(280,87%,65%)]"
                        style={{
                          height: `${(data.crypto / data.total) * 100}%`,
                        }}
                      />
                      <div
                        className="w-full bg-[hsl(24,95%,53%)]"
                        style={{
                          height: `${(data.realestate / data.total) * 100}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-xs text-slate-500">
                  <span>01월</span>
                  <span>12월</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
