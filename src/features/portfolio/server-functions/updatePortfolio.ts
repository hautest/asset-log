"use server";

import { db } from "@/shared/db/db";
import { portfolio, portfolioItem } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface PortfolioItemInput {
  ticker: string;
  name: string;
  weight: number;
}

interface UpdatePortfolioInput {
  id: string;
  name: string;
  description?: string;
  items: PortfolioItemInput[];
}

export async function updatePortfolio(input: UpdatePortfolioInput) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await db.query.portfolio.findFirst({
    where: eq(portfolio.id, input.id),
  });

  if (!existing) {
    throw new Error("Portfolio not found");
  }

  if (existing.userId !== session.user.id) {
    throw new Error("Forbidden");
  }

  const totalWeight = input.items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight !== 100) {
    throw new Error("Total weight must be 100%");
  }

  await db
    .update(portfolio)
    .set({
      name: input.name,
      description: input.description,
    })
    .where(eq(portfolio.id, input.id));

  await db.delete(portfolioItem).where(eq(portfolioItem.portfolioId, input.id));

  if (input.items.length > 0) {
    await db.insert(portfolioItem).values(
      input.items.map((item) => ({
        portfolioId: input.id,
        ticker: item.ticker,
        name: item.name,
        weight: item.weight,
      }))
    );
  }

  revalidatePath("/dashboard/portfolio");
  revalidatePath(`/dashboard/portfolio/${input.id}`);

  return { success: true };
}
