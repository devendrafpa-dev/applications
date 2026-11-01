/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SubNav } from './components/SubNav';
import { IndicesBar } from './components/IndicesBar';
import { OrderModal } from './components/OrderModal';
import { AddMoneyModal } from './components/AddMoneyModal';
import { SearchModal } from './components/SearchModal';
import { ToastContainer } from './components/Toast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PWAInstallModal } from './components/PWAInstallModal';
import { UpstoxLogo } from './components/UpstoxLogo';

// Pages
import { StocksExplore } from './pages/StocksExplore';
import { StockDetail } from './pages/StockDetail';
import { MutualFundsExplore } from './pages/MutualFundsExplore';
import { MutualFundDetail } from './pages/MutualFundDetail';
import { OptionChainPage } from './pages/OptionChainPage';
import { IpoPage } from './pages/IpoPage';
import { UsStocksPage } from './pages/UsStocksPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { CalculatorsPage } from './pages/CalculatorsPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';

const MainLayout: React.FC = () => {
  const { activePage, isInstallModalOpen, setIsInstallModalOpen } = useApp();

  const isExploreCategory = [
    'stocks', 
    'mutual-funds', 
    'transactions',
    'fno', 
    'ipo', 
    'us-stocks', 
    'calculators',
    'stock-detail',
    'fund-detail'
  ].includes(activePage);

  const showIndices = ['stocks', 'fno', 'us-stocks'].includes(activePage);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 light:bg-[#f8fafc] light:text-slate-900 transition-colors pb-24 md:pb-0">
      
      {/* Top Header */}
      <Header />

      {/* Sub Category Switcher */}
      {isExploreCategory && <SubNav />}

      {/* Live Market Indices Bar */}
      {showIndices && <IndicesBar />}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {activePage === 'stocks' && <StocksExplore />}
        {activePage === 'stock-detail' && <StockDetail />}
        {activePage === 'mutual-funds' && <MutualFundsExplore />}
        {activePage === 'fund-detail' && <MutualFundDetail />}
        {activePage === 'transactions' && <TransactionHistoryPage />}
        {activePage === 'fno' && <OptionChainPage />}
        {activePage === 'ipo' && <IpoPage />}
        {activePage === 'us-stocks' && <UsStocksPage />}
        {activePage === 'portfolio' && <PortfolioPage />}
        {activePage === 'watchlist' && <WatchlistPage />}
        {activePage === 'calculators' && <CalculatorsPage />}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Modals & Notifications */}
      <OrderModal />
      <AddMoneyModal />
      <SearchModal />
      <PWAInstallModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
      />
      <ToastContainer />

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 light:border-slate-200 bg-[#090b10] light:bg-white text-slate-400 py-8 text-xs transition-colors mb-2 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <UpstoxLogo size="sm" showText={true} />
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px]">
              <span className="hover:text-slate-200 cursor-pointer">RKSV Securities India Pvt. Ltd.</span>
              <span className="hover:text-slate-200 cursor-pointer">SEBI Reg. INZ000185137</span>
              <span className="hover:text-slate-200 cursor-pointer">NSE: 13942</span>
              <span className="hover:text-slate-200 cursor-pointer">BSE: 6155</span>
              <span className="hover:text-slate-200 cursor-pointer">CDSL DP: 12081800</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Investments in securities market are subject to market risks, read all the related documents carefully before investing. Upstox is a registered trademark of RKSV Securities India Pvt. Ltd. Brokerage will not exceed the SEBI prescribed limit.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
