import { Suspense } from "react";
import { getSession } from "@/shared/auth/getSession";
import { redirect } from "@/shared/router/router";
import { Link } from "waku";
import { AppHeader } from "@/shared/components/AppHeader";
import { LogoutButton } from "./_components/LogoutButton";
import { UserInfoCard } from "./_components/UserInfoCard";
import { CategoryManageCardSection } from "./_components/CategoryManageCardSection";

export default async function MyPage() {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

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
          <UserInfoCard
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
          />
          <Suspense fallback={<CategoryManageCardSection.Skeleton />}>
            <CategoryManageCardSection />
          </Suspense>
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
