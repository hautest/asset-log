"use client";

import { Link, useRouter } from "waku";
import { BarChart3, Calendar, Banknote } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";

const MENU_ITEMS = [
  {
    title: "월별 자산 추이",
    url: "/dashboard/monthly" as const,
    icon: Calendar,
  },
  {
    title: "연봉 상승",
    url: "/dashboard/salary" as const,
    icon: Banknote,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const currentPath = router.path;

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">자산로그</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>대시보드</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
