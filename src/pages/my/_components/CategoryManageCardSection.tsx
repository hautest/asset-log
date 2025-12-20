import { getCategories } from "@/features/category/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { CategoryManager } from "./CategoryManager";

async function CategoryManageCardSection() {
  const categories = await getCategories();

  return (
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
  );
}

function CategoryManageCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-1 h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

CategoryManageCardSection.Skeleton = CategoryManageCardSkeleton;

export { CategoryManageCardSection };
