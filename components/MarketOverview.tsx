import React from 'react';
import { MarketOverview as IMarketOverview } from '../types';
import { TrendingUp, TrendingDown, Minus, Zap, Activity } from 'lucide-react';

interface MarketOverviewProps {
  data: IMarketOverview | null;
  isLoading: boolean;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-xl"></div>
          ))}
        </div>
        <div className="h-48 bg-slate-800 rounded-xl"></div>
        <div className="h-64 bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 fade-in">
      {/* Indices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.indices.map((index, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl backdrop-blur-sm">
            <div className="text-slate-400 text-sm font-medium mb-1">{index.name}</div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-white">{index.value}</div>
              <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
                index.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' :
                index.trend === 'down' ? 'bg-rose-500/10 text-rose-400' :
                'bg-slate-500/10 text-slate-400'
              }`}>
                {index.trend === 'up' && <TrendingUp size={14} className="mr-1" />}
                {index.trend === 'down' && <TrendingDown size={14} className="mr-1" />}
                {index.trend === 'neutral' && <Minus size={14} className="mr-1" />}
                {index.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment & Overview */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4 text-primary-400">
              <Activity size={20} />
              <h3 className="text-lg font-semibold">Market Sentiment</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg">
              {data.sentiment}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-3 text-indigo-400">
              <Zap size={20} />
              <h3 className="text-lg font-semibold">Trending Point</h3>
            </div>
            <p className="text-indigo-100 font-medium text-lg">
              {data.trendingPoint}
            </p>
          </div>
        </div>

        {/* Hot Industries */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl h-full">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-rose-400">🔥</span> Hot Industries
            </h3>
            <div className="space-y-4">
              {data.hotIndustries.map((industry, idx) => (
                <div key={idx} className="group p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-200">{industry.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      industry.momentum === 'high' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                      industry.momentum === 'medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                      'border-slate-500/30 text-slate-400'
                    }`}>
                      {industry.momentum.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-snug">
                    {industry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
