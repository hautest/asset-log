import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface LandingHeaderProps {
  isLoggedIn: boolean;
}

export function LandingHeader({ isLoggedIn }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            자산로그
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/dashboard/monthly">
            <Button>{isLoggedIn ? "대시보드" : "시작하기"}</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
