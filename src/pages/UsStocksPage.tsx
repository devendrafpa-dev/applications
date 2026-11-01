import React from 'react';
import { useApp } from '../context/AppContext';
import { EasyBackButton } from '../components/EasyBackButton';
import { Globe, DollarSign, ArrowUpRight, ShieldCheck, Zap, Receipt } from 'lucide-react';

export const UsStocksPage: React.FC = () => {
  const { usStocks, navigateTo, openOrderModal, openTransactionsForCategory } = useApp();

  return (
    <div className="space-y-6 pb-20">
      
      {/* Easy Back Navigation & Transaction History */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <EasyBackButton showBreadcrumb={true} currentPageName="US Equities" />

        <button
          onClick={() => openTransactionsForCategory('stocks')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all shadow-xs"
          title="View all stock investment transactions"
        >
          <Receipt className="w-3.5 h-3.5 text-purple-400" />
          <span>Stock Transactions</span>
        </button>
      </div>
      
      {/* Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#161b24] via-[#15233e] to-[#121620] light:from-white light:to-slate-50 light:border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white light:text-slate-900">
              Invest in US Stocks
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Own shares of Apple, Nvidia, Microsoft, and Tesla with zero commission & fractional shares
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            USD / INR: ₹84.15
          </div>
        </div>
      </div>

      {/* US Tech Giants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {usStocks.map(stock => {
          const isPositive = stock.change >= 0;

          return (
            <div
              key={stock.id}
              onClick={() => navigateTo('stock-detail', { stockId: stock.id })}
              className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] hover:bg-[#1c222e] hover:border-slate-700 light:bg-white light:border-slate-200 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white light:text-slate-900 group-hover:text-blue-400 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                        NASDAQ
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{stock.name}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 light:bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-300">
                    {stock.symbol.slice(0, 2)}
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-xl font-mono tabular-nums font-bold text-white light:text-slate-900">
                    ${stock.price.toFixed(2)}
                  </span>
                  <span className={`text-xs font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-slate-400 text-[11px] font-mono pt-3 border-t border-slate-800 light:border-slate-100">
                  <span>M-Cap: {stock.marketCap}</span>
                  <span className="text-right">P/E: {stock.pe}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOrderModal(stock, 'BUY');
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-white transition-all shadow-sm"
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOrderModal(stock, 'SELL');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  SELL
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl border border-slate-800 bg-[#161b24] text-xs text-slate-400 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          Regulated under RBI LRS (Liberalised Remittance Scheme) with SIPC insurance up to $500,000 per demat account.
        </span>
      </div>

    </div>
  );
};
