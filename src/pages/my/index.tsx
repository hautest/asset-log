import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { getCategoriesByUserId } from "@/features/category/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { User } from "lucide-react";
import { Link } from "waku";
import { AppHeader } from "@/shared/components/AppHeader";
import { CategoryManager } from "./_components/CategoryManager";
import { LogoutButton } from "../dashboard/_components/LogoutButton";

export default async function MyPage() {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  const categories = await getCategoriesByUserId(session.user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AppHeader
        rightNode={
          <>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              대시보드
            </Link>
            <LogoutButton />
          </>
        }
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">마이페이지</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                회원 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-4">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-slate-900">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-slate-500">{session.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">카테고리 관리</CardTitle>
              <p className="text-sm text-slate-500">
                드래그하여 차트에 표시되는 순서를 변경하세요
              </p>
            </CardHeader>
            <CardContent>
              <CategoryManager initialCategories={categories} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
