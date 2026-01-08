import { db } from "@/shared/db/db";
import { monthlySnapshot, asset, category } from "@/shared/db/schema";
import { eq, and, asc, inArray, desc, like } from "drizzle-orm";
import { getSession } from "@/shared/auth/getSession";
import { cacheLife, cacheTag } from "next/cache";

async function getSnapshotByYearMonthCached(userId: string, yearMonth: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`assets-${userId}`);

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
    .innerJoin(
      category,
      and(eq(asset.categoryId, category.id), eq(category.userId, userId))
    )
    .where(eq(asset.snapshotId, snapshotData.id))
    .orderBy(asc(category.sortOrder));

  return {
    ...snapshotData,
    assets,
  };
}

export async function getSnapshotByYearMonth(yearMonth: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return getSnapshotByYearMonthCached(session.user.id, yearMonth);
}

async function getYearSnapshotsCached(userId: string, year: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(`assets-${userId}`);

  return db
    .select()
    .from(monthlySnapshot)
    .where(
      and(
        eq(monthlySnapshot.userId, userId),
        like(monthlySnapshot.yearMonth, `${year}-%`)
      )
    );
}

export async function getYearSnapshots(year: number) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return getYearSnapshotsCached(session.user.id, year);
}

interface MonthData {
  yearMonth: string;
  totalAmount: number;
  status: "completed" | "empty";
  categories: Record<string, number>;
}

async function getYearSnapshotsWithAssetsCached(
  userId: string,
  year: number
): Promise<MonthData[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`assets-${userId}`);

  const snapshots = await db
    .select()
    .from(monthlySnapshot)
    .where(eq(monthlySnapshot.userId, userId));

  const yearSnapshots = snapshots.filter((s) =>
    s.yearMonth.startsWith(`${year}-`)
  );

  const snapshotIds = yearSnapshots.map((s) => s.id);

  let assets: { snapshotId: string; categoryId: string; amount: number }[] = [];
  if (snapshotIds.length > 0) {
    assets = await db
      .select({
        snapshotId: asset.snapshotId,
        categoryId: asset.categoryId,
        amount: asset.amount,
      })
      .from(asset)
      .where(inArray(asset.snapshotId, snapshotIds));
  }

  const snapshotMap = new Map(yearSnapshots.map((s) => [s.yearMonth, s]));

  const assetsBySnapshot = new Map<string, Record<string, number>>();
  for (const a of assets) {
    const existing = assetsBySnapshot.get(a.snapshotId) || {};
    existing[a.categoryId] = a.amount;
    assetsBySnapshot.set(a.snapshotId, existing);
  }

  return Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const yearMonth = `${year}-${month}`;
    const snapshot = snapshotMap.get(yearMonth);

    if (snapshot) {
      return {
        yearMonth,
        totalAmount: snapshot.totalAmount,
        status: snapshot.status,
        categories: assetsBySnapshot.get(snapshot.id) || {},
      };
    }

    return {
      yearMonth,
      totalAmount: 0,
      status: "empty" as const,
      categories: {},
    };
  });
}

export async function getYearSnapshotsWithAssets(
  year: number
): Promise<MonthData[]> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return getYearSnapshotsWithAssetsCached(session.user.id, year);
}

async function getAllCompletedSnapshotsCached(
  userId: string,
  excludeYearMonth?: string
) {
  "use cache";
  cacheLife("hours");
  cacheTag(`assets-${userId}`);

  const snapshots = await db
    .select({
      yearMonth: monthlySnapshot.yearMonth,
      totalAmount: monthlySnapshot.totalAmount,
    })
    .from(monthlySnapshot)
    .where(
      and(
        eq(monthlySnapshot.userId, userId),
        eq(monthlySnapshot.status, "completed")
      )
    )
    .orderBy(desc(monthlySnapshot.yearMonth));

  if (excludeYearMonth) {
    return snapshots.filter((s) => s.yearMonth !== excludeYearMonth);
  }

  return snapshots;
}

export async function getAllCompletedSnapshots(excludeYearMonth?: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return getAllCompletedSnapshotsCached(session.user.id, excludeYearMonth);
}
