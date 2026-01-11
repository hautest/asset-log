interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

interface StockQuote {
  ticker: string;
  name: string;
  price: number;
  currency: string;
  exchange: string;
}

interface YahooChartResult {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        shortName?: string;
        longName?: string;
        regularMarketPrice: number;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: (number | null)[];
          high: (number | null)[];
          low: (number | null)[];
          close: (number | null)[];
          volume: (number | null)[];
        }>;
        adjclose?: Array<{
          adjclose: (number | null)[];
        }>;
      };
    }> | null;
    error: null | { code: string; description: string };
  };
}

interface YahooSearchResult {
  quotes: Array<{
    symbol: string;
    shortname?: string;
    longname?: string;
    exchange: string;
    quoteType: string;
  }>;
}

export async function getHistoricalPrices(
  ticker: string,
  startDate: Date,
  endDate: Date
): Promise<HistoricalPrice[]> {
  const period1 = Math.floor(startDate.getTime() / 1000);
  const period2 = Math.floor(endDate.getTime() / 1000);

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?period1=${period1}&period2=${period2}&interval=1d&events=history`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${ticker}: ${response.statusText}`);
  }

  const data: YahooChartResult = await response.json();

  if (data.chart.error) {
    throw new Error(`Yahoo Finance error: ${data.chart.error.description}`);
  }

  const result = data.chart.result?.[0];
  if (!result || !result.timestamp) {
    return [];
  }

  const quotes = result.indicators.quote[0];
  const adjClose = result.indicators.adjclose?.[0]?.adjclose;

  if (!quotes) {
    return [];
  }

  const prices: HistoricalPrice[] = [];

  for (let i = 0; i < result.timestamp.length; i++) {
    const timestamp = result.timestamp[i];
    const closePrice = quotes.close[i];

    if (timestamp !== undefined && closePrice !== null && closePrice !== undefined) {
      const dateStr = new Date(timestamp * 1000).toISOString().split("T")[0];
      if (dateStr) {
        prices.push({
          date: dateStr,
          open: quotes.open[i] ?? 0,
          high: quotes.high[i] ?? 0,
          low: quotes.low[i] ?? 0,
          close: closePrice,
          volume: quotes.volume[i] ?? 0,
          adjClose: adjClose?.[i] ?? closePrice,
        });
      }
    }
  }

  return prices;
}

export async function getStockQuote(ticker: string): Promise<StockQuote | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    return null;
  }

  const data: YahooChartResult = await response.json();

  if (data.chart.error || !data.chart.result?.[0]) {
    return null;
  }

  const meta = data.chart.result[0].meta;

  return {
    ticker: meta.symbol,
    name: meta.longName || meta.shortName || meta.symbol,
    price: meta.regularMarketPrice,
    currency: meta.currency,
    exchange: meta.exchangeName,
  };
}

export async function searchStocks(query: string): Promise<StockQuote[]> {
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    return [];
  }

  const data: YahooSearchResult = await response.json();

  if (!data.quotes) {
    return [];
  }

  return data.quotes
    .filter((q) => q.quoteType === "EQUITY" || q.quoteType === "ETF")
    .map((q) => ({
      ticker: q.symbol,
      name: q.longname || q.shortname || q.symbol,
      price: 0,
      currency: "",
      exchange: q.exchange,
    }));
}
