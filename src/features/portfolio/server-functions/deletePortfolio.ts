"use server";

import { db } from "@/shared/db/db";
import { portfolio } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deletePortfolio(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await db.query.portfolio.findFirst({
    where: eq(portfolio.id, id),
  });

  if (!existing) {
    throw new Error("Portfolio not found");
  }

  if (existing.userId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await db.delete(portfolio).where(eq(portfolio.id, id));

  revalidatePath("/dashboard/portfolio");

  return { success: true };
}
