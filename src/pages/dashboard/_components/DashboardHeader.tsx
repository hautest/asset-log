import { Link } from "waku";
import { Settings } from "lucide-react";
import { AppHeader } from "@/shared/components/AppHeader";
import { LogoutButton } from "./LogoutButton";

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <AppHeader
      rightNode={
        <>
          <Link
            to="/my"
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 transition-colors hover:bg-slate-200"
          >
            <Settings className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {userName}
            </span>
          </Link>
          <LogoutButton />
        </>
      }
    />
  );
}
