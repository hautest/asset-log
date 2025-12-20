"use client";

import type { ReactNode } from "react";
import { Link } from "waku";
import { BarChart3 } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="sticky top-0 z-40 flex h-[3.0625rem] items-center gap-3 border-b bg-white px-4">
          <SidebarTrigger />

          <Link to="/dashboard">
            <span className="text-lg font-bold text-slate-900 whitespace-nowrap">
              자산로그
            </span>
          </Link>
        </header>

        <div className="flex-1 bg-gradient-to-b from-slate-50 to-white">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
