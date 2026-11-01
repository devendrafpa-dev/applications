import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EasyBackButton } from '../components/EasyBackButton';
import { 
  Receipt, 
  Search, 
  Download, 
  TrendingUp, 
  PieChart, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  CreditCard, 
  UserCheck, 
  Building2,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const TransactionHistoryPage: React.FC = () => {
  const { 
    accountProfile, 
    stockTransactions, 
    mfTransactions, 
    orders, 
    txCategoryFilter, 
    setTxCategoryFilter, 
    navigateTo 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'SIP' | 'BUY' | 'LUMPSUM'>('ALL');

  // Filter Stock transactions
  const filteredStocks = stockTransactions.filter(tx => {
    const matchesSearch = 
      tx.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || (selectedType === 'BUY' && tx.type === 'BUY');
    return matchesSearch && matchesType;
  });

  // Filter MF transactions
  const filteredMfs = mfTransactions.filter(tx => {
    const matchesSearch = 
      tx.fundName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.folioNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = 
      selectedType === 'ALL' || 
      (selectedType === 'SIP' && tx.type === 'SIP Auto-Debit') ||
      (selectedType === 'LUMPSUM' && tx.type === 'One-Time Lumpsum');
    return matchesSearch && matchesType;
  });

  // Totals
  const totalStockAmount = stockTransactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalMfAmount = mfTransactions.reduce((acc, t) => acc + t.amount, 0);
  const grandTotal = totalStockAmount + totalMfAmount;

  // Handle CSV export
  const exportCSV = () => {
    const rows = [
      ['Category', 'Date', 'Item Name / Symbol', 'Type', 'Amount (INR)', 'Price / NAV', 'Quantity / Units', 'Folio / Order ID', 'Status']
    ];

    stockTransactions.forEach(s => {
      rows.push(['Stock', s.timestamp, s.symbol, `${s.type} (${s.product})`, s.totalAmount.toString(), s.price.toString(), s.shares.toString(), s.orderId, s.status]);
    });

    mfTransactions.forEach(m => {
      rows.push(['Mutual Fund', m.timestamp, m.fundName, m.type, m.amount.toString(), m.nav.toString(), m.units.toString(), m.folioNumber, m.status]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `upstox_transactions_${accountProfile.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Header & Easy Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <EasyBackButton showBreadcrumb={true} currentPageName="Transaction History" />

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white light:bg-white light:border-slate-200 light:text-slate-700 light:hover:bg-slate-50 transition-colors shadow-xs"
            title="Download CSV Statement"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* Account Holder Profile & Mandate Card */}
      <div className="p-6 rounded-2xl border border-purple-900/40 bg-gradient-to-br from-[#151329] via-[#101422] to-[#0c0f17] light:from-purple-50/70 light:via-white light:to-slate-50 light:border-purple-200 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-purple-900/30 light:border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7b2cbf] to-[#5c2494] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-900/40 ring-2 ring-purple-400/30 shrink-0">
              TS
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900 font-sans">
                  {accountProfile.name}
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  VERIFIED INVESTOR
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>UCC: <strong className="text-slate-200 light:text-slate-700">{accountProfile.ucc}</strong></span>
                <span>•</span>
                <span>PAN: <strong className="text-slate-200 light:text-slate-700">{accountProfile.pan}</strong></span>
                <span>•</span>
                <span>Demat DP: <strong className="text-slate-200 light:text-slate-700">{accountProfile.dpId}</strong></span>
              </p>
            </div>
          </div>

          {/* SIP Auto-Debit Mandate Highlights */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 light:bg-purple-100/60 light:border-purple-200 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  SIP Auto-Debit Date
                </span>
                <span className="text-xs font-bold text-purple-300 light:text-purple-900 font-mono">
                  {accountProfile.sipDebitDay}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 light:bg-emerald-100/60 light:border-emerald-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  NACH e-Mandate
                </span>
                <span className="text-xs font-bold text-emerald-400 light:text-emerald-800">
                  Active ({accountProfile.bankName} {accountProfile.accountNumber})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div>
            <span className="text-xs text-slate-400">Total Invested Volume</span>
            <p className="text-lg sm:text-xl font-bold font-mono text-white light:text-slate-900 mt-0.5">
              ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Stocks Invested</span>
            <p className="text-lg sm:text-xl font-bold font-mono text-purple-400 mt-0.5">
              ₹{totalStockAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Mutual Funds SIPs</span>
            <p className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
              ₹{totalMfAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Next Auto-Debit</span>
            <p className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-0.5">
              25 Nov 2026
            </p>
          </div>
        </div>
      </div>

      {/* Investment Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 light:border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Transactions', icon: Receipt },
            { id: 'stocks', label: 'Stocks (Date & Amount)', icon: TrendingUp },
            { id: 'mutual-funds', label: 'Mutual Funds (Date & NAV)', icon: PieChart },
            { id: 'fno', label: 'F&O Contracts', icon: Layers },
            { id: 'ipo', label: 'IPOs', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = txCategoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTxCategoryFilter(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 light:bg-slate-100 light:border-slate-200 light:text-slate-700 light:hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, symbol, ID..."
            className="w-full h-9 pl-8 pr-3 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 light:bg-white light:border-slate-200 light:text-slate-900"
          />
        </div>
      </div>

      {/* SECTION 1: STOCKS TRANSACTION HISTORY */}
      {(txCategoryFilter === 'all' || txCategoryFilter === 'stocks') && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#141822] light:bg-white light:border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white light:text-slate-900">
                Stock Investments & Trade History
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {filteredStocks.length} Record{filteredStocks.length !== 1 ? 's' : ''}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Comprehensive breakdown of stock investment dates, execution prices, quantity, and total invested amounts for <strong>{accountProfile.name}</strong>.
          </p>

          {/* Mobile Native Card View for Stocks */}
          <div className="block md:hidden space-y-3">
            {filteredStocks.map((stk) => (
              <div 
                key={stk.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 light:bg-slate-50 light:border-slate-200 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <button
                      onClick={() => navigateTo('stock-detail', { stockId: stk.stockId })}
                      className="text-left font-sans font-bold text-base text-white light:text-slate-900 hover:text-purple-400 block transition-colors"
                    >
                      {stk.symbol}
                    </button>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{stk.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    stk.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {stk.type} ({stk.product})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 light:border-slate-200 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Shares & Price</span>
                    <span className="font-bold text-slate-200 light:text-slate-800">
                      {stk.shares} @ ₹{stk.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-sans">Invested Amount</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      ₹{stk.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Trade Date</span>
                    <span className="text-slate-300 font-sans">{stk.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-sans">Exchange & Status</span>
                    <span className="text-emerald-400 font-sans font-semibold text-[11px] inline-flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{stk.exchange} • {stk.status}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 font-sans text-[11px]">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Stock Symbol</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-right">Shares</th>
                  <th className="py-3 px-3 text-right">Execution Price</th>
                  <th className="py-3 px-3 text-right">Total Invested Amount</th>
                  <th className="py-3 px-3">Order ID / Exchange</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 light:divide-slate-100">
                {filteredStocks.map((stk) => (
                  <tr key={stk.id} className="hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-300 light:text-slate-700">
                      <div className="font-semibold">{stk.date}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{stk.timestamp.split(', ')[1] || ''}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => navigateTo('stock-detail', { stockId: stk.stockId })}
                        className="text-left group"
                      >
                        <span className="font-sans font-bold text-white light:text-slate-900 group-hover:text-purple-400 block transition-colors">
                          {stk.symbol}
                        </span>
                        <span className="text-[10px] font-sans text-slate-400 line-clamp-1">
                          {stk.name}
                        </span>
                      </button>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stk.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {stk.type} ({stk.product})
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-white light:text-slate-900">
                      {stk.shares}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-200 light:text-slate-800">
                      ₹{stk.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold font-mono text-emerald-400 text-sm">
                      ₹{stk.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-3 text-[11px] text-slate-400">
                      <div>{stk.orderId}</div>
                      <div className="text-[10px] text-slate-500">{stk.exchange} • {stk.settlementDate}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-sans font-semibold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{stk.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: MUTUAL FUNDS TRANSACTION HISTORY (WITH DATE & NAV DETAIL) */}
      {(txCategoryFilter === 'all' || txCategoryFilter === 'mutual-funds') && (
        <div className="p-4 sm:p-6 rounded-2xl border border-slate-800 bg-[#141822] light:bg-white light:border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-teal-400 shrink-0" />
              <h2 className="text-base font-bold text-white light:text-slate-900">
                Mutual Fund Transactions (Date & NAV Breakdown)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Auto-Debit: 25th of month
              </span>
              <span className="text-xs font-mono text-slate-400">
                {filteredMfs.length} Record{filteredMfs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Every installment showing the exact <strong>investment date</strong>, scheme name, <strong>NAV at purchase</strong>, units allotted, and total debit amount under account holder <strong>{accountProfile.name}</strong>.
          </p>

          {/* Mobile Native Card View for MFs */}
          <div className="block md:hidden space-y-3">
            {filteredMfs.map((mf) => (
              <div 
                key={mf.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 light:bg-slate-50 light:border-slate-200 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <button
                      onClick={() => navigateTo('fund-detail', { fundId: mf.fundId })}
                      className="text-left font-sans font-bold text-sm text-white light:text-slate-900 hover:text-purple-400 block transition-colors leading-tight"
                    >
                      {mf.fundName}
                    </button>
                    <span className="text-[11px] text-slate-400">{mf.category} • Direct Plan</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    mf.type.includes('SIP') 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {mf.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 light:border-slate-200 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">NAV on Date</span>
                    <span className="font-bold text-purple-300 text-sm">
                      ₹{mf.nav.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-sans">Units Allotted</span>
                    <span className="font-bold text-slate-200 light:text-slate-800">
                      {mf.units.toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Debit Date</span>
                    <span className="text-slate-200 font-sans font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      <span>{mf.date}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-sans">Amount Invested</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      ₹{mf.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 light:border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px]">{mf.folioNumber} • {mf.mandateBank}</span>
                  <span className="text-emerald-400 font-sans font-semibold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{mf.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 light:border-slate-200 text-slate-400 font-sans text-[11px]">
                  <th className="py-3 px-3">Investment Date</th>
                  <th className="py-3 px-3">Mutual Fund Scheme</th>
                  <th className="py-3 px-3">Transaction Type</th>
                  <th className="py-3 px-3 text-right bg-purple-950/20 light:bg-purple-50">
                    <span className="text-purple-300 light:text-purple-800 font-bold">NAV on Date</span>
                  </th>
                  <th className="py-3 px-3 text-right">Units Allotted</th>
                  <th className="py-3 px-3 text-right">Investment Amount</th>
                  <th className="py-3 px-3">Folio Number / Bank</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 light:divide-slate-100">
                {filteredMfs.map((mf) => (
                  <tr key={mf.id} className="hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-200 light:text-slate-800">
                      <div className="font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>{mf.date}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">{mf.timestamp.split(', ')[1] || '09:15 AM'}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => navigateTo('fund-detail', { fundId: mf.fundId })}
                        className="text-left group"
                      >
                        <span className="font-sans font-bold text-white light:text-slate-900 group-hover:text-purple-400 block transition-colors">
                          {mf.fundName}
                        </span>
                        <span className="text-[10px] font-sans text-slate-400">
                          {mf.category} • Direct Plan
                        </span>
                      </button>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mf.type.includes('SIP') 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {mf.type}
                      </span>
                    </td>
                    {/* Explicit NAV on Date Cell */}
                    <td className="py-3.5 px-3 text-right font-bold text-purple-300 light:text-purple-700 bg-purple-950/10 light:bg-purple-50 text-sm">
                      ₹{mf.nav.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-200 light:text-slate-800">
                      {mf.units.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold font-mono text-emerald-400 text-sm">
                      ₹{mf.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-3 text-[11px] text-slate-400">
                      <div>{mf.folioNumber}</div>
                      <div className="text-[10px] text-slate-500">{mf.mandateBank || `${accountProfile.bankName} ${accountProfile.accountNumber}`}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-sans font-semibold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{mf.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: F&O / DERIVATIVES */}
      {(txCategoryFilter === 'all' || txCategoryFilter === 'fno') && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#141822] light:bg-white light:border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white light:text-slate-900">
                F&O (Futures & Options) Orders
              </h2>
            </div>
            <button
              onClick={() => navigateTo('fno')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <span>Option Chain Terminal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans text-[11px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Contract</th>
                  <th className="py-3 px-3">Side</th>
                  <th className="py-3 px-3 text-right">Lot Size</th>
                  <th className="py-3 px-3 text-right">Premium Price</th>
                  <th className="py-3 px-3 text-right">Total Premium</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-slate-300">29 Oct 2026, 10:45 AM</td>
                  <td className="py-3 px-3 font-bold text-white light:text-slate-900">NIFTY 24200 CE (Weekly)</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">BUY</span></td>
                  <td className="py-3 px-3 text-right">75 (1 Lot)</td>
                  <td className="py-3 px-3 text-right">₹142.50</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">₹10,687.50</td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-400 font-sans font-semibold">Executed</span></td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-slate-300">27 Oct 2026, 01:20 PM</td>
                  <td className="py-3 px-3 font-bold text-white light:text-slate-900">BANKNIFTY 51500 PE</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">SELL</span></td>
                  <td className="py-3 px-3 text-right">30 (2 Lots)</td>
                  <td className="py-3 px-3 text-right">₹210.00</td>
                  <td className="py-3 px-3 text-right font-bold text-rose-400">₹6,300.00</td>
                  <td className="py-3 px-3 text-center"><span className="text-emerald-400 font-sans font-semibold">Executed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: IPO TRANSACTIONS */}
      {(txCategoryFilter === 'all' || txCategoryFilter === 'ipo') && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#141822] light:bg-white light:border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white light:text-slate-900">
                IPO Bids & ASBA Mandates
              </h2>
            </div>
            <button
              onClick={() => navigateTo('ipo')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <span>Explore IPOs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-sans text-[11px]">
                  <th className="py-3 px-3">Application Date</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3 text-right">Lots (Shares)</th>
                  <th className="py-3 px-3 text-right">Cut-Off Price</th>
                  <th className="py-3 px-3 text-right">Blocked Amount</th>
                  <th className="py-3 px-3">UPI Mandate Status</th>
                  <th className="py-3 px-3 text-center">Allotment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-slate-300">22 Oct 2026, 03:30 PM</td>
                  <td className="py-3 px-3 font-bold text-white light:text-slate-900">Waaree Energies Limited</td>
                  <td className="py-3 px-3 text-right">1 Lot (9 Shares)</td>
                  <td className="py-3 px-3 text-right">₹1,503.00</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">₹13,527.00</td>
                  <td className="py-3 px-3 text-slate-300">Mandate Approved (HDFC Bank)</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-sans font-bold">
                      Allotted (+69.7%)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
