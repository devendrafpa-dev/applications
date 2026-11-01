import React from 'react';
import { useApp } from '../context/AppContext';
import { PageType } from '../types';
import { 
  TrendingUp, 
  PieChart, 
  Layers, 
  Sparkles, 
  Globe, 
  Calculator,
  Receipt
} from 'lucide-react';

export const SubNav: React.FC = () => {
  const { activePage, navigateTo } = useApp();

  const categories: { id: PageType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'stocks', label: 'Stocks', icon: TrendingUp },
    { id: 'mutual-funds', label: 'Mutual Funds', icon: PieChart },
    { id: 'transactions', label: 'Transaction History', icon: Receipt },
    { id: 'fno', label: 'F&O', icon: Layers },
    { id: 'ipo', label: 'IPO', icon: Sparkles },
    { id: 'us-stocks', label: 'US Stocks', icon: Globe },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
  ];

  return (
    <div className="w-full border-b bg-[#0d1117] border-slate-800 light:bg-slate-50 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activePage === cat.id || 
              (cat.id === 'stocks' && activePage === 'stock-detail') ||
              (cat.id === 'mutual-funds' && activePage === 'fund-detail');

            return (
              <button
                key={cat.id}
                onClick={() => navigateTo(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 light:bg-purple-100 light:text-purple-800 light:border-purple-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400 light:text-purple-700' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
