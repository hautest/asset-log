import { db } from "@/shared/db/db";
import { category } from "@/shared/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getCategoriesByUserId(userId: string) {
  return db
    .select()
    .from(category)
    .where(eq(category.userId, userId))
    .orderBy(asc(category.sortOrder));
}
