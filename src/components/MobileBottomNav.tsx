import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  TrendingUp, 
  PieChart, 
  Receipt,
  Bookmark
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activePage, navigateTo, portfolio, stockTransactions, mfTransactions } = useApp();

  const totalHoldingsCount = portfolio.length + 2; // Stocks + 2 active MFs
  const totalTxCount = stockTransactions.length + mfTransactions.length;

  const isExploreActive = ['stocks', 'stock-detail', 'fno', 'ipo', 'us-stocks', 'calculators'].includes(activePage);
  const isMfActive = ['mutual-funds', 'fund-detail'].includes(activePage);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0e14]/95 backdrop-blur-lg border-t border-purple-900/40 text-slate-400 light:bg-white/95 light:border-slate-200 light:text-slate-600 px-1 py-1 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        
        {/* 1. Markets / Discover */}
        <button
          onClick={() => navigateTo('stocks')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isExploreActive
              ? 'text-purple-400 light:text-purple-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Markets</span>
        </button>

        {/* 2. Holdings (Portfolio) */}
        <button
          onClick={() => navigateTo('portfolio')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 rounded-xl relative transition-all ${
            activePage === 'portfolio'
              ? 'text-purple-400 light:text-purple-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <TrendingUp className="w-5 h-5" />
            <span className="absolute -top-1 -right-3 px-1 min-w-[14px] h-3.5 rounded-full bg-purple-600 text-white font-mono text-[9px] flex items-center justify-center font-bold">
              {totalHoldingsCount}
            </span>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Holdings</span>
        </button>

        {/* 3. Mutual Funds (Direct SIPs) */}
        <button
          onClick={() => navigateTo('mutual-funds')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 rounded-xl relative transition-all ${
            isMfActive
              ? 'text-teal-400 light:text-teal-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <PieChart className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-teal-400" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Direct MFs</span>
        </button>

        {/* 4. Transactions Passbook */}
        <button
          onClick={() => navigateTo('transactions')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 rounded-xl relative transition-all ${
            activePage === 'transactions'
              ? 'text-purple-400 light:text-purple-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Receipt className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[9px] flex items-center justify-center font-bold">
              {totalTxCount}
            </span>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Passbook</span>
        </button>

        {/* 5. Watchlist */}
        <button
          onClick={() => navigateTo('watchlist')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activePage === 'watchlist'
              ? 'text-purple-400 light:text-purple-600 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Watchlist</span>
        </button>

      </div>
    </nav>
  );
};
