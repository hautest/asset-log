"use server";

import { db } from "@/shared/db/db";
import { category } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { updateTag } from "next/cache";

interface CreateCategoryInput {
  name: string;
  color: string;
}

export async function createCategory(input: CreateCategoryInput) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existing = await db
    .select({ sortOrder: category.sortOrder })
    .from(category)
    .where(eq(category.userId, userId))
    .orderBy(desc(category.sortOrder))
    .limit(1);

  const nextSortOrder =
    existing.length > 0 && existing[0] ? existing[0].sortOrder + 1 : 0;

  const [newCategory] = await db
    .insert(category)
    .values({
      id: nanoid(),
      userId,
      name: input.name,
      color: input.color,
      isDefault: false,
      sortOrder: nextSortOrder,
    })
    .returning();

  updateTag(`categories-${userId}`);

  return newCategory;
}
