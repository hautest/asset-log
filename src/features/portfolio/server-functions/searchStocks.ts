"use server";

import { searchStocks as search, getStockQuote } from "../yahooFinance";

export async function searchStocksAction(query: string) {
  if (!query || query.length < 1) {
    return [];
  }

  try {
    const results = await search(query);
    return results.slice(0, 10);
  } catch (error) {
    console.error("Stock search failed:", error);
    return [];
  }
}

export async function getStockQuoteAction(ticker: string) {
  try {
    return await getStockQuote(ticker);
  } catch (error) {
    console.error("Stock quote failed:", error);
    return null;
  }
}
