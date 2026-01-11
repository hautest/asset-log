export interface PortfolioItem {
  id: string;
  ticker: string;
  name: string;
  weight: number;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  items: PortfolioItem[];
  createdAt: Date;
}

export interface PortfolioItemInput {
  ticker: string;
  name: string;
  weight: number;
}
