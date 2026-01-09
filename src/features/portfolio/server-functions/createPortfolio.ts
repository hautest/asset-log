"use server";

import { db } from "@/shared/db/db";
import { portfolio, portfolioItem } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { revalidatePath } from "next/cache";

interface PortfolioItemInput {
  ticker: string;
  name: string;
  weight: number;
}

interface CreatePortfolioInput {
  name: string;
  description?: string;
  items: PortfolioItemInput[];
}

export async function createPortfolio(input: CreatePortfolioInput) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const totalWeight = input.items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight !== 100) {
    throw new Error("Total weight must be 100%");
  }

  const result = await db
    .insert(portfolio)
    .values({
      userId: session.user.id,
      name: input.name,
      description: input.description,
    })
    .returning();

  const newPortfolio = result[0];
  if (!newPortfolio) {
    throw new Error("Failed to create portfolio");
  }

  if (input.items.length > 0) {
    await db.insert(portfolioItem).values(
      input.items.map((item) => ({
        portfolioId: newPortfolio.id,
        ticker: item.ticker,
        name: item.name,
        weight: item.weight,
      }))
    );
  }

  revalidatePath("/dashboard/portfolio");

  return newPortfolio;
}
