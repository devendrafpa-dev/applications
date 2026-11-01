import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EasyBackButton } from '../components/EasyBackButton';
import { OPTION_CHAIN_DATA } from '../data/mockData';
import { Layers, ChevronDown, Activity, Info, Zap, ShieldCheck, Receipt } from 'lucide-react';
import { Stock } from '../types';

export const OptionChainPage: React.FC = () => {
  const { openOrderModal, openTransactionsForCategory } = useApp();

  const [selectedUnderlying, setSelectedUnderlying] = useState<'NIFTY' | 'BANKNIFTY' | 'FINNIFTY'>('NIFTY');
  const [expiry, setExpiry] = useState<string>('31-Oct-2026 (Weekly)');

  const underlyingSpot = {
    NIFTY: 24482.30,
    BANKNIFTY: 51920.45,
    FINNIFTY: 23895.10,
  }[selectedUnderlying];

  const spotChange = selectedUnderlying === 'BANKNIFTY' ? -98.20 : 142.15;
  const spotChangePct = selectedUnderlying === 'BANKNIFTY' ? -0.19 : 0.58;

  // Handle trade on strike
  const handleTradeOption = (strike: number, type: 'CE' | 'PE', ltp: number) => {
    const syntheticStock: Stock = {
      id: `opt-${selectedUnderlying}-${strike}-${type}`,
      symbol: `${selectedUnderlying} ${strike} ${type}`,
      name: `${selectedUnderlying} ${strike} ${type === 'CE' ? 'CALL Option' : 'PUT Option'}`,
      price: ltp,
      change: 8.50,
      changePercent: 5.2,
      marketCap: '₹0 Cr',
      category: 'Large Cap',
      sector: 'Derivatives',
      pe: 0,
      pb: 0,
      industryPe: 0,
      debtToEquity: 0,
      roe: 0,
      eps: 0,
      dividendYield: 0,
      bookValue: 0,
      dayLow: ltp * 0.8,
      dayHigh: ltp * 1.3,
      yearLow: ltp * 0.5,
      yearHigh: ltp * 2.0,
      volume: '150K',
      open: ltp * 0.95,
      prevClose: ltp * 0.95,
      about: `Standard ${selectedUnderlying} weekly options contract expiring ${expiry}`,
      ceo: 'NSE Clearing Ltd',
      founded: '1992',
      exchange: 'NSE',
      chartData: {
        '1D': [ltp * 0.9, ltp * 0.95, ltp * 0.98, ltp],
        '1W': [ltp * 0.8, ltp * 0.9, ltp],
        '1M': [ltp * 0.5, ltp],
        '1Y': [ltp],
        '5Y': [ltp],
      },
      financials: { quarters: [], revenue: [], profit: [] },
      shareholding: { promoters: 0, retail: 100, fii: 0, dii: 0 },
    };

    openOrderModal(syntheticStock, 'BUY', 'Intraday');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Easy Back Navigation & Transaction History */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <EasyBackButton showBreadcrumb={true} currentPageName="Option Chain Terminal" />

        <button
          onClick={() => openTransactionsForCategory('fno')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all shadow-xs"
          title="View all derivative contract execution transactions"
        >
          <Receipt className="w-3.5 h-3.5 text-purple-400" />
          <span>F&O Transactions</span>
        </button>
      </div>

      {/* Top Header & Controls */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white light:text-slate-900">
              Upstox Pro Option Chain Terminal
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time derivative analytics, Open Interest buildups, and 1-click execution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Underlying Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-200">
            {(['NIFTY', 'BANKNIFTY', 'FINNIFTY'] as const).map(u => (
              <button
                key={u}
                onClick={() => setSelectedUnderlying(u)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedUnderlying === u
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Expiry Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Expiry:</span>
            <select
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-200 text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
            >
              <option value="31-Oct-2026 (Weekly)">31 Oct 2026 (Weekly)</option>
              <option value="07-Nov-2026">07 Nov 2026</option>
              <option value="28-Nov-2026 (Monthly)">28 Nov 2026 (Monthly)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spot Price & PCR Barometer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200">
          <span className="text-xs text-slate-400 block font-medium">{selectedUnderlying} Spot Price</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono tabular-nums font-bold text-white light:text-slate-900">
              {underlyingSpot.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-mono font-bold ${spotChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {spotChange >= 0 ? '+' : ''}{spotChange.toFixed(2)} ({spotChangePct}%)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200">
          <span className="text-xs text-slate-400 block font-medium">PCR (Put / Call Ratio)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono tabular-nums font-bold text-emerald-400">
              1.18
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
              Bullish Bias
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200">
          <span className="text-xs text-slate-400 block font-medium">Max Pain Strike</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono tabular-nums font-bold text-cyan-400">
              24,500
            </span>
            <span className="text-xs text-slate-400">
              Highest OI concentration
            </span>
          </div>
        </div>
      </div>

      {/* Option Chain Grid */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm overflow-hidden space-y-4">
        
        {/* Call vs Put Header Indicator */}
        <div className="grid grid-cols-2 text-center text-xs font-bold py-2 border-b border-slate-800 light:border-slate-200">
          <div className="text-emerald-400 bg-emerald-500/10 py-1 rounded-l-lg">
            CALLS (CE) - Bullish Contracts
          </div>
          <div className="text-rose-400 bg-rose-500/10 py-1 rounded-r-lg">
            PUTS (PE) - Bearish Contracts
          </div>
        </div>

        <div className="sm:hidden text-[10px] text-slate-500 text-center font-mono">
          ← Swipe horizontally to view full Call / Strike / Put matrix →
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[580px] text-xs font-mono text-center">
            <thead>
              <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 text-[11px]">
                {/* Calls Headers */}
                <th className="py-2.5 px-2">OI</th>
                <th className="py-2.5 px-2">Chng OI</th>
                <th className="py-2.5 px-2 hidden sm:table-cell">IV</th>
                <th className="py-2.5 px-2 text-emerald-400">LTP</th>
                <th className="py-2.5 px-2">Call Buy</th>

                {/* Strike header */}
                <th className="py-2.5 px-3 bg-slate-900 light:bg-slate-200 text-white light:text-slate-900 font-bold">
                  STRIKE
                </th>

                {/* Puts Headers */}
                <th className="py-2.5 px-2">Put Buy</th>
                <th className="py-2.5 px-2 text-rose-400">LTP</th>
                <th className="py-2.5 px-2 hidden sm:table-cell">IV</th>
                <th className="py-2.5 px-2">Chng OI</th>
                <th className="py-2.5 px-2">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 light:divide-slate-100">
              {OPTION_CHAIN_DATA.map((row) => {
                const isATM = row.strikePrice === 24500;

                return (
                  <tr
                    key={row.strikePrice}
                    className={`transition-colors hover:bg-slate-800/40 light:hover:bg-slate-50 ${
                      isATM ? 'bg-emerald-500/10 light:bg-emerald-50 font-bold' : ''
                    }`}
                  >
                    {/* Calls data */}
                    <td className="py-3 px-2 text-slate-300 light:text-slate-700">
                      {(row.callOI / 100000).toFixed(1)}L
                    </td>
                    <td className={`py-3 px-2 ${row.callChngOI >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.callChngOI >= 0 ? '+' : ''}{(row.callChngOI / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-2 text-slate-400 hidden sm:table-cell">{row.callIv}%</td>
                    <td className="py-3 px-2 font-bold text-emerald-400">
                      ₹{row.callLtp.toFixed(2)}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleTradeOption(row.strikePrice, 'CE', row.callLtp)}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-[10px] font-bold transition-all"
                      >
                        BUY
                      </button>
                    </td>

                    {/* Strike Center Column */}
                    <td className="py-3 px-3 bg-slate-900/90 light:bg-slate-200 font-bold text-white light:text-slate-900 relative">
                      {row.strikePrice}
                      {isATM && (
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] bg-emerald-500 text-slate-950 px-1 rounded font-bold uppercase">
                          ATM
                        </span>
                      )}
                    </td>

                    {/* Puts data */}
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleTradeOption(row.strikePrice, 'PE', row.putLtp)}
                        className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[10px] font-bold transition-all"
                      >
                        BUY
                      </button>
                    </td>
                    <td className="py-3 px-2 font-bold text-rose-400">
                      ₹{row.putLtp.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-slate-400 hidden sm:table-cell">{row.putIv}%</td>
                    <td className={`py-3 px-2 ${row.putChngOI >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.putChngOI >= 0 ? '+' : ''}{(row.putChngOI / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-2 text-slate-300 light:text-slate-700">
                      {(row.putOI / 100000).toFixed(1)}L
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800 light:border-slate-200 font-sans">
          <span>Lot Size: NIFTY 25 shares · BANKNIFTY 15 shares</span>
          <span>Click any BUY button to instantly populate order drawer</span>
        </div>
      </div>

    </div>
  );
};
