import { getSession } from "@/shared/auth/getSession";
import { Seo } from "@/shared/components/Seo";
import { WebApplicationJsonLd } from "@/shared/components/JsonLd";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Link } from "waku";
import {
  BarChart3,
  PiggyBank,
  TrendingUp,
  Wallet,
  Building2,
  ChevronRight,
  Check,
  BitcoinIcon,
} from "lucide-react";

const SITE_URL = "https://assetlog.kr";
const PAGE_DESCRIPTION =
  "마이데이터가 못 잡는 숨은 자산까지 포함한 전체 자산을 차트로 시각화. 전세 보증금, 코인, 해외 자산 등 모든 자산을 한눈에 관리하세요.";

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

const ASSET_CATEGORIES = [
  { icon: PiggyBank, name: "현금" },
  { icon: BarChart3, name: "주식" },
  { icon: Building2, name: "부동산" },
  { icon: BitcoinIcon, name: "코인" },
] as const;

const STEPS = [
  {
    step: "01",
    title: "간편 가입",
    description: "구글 계정으로 3초 만에 시작",
  },
  {
    step: "02",
    title: "자산 입력",
    description: "카테고리별로 자산을 간편하게 기록",
  },
  {
    step: "03",
    title: "차트 확인",
    description: "한눈에 보는 내 자산의 성장 그래프",
  },
] as const;

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

export default async function HomePage() {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Seo />
      <WebApplicationJsonLd
        name="자산로그"
        description={PAGE_DESCRIPTION}
        url={SITE_URL}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              자산로그
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button>대시보드</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button>시작하기</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-6 gap-2 border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              마이데이터가 놓친 자산까지
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              흩어진 내 자산,
              <br />
              <span className="text-emerald-600">한눈에 모아보세요</span>
            </h1>
            <p className="mb-10 text-lg text-slate-600 md:text-xl">
              전세 보증금, 코인, 실물 자산, 해외 자산까지.
              <br className="hidden sm:block" />
              진짜 내 자산의 흐름을 차트로 확인하세요.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" className="h-12 px-8 text-base">
                    대시보드로 이동
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="h-12 px-8 text-base">
                    무료로 시작하기
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Asset Categories Preview */}
          <div className="mx-auto mt-16 max-w-2xl">
            <Card className="shadow-lg shadow-slate-200/50">
              <CardHeader className="pb-0">
                <CardDescription className="text-center">
                  다양한 자산을 카테고리별로 관리
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {ASSET_CATEGORIES.map((category) => (
                    <div
                      key={category.name}
                      className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                    >
                      <category.icon className="h-6 w-6 text-emerald-600" />
                      <span className="text-sm font-medium text-slate-700">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Features Section */}
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

      <Separator />

      {/* How it works */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              3단계로 시작하세요
            </h2>
            <p className="text-lg text-slate-600">
              복잡한 설정 없이 바로 시작할 수 있어요
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((item, index) => (
              <div key={item.step} className="relative">
                {index < STEPS.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-emerald-200 to-transparent md:block" />
                )}
                <Card className="relative border-none bg-transparent shadow-none">
                  <CardContent className="flex flex-col items-center p-0 text-center">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-3xl font-bold text-white shadow-lg shadow-emerald-200">
                      {item.step}
                    </div>
                    <CardTitle className="mb-2 text-xl">{item.title}</CardTitle>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Benefits */}
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

      <Separator />

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-600 to-emerald-700 text-center shadow-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
            <CardContent className="relative px-8 py-16 md:px-16 md:py-20">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                지금 바로 시작하세요
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-emerald-100">
                구글 계정으로 3초 만에 가입하고, 흩어진 내 자산을 한눈에
                모아보세요.
              </p>
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-8 text-base"
                  >
                    대시보드로 이동
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-8 text-base"
                  >
                    무료로 시작하기
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">자산로그</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2025 자산로그. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
