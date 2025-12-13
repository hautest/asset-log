"use server";

import { db } from "@/shared/db/db";
import { monthlySnapshot, asset } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

interface AssetInput {
  categoryId: string;
  amount: number;
  memo?: string;
}

interface SaveAssetsInput {
  yearMonth: string;
  assets: AssetInput[];
  memo?: string;
}

export async function saveAssets(input: SaveAssetsInput) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const { yearMonth, assets: assetInputs, memo } = input;

  const totalAmount = assetInputs.reduce((sum, a) => sum + a.amount, 0);

  const existingSnapshot = await db
    .select()
    .from(monthlySnapshot)
    .where(
      and(
        eq(monthlySnapshot.userId, userId),
        eq(monthlySnapshot.yearMonth, yearMonth)
      )
    )
    .limit(1);

  const snapshotId =
    existingSnapshot.length > 0 && existingSnapshot[0]
      ? existingSnapshot[0].id
      : nanoid();

  await db.transaction(async (tx) => {
    if (existingSnapshot.length === 0 || !existingSnapshot[0]) {
      await tx.insert(monthlySnapshot).values({
        id: snapshotId,
        userId,
        yearMonth,
        totalAmount,
        memo: memo ?? null,
        status: assetInputs.length > 0 ? "completed" : "empty",
      });
    } else {
      await tx
        .update(monthlySnapshot)
        .set({
          totalAmount,
          memo: memo ?? null,
          status: assetInputs.length > 0 ? "completed" : "empty",
        })
        .where(eq(monthlySnapshot.id, snapshotId));

      await tx.delete(asset).where(eq(asset.snapshotId, snapshotId));
    }

    if (assetInputs.length > 0) {
      await tx.insert(asset).values(
        assetInputs.map((a) => ({
          id: nanoid(),
          snapshotId,
          categoryId: a.categoryId,
          amount: a.amount,
          memo: a.memo ?? null,
        }))
      );
    }
  });

  return { success: true, snapshotId };
}
