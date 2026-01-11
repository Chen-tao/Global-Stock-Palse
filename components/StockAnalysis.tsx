import React from 'react';
import { StockData } from '../types';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface StockAnalysisProps {
  data: StockData;
  onClose: () => void;
}

const StockAnalysis: React.FC<StockAnalysisProps> = ({ data, onClose }) => {
  const isPositive = data.changePercent.includes('+') || !data.changePercent.includes('-');
  
  // Dummy data for a visual breakdown of sentiment for the chart
  const sentimentData = [
    { name: 'Bullish Signals', value: data.bullCase.length, color: '#10b981' },
    { name: 'Bearish Risks', value: data.bearCase.length, color: '#f43f5e' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <TrendingUp size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">{data.symbol}</h2>
              <span className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300 border border-slate-600">
                {data.sector}
              </span>
            </div>
            <h3 className="text-xl text-slate-400 mb-4">{data.name}</h3>
            
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-white">{data.price}</span>
              <span className={`flex items-center text-lg font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                {data.changePercent}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-slate-500 mb-1">Market Cap</div>
              <div className="font-medium text-slate-200">{data.marketCap}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-slate-500 mb-1">P/E Ratio</div>
              <div className="font-medium text-slate-200">{data.peRatio}</div>
            </div>
            <div className="col-span-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
              <span className="text-slate-500">AI Verdict</span>
              <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                data.verdict === 'Buy' ? 'bg-emerald-500 text-white' :
                data.verdict === 'Sell' ? 'bg-rose-500 text-white' :
                'bg-yellow-500 text-white'
              }`}>
                {data.verdict}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Executive Summary</h4>
            <p className="text-slate-300 leading-relaxed text-lg">{data.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bull Case */}
            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-5">
              <h5 className="flex items-center gap-2 text-emerald-400 font-semibold mb-4">
                <CheckCircle size={18} />
                Bull Case
              </h5>
              <ul className="space-y-3">
                {data.bullCase.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bear Case */}
            <div className="bg-rose-900/10 border border-rose-500/20 rounded-xl p-5">
              <h5 className="flex items-center gap-2 text-rose-400 font-semibold mb-4">
                <AlertTriangle size={18} />
                Bear Risks
              </h5>
              <ul className="space-y-3">
                {data.bearCase.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Viz */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
             <h4 className="text-sm font-semibold text-slate-400 mb-4 w-full text-left">Sentiment Weight</h4>
             <div className="w-full h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={sentimentData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {sentimentData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                     ))}
                   </Pie>
                   <RechartsTooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                     itemStyle={{ color: '#f8fafc' }}
                   />
                   <Legend verticalAlign="bottom" height={36}/>
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="text-center mt-2">
                <span className="text-3xl font-bold text-white">
                  {Math.round((data.bullCase.length / (data.bullCase.length + data.bearCase.length)) * 100)}%
                </span>
                <p className="text-xs text-slate-500">Bullish Factors</p>
             </div>
          </div>

          {/* Sources */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
             <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sources & References</h4>
             <div className="space-y-2">
               {data.sources.length > 0 ? data.sources.slice(0, 3).map((source, i) => (
                 <a key={i} href={source.uri} target="_blank" rel="noreferrer" className="block text-xs text-primary-400 hover:text-primary-300 truncate flex items-center gap-1">
                   <ExternalLink size={10} />
                   {source.title}
                 </a>
               )) : <span className="text-xs text-slate-600">Generated by Gemini analysis</span>}
             </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors underline decoration-slate-600 hover:decoration-white underline-offset-4"
        >
          Close Analysis & Return to Overview
        </button>
      </div>
    </div>
  );
};

export default StockAnalysis;
