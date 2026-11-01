import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EasyBackButton } from '../components/EasyBackButton';
import { 
  Bookmark, 
  Star, 
  Plus, 
  Search, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight 
} from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const { 
    watchlists, 
    activeWatchlistId, 
    setActiveWatchlistId, 
    createWatchlist, 
    toggleWatchlist, 
    stocks, 
    usStocks, 
    openOrderModal, 
    navigateTo,
    recentTicks 
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [newWlName, setNewWlName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];
  const allStocks = [...stocks, ...usStocks];

  const watchlistStocks = allStocks.filter(s => activeWatchlist?.stockIds.includes(s.id));

  const searchResults = searchQuery
    ? allStocks.filter(s => 
        (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !activeWatchlist?.stockIds.includes(s.id)
      )
    : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWlName.trim()) return;
    createWatchlist(newWlName.trim());
    setNewWlName('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Easy Back Navigation */}
      <EasyBackButton showBreadcrumb={true} currentPageName="Watchlist" />

      {/* Header & Watchlist Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 light:border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white light:text-slate-900">
              Watchlists
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Track your favorite stocks, ETFs, and market movers with real-time updates
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white light:bg-slate-100 light:text-slate-800 light:hover:bg-slate-200 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Watchlist</span>
        </button>
      </div>

      {/* Watchlist Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {watchlists.map(wl => (
          <button
            key={wl.id}
            onClick={() => setActiveWatchlistId(wl.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeWatchlistId === wl.id
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200'
            }`}
          >
            <span>{wl.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeWatchlistId === wl.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 light:bg-slate-200 text-slate-400 light:text-slate-600'
            }`}>
              {wl.stockIds.length}
            </span>
          </button>
        ))}
      </div>

      {/* Quick Add Stock Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={`Add stocks to "${activeWatchlist?.name}"... (e.g. Reliance, TCS, Zomato)`}
          className="w-full h-10 pl-10 pr-4 rounded-xl text-xs bg-[#161b24] light:bg-white border border-slate-800 light:border-slate-200 text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
        />

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-12 left-0 right-0 z-20 rounded-xl border border-slate-700 bg-[#161b24] shadow-2xl p-2 max-h-56 overflow-y-auto space-y-1">
            {searchResults.map(stock => (
              <div
                key={stock.id}
                onClick={() => {
                  toggleWatchlist(stock.id);
                  setSearchQuery('');
                }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer text-xs"
              >
                <div>
                  <span className="font-bold text-white mr-2">{stock.symbol}</span>
                  <span className="text-slate-400">{stock.name}</span>
                </div>
                <button className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to List</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Watchlist Table */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
        {watchlistStocks.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm text-slate-400">No stocks in this watchlist yet.</p>
            <p className="text-xs text-slate-500">Search above or browse Explore to add stocks.</p>
          </div>
        ) : (
          <>
            {/* Mobile Native Cards View */}
            <div className="block md:hidden space-y-2.5">
            {watchlistStocks.map(stock => {
              const isPositive = stock.change >= 0;
              const tick = recentTicks[stock.id];

              return (
                <div 
                  key={stock.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    tick === 'up'
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : tick === 'down'
                      ? 'border-rose-500/60 bg-rose-500/10'
                      : 'border-slate-800 bg-slate-900/60 light:bg-slate-50 light:border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div 
                      onClick={() => navigateTo('stock-detail', { stockId: stock.id })}
                      className="cursor-pointer group font-sans flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white light:text-slate-900 group-hover:text-emerald-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 light:bg-slate-200 text-slate-400">
                          {stock.exchange}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{stock.name}</p>
                    </div>

                    <div className="text-right font-mono">
                      <span className={`font-bold text-sm block ${
                        tick === 'up' ? 'text-emerald-400' : tick === 'down' ? 'text-rose-400' : 'text-white light:text-slate-900'
                      }`}>
                        ₹{stock.price.toFixed(2)}
                      </span>
                      <span className={`text-[11px] font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 light:border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleWatchlist(stock.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 font-sans">
                      <button
                        onClick={() => openOrderModal(stock, 'BUY')}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                      >
                        BUY
                      </button>
                      <button
                        onClick={() => openOrderModal(stock, 'SELL')}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        SELL
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans">
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3 text-right">Price</th>
                  <th className="py-3 px-3 text-right">Day Change</th>
                  <th className="py-3 px-3 text-right hidden sm:table-cell">52W Range</th>
                  <th className="py-3 px-3 text-right hidden md:table-cell">Market Cap</th>
                  <th className="py-3 px-3 text-center font-sans">Quick Trade</th>
                  <th className="py-3 px-3 text-center">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {watchlistStocks.map(stock => {
                  const isPositive = stock.change >= 0;
                  const tick = recentTicks[stock.id];

                  return (
                    <tr key={stock.id} className={`transition-colors ${
                      tick === 'up'
                        ? 'bg-emerald-500/10'
                        : tick === 'down'
                        ? 'bg-rose-500/10'
                        : 'hover:bg-slate-800/40'
                    }`}>
                      <td className="py-3.5 px-3">
                        <div 
                          onClick={() => navigateTo('stock-detail', { stockId: stock.id })}
                          className="cursor-pointer group font-sans"
                        >
                          <span className="font-bold text-white light:text-slate-900 group-hover:text-emerald-400 transition-colors block">
                            {stock.symbol}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{stock.name}</span>
                        </div>
                      </td>

                      <td className={`py-3.5 px-3 text-right font-bold transition-colors ${
                        tick === 'up' ? 'text-emerald-400' : tick === 'down' ? 'text-rose-400' : 'text-white light:text-slate-900'
                      }`}>
                        ₹{stock.price.toFixed(2)}
                      </td>

                      <td className={`py-3.5 px-3 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </td>

                      <td className="py-3.5 px-3 text-right text-slate-400 text-[11px] hidden sm:table-cell">
                        ₹{stock.yearLow} - ₹{stock.yearHigh}
                      </td>

                      <td className="py-3.5 px-3 text-right text-slate-300 hidden md:table-cell">
                        {stock.marketCap}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-sans">
                          <button
                            onClick={() => openOrderModal(stock, 'BUY')}
                            className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                          >
                            BUY
                          </button>
                          <button
                            onClick={() => openOrderModal(stock, 'SELL')}
                            className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          >
                            SELL
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => toggleWatchlist(stock.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove from watchlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>

      {/* New Watchlist Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-sm rounded-2xl border shadow-2xl p-5 bg-[#161b22] border-slate-700 text-white"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-base mb-3">Create New Watchlist</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={newWlName}
                onChange={e => setNewWlName(e.target.value)}
                placeholder="e.g. Dividend Stocks, EVs, Momentum"
                className="w-full h-10 px-3 rounded-xl text-xs bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950"
                >
                  Create Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
