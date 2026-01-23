import { db } from "@/shared/db/db";
import { monthlySnapshot, asset, category, portfolio, salary } from "@/shared/db/schema";
import { eq, and, desc, gte, lte, asc } from "drizzle-orm";
import { getSession } from "@/shared/auth/getSession";

export interface AssetSummary {
  yearMonth: string;
  totalAmount: number;
  categories: Array<{
    name: string;
    amount: number;
  }>;
  memo: string | null;
}

export interface PortfolioSummary {
  id: string;
  name: string;
  description: string | null;
  items: Array<{
    ticker: string;
    name: string;
    weight: number;
  }>;
}

export interface SalarySummary {
  year: number;
  amount: number;
  memo: string | null;
}

export interface UserFullContext {
  assets: {
    snapshots: AssetSummary[];
    categories: Array<{ name: string; color: string }>;
    latestSnapshot: AssetSummary | null;
    totalMonths: number;
  };
  portfolios: PortfolioSummary[];
  salaries: SalarySummary[];
}

export async function getUserFullContext(): Promise<UserFullContext | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const userId = session.user.id;

  const userCategories = await db
    .select({
      id: category.id,
      name: category.name,
      color: category.color,
    })
    .from(category)
    .where(eq(category.userId, userId));

  const categoryMap = new Map(userCategories.map((c) => [c.id, c.name]));

  const snapshots = await db
    .select()
    .from(monthlySnapshot)
    .where(
      and(
        eq(monthlySnapshot.userId, userId),
        eq(monthlySnapshot.status, "completed")
      )
    )
    .orderBy(desc(monthlySnapshot.yearMonth));

  const snapshotIds = snapshots.map((s) => s.id);

  const assetMap = new Map<string, Array<{ categoryId: string; amount: number }>>();

  for (const snapshotId of snapshotIds) {
    const snapshotAssets = await db
      .select({
        categoryId: asset.categoryId,
        amount: asset.amount,
      })
      .from(asset)
      .where(eq(asset.snapshotId, snapshotId));

    assetMap.set(snapshotId, snapshotAssets);
  }

  const assetSummaries: AssetSummary[] = snapshots.map((snapshot) => {
    const snapshotAssets = assetMap.get(snapshot.id) || [];
    return {
      yearMonth: snapshot.yearMonth,
      totalAmount: snapshot.totalAmount,
      categories: snapshotAssets.map((a) => ({
        name: categoryMap.get(a.categoryId) || "Unknown",
        amount: a.amount,
      })),
      memo: snapshot.memo,
    };
  });

  const userPortfolios = await db.query.portfolio.findMany({
    where: eq(portfolio.userId, userId),
    with: {
      items: true,
    },
    orderBy: (portfolio, { desc }) => [desc(portfolio.createdAt)],
  });

  const portfolioSummaries: PortfolioSummary[] = userPortfolios.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    items: p.items.map((item) => ({
      ticker: item.ticker,
      name: item.name,
      weight: item.weight,
    })),
  }));

  const currentYear = new Date().getFullYear();
  const userSalaries = await db
    .select()
    .from(salary)
    .where(
      and(
        eq(salary.userId, userId),
        gte(salary.year, currentYear - 10),
        lte(salary.year, currentYear)
      )
    )
    .orderBy(asc(salary.year));

  const salarySummaries: SalarySummary[] = userSalaries.map((s) => ({
    year: s.year,
    amount: s.amount,
    memo: s.memo,
  }));

  return {
    assets: {
      snapshots: assetSummaries,
      categories: userCategories.map((c) => ({ name: c.name, color: c.color })),
      latestSnapshot: assetSummaries[0] || null,
      totalMonths: snapshots.length,
    },
    portfolios: portfolioSummaries,
    salaries: salarySummaries,
  };
}
