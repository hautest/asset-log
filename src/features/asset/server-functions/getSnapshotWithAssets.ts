"use server";

import { db } from "@/shared/db/db";
import { monthlySnapshot, asset, category } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and, asc } from "drizzle-orm";

export interface AssetWithCategory {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  memo: string | null;
}

export interface SnapshotWithAssets {
  id: string | null;
  yearMonth: string;
  totalAmount: number;
  memo: string | null;
  status: "completed" | "empty";
  assets: AssetWithCategory[];
}

export async function getSnapshotWithAssets(
  yearMonth: string
): Promise<SnapshotWithAssets> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

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
    return {
      id: null,
      yearMonth,
      totalAmount: 0,
      memo: null,
      status: "empty",
      assets: [],
    };
  }

  const snapshotData = snapshot[0];

  const assets = await db
    .select({
      id: asset.id,
      categoryId: asset.categoryId,
      categoryName: category.name,
      categoryColor: category.color,
      amount: asset.amount,
      memo: asset.memo,
    })
    .from(asset)
    .innerJoin(category, eq(asset.categoryId, category.id))
    .where(eq(asset.snapshotId, snapshotData.id))
    .orderBy(asc(category.sortOrder));

  return {
    id: snapshotData.id,
    yearMonth: snapshotData.yearMonth,
    totalAmount: snapshotData.totalAmount,
    memo: snapshotData.memo,
    status: snapshotData.status,
    assets,
  };
}
