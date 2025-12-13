import { db } from "@/shared/db/db";
import { monthlySnapshot, asset, category } from "@/shared/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function getSnapshotByYearMonth(userId: string, yearMonth: string) {
  const snapshot = await db
    .select()
    .from(monthlySnapshot)
    .where(
      and(
        eq(monthlySnapshot.userId, userId),
        eq(monthlySnapshot.yearMonth, yearMonth)
      )
    )
    .limit(1);

  if (snapshot.length === 0 || !snapshot[0]) {
    return null;
  }

  const snapshotData = snapshot[0];

  const assets = await db
    .select({
      id: asset.id,
      categoryId: asset.categoryId,
      categoryName: category.name,
      categoryColor: category.color,
      categorySortOrder: category.sortOrder,
      amount: asset.amount,
      memo: asset.memo,
    })
    .from(asset)
    .innerJoin(category, eq(asset.categoryId, category.id))
    .where(eq(asset.snapshotId, snapshotData.id))
    .orderBy(asc(category.sortOrder));

  return {
    ...snapshotData,
    assets,
  };
}

export async function getYearSnapshots(userId: string, year: number) {
  const snapshots = await db
    .select()
    .from(monthlySnapshot)
    .where(
      and(
        eq(monthlySnapshot.userId, userId),
        // yearMonth format is 'YYYY-MM'
      )
    );

  return snapshots.filter((s) => s.yearMonth.startsWith(`${year}-`));
}
