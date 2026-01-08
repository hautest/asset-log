"use server";

import { db } from "@/shared/db/db";
import { category } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq, and } from "drizzle-orm";
import { updateTag } from "next/cache";

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

  if (input.name !== undefined && input.name.trim() === "") {
    throw new Error("카테고리 이름은 비어있을 수 없습니다");
  }

  if (input.color !== undefined && input.color.trim() === "") {
    throw new Error("카테고리 색상은 비어있을 수 없습니다");
  }

  const userId = session.user.id;

  const [updated] = await db
    .update(category)
    .set({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.color !== undefined && { color: input.color }),
    })
    .where(and(eq(category.id, input.id), eq(category.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Category not found");
  }

  updateTag(`categories-${userId}`);

  return updated;
}
