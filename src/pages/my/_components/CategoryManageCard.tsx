import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { CategoryManager } from "./CategoryManager";

interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  sortOrder: number;
}

interface CategoryManageCardProps {
  categories: Category[];
}

export function CategoryManageCard({ categories }: CategoryManageCardProps) {
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
