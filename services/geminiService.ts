import { GoogleGenAI, Type } from "@google/genai";
import { MarketOverview, StockData, MarketRegion } from "../types";

// Helper to sanitize JSON from markdown code blocks
const extractJson = (text: string): any => {
  try {
    // Remove ```json and ``` fences
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    // Attempt to parse raw text if no blocks found
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response", e);
    return null;
  }
};

export const fetchMarketOverview = async (region: MarketRegion): Promise<MarketOverview> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const regionNames: Record<MarketRegion, string> = {
    US: "United States (NYSE, NASDAQ)",
    CN: "Mainland China (A-Shares, Shanghai, Shenzhen)",
    HK: "Hong Kong (HKEX)",
    JP: "Japan (Tokyo Stock Exchange)"
  };

  const prompt = `
    Generate a real-time market overview for the ${regionNames[region]} stock market.
    Use the Google Search tool to find the latest indices data, market sentiment, and hot industries.
    
    Return the response strictly as a JSON object with the following schema:
    {
      "indices": [
        { "name": "Index Name (e.g., S&P 500)", "value": "1234.56", "change": "+0.5%", "trend": "up" | "down" | "neutral" }
      ],
      "sentiment": "A brief paragraph describing the overall market mood today.",
      "hotIndustries": [
        { "name": "Industry Name", "description": "Why it is trending", "momentum": "high" | "medium" | "low" }
      ],
      "trendingPoint": "The single most important news or trend affecting this market right now.",
      "lastUpdated": "Current Time"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json" 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = extractJson(text);
    if (!data) throw new Error("Invalid JSON format");

    return data as MarketOverview;
  } catch (error) {
    console.error("Gemini Market Overview Error:", error);
    // Fallback mock data in case of API failure to prevent app crash during demo
    return {
      indices: [{ name: "Error Fetching Data", value: "0.00", change: "0%", trend: "neutral" }],
      sentiment: "Unable to retrieve real-time market data. Please try again later.",
      hotIndustries: [],
      trendingPoint: "N/A",
      lastUpdated: new Date().toISOString()
    };
  }
};

export const analyzeStock = async (symbol: string, region: MarketRegion): Promise<StockData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const regionContext = {
    US: "US Market",
    CN: "China A-Shares/Mainland",
    HK: "Hong Kong Stock Exchange",
    JP: "Tokyo Stock Exchange"
  };

  const prompt = `
    Analyze the stock with identifier "${symbol}" in the ${regionContext[region]}.
    Use Google Search to find current price, recent news, and financial health.
    
    Return the response strictly as a JSON object with this schema:
    {
      "symbol": "${symbol}",
      "name": "Company Name",
      "price": "Current Price (with currency symbol)",
      "changePercent": "24h Change % (e.g. +1.2%)",
      "marketCap": "Market Cap",
      "peRatio": "P/E Ratio (or N/A)",
      "sector": "Sector/Industry",
      "summary": "A concise 2-3 sentence summary of the company's current status.",
      "bullCase": ["Reason 1 to buy", "Reason 2 to buy", "Reason 3 to buy"],
      "bearCase": ["Risk 1", "Risk 2", "Risk 3"],
      "verdict": "Buy" | "Sell" | "Hold"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = extractJson(text);
    if (!data) throw new Error("Invalid JSON format");

    // Extract grounding metadata for sources
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#") || [];

    return { ...data, sources } as StockData;
  } catch (error) {
    console.error("Gemini Stock Analysis Error:", error);
    throw error;
  }
};
