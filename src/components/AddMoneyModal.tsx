import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';

export const AddMoneyModal: React.FC = () => {
  const { isAddMoneyOpen, setIsAddMoneyOpen, addBalance, balance, accountProfile } = useApp();
  const [amount, setAmount] = useState<number>(5000);
  const [selectedMethod, setSelectedMethod] = useState<'gpay' | 'phonepe' | 'paytm' | 'netbanking'>('gpay');

  if (!isAddMoneyOpen) return null;

  const presets = [1000, 2500, 5000, 10000, 25000];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    addBalance(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border-t sm:border shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto bg-[#161b22] border-slate-700/80 text-slate-100 light:bg-white light:border-slate-200 light:text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Pull Indicator */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mt-2.5 sm:hidden" />

        <div className="px-5 py-3.5 sm:py-4 border-b border-slate-800 light:border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Add Funds to Upstox Pro</h3>
            <p className="text-xs text-slate-400">Account: <strong>{accountProfile.name}</strong> • Balance: ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <button
            onClick={() => setIsAddMoneyOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleDeposit} className="p-5 space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount-input" className="text-xs font-semibold text-slate-400">Enter Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-mono font-bold text-slate-400">₹</span>
              <input
                id="amount-input"
                type="number"
                min="100"
                value={amount}
                onChange={e => setAmount(parseInt(e.target.value) || 0)}
                className="w-full h-13 pl-9 pr-4 rounded-xl font-mono tabular-nums text-xl font-bold bg-slate-900 light:bg-slate-50 border border-slate-700 light:border-slate-200 focus:outline-none focus:border-emerald-500 text-white light:text-slate-900"
                placeholder="5,000"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    amount === p
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 light:bg-slate-100 text-slate-300 light:text-slate-700 hover:bg-slate-700'
                  }`}
                >
                  +₹{p.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400">Select Payment Mode</span>
            <div className="space-y-2">
              <div
                onClick={() => setSelectedMethod('gpay')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'gpay'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-800 light:border-slate-200 bg-slate-900/40 light:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-slate-900 text-xs shadow-sm">
                    GPay
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Google Pay UPI</p>
                    <p className="text-[11px] text-slate-400">Instant • Zero Convenience Fee</p>
                  </div>
                </div>
                {selectedMethod === 'gpay' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                onClick={() => setSelectedMethod('phonepe')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'phonepe'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-800 light:border-slate-200 bg-slate-900/40 light:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5f259f] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    Pe
                  </div>
                  <div>
                    <p className="text-xs font-semibold">PhonePe UPI</p>
                    <p className="text-[11px] text-slate-400">Fast 1-click mandate</p>
                  </div>
                </div>
                {selectedMethod === 'phonepe' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'netbanking'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-800 light:border-slate-200 bg-slate-900/40 light:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Net Banking / NEFT</p>
                    <p className="text-[11px] text-slate-400">Linked: {accountProfile.bankName} ({accountProfile.accountNumber}) & 50+ Banks</p>
                  </div>
                </div>
                {selectedMethod === 'netbanking' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
          >
            Deposit ₹{amount.toLocaleString('en-IN')} Instantly
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Safe 256-bit Encrypted Banking via NPCI
          </p>
        </form>
      </div>
    </div>
  );
};
