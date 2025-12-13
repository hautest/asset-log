import { BarChart3 } from "lucide-react";

export function LandingFooter() {
  return (
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
  );
}
