"use server";

import { db } from "@/shared/db/db";
import { monthlySnapshot, asset } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and, sum } from "drizzle-orm";

export async function deleteAsset(assetId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const assetToDelete = await db
    .select({
      id: asset.id,
      snapshotId: asset.snapshotId,
    })
    .from(asset)
    .innerJoin(monthlySnapshot, eq(asset.snapshotId, monthlySnapshot.id))
    .where(and(eq(asset.id, assetId), eq(monthlySnapshot.userId, userId)))
    .limit(1);

  if (assetToDelete.length === 0 || !assetToDelete[0]) {
    throw new Error("Asset not found");
  }

  const snapshotId = assetToDelete[0].snapshotId;

  await db.transaction(async (tx) => {
    await tx.delete(asset).where(eq(asset.id, assetId));

    const remaining = await tx
      .select({ total: sum(asset.amount) })
      .from(asset)
      .where(eq(asset.snapshotId, snapshotId));

    const newTotal = Number(remaining[0]?.total) || 0;

    const remainingAssets = await tx
      .select({ id: asset.id })
      .from(asset)
      .where(eq(asset.snapshotId, snapshotId))
      .limit(1);

    await tx
      .update(monthlySnapshot)
      .set({
        totalAmount: newTotal,
        status: remainingAssets.length > 0 ? "completed" : "empty",
      })
      .where(eq(monthlySnapshot.id, snapshotId));
  });

  return { success: true };
}
