"use server";

import { db } from "@/shared/db/db";
import { portfolio } from "@/shared/db/schema";
import { getSession } from "@/shared/auth/getSession";
import { eq } from "drizzle-orm";
import { getHistoricalPrices } from "../yahooFinance";
import {
  analyzePortfolio as runAnalysis,
  combinePortfolioPrices,
  type PortfolioAnalysis,
} from "../analysis";

interface AnalyzePortfolioInput {
  portfolioId: string;
  startDate: string;
  endDate: string;
}

interface PriceData {
  date: string;
  close: number;
}

interface AnalysisResult {
  analysis: PortfolioAnalysis;
  portfolioPrices: PriceData[];
  stockPrices: Record<string, PriceData[]>;
  items: Array<{
    ticker: string;
    name: string;
    weight: number;
  }>;
}

export async function analyzePortfolioAction(
  input: AnalyzePortfolioInput
): Promise<AnalysisResult> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const portfolioData = await db.query.portfolio.findFirst({
    where: eq(portfolio.id, input.portfolioId),
    with: {
      items: true,
    },
  });

  if (!portfolioData) {
    throw new Error("Portfolio not found");
  }

  if (portfolioData.userId !== session.user.id) {
    throw new Error("Forbidden");
  }

  if (portfolioData.items.length === 0) {
    throw new Error("Portfolio has no items");
  }

  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  const stockPricesMap = new Map<string, PriceData[]>();
  const weightsMap = new Map<string, number>();
  const stockPricesRecord: Record<string, PriceData[]> = {};

  for (const item of portfolioData.items) {
    try {
      const prices = await getHistoricalPrices(item.ticker, startDate, endDate);
      const priceData = prices.map((p) => ({
        date: p.date,
        close: p.adjClose,
      }));

      stockPricesMap.set(item.ticker, priceData);
      weightsMap.set(item.ticker, item.weight);
      stockPricesRecord[item.ticker] = priceData;
    } catch (error) {
      console.error(`Failed to fetch data for ${item.ticker}:`, error);
      throw new Error(`Failed to fetch data for ${item.ticker}`);
    }
  }

  const portfolioPrices = combinePortfolioPrices(stockPricesMap, weightsMap);
  const analysis = runAnalysis(portfolioPrices);

  return {
    analysis,
    portfolioPrices,
    stockPrices: stockPricesRecord,
    items: portfolioData.items.map((item) => ({
      ticker: item.ticker,
      name: item.name,
      weight: item.weight,
    })),
  };
}
