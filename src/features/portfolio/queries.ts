import { db } from "@/shared/db/db";
import { portfolio, portfolioItem } from "@/shared/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/shared/auth/getSession";

export async function getPortfolios() {
  const session = await getSession();
  if (!session) {
    return [];
  }

  const portfolios = await db.query.portfolio.findMany({
    where: eq(portfolio.userId, session.user.id),
    with: {
      items: true,
    },
    orderBy: (portfolio, { desc }) => [desc(portfolio.createdAt)],
  });

  return portfolios;
}

export async function getPortfolioById(id: string) {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const result = await db.query.portfolio.findFirst({
    where: eq(portfolio.id, id),
    with: {
      items: true,
    },
  });

  if (!result) {
    return null;
  }

  if (result.userId !== session.user.id) {
    return null;
  }

  return result;
}
