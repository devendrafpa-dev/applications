import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UpstoxLogo } from './UpstoxLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Search, 
  Sun, 
  Moon, 
  Wallet, 
  Plus, 
  TrendingUp, 
  Bookmark, 
  Calculator,
  Download,
  ShieldCheck,
  Smartphone,
  Receipt
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    activePage, 
    navigateTo, 
    balance, 
    setIsAddMoneyOpen, 
    setIsSearchOpen,
    portfolio,
    setIsInstallModalOpen,
    accountProfile
  } = useApp();

  const { isInstalled } = usePWAInstall();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Top Bar 3-Zone Contract:
  // Zone 1: Single Brand wordmark
  // Zone 2: 4-5 single-line clean nav links
  // Zone 3: Install App + Search + Balance pill + Theme toggle + Profile
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors bg-[#0b0e14]/95 border-purple-900/30 text-slate-100 light:bg-white/95 light:border-slate-200 light:text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Zone 1: Upstox Brand Wordmark (Left of the screen) */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          <button 
            onClick={() => navigateTo('stocks')}
            className="flex items-center gap-1.5 sm:gap-2.5 focus:outline-none group text-left"
            title="Upstox Pro Home"
          >
            <UpstoxLogo size="md" isPro={true} />
          </button>
        </div>

        {/* Zone 2: Primary Navigation Links (Single line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium">
          <button
            onClick={() => navigateTo('stocks')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              ['stocks', 'mutual-funds', 'fno', 'ipo', 'us-stocks', 'stock-detail', 'fund-detail'].includes(activePage)
                ? 'text-purple-400 light:text-purple-700 font-semibold'
                : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            Explore
            {['stocks', 'mutual-funds', 'fno', 'ipo', 'us-stocks', 'stock-detail', 'fund-detail'].includes(activePage) && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigateTo('portfolio')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              activePage === 'portfolio'
                ? 'text-purple-400 light:text-purple-700 font-semibold'
                : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            Holdings & P&L
            {portfolio.length > 0 && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                {portfolio.length}
              </span>
            )}
            {activePage === 'portfolio' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigateTo('fno')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activePage === 'fno'
                ? 'text-purple-400 light:text-purple-700 font-semibold'
                : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            Option Chain
            {activePage === 'fno' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigateTo('watchlist')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1 ${
              activePage === 'watchlist'
                ? 'text-purple-400 light:text-purple-700 font-semibold'
                : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            Watchlist
            {activePage === 'watchlist' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => navigateTo('calculators')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activePage === 'calculators'
                ? 'text-purple-400 light:text-purple-700 font-semibold'
                : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
            }`}
          >
            Calculators
            {activePage === 'calculators' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Install App + Search + Wallet + Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* PWA In-App Install Button */}
          {!isInstalled && (
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7b2cbf] to-[#5c2494] hover:from-[#8a2be2] hover:to-[#6c2a9d] text-white shadow-md shadow-purple-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Install Upstox App on Mobile / Desktop"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {/* Universal Search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs bg-slate-900/80 hover:bg-slate-800 border border-purple-900/40 text-slate-400 hover:text-slate-200 light:bg-slate-100 light:border-slate-200 light:hover:bg-slate-200 light:text-slate-600 transition-colors"
            title="Search stocks, F&O contracts, mutual funds, IPOs (Ctrl+K)"
          >
            <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-purple-400" />
            <span className="hidden sm:inline sm:ml-2">Search</span>
            <kbd className="hidden lg:inline ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Wallet / Balance Pill with Add Money CTA */}
          <div className="flex items-center bg-slate-900/90 border border-purple-900/40 light:bg-purple-50 light:border-purple-200 rounded-xl p-0.5">
            <button
              onClick={() => setIsAddMoneyOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-medium text-slate-200 light:text-purple-900 hover:text-purple-400 light:hover:text-purple-700 transition-colors"
              title="Upstox Trading Wallet Balance"
            >
              <Wallet className="w-3.5 h-3.5 text-purple-400 light:text-purple-600 shrink-0" />
              <span className="font-mono tabular-nums font-semibold text-[11px] sm:text-xs">
                ₹{balance > 99999 ? `${(balance / 100000).toFixed(2)}L` : balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </button>
            <button
              onClick={() => setIsAddMoneyOpen(true)}
              className="flex items-center justify-center p-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 light:bg-purple-200 light:text-purple-800 transition-colors"
              title="Add Money"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-100 light:hover:text-slate-900 hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-600" />
            )}
          </button>

          {/* TS Profile Avatar in the top right corner */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1.5 p-0.5 sm:px-2 sm:py-1 rounded-full sm:rounded-xl bg-purple-950/60 light:bg-purple-100/90 hover:bg-purple-900/80 light:hover:bg-purple-200 border border-purple-500/50 light:border-purple-300 text-white light:text-purple-900 shadow-xs focus:outline-none transition-all active:scale-95"
              title={`Account Holder: ${accountProfile.name}`}
            >
              <div className="w-7 h-7 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#7b2cbf] to-[#5c2494] text-white flex items-center justify-center text-[11px] sm:text-xs font-bold ring-1.5 ring-purple-300/50 shrink-0 shadow-sm">
                TS
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-purple-200 light:text-purple-900">
                Twinkle S.
              </span>
            </button>

            {isProfileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsProfileMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl py-2 z-40 bg-[#121620] border border-purple-900/50 text-slate-200 light:bg-white light:border-slate-200 light:text-slate-800">
                  <div className="px-4 py-2.5 border-b border-slate-800 light:border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white light:text-slate-900">{accountProfile.name}</p>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">PRO INVESTOR</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">UCC: {accountProfile.ucc} • CDSL Demat</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <span>SIP Auto-Debit: {accountProfile.sipDebitDay}</span>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigateTo('transactions');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-purple-950/30 light:hover:bg-slate-50 flex items-center gap-2 text-purple-300 font-bold"
                    >
                      <Receipt className="w-3.5 h-3.5 text-purple-400" />
                      Transaction History (Stocks & MFs)
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('portfolio');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-purple-950/30 light:hover:bg-slate-50 flex items-center gap-2"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                      Holdings & Positions P&L
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('watchlist');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-purple-950/30 light:hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                      Custom Watchlists
                    </button>
                    <button
                      onClick={() => {
                        setIsAddMoneyOpen(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-purple-950/30 light:hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Wallet className="w-3.5 h-3.5 text-amber-400" />
                      Add Funds ({accountProfile.bankName} {accountProfile.accountNumber})
                    </button>
                    <button
                      onClick={() => {
                        setIsInstallModalOpen(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-purple-950/30 light:hover:bg-slate-50 flex items-center gap-2 text-purple-300 font-semibold"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                      Install Upstox on Mobile
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('calculators');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-purple-950/30 light:hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                      Financial Calculators
                    </button>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-800 light:border-slate-100 px-4 py-2 text-[10px] text-slate-500">
                    Upstox Pro • RKSV Securities (SEBI: INZ000185137)
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
