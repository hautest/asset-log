import { Link } from "waku";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/shared/ui/card";
import {
  PiggyBank,
  BarChart3,
  Building2,
  BitcoinIcon,
  ChevronRight,
} from "lucide-react";

const ASSET_CATEGORIES = [
  { icon: PiggyBank, name: "현금" },
  { icon: BarChart3, name: "주식" },
  { icon: Building2, name: "부동산" },
  { icon: BitcoinIcon, name: "코인" },
] as const;

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
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
  );
}
