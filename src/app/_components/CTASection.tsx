import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { ChevronRight } from "lucide-react";

interface CTASectionProps {
  isLoggedIn: boolean;
}

export function CTASection({ isLoggedIn }: CTASectionProps) {
  return (
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
            <Link href="/dashboard/monthly">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base"
              >
                {isLoggedIn ? "대시보드로 이동" : "무료로 시작하기"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
