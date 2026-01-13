import { db } from "@/shared/db/db";
import { category } from "@/shared/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/shared/auth/getSession";
import { cacheLife, cacheTag } from "next/cache";

async function getCategoriesCached(userId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`categories-${userId}`);

  return db
    .select()
    .from(category)
    .where(eq(category.userId, userId))
    .orderBy(asc(category.sortOrder));
}

export async function getCategories() {
  const session = await getSession();
  if (!session) {
    return [];
  }
  return getCategoriesCached(session.user.id);
}
