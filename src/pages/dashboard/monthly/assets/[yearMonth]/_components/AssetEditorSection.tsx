import { getCategories } from "@/features/category/queries";
import { getSnapshotByYearMonth } from "@/features/asset/queries";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { AssetEditor } from "./AssetEditor";

interface AssetEditorSectionProps {
  yearMonth: string;
}

async function AssetEditorSection({ yearMonth }: AssetEditorSectionProps) {
  const [categories, snapshot] = await Promise.all([
    getCategories(),
    getSnapshotByYearMonth(yearMonth),
  ]);

  const existingAssets = snapshot?.assets ?? [];

  return (
    <AssetEditor
      yearMonth={yearMonth}
      categories={categories}
      existingAssets={existingAssets}
      snapshotMemo={snapshot?.memo ?? null}
    />
  );
}

function AssetEditorSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg">
          <div className="flex border-b bg-muted/50 p-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-4 w-24" />
            <Skeleton className="ml-8 h-4 w-12" />
            <div className="w-12" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center border-b p-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="ml-auto h-9 w-40" />
              <Skeleton className="ml-4 h-9 w-48" />
              <Skeleton className="ml-4 h-8 w-8" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-7 w-32" />
        </div>

        <div className="mt-6">
          <Skeleton className="mb-2 h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-10 w-20" />
      </CardFooter>
    </Card>
  );
}

AssetEditorSection.Skeleton = AssetEditorSkeleton;

export { AssetEditorSection };
