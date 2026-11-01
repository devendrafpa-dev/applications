import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MutualFund } from '../types';
import { 
  PieChart, 
  TrendingUp, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Calculator, 
  ChevronRight, 
  Zap,
  ArrowRight,
  Receipt,
  Calendar
} from 'lucide-react';

export const MutualFundsExplore: React.FC = () => {
  const { funds, navigateTo, startSip, openTransactionsForCategory, accountProfile } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeReturnTab, setActiveReturnTab] = useState<'3Y' | '1Y' | '5Y'>('3Y');

  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [returnRate, setReturnRate] = useState<number>(14);
  const [sipYears, setSipYears] = useState<number>(10);

  // SIP Math: M = P * [ (1 + i)^n - 1 ] * (1 + i) / i
  const monthlyRate = returnRate / 12 / 100;
  const totalMonths = sipYears * 12;
  const totalInvested = sipAmount * totalMonths;
  const totalCorpus = sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const wealthGained = totalCorpus - totalInvested;
  const gainRatio = (wealthGained / totalCorpus) * 100;

  const filteredFunds = categoryFilter === 'All'
    ? funds
    : funds.filter(f => f.category === categoryFilter);

  const categories = ['All', 'Small Cap', 'Flexi Cap', 'Index Fund', 'ELSS Tax Saver', 'Large & Mid Cap'];

  return (
    <div className="space-y-8 pb-16">

      {/* Account Mandate & MF Transaction History Header Bar */}
      <div className="p-4 rounded-2xl border border-teal-900/40 bg-gradient-to-r from-teal-950/30 via-slate-900/80 to-[#121620] light:from-teal-50 light:to-white light:border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md">
            MF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white light:text-slate-900">Direct Mutual Funds Portfolio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">ZERO COMMISSION</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Investor: <strong>{accountProfile.name}</strong></span>
              <span>•</span>
              <span className="text-teal-400 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                SIP Auto-Debit: {accountProfile.sipDebitDay}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openTransactionsForCategory('mutual-funds')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all shadow-xs"
            title="View all mutual fund investment dates, NAVs, and units"
          >
            <Receipt className="w-3.5 h-3.5 text-purple-400" />
            <span>MF Transactions (Date & NAV)</span>
          </button>
        </div>
      </div>
      
      {/* Popular Collections Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 light:text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-teal-400" />
              Popular Mutual Fund Collections
            </h2>
            <p className="text-xs text-slate-400 light:text-slate-500">
              Curated funds based on risk tolerance, return history, and tax efficiency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'High Return', desc: 'Up to 48% p.a.', cat: 'Small Cap', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'SIP with ₹500', desc: 'Start small', cat: 'Index Fund', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: 'Tax Saving (ELSS)', desc: 'Save up to ₹46,800', cat: 'ELSS Tax Saver', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Large & Mid Cap', desc: 'Balanced growth', cat: 'Large & Mid Cap', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'Flexi Cap', desc: 'All weather fund', cat: 'Flexi Cap', color: 'text-teal-400', bg: 'bg-teal-500/10' },
          ].map(col => (
            <div
              key={col.label}
              onClick={() => setCategoryFilter(col.cat)}
              className={`p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-[#161b24] hover:bg-[#1c222e] light:bg-white light:border-slate-200 cursor-pointer transition-all group ${
                categoryFilter === col.cat ? 'ring-2 ring-emerald-500/50 border-emerald-500/50' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${col.bg} ${col.color} flex items-center justify-center font-bold text-xs mb-2`}>
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-200 light:text-slate-900 group-hover:text-teal-400 transition-colors">
                {col.label}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{col.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive SIP Wealth Calculator Section */}
      <section className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#161b24] to-[#121926] light:from-white light:to-slate-50 light:border-slate-200 shadow-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white light:text-slate-900">
              Interactive SIP Wealth Estimator
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-500">
              Calculate how small monthly investments compound exponentially over time
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Monthly Investment Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Monthly Investment</span>
                <span className="font-mono tabular-nums font-bold text-base text-emerald-400">
                  ₹{sipAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={sipAmount}
                onChange={e => setSipAmount(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹500</span>
                <span>₹25,000</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Expected Return Rate (p.a)</span>
                <span className="font-mono tabular-nums font-bold text-base text-teal-400">
                  {returnRate}%
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="30"
                step="0.5"
                value={returnRate}
                onChange={e => setReturnRate(Number(e.target.value))}
                className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>6% (FD)</span>
                <span>14% (Index)</span>
                <span>30% (High Alpha)</span>
              </div>
            </div>

            {/* Time Period */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Time Period</span>
                <span className="font-mono tabular-nums font-bold text-base text-cyan-400">
                  {sipYears} Years ({totalMonths} Months)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={sipYears}
                onChange={e => setSipYears(Number(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Results Visualizer (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Future Corpus</span>
              <span className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 block mt-1">
                ₹{Math.round(totalCorpus).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-1">
              <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden">
                <div
                  style={{ width: `${100 - gainRatio}%` }}
                  className="h-full bg-slate-600"
                  title="Invested Amount"
                />
                <div
                  style={{ width: `${gainRatio}%` }}
                  className="h-full bg-emerald-500"
                  title="Wealth Gained"
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Invested: ₹{Math.round(totalInvested).toLocaleString('en-IN')}</span>
                <span className="text-emerald-400 font-bold">Gains: +₹{Math.round(wealthGained).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 light:border-slate-200">
              <button
                onClick={() => startSip(funds[0], sipAmount)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Start SIP with ₹{sipAmount.toLocaleString('en-IN')}/mo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Funds Screener Table */}
      <section className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 light:border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 light:text-slate-900">
              All Mutual Funds ({filteredFunds.length})
            </h3>
            <p className="text-xs text-slate-400">Direct growth plans with zero distributor commissions</p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800/60 light:bg-slate-100 text-slate-400 light:text-slate-600 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Screener Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 font-semibold">
                <th className="py-3 px-3">Fund Scheme</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Rating</th>
                <th className="py-3 px-3 text-right">NAV</th>
                <th className="py-3 px-3 text-right">3Y Return</th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">AUM</th>
                <th className="py-3 px-3 text-right hidden md:table-cell">Exp. Ratio</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-100">
              {filteredFunds.map((fund) => (
                <tr
                  key={fund.id}
                  onClick={() => navigateTo('fund-detail', { fundId: fund.id })}
                  className="hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-100 light:text-slate-900 group-hover:text-emerald-400 transition-colors">
                      {fund.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{fund.amc}</p>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-[11px] text-slate-300 light:text-slate-700 font-medium">
                      {fund.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[11px]">
                      <span>{fund.rating}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-white light:text-slate-900">
                    ₹{fund.nav.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-emerald-400 light:text-emerald-600">
                    +{fund.return3Y}%
                  </td>

                  <td className="py-3.5 px-3 text-right text-slate-300 light:text-slate-700 font-mono hidden sm:table-cell">
                    {fund.aum}
                  </td>

                  <td className="py-3.5 px-3 text-right text-slate-400 font-mono hidden md:table-cell">
                    {fund.expenseRatio}%
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startSip(fund, fund.minSip);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-xs"
                    >
                      Start SIP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
