import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Stock } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ArrowUpRight, 
  ChevronRight, 
  Filter, 
  Sparkles,
  Zap,
  ArrowRight,
  Receipt
} from 'lucide-react';

export const StocksExplore: React.FC = () => {
  const { 
    stocks, 
    navigateTo, 
    openOrderModal, 
    toggleWatchlist, 
    isInWatchlist, 
    recentTicks,
    openTransactionsForCategory 
  } = useApp();
  
  const [capFilter, setCapFilter] = useState<'All' | 'Large Cap' | 'Mid Cap'>('All');
  const [gainersTab, setGainersTab] = useState<'gainers' | 'losers'>('gainers');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // Sectors list
  const sectors = ['All', 'Banking & Financials', 'IT & Software', 'Energy & Petrochemicals', 'Automobile', 'Consumer Tech & Internet', 'Renewable Energy'];

  const trendingStocks = stocks.filter(s => s.isTrending);

  // Top gainers and losers
  const sortedGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const sortedLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent);

  const displayList = gainersTab === 'gainers' ? sortedGainers : sortedLosers;
  const filteredList = displayList.filter(s => {
    const matchesCap = capFilter === 'All' || s.category === capFilter;
    const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
    return matchesCap && matchesSector;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Section Header with Quick Holdings & Transaction History Access */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Most Traded on Upstox
            </h2>
            <p className="text-xs text-slate-400 light:text-slate-500">
              High volume equities actively accumulated by Upstox retail traders today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openTransactionsForCategory('stocks')}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all flex items-center gap-1.5"
              title="View all stock investment dates, execution prices, and amounts"
            >
              <Receipt className="w-3.5 h-3.5 text-purple-400" />
              <span>Stock Transactions</span>
            </button>
            <button
              onClick={() => navigateTo('portfolio')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 light:text-emerald-600 flex items-center gap-1 group px-2 py-1"
            >
              <span>View Holdings</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingStocks.map((stock) => {
            const inWl = isInWatchlist(stock.id);
            const isPositive = stock.change >= 0;
            const tick = recentTicks[stock.id];

            return (
              <div
                key={stock.id}
                onClick={() => navigateTo('stock-detail', { stockId: stock.id })}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  tick === 'up'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : tick === 'down'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-800 bg-[#161b24] hover:bg-[#1c222e] hover:border-slate-700 light:bg-white light:border-slate-200 light:hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    {/* Symbol & Name */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100 light:text-slate-900 group-hover:text-emerald-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 light:bg-slate-100 text-slate-400">
                          {stock.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{stock.name}</p>
                    </div>

                    {/* Watchlist Star */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(stock.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        inWl 
                          ? 'text-amber-400 bg-amber-400/10' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 light:hover:bg-slate-100'
                      }`}
                      title={inWl ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Price info */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className={`text-lg font-mono tabular-nums font-bold transition-colors ${
                        tick === 'up' ? 'text-emerald-400' : tick === 'down' ? 'text-rose-400' : 'text-white light:text-slate-900'
                      }`}>
                        ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className={`text-xs font-mono tabular-nums font-bold flex items-center gap-0.5 ${
                      isPositive ? 'text-emerald-400 light:text-emerald-600' : 'text-rose-400 light:text-rose-600'
                    }`}>
                      {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                {/* Card Quick Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 light:border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">Vol: {stock.volume}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openOrderModal(stock, 'BUY');
                    }}
                    className="px-3 py-1 rounded-lg font-bold text-xs bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 light:bg-emerald-50 light:text-emerald-700 light:hover:bg-emerald-500 light:hover:text-white transition-all"
                  >
                    BUY
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Gainers & Top Losers with Filter Bar */}
      <section className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 light:border-slate-100 pb-4">
          
          {/* Gainers / Losers Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-200">
            <button
              onClick={() => setGainersTab('gainers')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                gainersTab === 'gainers'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Top Gainers
            </button>
            <button
              onClick={() => setGainersTab('losers')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                gainersTab === 'losers'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 light:hover:text-slate-800'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Top Losers
            </button>
          </div>

          {/* Market Cap Segments */}
          <div className="flex items-center gap-1 text-xs">
            {(['All', 'Large Cap', 'Mid Cap'] as const).map(cap => (
              <button
                key={cap}
                onClick={() => setCapFilter(cap)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  capFilter === cap
                    ? 'bg-slate-800 text-white light:bg-slate-900 light:text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {cap}
              </button>
            ))}
          </div>

        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Sector:</span>
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedSector === sec
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/60 light:bg-slate-100 text-slate-400 light:text-slate-600 hover:bg-slate-800'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 font-semibold">
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3 text-right">Market Price</th>
                <th className="py-3 px-3 text-right">Day Change</th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">Market Cap</th>
                <th className="py-3 px-3 text-right hidden md:table-cell">P/E Ratio</th>
                <th className="py-3 px-3 text-right hidden lg:table-cell">52W Range</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-100">
              {filteredList.map((stock) => {
                const isPositive = stock.change >= 0;
                const inWl = isInWatchlist(stock.id);
                const tick = recentTicks[stock.id];

                return (
                  <tr
                    key={stock.id}
                    onClick={() => navigateTo('stock-detail', { stockId: stock.id })}
                    className={`transition-colors cursor-pointer group ${
                      tick === 'up'
                        ? 'bg-emerald-500/10'
                        : tick === 'down'
                        ? 'bg-rose-500/10'
                        : 'hover:bg-slate-800/40 light:hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(stock.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            inWl ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <div>
                          <p className="font-bold text-slate-100 light:text-slate-900 group-hover:text-emerald-400 transition-colors">
                            {stock.symbol}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{stock.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className={`py-3.5 px-3 text-right font-mono tabular-nums font-bold transition-colors ${
                      tick === 'up' ? 'text-emerald-400' : tick === 'down' ? 'text-rose-400' : 'text-white light:text-slate-900'
                    }`}>
                      ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold">
                      <span className={`inline-block ${isPositive ? 'text-emerald-400 light:text-emerald-600' : 'text-rose-400 light:text-rose-600'}`}>
                        {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right text-slate-300 light:text-slate-700 font-mono hidden sm:table-cell">
                      {stock.marketCap}
                    </td>

                    <td className="py-3.5 px-3 text-right text-slate-300 light:text-slate-700 font-mono hidden md:table-cell">
                      {stock.pe}
                    </td>

                    <td className="py-3.5 px-3 text-right text-slate-400 font-mono text-[11px] hidden lg:table-cell">
                      <span>₹{stock.yearLow} - ₹{stock.yearHigh}</span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderModal(stock, 'BUY');
                          }}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                        >
                          BUY
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderModal(stock, 'SELL');
                          }}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 light:bg-slate-200 light:text-slate-800 transition-colors"
                        >
                          SELL
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Groww Features Promo Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => navigateTo('fno')}
          className="p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#161b24] to-[#1a2333] light:from-white light:to-slate-50 light:border-slate-200 cursor-pointer hover:border-slate-700 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white light:text-slate-900 group-hover:text-emerald-400 transition-colors">
            F&O Trading Terminal
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-1 leading-relaxed">
            Live Nifty & Bank Nifty options chain with Greeks, open interest, and instantaneous execution.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <span>Open Option Chain</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => navigateTo('mutual-funds')}
          className="p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#161b24] to-[#1a2333] light:from-white light:to-slate-50 light:border-slate-200 cursor-pointer hover:border-slate-700 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white light:text-slate-900 group-hover:text-teal-400 transition-colors">
            Direct Mutual Funds
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-1 leading-relaxed">
            Zero commission direct mutual funds with 1-click SIP, Tax saving ELSS, and automated mandates.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal-400">
            <span>Explore Top Funds</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => navigateTo('ipo')}
          className="p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#161b24] to-[#1a2333] light:from-white light:to-slate-50 light:border-slate-200 cursor-pointer hover:border-slate-700 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white light:text-slate-900 group-hover:text-amber-400 transition-colors">
            Upcoming IPOs & GMP
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-1 leading-relaxed">
            Track Swiggy, NTPC Green & live subscription numbers. Apply in 2 clicks with your UPI ID.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-400">
            <span>Check Active IPOs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

    </div>
  );
};
