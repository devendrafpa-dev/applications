import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause } from 'lucide-react';

export const IndicesBar: React.FC = () => {
  const { indices, navigateTo, isLiveMarket, toggleLiveMarket, recentTicks, lastUpdatedTime } = useApp();

  return (
    <div className="w-full border-b bg-[#12161f] border-slate-800/80 light:bg-white light:border-slate-200 py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
        
        {/* Market Status Strip */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold">
              <span className={`w-2 h-2 rounded-full ${isLiveMarket ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className={isLiveMarket ? 'text-emerald-400' : 'text-slate-400'}>
                {isLiveMarket ? 'LIVE MARKET (NSE / BSE)' : 'MARKET FEED PAUSED'}
              </span>
            </span>
            <span className="text-slate-600">·</span>
            <span>Tick Feed: {lastUpdatedTime} IST</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLiveMarket}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                isLiveMarket
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 light:bg-slate-100 light:text-slate-700'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              {isLiveMarket ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause Feed</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Resume Live Feed</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Indices Ticker / Grid */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 gap-2.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {indices.map((index) => {
            const isPositive = index.change >= 0;
            const tick = recentTicks[index.id];

            // Generate small SVG sparkline
            const min = Math.min(...index.sparkline);
            const max = Math.max(...index.sparkline);
            const range = max - min || 1;
            const points = index.sparkline
              .map((val, i) => {
                const x = (i / (index.sparkline.length - 1)) * 48;
                const y = 20 - ((val - min) / range) * 16;
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <div
                key={index.id}
                onClick={() => navigateTo('fno')}
                className={`group min-w-[145px] sm:min-w-0 p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between shrink-0 sm:shrink ${
                  tick === 'up'
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : tick === 'down'
                    ? 'border-rose-500/60 bg-rose-500/10'
                    : 'border-slate-800/60 hover:border-slate-700 bg-[#161b24] hover:bg-[#1c222e] light:bg-slate-50 light:border-slate-200/80 light:hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 light:text-slate-700 group-hover:text-emerald-400 transition-colors truncate">
                    {index.name}
                  </span>
                  {/* Mini sparkline */}
                  <svg className="w-12 h-5 overflow-visible shrink-0" viewBox="0 0 48 20">
                    <polyline
                      fill="none"
                      stroke={isPositive ? '#10B981' : '#F43F5E'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                  </svg>
                </div>

                <div className="mt-1 flex items-baseline justify-between gap-1">
                  <span className={`font-mono tabular-nums text-sm font-bold transition-colors ${
                    tick === 'up' ? 'text-emerald-400' : tick === 'down' ? 'text-rose-400' : 'text-white light:text-slate-900'
                  }`}>
                    {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div
                    className={`flex items-center text-[11px] font-mono tabular-nums font-semibold ${
                      isPositive ? 'text-emerald-400 light:text-emerald-600' : 'text-rose-400 light:text-rose-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
