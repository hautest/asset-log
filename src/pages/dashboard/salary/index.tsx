import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Construction } from "lucide-react";

export default async function SalaryPage() {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">연봉 상승</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            준비 중
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            연봉 상승 추이를 확인할 수 있는 페이지입니다. 곧 업데이트될 예정입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
