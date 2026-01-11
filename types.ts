export type MarketRegion = 'US' | 'CN' | 'HK' | 'JP';

export interface MarketIndex {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface IndustryTrend {
  name: string;
  description: string;
  momentum: 'high' | 'medium' | 'low';
}

export interface MarketOverview {
  indices: MarketIndex[];
  sentiment: string;
  hotIndustries: IndustryTrend[];
  trendingPoint: string;
  lastUpdated: string;
}

export interface StockData {
  symbol: string;
  name: string;
  price: string;
  changePercent: string;
  marketCap: string;
  peRatio: string;
  sector: string;
  summary: string;
  bullCase: string[];
  bearCase: string[];
  verdict: 'Buy' | 'Hold' | 'Sell' | 'Neutral';
  sources: { title: string; uri: string }[];
}

export interface StockAnalysisRequest {
  symbol: string;
  region: MarketRegion;
}
