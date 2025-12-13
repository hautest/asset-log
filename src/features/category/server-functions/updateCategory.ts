"use server";

import { db } from "@/shared/db/db";
import { category } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and } from "drizzle-orm";

interface UpdateCategoryInput {
  id: string;
  name?: string;
  color?: string;
}

export async function updateCategory(input: UpdateCategoryInput) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const [updated] = await db
    .update(category)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.color && { color: input.color }),
    })
    .where(and(eq(category.id, input.id), eq(category.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Category not found");
  }

  return updated;
}
