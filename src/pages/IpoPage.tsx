import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EasyBackButton } from '../components/EasyBackButton';
import { IPOItem } from '../types';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  X,
  Receipt
} from 'lucide-react';

export const IpoPage: React.FC = () => {
  const { ipos, applyIpo, balance, setIsAddMoneyOpen, openTransactionsForCategory, accountProfile } = useApp();

  const [selectedIpo, setSelectedIpo] = useState<IPOItem | null>(null);
  const [lots, setLots] = useState<number>(1);
  const [upiId, setUpiId] = useState<string>('twinkle.singh@okhdfcbank');

  const openIpos = ipos.filter(i => i.status === 'Open');
  const upcomingIpos = ipos.filter(i => i.status === 'Upcoming');
  const listedIpos = ipos.filter(i => i.status === 'Listed');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIpo) return;
    const success = applyIpo(selectedIpo, lots, upiId);
    if (success) {
      setSelectedIpo(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Easy Back Option & Category Transactions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <EasyBackButton showBreadcrumb={true} currentPageName="IPO Portal" />

        <button
          onClick={() => openTransactionsForCategory('ipo')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all shadow-xs"
          title="View all IPO applications and ASBA mandates"
        >
          <Receipt className="w-3.5 h-3.5 text-purple-400" />
          <span>IPO Applications History</span>
        </button>
      </div>
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#161b24] via-[#1a2333] to-[#121620] light:from-white light:to-slate-50 light:border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white light:text-slate-900">
              Initial Public Offerings (IPOs)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Apply seamlessly for upcoming mainboard IPOs directly through your UPI mandate
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>ASBA Enabled • Funds Blocked Only</span>
        </div>
      </div>

      {/* Active IPOs (Apply Open) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Open for Bidding ({openIpos.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openIpos.map((ipo) => (
            <div
              key={ipo.id}
              className="p-5 rounded-2xl border border-emerald-500/30 bg-[#161b24] light:bg-white light:border-slate-200 shadow-md flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white light:text-slate-900">{ipo.companyName}</h3>
                    <span className="text-xs text-slate-400">Issue Dates: {ipo.openDate} - {ipo.closeDate}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Bidding Open
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Price Band</span>
                    <span className="font-mono tabular-nums font-bold text-slate-200 light:text-slate-800">{ipo.priceRange}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Lot Size / Min Invest</span>
                    <span className="font-mono tabular-nums font-bold text-slate-200 light:text-slate-800">
                      {ipo.lotSize} shares (₹{ipo.minInvestment.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Subscription</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-400">{ipo.subscriptionTimes}x Subscribed</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Expected Listing Gain (GMP):</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-400">{ipo.expectedListingGain}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedIpo(ipo);
                  setLots(1);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <span>Apply for IPO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming IPOs */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Upcoming IPOs ({upcomingIpos.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingIpos.map((ipo) => (
            <div
              key={ipo.id}
              className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white light:text-slate-900">{ipo.companyName}</h3>
                    <span className="text-xs text-slate-400">Bidding Opens: {ipo.openDate}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Announced
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Price Band</span>
                    <span className="font-mono tabular-nums font-bold text-slate-200 light:text-slate-800">{ipo.priceRange}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Issue Size</span>
                    <span className="font-mono tabular-nums font-bold text-slate-200 light:text-slate-800">{ipo.issueSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Est. GMP</span>
                    <span className="font-mono tabular-nums font-bold text-amber-400">{ipo.expectedListingGain}</span>
                  </div>
                </div>
              </div>

              <button
                disabled
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-400 cursor-not-allowed"
              >
                Opening on {ipo.openDate}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Listed IPOs */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          Recently Listed IPOs
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Listing Date</th>
                <th className="py-2.5 px-3 text-right">Listing Price</th>
                <th className="py-2.5 px-3 text-right">Current Price</th>
                <th className="py-2.5 px-3 text-right">Listing Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {listedIpos.map((ipo) => (
                <tr key={ipo.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-bold font-sans text-white light:text-slate-900">
                    {ipo.companyName}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{ipo.listingDate}</td>
                  <td className="py-3 px-3 text-right">₹{ipo.listingPrice?.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right font-bold text-white light:text-slate-900">
                    ₹{ipo.currentPrice?.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">
                    {ipo.expectedListingGain}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Apply IPO Modal */}
      {selectedIpo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden bg-[#161b22] border-slate-700/80 text-slate-100 light:bg-white light:border-slate-200 light:text-slate-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Apply for {selectedIpo.companyName}</h3>
                <span className="text-xs text-slate-400">Price Band: {selectedIpo.priceRange}</span>
              </div>
              <button
                onClick={() => setSelectedIpo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Number of Lots</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLots(Math.max(1, lots - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 light:bg-slate-100 text-white light:text-slate-800 hover:bg-slate-700 light:hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={lots}
                    onChange={e => setLots(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 h-10 text-center font-mono font-bold text-base rounded-xl bg-slate-900 light:bg-slate-50 border border-slate-700 light:border-slate-200 text-white light:text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setLots(lots + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-800 light:bg-slate-100 text-white light:text-slate-800 hover:bg-slate-700 light:hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Total Shares: {lots * selectedIpo.lotSize} shares
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Your UPI ID for Mandate</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-xs font-mono bg-slate-900 light:bg-slate-50 border border-slate-700 light:border-slate-200 text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
                  placeholder="yourname@okhdfcbank"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount to Block:</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-400 text-sm">
                    ₹{(selectedIpo.minInvestment * lots).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Wallet Balance:</span>
                  <span className="font-mono tabular-nums text-slate-200 light:text-slate-800">₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
              >
                Submit Bid & Approve Mandate
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
