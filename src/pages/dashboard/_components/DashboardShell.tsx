"use client";

import { useState, type ReactNode } from "react";
import { Link, useRouter } from "waku";
import {
  Menu,
  BarChart3,
  Calendar,
  Banknote,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { authClient } from "@/shared/auth/authClient";

interface DashboardShellProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: "월별 자산 추이",
    url: "/dashboard/monthly" as const,
    icon: Calendar,
  },
  {
    title: "연봉 추이",
    url: "/dashboard/salary" as const,
    icon: Banknote,
  },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-white px-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>

        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 whitespace-nowrap">
            자산로그
          </span>
        </Link>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span>자산로그</span>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col h-[calc(100%-73px)]">
            <div className="flex-1 p-4">
              <p className="mb-2 text-xs font-medium text-slate-500">
                대시보드
              </p>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.url}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t p-4 space-y-1">
              <Link
                to="/my"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
              >
                <User className="h-4 w-4" />
                <span>마이페이지</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-1 bg-gradient-to-b from-slate-50 to-white">
        {children}
      </main>
    </div>
  );
}
