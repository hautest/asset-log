import { db } from "@/shared/db/db";
import { category } from "@/shared/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/shared/auth/getSession";

export async function getCategories() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(category)
    .where(eq(category.userId, session.user.id))
    .orderBy(asc(category.sortOrder));
}
