import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/shared/auth/getSession";
import { UserInfoCard } from "./_components/UserInfoCard";
import { CategoryManageCardSection } from "./_components/CategoryManageCardSection";

export const metadata: Metadata = {
  title: "마이페이지",
  robots: { index: false, follow: false },
};

export default async function MyPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>
        <p className="text-sm text-slate-500">계정 정보 및 카테고리 관리</p>
      </div>

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
    </div>
  );
}
