"use server";

import { db } from "@/shared/db/db";
import { monthlySnapshot, asset, category } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and, inArray } from "drizzle-orm";
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
  const snapshotId = nanoid();

  const result = await db.transaction(async (tx) => {
    if (assetInputs.length > 0) {
      const categoryIds = [...new Set(assetInputs.map((a) => a.categoryId))];
      const ownedCategories = await tx
        .select({ id: category.id })
        .from(category)
        .where(
          and(eq(category.userId, userId), inArray(category.id, categoryIds))
        );

      const ownedCategoryIds = new Set(ownedCategories.map((c) => c.id));
      const invalidCategoryIds = categoryIds.filter(
        (id) => !ownedCategoryIds.has(id)
      );

      if (invalidCategoryIds.length > 0) {
        throw new Error("Invalid category: unauthorized access");
      }
    }

    const upsertResult = await tx
      .insert(monthlySnapshot)
      .values({
        id: snapshotId,
        userId,
        yearMonth,
        totalAmount,
        memo: memo ?? null,
        status: assetInputs.length > 0 ? "completed" : "empty",
      })
      .onConflictDoUpdate({
        target: [monthlySnapshot.userId, monthlySnapshot.yearMonth],
        set: {
          totalAmount,
          memo: memo ?? null,
          status: assetInputs.length > 0 ? "completed" : "empty",
        },
      })
      .returning({ id: monthlySnapshot.id });

    const actualSnapshotId = upsertResult[0]?.id ?? snapshotId;

    await tx.delete(asset).where(eq(asset.snapshotId, actualSnapshotId));

    if (assetInputs.length > 0) {
      await tx.insert(asset).values(
        assetInputs.map((a) => ({
          id: nanoid(),
          snapshotId: actualSnapshotId,
          categoryId: a.categoryId,
          amount: a.amount,
          memo: a.memo ?? null,
        }))
      );
    }

    return actualSnapshotId;
  });

  return { success: true, snapshotId: result };
}
