"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BarChart3, Calendar, Banknote, User, LogOut, PieChart } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar";
import { authClient } from "@/shared/auth/authClient";

const MENU_ITEMS = [
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
  {
    title: "포트폴리오 분석",
    url: "/dashboard/portfolio" as const,
    icon: PieChart,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const currentPath = pathname.split("?")[0];

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const handleLogout = async () => {
    setOpenMobile(false);
    await authClient.signOut();
    router.replace("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="whitespace-nowrap overflow-hidden text-lg font-bold text-slate-900 group-data-[collapsible=icon]:hidden">
            자산로그
          </span>
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
                    <Link href={item.url} onClick={handleLinkClick}>
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
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={currentPath === "/dashboard/my"}>
              <Link href="/dashboard/my" onClick={handleLinkClick}>
                <User />
                <span>마이페이지</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>로그아웃</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
