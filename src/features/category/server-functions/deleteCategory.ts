"use server";

import { db } from "@/shared/db/db";
import { category, asset } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and } from "drizzle-orm";
import { updateTag } from "next/cache";

export async function deleteCategory(id: string) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existingAssets = await db
    .select({ id: asset.id })
    .from(asset)
    .where(eq(asset.categoryId, id))
    .limit(1);

  if (existingAssets.length > 0) {
    throw new Error("해당 카테고리에 자산이 있어 삭제할 수 없습니다");
  }

  const [deleted] = await db
    .delete(category)
    .where(and(eq(category.id, id), eq(category.userId, userId)))
    .returning();

  if (!deleted) {
    throw new Error("Category not found");
  }

  updateTag(`categories-${userId}`);

  return deleted;
}
