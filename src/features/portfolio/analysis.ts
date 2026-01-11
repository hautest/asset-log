interface PriceData {
  date: string;
  close: number;
}

interface PeakTrough {
  type: "peak" | "trough";
  date: string;
  price: number;
  index: number;
}

interface Segment {
  type: "rise" | "fall";
  startDate: string;
  endDate: string;
  startPrice: number;
  endPrice: number;
  changePercent: number;
  durationDays: number;
}

export interface PortfolioAnalysis {
  totalReturn: number;
  totalReturnPercent: number;
  startValue: number;
  endValue: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  maxDrawdownPeriod: { start: string; end: string } | null;
  maxGain: number;
  maxGainPercent: number;
  maxGainPeriod: { start: string; end: string } | null;
  riseSegments: Segment[];
  fallSegments: Segment[];
  volatility: number;
  sharpeRatio: number;
}

function findPeaksAndTroughs(prices: PriceData[], threshold = 0.05): PeakTrough[] {
  if (prices.length < 3) return [];

  const points: PeakTrough[] = [];
  let lastExtreme: PeakTrough | null = null;

  for (let i = 1; i < prices.length - 1; i++) {
    const prevPrice = prices[i - 1];
    const currPrice = prices[i];
    const nextPrice = prices[i + 1];

    if (!prevPrice || !currPrice || !nextPrice) continue;

    const prev = prevPrice.close;
    const curr = currPrice.close;
    const next = nextPrice.close;

    const isPeak = curr > prev && curr > next;
    const isTrough = curr < prev && curr < next;

    if (isPeak || isTrough) {
      const type = isPeak ? "peak" : "trough";

      if (!lastExtreme) {
        lastExtreme = { type, date: currPrice.date, price: curr, index: i };
        points.push(lastExtreme);
      } else if (lastExtreme.type !== type) {
        const change = Math.abs(curr - lastExtreme.price) / lastExtreme.price;
        if (change >= threshold) {
          lastExtreme = { type, date: currPrice.date, price: curr, index: i };
          points.push(lastExtreme);
        }
      } else {
        if (
          (type === "peak" && curr > lastExtreme.price) ||
          (type === "trough" && curr < lastExtreme.price)
        ) {
          lastExtreme.date = currPrice.date;
          lastExtreme.price = curr;
          lastExtreme.index = i;
        }
      }
    }
  }

  return points;
}

function calculateSegments(prices: PriceData[], peaksTroughs: PeakTrough[]): Segment[] {
  if (peaksTroughs.length < 2) return [];

  const segments: Segment[] = [];

  for (let i = 0; i < peaksTroughs.length - 1; i++) {
    const start = peaksTroughs[i];
    const end = peaksTroughs[i + 1];

    if (!start || !end) continue;

    const isRise = end.price > start.price;
    const changePercent = ((end.price - start.price) / start.price) * 100;

    const startDate = new Date(start.date);
    const endDate = new Date(end.date);
    const durationDays = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    segments.push({
      type: isRise ? "rise" : "fall",
      startDate: start.date,
      endDate: end.date,
      startPrice: start.price,
      endPrice: end.price,
      changePercent,
      durationDays,
    });
  }

  return segments;
}

function calculateMaxDrawdown(
  prices: PriceData[]
): { maxDrawdown: number; maxDrawdownPercent: number; period: { start: string; end: string } | null } {
  const firstPrice = prices[0];
  if (prices.length < 2 || !firstPrice) {
    return { maxDrawdown: 0, maxDrawdownPercent: 0, period: null };
  }

  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  let peak = firstPrice.close;
  let peakDate = firstPrice.date;
  let drawdownStart = firstPrice.date;
  let drawdownEnd = firstPrice.date;

  for (const price of prices) {
    if (price.close > peak) {
      peak = price.close;
      peakDate = price.date;
    }

    const drawdown = peak - price.close;
    const drawdownPercent = (drawdown / peak) * 100;

    if (drawdownPercent > maxDrawdownPercent) {
      maxDrawdown = drawdown;
      maxDrawdownPercent = drawdownPercent;
      drawdownStart = peakDate;
      drawdownEnd = price.date;
    }
  }

  return {
    maxDrawdown,
    maxDrawdownPercent,
    period: maxDrawdownPercent > 0 ? { start: drawdownStart, end: drawdownEnd } : null,
  };
}

function calculateMaxGain(
  prices: PriceData[]
): { maxGain: number; maxGainPercent: number; period: { start: string; end: string } | null } {
  const firstPrice = prices[0];
  if (prices.length < 2 || !firstPrice) {
    return { maxGain: 0, maxGainPercent: 0, period: null };
  }

  let maxGain = 0;
  let maxGainPercent = 0;
  let trough = firstPrice.close;
  let troughDate = firstPrice.date;
  let gainStart = firstPrice.date;
  let gainEnd = firstPrice.date;

  for (const price of prices) {
    if (price.close < trough) {
      trough = price.close;
      troughDate = price.date;
    }

    const gain = price.close - trough;
    const gainPercent = (gain / trough) * 100;

    if (gainPercent > maxGainPercent) {
      maxGain = gain;
      maxGainPercent = gainPercent;
      gainStart = troughDate;
      gainEnd = price.date;
    }
  }

  return {
    maxGain,
    maxGainPercent,
    period: maxGainPercent > 0 ? { start: gainStart, end: gainEnd } : null,
  };
}

function calculateVolatility(prices: PriceData[]): number {
  if (prices.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const curr = prices[i];
    const prev = prices[i - 1];
    if (!curr || !prev) continue;
    const dailyReturn = (curr.close - prev.close) / prev.close;
    returns.push(dailyReturn);
  }

  if (returns.length === 0) return 0;

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map((r) => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;
  const dailyVolatility = Math.sqrt(variance);

  return dailyVolatility * Math.sqrt(252) * 100;
}

function calculateSharpeRatio(prices: PriceData[], riskFreeRate = 0.04): number {
  const first = prices[0];
  const last = prices[prices.length - 1];
  if (prices.length < 2 || !first || !last) return 0;

  const totalReturn = (last.close - first.close) / first.close;
  const years =
    (new Date(last.date).getTime() - new Date(first.date).getTime()) /
    (1000 * 60 * 60 * 24 * 365);

  if (years <= 0) return 0;

  const annualizedReturn = Math.pow(1 + totalReturn, 1 / years) - 1;
  const volatility = calculateVolatility(prices) / 100;

  if (volatility === 0) return 0;

  return (annualizedReturn - riskFreeRate) / volatility;
}

export function analyzePortfolio(
  portfolioPrices: PriceData[],
  threshold = 0.05
): PortfolioAnalysis {
  const first = portfolioPrices[0];
  const last = portfolioPrices[portfolioPrices.length - 1];

  if (portfolioPrices.length === 0 || !first || !last) {
    return {
      totalReturn: 0,
      totalReturnPercent: 0,
      startValue: 0,
      endValue: 0,
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      maxDrawdownPeriod: null,
      maxGain: 0,
      maxGainPercent: 0,
      maxGainPeriod: null,
      riseSegments: [],
      fallSegments: [],
      volatility: 0,
      sharpeRatio: 0,
    };
  }

  const startValue = first.close;
  const endValue = last.close;
  const totalReturn = endValue - startValue;
  const totalReturnPercent = (totalReturn / startValue) * 100;

  const peaksTroughs = findPeaksAndTroughs(portfolioPrices, threshold);
  const segments = calculateSegments(portfolioPrices, peaksTroughs);

  const riseSegments = segments
    .filter((s) => s.type === "rise")
    .sort((a, b) => b.changePercent - a.changePercent);
  const fallSegments = segments
    .filter((s) => s.type === "fall")
    .sort((a, b) => a.changePercent - b.changePercent);

  const drawdownResult = calculateMaxDrawdown(portfolioPrices);
  const gainResult = calculateMaxGain(portfolioPrices);
  const volatility = calculateVolatility(portfolioPrices);
  const sharpeRatio = calculateSharpeRatio(portfolioPrices);

  return {
    totalReturn,
    totalReturnPercent,
    startValue,
    endValue,
    maxDrawdown: drawdownResult.maxDrawdown,
    maxDrawdownPercent: drawdownResult.maxDrawdownPercent,
    maxDrawdownPeriod: drawdownResult.period,
    maxGain: gainResult.maxGain,
    maxGainPercent: gainResult.maxGainPercent,
    maxGainPeriod: gainResult.period,
    riseSegments,
    fallSegments,
    volatility,
    sharpeRatio,
  };
}

export function combinePortfolioPrices(
  stockPrices: Map<string, PriceData[]>,
  weights: Map<string, number>
): PriceData[] {
  const allDates = new Set<string>();

  for (const prices of stockPrices.values()) {
    for (const price of prices) {
      allDates.add(price.date);
    }
  }

  const sortedDates = Array.from(allDates).sort();

  const pricesByDate = new Map<string, Map<string, number>>();
  for (const [ticker, prices] of stockPrices) {
    for (const price of prices) {
      if (!pricesByDate.has(price.date)) {
        pricesByDate.set(price.date, new Map());
      }
      pricesByDate.get(price.date)!.set(ticker, price.close);
    }
  }

  const tickers = Array.from(stockPrices.keys());
  const normalizedPrices = new Map<string, number>();

  for (const ticker of tickers) {
    const prices = stockPrices.get(ticker);
    const firstPrice = prices?.[0];
    if (firstPrice) {
      normalizedPrices.set(ticker, firstPrice.close);
    }
  }

  const portfolioPrices: PriceData[] = [];
  const lastPrices = new Map<string, number>();

  for (const date of sortedDates) {
    const dayPrices = pricesByDate.get(date);
    if (!dayPrices) continue;

    for (const [ticker, price] of dayPrices) {
      lastPrices.set(ticker, price);
    }

    if (lastPrices.size === tickers.length) {
      let portfolioValue = 0;

      for (const ticker of tickers) {
        const currentPrice = lastPrices.get(ticker);
        const basePrice = normalizedPrices.get(ticker);
        const weight = weights.get(ticker) || 0;

        if (currentPrice !== undefined && basePrice !== undefined && basePrice > 0) {
          const normalizedValue = (currentPrice / basePrice) * (weight / 100);
          portfolioValue += normalizedValue;
        }
      }

      portfolioPrices.push({
        date,
        close: portfolioValue * 100,
      });
    }
  }

  return portfolioPrices;
}
