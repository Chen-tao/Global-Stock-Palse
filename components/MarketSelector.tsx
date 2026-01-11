import React from 'react';
import { MarketRegion } from '../types';
import { Globe } from 'lucide-react';

interface MarketSelectorProps {
  selected: MarketRegion;
  onSelect: (region: MarketRegion) => void;
  disabled?: boolean;
}

const markets: { id: MarketRegion; label: string; flag: string }[] = [
  { id: 'US', label: 'United States', flag: '🇺🇸' },
  { id: 'CN', label: 'China Mainland', flag: '🇨🇳' },
  { id: 'HK', label: 'Hong Kong', flag: '🇭🇰' },
  { id: 'JP', label: 'Japan', flag: '🇯🇵' },
];

const MarketSelector: React.FC<MarketSelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 mb-4 text-slate-400">
        <Globe size={16} />
        <span className="text-sm font-medium uppercase tracking-wider">Select Market Region</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {markets.map((market) => (
          <button
            key={market.id}
            onClick={() => onSelect(market.id)}
            disabled={disabled}
            className={`
              relative overflow-hidden p-4 rounded-xl border transition-all duration-300 text-left group
              ${
                selected === market.id
                  ? 'bg-primary-600/10 border-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{market.flag}</span>
              {selected === market.id && (
                <div className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_10px_#3b82f6]"></div>
              )}
            </div>
            <div className={`font-semibold ${selected === market.id ? 'text-primary-400' : 'text-slate-200'}`}>
              {market.label}
            </div>
            <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">
              Click to analyze
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MarketSelector;
