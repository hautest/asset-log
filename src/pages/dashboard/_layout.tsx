import type { ReactNode } from "react";
import { DashboardShell } from "./_components/DashboardShell";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
