import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  PageType, 
  Stock, 
  MutualFund, 
  IPOItem, 
  PortfolioHolding, 
  ActiveSip, 
  OrderRecord, 
  Watchlist,
  MFTransactionRecord,
  StockTransactionRecord,
  AccountProfile
} from '../types';
import { 
  ALL_STOCKS, 
  US_STOCKS, 
  MUTUAL_FUNDS, 
  IPO_LIST, 
  INITIAL_PORTFOLIO_HOLDINGS, 
  INITIAL_ACTIVE_SIPS, 
  INITIAL_ORDERS,
  INITIAL_ACCOUNT_PROFILE,
  INITIAL_STOCK_TRANSACTIONS,
  INITIAL_MF_TRANSACTIONS,
  MARKET_INDICES,
  MarketIndex
} from '../data/mockData';

interface OrderModalState {
  isOpen: boolean;
  stock?: Stock;
  defaultType: 'BUY' | 'SELL';
  defaultProduct: 'Delivery' | 'Intraday';
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activePage: PageType;
  navigateTo: (page: PageType, extra?: { stockId?: string; fundId?: string; txFilter?: 'all' | 'stocks' | 'mutual-funds' | 'fno' | 'ipo' | 'us-stocks' }) => void;
  goBack: () => void;
  previousPageName: string;
  canGoBack: boolean;
  selectedStockId: string;
  selectedFundId: string;
  stocks: Stock[];
  usStocks: Stock[];
  indices: MarketIndex[];
  funds: MutualFund[];
  ipos: IPOItem[];
  portfolio: PortfolioHolding[];
  activeSips: ActiveSip[];
  orders: OrderRecord[];
  stockTransactions: StockTransactionRecord[];
  mfTransactions: MFTransactionRecord[];
  accountProfile: AccountProfile;
  txCategoryFilter: 'all' | 'stocks' | 'mutual-funds' | 'fno' | 'ipo' | 'us-stocks';
  setTxCategoryFilter: (cat: 'all' | 'stocks' | 'mutual-funds' | 'fno' | 'ipo' | 'us-stocks') => void;
  openTransactionsForCategory: (cat?: 'all' | 'stocks' | 'mutual-funds' | 'fno' | 'ipo' | 'us-stocks') => void;
  balance: number;
  watchlists: Watchlist[];
  activeWatchlistId: string;
  setActiveWatchlistId: (id: string) => void;
  createWatchlist: (name: string) => void;
  toggleWatchlist: (stockId: string) => void;
  isInWatchlist: (stockId: string) => boolean;
  orderModal: OrderModalState;
  openOrderModal: (stock: Stock, type?: 'BUY' | 'SELL', product?: 'Delivery' | 'Intraday') => void;
  closeOrderModal: () => void;
  executeOrder: (stock: Stock, type: 'BUY' | 'SELL', product: 'Delivery' | 'Intraday', shares: number, price: number) => boolean;
  addBalance: (amount: number) => void;
  startSip: (fund: MutualFund, monthlyAmount: number, debitDay?: number) => void;
  applyIpo: (ipo: IPOItem, lots: number, upiId: string) => boolean;
  isAddMoneyOpen: boolean;
  setIsAddMoneyOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  isLiveMarket: boolean;
  toggleLiveMarket: () => void;
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;
  recentTicks: Record<string, 'up' | 'down'>;
  lastUpdatedTime: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activePage, setActivePage] = useState<PageType>('stocks');
  const [selectedStockId, setSelectedStockId] = useState<string>('reliance');
  const [selectedFundId, setSelectedFundId] = useState<string>('quant-small-cap');

  const [stocks, setStocks] = useState<Stock[]>(ALL_STOCKS);
  const [usStocks, setUsStocks] = useState<Stock[]>(US_STOCKS);
  const [indices, setIndices] = useState<MarketIndex[]>(MARKET_INDICES);
  const [funds] = useState<MutualFund[]>(MUTUAL_FUNDS);
  const [ipos, setIpos] = useState<IPOItem[]>(IPO_LIST);
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>(INITIAL_PORTFOLIO_HOLDINGS);
  const [activeSips, setActiveSips] = useState<ActiveSip[]>(INITIAL_ACTIVE_SIPS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [balance, setBalance] = useState<number>(64500.50);

  // Live Market streaming state
  const [isLiveMarket, setIsLiveMarket] = useState<boolean>(true);
  const [recentTicks, setRecentTicks] = useState<Record<string, 'up' | 'down'>>({});
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const [accountProfile] = useState<AccountProfile>(INITIAL_ACCOUNT_PROFILE);
  const [stockTransactions, setStockTransactions] = useState<StockTransactionRecord[]>(INITIAL_STOCK_TRANSACTIONS);
  const [mfTransactions, setMfTransactions] = useState<MFTransactionRecord[]>(INITIAL_MF_TRANSACTIONS);
  const [txCategoryFilter, setTxCategoryFilter] = useState<'all' | 'stocks' | 'mutual-funds' | 'fno' | 'ipo' | 'us-stocks'>('all');
  const [history, setHistory] = useState<PageType[]>([]);

  const [watchlists, setWatchlists] = useState<Watchlist[]>([
    { id: 'w1', name: 'My Watchlist', stockIds: ['reliance', 'tatamotors', 'zomato', 'suzlon'] },
    { id: 'w2', name: 'Bluechips', stockIds: ['reliance', 'tcs', 'hdfcbank', 'infosys', 'itc'] },
    { id: 'w3', name: 'High Growth', stockIds: ['zomato', 'suzlon', 'cdsl', 'jiofin'] },
  ]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string>('w1');

  const [orderModal, setOrderModal] = useState<OrderModalState>({
    isOpen: false,
    stock: undefined,
    defaultType: 'BUY',
    defaultProduct: 'Delivery',
  });

  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLiveMarket = () => {
    setIsLiveMarket(prev => {
      const next = !prev;
      addToast(
        next ? 'Live Market Feed Connected' : 'Live Feed Paused',
        next ? 'Receiving real-time tick-by-tick NSE/BSE updates.' : 'Price updates paused.',
        'info'
      );
      return next;
    });
  };

  // Real-time market tick-by-tick simulation loop (every 1.8 seconds)
  useEffect(() => {
    if (!isLiveMarket) return;

    const interval = setInterval(() => {
      setLastUpdatedTime(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );

      const ticksUpdate: Record<string, 'up' | 'down'> = {};

      // 1. Pick 2 to 4 random stocks to tick
      setStocks(prevStocks => {
        const nextStocks = [...prevStocks];
        const numUpdates = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 stocks
        
        for (let i = 0; i < numUpdates; i++) {
          const randIdx = Math.floor(Math.random() * nextStocks.length);
          const target = nextStocks[randIdx];
          
          // Realistic NSE tick in 0.05 multiples
          const isUp = Math.random() > 0.48; // slight upward drift
          const magnitude = (target.price * 0.0006 * Math.random()) + 0.05;
          const tickDelta = (isUp ? 1 : -1) * (Math.round(magnitude * 20) / 20);

          const newPrice = Number(Math.max(1, target.price + tickDelta).toFixed(2));
          const newChange = Number((newPrice - target.prevClose).toFixed(2));
          const newChangePct = Number(((newChange / target.prevClose) * 100).toFixed(2));
          const newDayLow = Math.min(target.dayLow, newPrice);
          const newDayHigh = Math.max(target.dayHigh, newPrice);

          // Update 1D chart data last point
          const chart1D = [...target.chartData['1D']];
          chart1D[chart1D.length - 1] = newPrice;

          ticksUpdate[target.id] = isUp ? 'up' : 'down';

          nextStocks[randIdx] = {
            ...target,
            price: newPrice,
            change: newChange,
            changePercent: newChangePct,
            dayLow: newDayLow,
            dayHigh: newDayHigh,
            chartData: {
              ...target.chartData,
              '1D': chart1D,
            },
          };
        }

        return nextStocks;
      });

      // 2. Also tick 1 US stock occasionally
      if (Math.random() > 0.5) {
        setUsStocks(prevUs => {
          const nextUs = [...prevUs];
          const randIdx = Math.floor(Math.random() * nextUs.length);
          const target = nextUs[randIdx];
          const isUp = Math.random() > 0.48;
          const tickDelta = (isUp ? 1 : -1) * Number((Math.random() * 0.25 + 0.05).toFixed(2));
          const newPrice = Number(Math.max(1, target.price + tickDelta).toFixed(2));
          const newChange = Number((newPrice - target.prevClose).toFixed(2));
          const newChangePct = Number(((newChange / target.prevClose) * 100).toFixed(2));
          
          ticksUpdate[target.id] = isUp ? 'up' : 'down';

          nextUs[randIdx] = {
            ...target,
            price: newPrice,
            change: newChange,
            changePercent: newChangePct,
          };
          return nextUs;
        });
      }

      // 3. Update Indices (NIFTY 50, SENSEX, BANK NIFTY, FINNIFTY)
      setIndices(prevIndices => {
        return prevIndices.map(idx => {
          if (Math.random() > 0.35) {
            const isUp = Math.random() > 0.46;
            const deltaPoints = (isUp ? 1 : -1) * Number((Math.random() * 6.5 + 0.8).toFixed(2));
            const newVal = Number((idx.value + deltaPoints).toFixed(2));
            const newChng = Number((idx.change + deltaPoints).toFixed(2));
            const newPct = Number(((newChng / (newVal - newChng)) * 100).toFixed(2));

            const newSparkline = [...idx.sparkline];
            newSparkline[newSparkline.length - 1] = newVal;

            ticksUpdate[idx.id] = isUp ? 'up' : 'down';

            return {
              ...idx,
              value: newVal,
              change: newChng,
              changePercent: newPct,
              sparkline: newSparkline,
            };
          }
          return idx;
        });
      });

      setRecentTicks(ticksUpdate);

      // Clear the flash highlight after 700ms
      setTimeout(() => {
        setRecentTicks({});
      }, 700);

    }, 1800);

    return () => clearInterval(interval);
  }, [isLiveMarket]);

  // Keep portfolio current prices synced with live stocks
  useEffect(() => {
    setPortfolio(prevPortfolio => {
      let hasChange = false;
      const updated = prevPortfolio.map(h => {
        const live = stocks.find(s => s.id === h.stockId) || usStocks.find(s => s.id === h.stockId);
        if (live && live.price !== h.currentPrice) {
          hasChange = true;
          return { ...h, currentPrice: live.price };
        }
        return h;
      });
      return hasChange ? updated : prevPortfolio;
    });
  }, [stocks, usStocks]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = (
    page: PageType, 
    extra?: { 
      stockId?: string; 
      fundId?: string; 
      txFilter?: 'all' | 'stocks' | 'mutual-funds' | 'fno' | 'ipo' | 'us-stocks';
    }
  ) => {
    if (extra?.stockId) setSelectedStockId(extra.stockId);
    if (extra?.fundId) setSelectedFundId(extra.fundId);
    if (extra?.txFilter) setTxCategoryFilter(extra.txFilter);
    
    if (page !== activePage) {
      setHistory(prev => [...prev, activePage]);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(old => old.slice(0, -1));
      setActivePage(prev);
    } else {
      // Smart fallback based on current page
      if (activePage === 'stock-detail') {
        setActivePage('stocks');
      } else if (activePage === 'fund-detail') {
        setActivePage('mutual-funds');
      } else if (activePage === 'transactions') {
        setActivePage('portfolio');
      } else {
        setActivePage('stocks');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTransactionsForCategory = (cat: 'all' | 'stocks' | 'mutual-funds' | 'fno' | 'ipo' | 'us-stocks' = 'all') => {
    setTxCategoryFilter(cat);
    navigateTo('transactions', { txFilter: cat });
  };

  const lastHistoryPage = history.length > 0 ? history[history.length - 1] : null;
  const previousPageName = (() => {
    const target = lastHistoryPage || (
      activePage === 'stock-detail' ? 'stocks' :
      activePage === 'fund-detail' ? 'mutual-funds' :
      activePage === 'transactions' ? 'portfolio' : 'stocks'
    );
    switch (target) {
      case 'stocks': return 'Stocks Explore';
      case 'mutual-funds': return 'Mutual Funds';
      case 'portfolio': return 'Holdings & Portfolio';
      case 'watchlist': return 'Watchlist';
      case 'fno': return 'Option Chain';
      case 'ipo': return 'IPO';
      case 'us-stocks': return 'US Stocks';
      case 'calculators': return 'Calculators';
      default: return 'Previous Page';
    }
  })();

  const canGoBack = true; // Always allow back navigation to outer page

  const openOrderModal = (stock: Stock, type: 'BUY' | 'SELL' = 'BUY', product: 'Delivery' | 'Intraday' = 'Delivery') => {
    setOrderModal({
      isOpen: true,
      stock,
      defaultType: type,
      defaultProduct: product,
    });
  };

  const closeOrderModal = () => {
    setOrderModal(prev => ({ ...prev, isOpen: false }));
  };

  const executeOrder = (stock: Stock, type: 'BUY' | 'SELL', product: 'Delivery' | 'Intraday', shares: number, price: number): boolean => {
    const totalAmount = shares * price;

    if (type === 'BUY') {
      if (balance < totalAmount) {
        addToast('Insufficient Balance', `You need ₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} but only have ₹${balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })} in your Upstox wallet.`, 'error');
        return false;
      }

      setBalance(prev => prev - totalAmount);
      // Update or add holding
      setPortfolio(prev => {
        const existing = prev.find(h => h.stockId === stock.id);
        if (existing) {
          const totalExistingValue = existing.shares * existing.avgBuyPrice;
          const newTotalShares = existing.shares + shares;
          const newAvgPrice = (totalExistingValue + totalAmount) / newTotalShares;
          return prev.map(h => h.stockId === stock.id ? { ...h, shares: newTotalShares, avgBuyPrice: newAvgPrice, currentPrice: stock.price } : h);
        } else {
          return [
            ...prev,
            {
              id: `hold-${Date.now()}`,
              stockId: stock.id,
              symbol: stock.symbol,
              name: stock.name,
              shares,
              avgBuyPrice: price,
              currentPrice: stock.price,
              type: stock.marketCap.startsWith('$') ? 'US Stock' : 'Stock',
            }
          ];
        }
      });
    } else {
      // SELL
      const existing = portfolio.find(h => h.stockId === stock.id);
      if (!existing || existing.shares < shares) {
        addToast('Holdings Exceeded', `You can only sell up to ${existing ? existing.shares : 0} shares of ${stock.symbol}.`, 'error');
        return false;
      }

      setBalance(prev => prev + totalAmount);
      setPortfolio(prev => {
        const remainingShares = existing.shares - shares;
        if (remainingShares === 0) {
          return prev.filter(h => h.stockId !== stock.id);
        }
        return prev.map(h => h.stockId === stock.id ? { ...h, shares: remainingShares } : h);
      });
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const timestamp = `${dateStr}, ${timeStr}`;

    // Add to orders history
    const newOrder: OrderRecord = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      symbol: stock.symbol,
      name: stock.name,
      type,
      product,
      shares,
      price,
      totalAmount,
      status: 'Executed',
      timestamp,
    };

    // Add to stock detailed transaction history
    const newStockTx: StockTransactionRecord = {
      id: `stk-tx-${Date.now()}`,
      stockId: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      type,
      product,
      shares,
      price,
      totalAmount,
      date: dateStr,
      timestamp,
      status: 'Executed',
      exchange: stock.exchange === 'Both' ? 'NSE' : (stock.exchange as any) || 'NSE',
      orderId: `ORD-${Date.now().toString().slice(-8)}`,
      brokerage: 0.00,
      stt: Number((totalAmount * 0.001).toFixed(2)),
      settlementDate: 'T+1 Cleared',
    };

    setOrders(prev => [newOrder, ...prev]);
    setStockTransactions(prev => [newStockTx, ...prev]);

    addToast(
      `${type === 'BUY' ? 'Buy' : 'Sell'} Order Executed`,
      `${shares} shares of ${stock.symbol} ${type === 'BUY' ? 'purchased' : 'sold'} at ₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (Account: Twinkle Singh)`,
      'success'
    );
    closeOrderModal();
    return true;
  };

  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
    addToast('Funds Added Successfully', `₹${amount.toLocaleString('en-IN')} credited to your Upstox Wallet via Instant UPI (Account: Twinkle Singh).`, 'success');
    setIsAddMoneyOpen(false);
  };

  const startSip = (fund: MutualFund, monthlyAmount: number, debitDay: number = 25) => {
    if (balance < monthlyAmount) {
      addToast('Low Wallet Balance', `First installment of ₹${monthlyAmount} requires sufficient wallet balance. Please add funds.`, 'error');
      setIsAddMoneyOpen(true);
      return;
    }

    setBalance(prev => prev - monthlyAmount);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const timestamp = `${dateStr}, ${timeStr}`;
    const units = Number((monthlyAmount / fund.nav).toFixed(4));

    // Record mutual fund transaction with date, NAV and units detail
    const newMfTx: MFTransactionRecord = {
      id: `mf-tx-${Date.now()}`,
      fundId: fund.id,
      fundName: fund.name,
      category: fund.category,
      type: 'SIP Auto-Debit',
      date: dateStr,
      timestamp,
      amount: monthlyAmount,
      nav: fund.nav,
      units,
      folioNumber: `FOL-${Math.floor(1000000 + Math.random() * 9000000)}/25`,
      status: 'Completed',
      mandateBank: 'HDFC Bank (•••• 4821)',
      debitDay: '25th of every month',
    };
    setMfTransactions(prev => [newMfTx, ...prev]);

    const existing = activeSips.find(s => s.fundId === fund.id);
    if (existing) {
      setActiveSips(prev => prev.map(s => s.fundId === fund.id ? {
        ...s,
        monthlyAmount,
        totalInvested: s.totalInvested + monthlyAmount,
        installmentsPaid: s.installmentsPaid + 1,
        currentValue: s.currentValue + monthlyAmount * 1.05,
        nextDate: '25th Nov 2026',
        debitDay: '25th of every month',
      } : s));
    } else {
      setActiveSips(prev => [
        ...prev,
        {
          id: `sip-${Date.now()}`,
          fundId: fund.id,
          fundName: fund.name,
          monthlyAmount,
          installmentsPaid: 1,
          totalInvested: monthlyAmount,
          currentValue: monthlyAmount,
          nextDate: '25th Nov 2026',
          debitDay: '25th of every month',
        }
      ]);
    }

    addToast('SIP Started Successfully', `Monthly SIP of ₹${monthlyAmount.toLocaleString('en-IN')} with auto-debit on 25th of every month activated for ${fund.name} (Mandate: Twinkle Singh).`, 'success');
  };

  const applyIpo = (ipo: IPOItem, lots: number, upiId: string): boolean => {
    const requiredAmount = ipo.minInvestment * lots;
    if (balance < requiredAmount) {
      addToast('Insufficient Balance', `IPO application requires ₹${requiredAmount.toLocaleString('en-IN')}. Please add funds to proceed.`, 'error');
      return false;
    }

    setBalance(prev => prev - requiredAmount);
    setIpos(prev => prev.map(i => i.id === ipo.id ? { ...i, subscriptionTimes: Number((i.subscriptionTimes + 0.05).toFixed(2)) } : i));
    addToast('IPO Application Submitted', `Applied for ${lots} lot(s) of ${ipo.companyName} at ₹${requiredAmount.toLocaleString('en-IN')} (Mandate: Twinkle Singh).`, 'success');
    return true;
  };

  const createWatchlist = (name: string) => {
    if (!name.trim()) return;
    const newWl: Watchlist = {
      id: `wl-${Date.now()}`,
      name: name.trim(),
      stockIds: [],
    };
    setWatchlists(prev => [...prev, newWl]);
    setActiveWatchlistId(newWl.id);
    addToast('Watchlist Created', `Created "${name.trim()}" watchlist.`, 'info');
  };

  const toggleWatchlist = (stockId: string) => {
    setWatchlists(prev => prev.map(wl => {
      if (wl.id === activeWatchlistId) {
        const hasIt = wl.stockIds.includes(stockId);
        const updated = hasIt ? wl.stockIds.filter(id => id !== stockId) : [...wl.stockIds, stockId];
        addToast(
          hasIt ? 'Removed from Watchlist' : 'Added to Watchlist',
          `Stock updated in ${wl.name}`,
          'info'
        );
        return { ...wl, stockIds: updated };
      }
      return wl;
    }));
  };

  const isInWatchlist = (stockId: string) => {
    const currentWl = watchlists.find(wl => wl.id === activeWatchlistId);
    return currentWl ? currentWl.stockIds.includes(stockId) : false;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activePage,
        navigateTo,
        goBack,
        previousPageName,
        canGoBack,
        selectedStockId,
        selectedFundId,
        stocks,
        usStocks,
        indices,
        funds,
        ipos,
        portfolio,
        activeSips,
        orders,
        stockTransactions,
        mfTransactions,
        accountProfile,
        txCategoryFilter,
        setTxCategoryFilter,
        openTransactionsForCategory,
        balance,
        watchlists,
        activeWatchlistId,
        setActiveWatchlistId,
        createWatchlist,
        toggleWatchlist,
        isInWatchlist,
        orderModal,
        openOrderModal,
        closeOrderModal,
        executeOrder,
        addBalance,
        startSip,
        applyIpo,
        isAddMoneyOpen,
        setIsAddMoneyOpen,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        addToast,
        removeToast,
        isLiveMarket,
        toggleLiveMarket,
        isInstallModalOpen,
        setIsInstallModalOpen,
        recentTicks,
        lastUpdatedTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
