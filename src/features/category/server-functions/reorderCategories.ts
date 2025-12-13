"use server";

import { db } from "@/shared/db/db";
import { category } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and } from "drizzle-orm";

export async function reorderCategories(orderedIds: string[]) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      const categoryId = orderedIds[i];
      if (categoryId) {
        await tx
          .update(category)
          .set({ sortOrder: i })
          .where(
            and(eq(category.id, categoryId), eq(category.userId, userId))
          );
      }
    }
  });

  return { success: true };
}
