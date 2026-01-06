"use server";

import { getSnapshotByYearMonth } from "../queries";

export async function getSnapshotAssets(yearMonth: string) {
  const snapshot = await getSnapshotByYearMonth(yearMonth);

  if (!snapshot) {
    return [];
  }

  return snapshot.assets.map((asset) => ({
    categoryId: asset.categoryId,
    categoryName: asset.categoryName,
    categoryColor: asset.categoryColor,
    amount: asset.amount,
    memo: asset.memo ?? "",
  }));
}
