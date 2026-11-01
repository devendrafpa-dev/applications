import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EasyBackButton } from '../components/EasyBackButton';
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  PieChart, 
  Info,
  Calendar,
  CheckCircle2,
  Lock,
  Receipt
} from 'lucide-react';

export const MutualFundDetail: React.FC = () => {
  const { 
    funds, 
    selectedFundId, 
    navigateTo, 
    startSip, 
    balance, 
    setIsAddMoneyOpen,
    mfTransactions,
    openTransactionsForCategory,
    accountProfile 
  } = useApp();

  const fund = funds.find(f => f.id === selectedFundId) || funds[0];

  const [investMode, setInvestMode] = useState<'SIP' | 'OneTime'>('SIP');
  const [amount, setAmount] = useState<number>(fund.minSip);
  const [sipDay, setSipDay] = useState<number>(25);

  const presets = [1000, 2500, 5000, 10000];

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    startSip(fund, amount, sipDay);
  };

  // Filter transactions for this specific fund
  const thisFundTxs = mfTransactions.filter(t => t.fundId === fund.id);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Easy Back Button & Transactions Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <EasyBackButton showBreadcrumb={true} currentPageName={fund.name} />

        <div className="flex items-center gap-2">
          <button
            onClick={() => openTransactionsForCategory('mutual-funds')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all shadow-xs"
            title="View all mutual fund transactions with Date & NAV detail"
          >
            <Receipt className="w-3.5 h-3.5 text-purple-400" />
            <span>MF Transactions (Date & NAV)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Overview, Returns, Details, Holdings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-semibold text-emerald-400 block mb-1">
                  {fund.category} · {fund.amc}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white light:text-slate-900 font-sans">
                  {fund.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-xs">
                    <span>{fund.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                    {fund.risk}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 light:bg-slate-100 text-slate-400">
                    Direct • Growth
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Current NAV</span>
                <span className="text-2xl font-mono tabular-nums font-bold text-white light:text-slate-900 block">
                  ₹{fund.nav.toFixed(2)}
                </span>
                <span className="text-xs font-mono tabular-nums font-semibold text-emerald-400">
                  +{fund.navChange.toFixed(2)} (1D)
                </span>
              </div>
            </div>

            {/* Return Comparison Matrix */}
            <div className="mt-6 pt-5 border-t border-slate-800 light:border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Historical Annualized Returns
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 block font-mono">1 Year</span>
                  <span className="text-lg font-mono tabular-nums font-bold text-emerald-400">
                    +{fund.return1Y}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">vs Cat. 21.4%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 block font-mono">3 Years</span>
                  <span className="text-lg font-mono tabular-nums font-bold text-emerald-400">
                    +{fund.return3Y}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">vs Cat. 18.2%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 block font-mono">5 Years</span>
                  <span className="text-lg font-mono tabular-nums font-bold text-emerald-400">
                    +{fund.return5Y}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">vs Cat. 19.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fund Details Ratios */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Fund Essentials</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Fund Size (AUM)</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{fund.aum}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Expense Ratio</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{fund.expenseRatio}% (Inclusive of GST)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Minimum SIP</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">₹{fund.minSip}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Exit Load</span>
                <span className="font-medium text-slate-200 light:text-slate-800 text-xs">{fund.exitLoad}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Stamp Duty</span>
                <span className="font-medium text-slate-200 light:text-slate-800 text-xs">0.005% (Govt Levy)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Lock-in Period</span>
                <span className="font-medium text-slate-200 light:text-slate-800 text-xs">
                  {fund.category === 'ELSS Tax Saver' ? '3 Years (Tax Free)' : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Fund Manager & AMC */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Fund Management</h3>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                FM
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100 light:text-slate-900">{fund.fundManager}</p>
                <p className="text-xs text-slate-400">Chief Investment Officer & Portfolio Strategist</p>
              </div>
            </div>
          </div>

          {/* Top Holdings Table */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Top Portfolio Holdings</h3>
              <span className="text-xs text-slate-400 font-mono">Total Assets: {fund.aum}</span>
            </div>

            <div className="divide-y divide-slate-800 light:divide-slate-100 text-xs">
              {fund.topHoldings.map((h, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200 light:text-slate-900">{h.company}</p>
                    <span className="text-[11px] text-slate-400">{h.sector}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 block">
                      {h.weight}%
                    </span>
                    <span className="text-[10px] text-slate-500">Allocation</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical SIP & NAV Transactions for this Fund */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">
                  Transaction & NAV History for this Fund
                </h3>
              </div>
              <button
                onClick={() => openTransactionsForCategory('mutual-funds')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                All MF Ledger →
              </button>
            </div>

            {thisFundTxs.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 text-xs text-slate-400 text-center">
                No past transactions for this fund. Start a monthly SIP to automatically invest on the 25th of every month.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 font-sans text-[11px]">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3 text-right bg-purple-950/20 light:bg-purple-50 text-purple-300 light:text-purple-800 font-bold">NAV on Date</th>
                      <th className="py-2.5 px-3 text-right">Units</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3">Folio No</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 light:divide-slate-100">
                    {thisFundTxs.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 light:hover:bg-slate-50">
                        <td className="py-3 px-3 text-slate-300 light:text-slate-700 whitespace-nowrap font-sans font-medium">{tx.date}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-purple-300 light:text-purple-700 bg-purple-950/10 light:bg-purple-50">
                          ₹{tx.nav.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-200 light:text-slate-800">{tx.units.toFixed(4)}</td>
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
            )}
          </div>

        </div>

        {/* Right Column: Start SIP Action Drawer */}
        <div className="space-y-4">
          <div className="sticky top-20 p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-lg space-y-5">
            <h3 className="font-bold text-sm text-slate-100 light:text-slate-900">Invest in Fund</h3>

            {/* SIP vs One Time */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-200">
              <button
                type="button"
                onClick={() => setInvestMode('SIP')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  investMode === 'SIP'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly SIP
              </button>
              <button
                type="button"
                onClick={() => setInvestMode('OneTime')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  investMode === 'OneTime'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                One-Time (Lumpsum)
              </button>
            </div>

            <form onSubmit={handleInvest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Installment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    min={fund.minSip}
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full h-11 pl-8 pr-3 rounded-xl font-mono tabular-nums font-bold text-base bg-slate-900 light:bg-slate-50 border border-slate-700 light:border-slate-200 text-white light:text-slate-900 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {presets.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(p)}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 light:bg-slate-100 text-slate-300 light:text-slate-700 hover:bg-slate-700"
                    >
                      +₹{p}
                    </button>
                  ))}
                </div>
              </div>

              {investMode === 'SIP' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400">Monthly Auto-Debit Date</label>
                    <span className="text-[10px] text-purple-400 font-semibold">Mandate: 25th Recommended</span>
                  </div>
                  <select
                    value={sipDay}
                    onChange={e => setSipDay(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl text-xs font-semibold bg-slate-900 light:bg-slate-50 border border-purple-500/50 light:border-slate-200 text-white light:text-slate-900 focus:outline-none focus:border-purple-500"
                  >
                    <option value={25}>25th of every month (Active Mandate: Twinkle Singh)</option>
                    <option value={5}>5th of every month</option>
                    <option value={10}>10th of every month</option>
                    <option value={15}>15th of every month</option>
                    <option value={20}>20th of every month</option>
                  </select>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Balance:</span>
                  <span className="font-mono tabular-nums font-bold">₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">First Installment:</span>
                  <span className="text-emerald-400 font-bold">Deducted Today</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
              >
                {investMode === 'SIP' ? `Start SIP (₹${amount.toLocaleString('en-IN')})` : `Invest ₹${amount.toLocaleString('en-IN')} Lumpsum`}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Direct Mutual Fund • Zero Commission • Zero Paperwork
              </p>
            </form>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Investment Bar (Fixed above bottom nav on mobile) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 px-4 py-2.5 bg-[#0b0e14]/95 backdrop-blur-md border-t border-purple-900/40 light:bg-white/95 light:border-slate-200 shadow-2xl flex items-center justify-between gap-3 safe-area-bottom">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Current NAV</span>
          <span className="font-mono tabular-nums font-bold text-sm text-teal-400">
            ₹{fund.nav.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[260px]">
          <button
            type="button"
            onClick={() => {
              setInvestMode('SIP');
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
            className="flex-1 py-2 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-95"
          >
            Start SIP (25th)
          </button>
          <button
            type="button"
            onClick={() => {
              setInvestMode('OneTime');
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
            className="py-2 px-3 rounded-xl font-semibold text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 light:bg-slate-100 light:text-slate-800 light:hover:bg-slate-200 transition-all active:scale-95"
          >
            One-Time
          </button>
        </div>
      </div>

    </div>
  );
};
