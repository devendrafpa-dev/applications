import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, TrendingUp, PieChart, Sparkles, Globe, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, stocks, usStocks, funds, ipos, navigateTo } = useApp();
  const [query, setQuery] = useState('');

  // Handle Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredStocks = stocks.filter(
    s => s.name.toLowerCase().includes(query.toLowerCase()) || s.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUS = usStocks.filter(
    s => s.name.toLowerCase().includes(query.toLowerCase()) || s.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFunds = funds.filter(
    f => f.name.toLowerCase().includes(query.toLowerCase()) || f.amc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredIpos = ipos.filter(
    i => i.companyName.toLowerCase().includes(query.toLowerCase()) || i.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-20 p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden bg-[#161b22] border-slate-700/80 text-slate-100 light:bg-white light:border-slate-200 light:text-slate-900 max-h-[88vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 light:border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Upstox Pro: stocks, F&O contracts, mutual funds, ETFs, IPOs..."
            className="w-full bg-transparent text-base font-medium placeholder-slate-500 focus:outline-none text-white light:text-slate-900"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 light:bg-slate-100 text-slate-400 border border-slate-700 light:border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Indian Stocks */}
          {filteredStocks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Stocks ({filteredStocks.length})
              </div>
              <div className="space-y-1">
                {filteredStocks.slice(0, 5).map(stock => (
                  <div
                    key={stock.id}
                    onClick={() => {
                      navigateTo('stock-detail', { stockId: stock.id });
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 light:hover:bg-slate-100 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs group-hover:text-emerald-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[11px] text-slate-400 font-sans">
                          {stock.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{stock.sector}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono tabular-nums text-xs font-bold block">
                        ₹{stock.price.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-mono tabular-nums font-semibold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mutual Funds */}
          {filteredFunds.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <PieChart className="w-3.5 h-3.5 text-teal-400" />
                Mutual Funds ({filteredFunds.length})
              </div>
              <div className="space-y-1">
                {filteredFunds.slice(0, 4).map(fund => (
                  <div
                    key={fund.id}
                    onClick={() => {
                      navigateTo('fund-detail', { fundId: fund.id });
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 light:hover:bg-slate-100 cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-xs group-hover:text-teal-400 transition-colors">
                        {fund.name}
                      </p>
                      <span className="text-[11px] text-slate-400">{fund.category} · {fund.amc}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono tabular-nums text-xs font-bold text-emerald-400 block">
                        {fund.return3Y}% (3Y)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        NAV ₹{fund.nav.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* US Stocks */}
          {filteredUS.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                US Tech Stocks
              </div>
              <div className="space-y-1">
                {filteredUS.slice(0, 3).map(stock => (
                  <div
                    key={stock.id}
                    onClick={() => {
                      navigateTo('stock-detail', { stockId: stock.id });
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 light:hover:bg-slate-100 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs group-hover:text-blue-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {stock.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono tabular-nums text-xs font-bold block">
                        ${stock.price.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-mono tabular-nums font-semibold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IPOs */}
          {filteredIpos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                IPOs
              </div>
              <div className="space-y-1">
                {filteredIpos.slice(0, 2).map(ipo => (
                  <div
                    key={ipo.id}
                    onClick={() => {
                      navigateTo('ipo');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 light:hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-bold text-xs">{ipo.companyName}</p>
                      <span className="text-[11px] text-slate-400">Issue: {ipo.priceRange}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400 block">{ipo.status}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{ipo.expectedListingGain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredStocks.length === 0 && filteredFunds.length === 0 && filteredUS.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No results found for "{query}". Try searching "Reliance", "Zomato", "Quant", or "Nifty".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-800 light:border-slate-200 bg-slate-900/60 light:bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press <strong>Enter</strong> to select</span>
          <span>Upstox Pro Universal Search</span>
        </div>
      </div>
    </div>
  );
};
