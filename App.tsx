import React, { useState, useEffect, useCallback } from 'react';
import { MarketRegion, MarketOverview, StockData } from './types';
import { fetchMarketOverview, analyzeStock } from './services/geminiService';
import MarketSelector from './components/MarketSelector';
import MarketOverviewComponent from './components/MarketOverview';
import StockAnalysis from './components/StockAnalysis';
import { Search, Sparkles, AlertCircle, BarChart3, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState<MarketRegion>('US');
  const [overviewData, setOverviewData] = useState<Record<MarketRegion, MarketOverview | null>>({
    US: null, CN: null, HK: null, JP: null
  });
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  
  // Stock Analysis State
  const [stockQuery, setStockQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Check API Key
  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const loadMarketOverview = useCallback(async (region: MarketRegion) => {
    if (overviewData[region]) return; // Cache hit
    
    setIsLoadingOverview(true);
    setError(null);
    try {
      const data = await fetchMarketOverview(region);
      setOverviewData(prev => ({ ...prev, [region]: data }));
    } catch (err) {
      setError("Failed to load market overview. The AI service might be busy.");
    } finally {
      setIsLoadingOverview(false);
    }
  }, [overviewData]);

  // Initial load
  useEffect(() => {
    if (!apiKeyMissing) {
      loadMarketOverview(activeRegion);
    }
  }, [activeRegion, loadMarketOverview, apiKeyMissing]);

  const handleStockSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockQuery.trim()) return;

    setIsAnalyzing(true);
    setStockData(null);
    setError(null);

    try {
      const data = await analyzeStock(stockQuery, activeRegion);
      setStockData(data);
    } catch (err) {
      setError("Unable to analyze stock. Please verify the stock ID and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearAnalysis = () => {
    setStockData(null);
    setStockQuery('');
  };

  if (apiKeyMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-900/50 rounded-xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">API Key Missing</h1>
          <p className="text-slate-400">
            This application requires a Google Gemini API key to function. 
            The key is expected to be in <code>process.env.API_KEY</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary-500/30">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-primary-600 to-primary-400 p-2 rounded-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Global Stock Pulse
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
             <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-yellow-400"/> Powered by Gemini 2.0/3.0</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
             <MarketSelector 
              selected={activeRegion} 
              onSelect={setActiveRegion} 
              disabled={isAnalyzing || isLoadingOverview}
            />
          </div>
        </div>

        {/* Search Bar */}
        {!stockData && (
          <div className="max-w-2xl mx-auto mb-12 relative z-10">
            <form onSubmit={handleStockSearch} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative flex items-center bg-slate-900 rounded-xl p-2 border border-slate-700 shadow-2xl">
                <Search className="ml-3 text-slate-500" size={20} />
                <input 
                  type="text" 
                  value={stockQuery}
                  onChange={(e) => setStockQuery(e.target.value)}
                  placeholder={`Enter stock ID for ${activeRegion} (e.g. ${
                    activeRegion === 'US' ? 'AAPL, NVDA' : 
                    activeRegion === 'HK' ? '0700.HK, 9988.HK' : 
                    activeRegion === 'CN' ? '600519.SS' : '7203.T'
                  })`}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 h-10 px-3 text-lg"
                />
                <button 
                  type="submit"
                  disabled={isAnalyzing || !stockQuery}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>Analyze</>
                  )}
                </button>
              </div>
            </form>
            {error && (
              <div className="mt-4 p-4 bg-rose-950/30 border border-rose-900/50 rounded-lg flex items-center gap-3 text-rose-300">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        {stockData ? (
          <StockAnalysis data={stockData} onClose={handleClearAnalysis} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Market Overview <span className="text-slate-500 text-lg font-normal">/ {activeRegion}</span>
              </h2>
              {overviewData[activeRegion]?.lastUpdated && (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Info size={12}/> Updated: {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
            
            <MarketOverviewComponent 
              data={overviewData[activeRegion]} 
              isLoading={isLoadingOverview} 
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
