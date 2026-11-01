import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Plus,
  Receipt,
  Calendar,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { 
    portfolio, 
    activeSips, 
    orders, 
    stocks, 
    usStocks, 
    funds,
    openOrderModal, 
    navigateTo, 
    setIsAddMoneyOpen, 
    recentTicks,
    accountProfile,
    stockTransactions,
    mfTransactions,
    openTransactionsForCategory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'holdings' | 'sips' | 'orders' | 'transactions'>('holdings');
  const [holdingsFilter, setHoldingsFilter] = useState<'all' | 'stocks' | 'mfs'>('all');
  const [portfolioTxSubTab, setPortfolioTxSubTab] = useState<'all' | 'stocks' | 'mfs'>('all');

  // Calculate total portfolio values
  const allStocks = [...stocks, ...usStocks];

  let totalCurrentStocksValue = 0;
  let totalInvestedStocksValue = 0;

  const stockHoldingsCalculated = portfolio.map(h => {
    const liveStock = allStocks.find(s => s.id === h.stockId);
    const currentPrice = liveStock ? liveStock.price : h.currentPrice;
    const invested = h.shares * h.avgBuyPrice;
    const current = h.shares * currentPrice;
    totalCurrentStocksValue += current;
    totalInvestedStocksValue += invested;
    return {
      ...h,
      liveStock,
      currentPrice,
      invested,
      current,
      pnl: current - invested,
      pnlPct: invested > 0 ? ((current - invested) / invested) * 100 : 0
    };
  });

  // Calculate mutual fund holdings from mfTransactions and live NAV
  let totalSipsCurrentValue = 0;
  let totalSipsInvestedValue = 0;

  const mfHoldingsCalculated = activeSips.map(s => {
    const txs = mfTransactions.filter(t => t.fundId === s.fundId);
    const totalUnits = txs.reduce((acc, t) => acc + t.units, 0);
    const totalInvested = txs.reduce((acc, t) => acc + t.amount, 0) || s.totalInvested;
    const liveFund = funds.find(f => f.id === s.fundId);
    const currentNav = liveFund ? liveFund.nav : (s.fundId === 'quant-small-cap' ? 268.45 : 84.12);
    const currentValue = totalUnits > 0 ? totalUnits * currentNav : s.currentValue;
    const gain = currentValue - totalInvested;
    const gainPct = totalInvested > 0 ? (gain / totalInvested) * 100 : 0;
    const avgNav = totalUnits > 0 ? totalInvested / totalUnits : 0;

    totalSipsCurrentValue += currentValue;
    totalSipsInvestedValue += totalInvested;

    return {
      ...s,
      totalUnits,
      totalInvested,
      currentNav,
      currentValue,
      gain,
      gainPct,
      avgNav,
      txCount: txs.length,
      category: liveFund?.category || (s.fundId === 'quant-small-cap' ? 'Small Cap' : 'Flexi Cap'),
      folioNumber: txs[0]?.folioNumber || '1948201/88'
    };
  });

  const grandCurrentValue = totalCurrentStocksValue + totalSipsCurrentValue;
  const grandInvestedValue = totalInvestedStocksValue + totalSipsInvestedValue;
  const grandTotalReturns = grandCurrentValue - grandInvestedValue;
  const grandReturnsPct = grandInvestedValue > 0 ? (grandTotalReturns / grandInvestedValue) * 100 : 0;
  const dayGain = totalCurrentStocksValue * 0.0142; // ~1.42% day gain estimate

  return (
    <div className="space-y-8 pb-20">

      {/* Account Holder Verification Header Bar */}
      <div className="p-4 rounded-2xl border border-purple-900/40 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-[#121620] light:from-purple-50 light:to-white light:border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7b2cbf] to-[#5c2494] text-white flex items-center justify-center font-bold text-sm shadow-md">
            TS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Account Holder:</span>
              <span className="text-sm font-bold text-white light:text-slate-900">{accountProfile.name}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">UCC: {accountProfile.ucc}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Linked Bank: {accountProfile.bankName} {accountProfile.accountNumber} • CDSL Demat DP: {accountProfile.dpId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>SIP Auto-Debit: {accountProfile.sipDebitDay}</span>
          </div>
          <button
            onClick={() => navigateTo('transactions')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Receipt className="w-3.5 h-3.5 text-purple-400" />
            <span>Full Statement</span>
          </button>
        </div>
      </div>
      
      {/* Portfolio Top KPI Summary Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#161b24] via-[#1a2333] to-[#121620] light:from-white light:to-slate-50 light:border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 light:border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Investment Value</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-mono tabular-nums font-black text-white light:text-slate-900">
                ₹{grandCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>+₹{grandTotalReturns.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (+{grandReturnsPct.toFixed(2)}%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddMoneyOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Funds</span>
            </button>
            <button
              onClick={() => navigateTo('stocks')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 light:bg-slate-100 light:text-slate-800 transition-colors"
            >
              Explore Stocks
            </button>
          </div>
        </div>

        {/* Breakdown sub-stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[11px] font-sans">Total Invested</span>
            <span className="font-bold text-slate-200 light:text-slate-800 text-sm">
              ₹{grandInvestedValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-sans">1-Day Returns</span>
            <span className="font-bold text-emerald-400 text-sm">
              +₹{dayGain.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (+1.42%)
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-sans">Stocks Equity</span>
            <span className="font-bold text-slate-200 light:text-slate-800 text-sm">
              ₹{totalCurrentStocksValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-sans">Mutual Fund SIPs</span>
            <span className="font-bold text-slate-200 light:text-slate-800 text-sm">
              ₹{totalSipsCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 light:border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('holdings')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'holdings'
              ? 'border-purple-500 text-purple-400 light:text-purple-600'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Holdings & P&L</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700">
            {portfolio.length + mfHoldingsCalculated.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sips')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'sips'
              ? 'border-purple-500 text-purple-400 light:text-purple-600'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Active SIPs (25th of Month)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700">
            {activeSips.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'transactions'
              ? 'border-purple-500 text-purple-400 light:text-purple-600'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Transaction History</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-300">
            {stockTransactions.length + mfTransactions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-purple-500 text-purple-400 light:text-purple-600'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Orders Log</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700">
            {orders.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Holdings Content (Stocks & Mutual Funds with Live Price & NAV) */}
      {activeTab === 'holdings' && (
        <div className="space-y-6">
          {/* Asset Category Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHoldingsFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                holdingsFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 light:bg-slate-100 light:border-slate-200 light:text-slate-700 light:hover:bg-slate-200'
              }`}
            >
              All Assets ({portfolio.length + mfHoldingsCalculated.length})
            </button>
            <button
              onClick={() => setHoldingsFilter('stocks')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                holdingsFilter === 'stocks'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 light:bg-slate-100 light:border-slate-200 light:text-slate-700 light:hover:bg-slate-200'
              }`}
            >
              Stocks Equity ({portfolio.length} • ₹{totalCurrentStocksValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })})
            </button>
            <button
              onClick={() => setHoldingsFilter('mfs')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                holdingsFilter === 'mfs'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 light:bg-slate-100 light:border-slate-200 light:text-slate-700 light:hover:bg-slate-200'
              }`}
            >
              Mutual Funds ({mfHoldingsCalculated.length} • ₹{totalSipsCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })})
            </button>
          </div>

          {/* Section A: Stocks Equity Holdings */}
          {(holdingsFilter === 'all' || holdingsFilter === 'stocks') && (
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
                  <h3 className="font-bold text-sm text-white light:text-slate-900">
                    Stocks Equity Holdings
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Invested: ₹{totalInvestedStocksValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Current: ₹{totalCurrentStocksValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (+₹{(totalCurrentStocksValue - totalInvestedStocksValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })})
                  </span>
                </div>
              </div>

              {/* Mobile Native Card View (Visible on < md) */}
              <div className="block md:hidden space-y-3">
                {stockHoldingsCalculated.map((item) => {
                  const isPositive = item.pnl >= 0;
                  const tick = recentTicks[item.stockId];

                  return (
                    <div 
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all ${
                        tick === 'up'
                          ? 'border-emerald-500/60 bg-emerald-500/10'
                          : tick === 'down'
                          ? 'border-rose-500/60 bg-rose-500/10'
                          : 'border-slate-800 bg-slate-900/70 light:bg-slate-50 light:border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div 
                          onClick={() => navigateTo('stock-detail', { stockId: item.stockId })}
                          className="cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white light:text-slate-900 group-hover:text-purple-400 transition-colors">
                              {item.symbol}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 light:bg-slate-200 text-slate-400">
                              NSE
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.name}</p>
                        </div>

                        <button
                          onClick={() => {
                            if (item.liveStock) openOrderModal(item.liveStock, 'SELL');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        >
                          SELL
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 light:border-slate-200 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-500 block font-sans">Shares & Avg</span>
                          <span className="font-bold text-slate-200 light:text-slate-800">
                            {item.shares} @ ₹{item.avgBuyPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-sans">Market Price</span>
                          <span className={`font-bold ${tick === 'up' ? 'text-emerald-400' : tick === 'down' ? 'text-rose-400' : 'text-white light:text-slate-900'}`}>
                            ₹{item.currentPrice.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-sans">Invested</span>
                          <span className="text-slate-400">
                            ₹{item.invested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-sans">Current Value</span>
                          <span className="font-bold text-white light:text-slate-900">
                            ₹{item.current.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 light:border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">Total Profit / Loss</span>
                        <span className={`font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}₹{item.pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{item.pnlPct.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 font-sans font-semibold">
                      <th className="py-3 px-3">Company</th>
                      <th className="py-3 px-3 text-right">Shares</th>
                      <th className="py-3 px-3 text-right">Avg Buy Price</th>
                      <th className="py-3 px-3 text-right">Invested Value</th>
                      <th className="py-3 px-3 text-right">Market Price</th>
                      <th className="py-3 px-3 text-right">Current Value</th>
                      <th className="py-3 px-3 text-right">Total P&L</th>
                      <th className="py-3 px-3 text-center font-sans">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 light:divide-slate-100">
                    {stockHoldingsCalculated.map((item) => {
                      const isPositive = item.pnl >= 0;
                      const tick = recentTicks[item.stockId];

                      return (
                        <tr key={item.id} className={`transition-colors ${
                          tick === 'up'
                            ? 'bg-emerald-500/10'
                            : tick === 'down'
                            ? 'bg-rose-500/10'
                            : 'hover:bg-slate-800/40 light:hover:bg-slate-50'
                        }`}>
                          <td className="py-3.5 px-3">
                            <div 
                              onClick={() => navigateTo('stock-detail', { stockId: item.stockId })}
                              className="cursor-pointer group font-sans"
                            >
                              <span className="font-bold text-white light:text-slate-900 group-hover:text-emerald-400 transition-colors block">
                                {item.symbol}
                              </span>
                              <span className="text-[11px] text-slate-400 line-clamp-1">{item.name}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-white light:text-slate-900">
                            {item.shares}
                          </td>

                          <td className="py-3.5 px-3 text-right text-slate-300 light:text-slate-700">
                            ₹{item.avgBuyPrice.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-3 text-right text-slate-400 light:text-slate-600">
                            ₹{item.invested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>

                          <td className={`py-3.5 px-3 text-right font-bold transition-colors ${
                            tick === 'up' ? 'text-emerald-400' : tick === 'down' ? 'text-rose-400' : 'text-white light:text-slate-900'
                          }`}>
                            ₹{item.currentPrice.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-white light:text-slate-900">
                            ₹{item.current.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </td>

                          <td className={`py-3.5 px-3 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? '+' : ''}₹{item.pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{item.pnlPct.toFixed(2)}%)
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <button
                              onClick={() => {
                                if (item.liveStock) openOrderModal(item.liveStock, 'SELL');
                              }}
                              className="px-3 py-1 rounded-md text-[11px] font-bold bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                            >
                              SELL
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section B: Mutual Fund Holdings (Live NAV & Units Allotted) */}
          {(holdingsFilter === 'all' || holdingsFilter === 'mfs') && (
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-teal-400 shrink-0" />
                  <h3 className="font-bold text-sm text-white light:text-slate-900">
                    Mutual Funds Holdings (Live NAV & Allotted Units)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Invested: ₹{totalSipsInvestedValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Current: ₹{totalSipsCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (+₹{(totalSipsCurrentValue - totalSipsInvestedValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })})
                  </span>
                </div>
              </div>

              {/* Mobile Native Card View (Visible on < md) */}
              <div className="block md:hidden space-y-3">
                {mfHoldingsCalculated.map((mf) => {
                  const isPositive = mf.gain >= 0;

                  return (
                    <div 
                      key={mf.id}
                      onClick={() => navigateTo('fund-detail', { fundId: mf.fundId })}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 light:bg-slate-50 light:border-slate-200 cursor-pointer hover:border-purple-500/40 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-sm text-white light:text-slate-900 block leading-tight">
                            {mf.fundName}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                            <span className="text-teal-400 font-semibold">{mf.category}</span>
                            <span>•</span>
                            <span>Folio: {mf.folioNumber}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 shrink-0">
                          SIP: 25th
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 light:border-slate-200 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-500 block font-sans">Units Allotted</span>
                          <span className="font-bold text-slate-200 light:text-slate-800">
                            {mf.totalUnits.toFixed(4)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-sans">Current Live NAV</span>
                          <span className="font-bold text-teal-400">
                            ₹{mf.currentNav.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-sans">Amount Invested</span>
                          <span className="text-slate-400">
                            ₹{mf.totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-sans">Current Value</span>
                          <span className="font-bold text-white light:text-slate-900">
                            ₹{mf.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 light:border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">Total Returns</span>
                        <span className={`font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}₹{mf.gain.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{mf.gainPct.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 font-sans font-semibold">
                      <th className="py-3 px-3">Fund Scheme</th>
                      <th className="py-3 px-3 text-right">Units Allotted</th>
                      <th className="py-3 px-3 text-right">Avg Allotted NAV</th>
                      <th className="py-3 px-3 text-right">Amount Invested</th>
                      <th className="py-3 px-3 text-right text-teal-300 light:text-teal-800 font-bold bg-teal-950/20 light:bg-teal-50">Current Live NAV</th>
                      <th className="py-3 px-3 text-right">Current Value</th>
                      <th className="py-3 px-3 text-right">Total Returns</th>
                      <th className="py-3 px-3 text-center font-sans">SIP Debit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 light:divide-slate-100">
                    {mfHoldingsCalculated.map((mf) => {
                      const isPositive = mf.gain >= 0;

                      return (
                        <tr key={mf.id} className="hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3">
                            <div 
                              onClick={() => navigateTo('fund-detail', { fundId: mf.fundId })}
                              className="cursor-pointer group font-sans"
                            >
                              <span className="font-bold text-white light:text-slate-900 group-hover:text-teal-400 transition-colors block">
                                {mf.fundName}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                                <span className="text-teal-400">{mf.category}</span>
                                <span>•</span>
                                <span>Folio: {mf.folioNumber}</span>
                                <span>•</span>
                                <span>{mf.txCount} txns</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-white light:text-slate-900">
                            {mf.totalUnits.toFixed(4)}
                          </td>

                          <td className="py-3.5 px-3 text-right text-slate-300 light:text-slate-700">
                            ₹{mf.avgNav.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-slate-200 light:text-slate-800">
                            ₹{mf.totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-teal-300 light:text-teal-800 bg-teal-950/10 light:bg-teal-50">
                            ₹{mf.currentNav.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-3 text-right font-bold text-white light:text-slate-900">
                            ₹{mf.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>

                          <td className={`py-3.5 px-3 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? '+' : ''}₹{mf.gain.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{mf.gainPct.toFixed(2)}%)
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 light:bg-purple-100 text-purple-300 light:text-purple-800 whitespace-nowrap">
                              25th of month
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SIPs Content */}
      {activeTab === 'sips' && (
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white light:text-slate-900">Ongoing SIP Mandates</h3>
              <p className="text-xs text-slate-400 mt-0.5">Auto-debited on 25th of every month from Bank of India</p>
            </div>
            <button
              onClick={() => navigateTo('mutual-funds')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Explore More Funds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mfHoldingsCalculated.map((sip) => {
              const gain = sip.currentValue - sip.totalInvested;

              return (
                <div
                  key={sip.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 light:bg-slate-50 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white light:text-slate-900">{sip.fundName}</h4>
                      <span className="text-xs text-slate-400">Monthly SIP: ₹{sip.monthlyAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-sans">Total Invested</span>
                      <span className="font-bold text-slate-200">₹{sip.totalInvested.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-sans">Units Allotted</span>
                      <span className="font-bold text-slate-200">{sip.totalUnits.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-sans">Current Value</span>
                      <span className="font-bold text-emerald-400">
                        ₹{sip.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 gap-1.5">
                    <span className="flex items-center gap-1.5 text-purple-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      Auto-Debit: {accountProfile.sipDebitDay}
                    </span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      NACH Mandate: Active ({accountProfile.name})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Next debit: 25 Nov 2026 • {accountProfile.bankName} ({accountProfile.accountNumber})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Detailed Transaction History */}
      {activeTab === 'transactions' && (
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-white light:text-slate-900">
                  Investment Transaction History
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Detailed ledger for <strong>{accountProfile.name}</strong> • Stock date & amount and Mutual Fund date & NAV
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                {(['all', 'stocks', 'mfs'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPortfolioTxSubTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      portfolioTxSubTab === tab
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab === 'stocks' ? 'Stocks' : 'Mutual Funds'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => navigateTo('transactions')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <span>Full Statement Terminal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stocks Breakdown */}
          {(portfolioTxSubTab === 'all' || portfolioTxSubTab === 'stocks') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Stock Investments (Date & Amount)</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {stockTransactions.length} Trades
                </span>
              </div>

              {/* Mobile Cards for Stock Transactions */}
              <div className="block md:hidden space-y-2.5">
                {stockTransactions.map(tx => (
                  <div key={tx.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 light:bg-slate-50 light:border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white light:text-slate-900">{tx.symbol}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {tx.type} ({tx.product})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{tx.shares} shares @ ₹{tx.price.toFixed(2)}</span>
                      <span className="font-bold text-emerald-400">₹{tx.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 light:border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                      <span>{tx.date}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{tx.orderId}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-sans text-[11px]">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Stock Symbol</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3 text-right">Shares</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Investment Amount</th>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stockTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 text-slate-300 whitespace-nowrap">{tx.date}</td>
                        <td className="py-3 px-3 font-bold font-sans text-white light:text-slate-900">{tx.symbol}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            {tx.type} ({tx.product})
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-white light:text-slate-900">{tx.shares}</td>
                        <td className="py-3 px-3 text-right">₹{tx.price.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-400">
                          ₹{tx.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">{tx.orderId}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-emerald-400 font-sans font-semibold text-[11px]">{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mutual Funds Breakdown */}
          {(portfolioTxSubTab === 'all' || portfolioTxSubTab === 'mfs') && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4" />
                  <span>Mutual Fund Investments (Date & NAV Detail)</span>
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Auto-Debit: 25th of month
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {mfTransactions.length} Transactions
                  </span>
                </div>
              </div>

              {/* Mobile Cards for MF Transactions */}
              <div className="block md:hidden space-y-2.5">
                {mfTransactions.map(tx => (
                  <div key={tx.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 light:bg-slate-50 light:border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-white light:text-slate-900 leading-tight">{tx.fundName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 shrink-0">
                        {tx.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans">NAV on Date</span>
                        <span className="font-bold text-purple-300">₹{tx.nav.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block font-sans">Units Allotted</span>
                        <span className="font-bold text-slate-200">{tx.units.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans">Debit Date</span>
                        <span className="text-slate-300 font-sans">{tx.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block font-sans">Amount Invested</span>
                        <span className="font-bold text-emerald-400 text-sm">₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-sans text-[11px]">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Fund Scheme</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3 text-right text-purple-300 font-bold bg-purple-950/20">NAV on Date</th>
                      <th className="py-2.5 px-3 text-right">Units Allotted</th>
                      <th className="py-2.5 px-3 text-right">Amount Invested</th>
                      <th className="py-2.5 px-3">Folio No</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {mfTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                          <div className="font-bold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            <span>{tx.date}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold font-sans text-white light:text-slate-900">{tx.fundName}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {tx.type}
                          </span>
                        </td>
                        {/* NAV detail */}
                        <td className="py-3 px-3 text-right font-bold text-purple-300 bg-purple-950/10">
                          ₹{tx.nav.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-200">{tx.units.toFixed(4)}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-400">
                          ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">{tx.folioNumber}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-emerald-400 font-sans font-semibold text-[11px]">{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Order History */}
      {activeTab === 'orders' && (
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-white light:text-slate-900">Trading Activity & Execution Log</h3>
          
          {/* Mobile Cards for Orders */}
          <div className="block md:hidden space-y-2.5">
            {orders.map(ord => (
              <div key={ord.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 light:bg-slate-50 light:border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white light:text-slate-900">{ord.symbol}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ord.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {ord.type} ({ord.product})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{ord.shares} shares @ ₹{ord.price.toFixed(2)}</span>
                  <span className="font-bold text-white light:text-slate-900">₹{ord.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>{ord.timestamp}</span>
                  <span className="text-emerald-400 font-bold">Executed</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Stock / Contract</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Shares</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 text-slate-400">{ord.id}</td>
                    <td className="py-3 px-3 font-sans font-bold text-white light:text-slate-900">
                      {ord.symbol}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {ord.type} ({ord.product})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white light:text-slate-900">{ord.shares}</td>
                    <td className="py-3 px-3 text-right">₹{ord.price.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-bold text-white light:text-slate-900">
                      ₹{ord.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-emerald-400 font-bold font-sans">Executed</span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">{ord.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
