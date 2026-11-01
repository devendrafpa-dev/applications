import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EasyBackButton } from '../components/EasyBackButton';
import { 
  Star, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Building2,
  Calendar,
  UserCheck,
  Check,
  Receipt
} from 'lucide-react';

export const StockDetail: React.FC = () => {
  const { 
    stocks, 
    usStocks, 
    selectedStockId, 
    navigateTo, 
    openOrderModal, 
    toggleWatchlist, 
    isInWatchlist, 
    portfolio, 
    recentTicks,
    stockTransactions,
    openTransactionsForCategory,
    accountProfile
  } = useApp();

  const allAvailable = [...stocks, ...usStocks];
  const stock = allAvailable.find(s => s.id === selectedStockId) || stocks[0];

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | '5Y'>('1D');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const inWl = isInWatchlist(stock.id);
  const holding = portfolio.find(h => h.stockId === stock.id);

  const isPositive = stock.change >= 0;
  const currentChartData = stock.chartData[timeframe] || stock.chartData['1D'];

  // Calculate high/low for chart bounds
  const minPrice = Math.min(...currentChartData);
  const maxPrice = Math.max(...currentChartData);
  const priceRange = maxPrice - minPrice || 1;

  // Hover price computation
  const activePrice = hoverIndex !== null ? currentChartData[hoverIndex] : stock.price;
  const activeChange = activePrice - currentChartData[0];
  const activeChangePct = (activeChange / currentChartData[0]) * 100;

  // Chart coordinate generator for 500x200 viewBox
  const width = 640;
  const height = 240;
  const paddingY = 24;

  const points = currentChartData.map((val, idx) => {
    const x = (idx / (currentChartData.length - 1)) * width;
    const y = height - paddingY - ((val - minPrice) / priceRange) * (height - paddingY * 2);
    return { x, y, val };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M0,${height} L${points.map(p => `${p.x},${p.y}`).join(' L')} L${width},${height} Z`;

  // Performance slider percentage
  const todayRange = stock.dayHigh - stock.dayLow || 1;
  const todayPct = Math.min(100, Math.max(0, ((stock.price - stock.dayLow) / todayRange) * 100));

  const yearRange = stock.yearHigh - stock.yearLow || 1;
  const yearPct = Math.min(100, Math.max(0, ((stock.price - stock.yearLow) / yearRange) * 100));

  const isUS = stock.marketCap.startsWith('$');
  const currencySymbol = isUS ? '$' : '₹';

  return (
    <div className="space-y-6 pb-20">
      
      {/* Easy Back Button & Category Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <EasyBackButton showBreadcrumb={true} currentPageName={stock.symbol} />

        <div className="flex items-center gap-2">
          <button
            onClick={() => openTransactionsForCategory('stocks')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all shadow-xs"
            title="View all stock transactions"
          >
            <Receipt className="w-3.5 h-3.5 text-purple-400" />
            <span>Stock Transactions</span>
          </button>

          <button
            onClick={() => toggleWatchlist(stock.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              inWl
                ? 'bg-amber-400/15 border-amber-400/30 text-amber-400'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white light:bg-white light:border-slate-200 light:text-slate-700'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${inWl ? 'fill-current' : ''}`} />
            <span>{inWl ? 'Watchlisted' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2-column layout (Chart & details left, Order Box right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Price Header, Chart, Performance, Depth, Fundamentals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stock Header & Live Price */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900 font-sans">
                    {stock.symbol}
                  </h1>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 light:bg-slate-100 text-slate-300 light:text-slate-700">
                    {stock.exchange}
                  </span>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800/60 light:bg-slate-100 text-slate-400">
                    {stock.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{stock.name} · {stock.sector}</p>
              </div>

              {holding && (
                <div className="text-right p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-400 font-medium block">In Your Portfolio</span>
                  <span className="text-xs font-mono font-bold text-white light:text-slate-900">
                    {holding.shares} Shares (Avg ₹{holding.avgBuyPrice})
                  </span>
                </div>
              )}
            </div>

            {/* Price Row */}
            <div className="mt-4 flex flex-wrap items-baseline gap-4">
              {(() => {
                const tick = recentTicks[stock.id];
                return (
                  <span className={`text-3xl font-mono tabular-nums font-bold transition-all px-1.5 py-0.5 rounded-lg ${
                    tick === 'up'
                      ? 'text-emerald-400 bg-emerald-500/20 ring-1 ring-emerald-500/40'
                      : tick === 'down'
                      ? 'text-rose-400 bg-rose-500/20 ring-1 ring-rose-500/40'
                      : 'text-white light:text-slate-900'
                  }`}>
                    {currencySymbol}{activePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                );
              })()}
              <div className={`flex items-center gap-1 font-mono tabular-nums text-sm font-bold ${
                activeChange >= 0 ? 'text-emerald-400 light:text-emerald-600' : 'text-rose-400 light:text-rose-600'
              }`}>
                {activeChange >= 0 ? '+' : ''}{activeChange.toFixed(2)} ({activeChange >= 0 ? '+' : ''}{activeChangePct.toFixed(2)}%)
                <span className="text-slate-500 text-xs font-sans font-normal ml-1">Today</span>
              </div>
            </div>

            {/* Chart Toolbar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 light:border-slate-100 pt-3">
              {/* Timeframe selector */}
              <div className="flex items-center gap-1">
                {(['1D', '1W', '1M', '1Y', '5Y'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setHoverIndex(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      timeframe === tf
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800 light:hover:text-slate-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart type toggle */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-800/60 light:bg-slate-100 border border-slate-700/60 light:border-slate-200">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                    chartType === 'line' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Line
                </button>
                <button
                  onClick={() => setChartType('candle')}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                    chartType === 'candle' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  Candles
                </button>
              </div>
            </div>

            {/* Interactive SVG Chart Canvas */}
            <div className="mt-4 relative h-64 w-full">
              {chartType === 'line' ? (
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox={`0 0 ${width} ${height}`}
                  preserveAspectRatio="none"
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide lines */}
                  <line x1="0" y1={paddingY} x2={width} y2={paddingY} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="0" y1={height - paddingY} x2={width} y2={height - paddingY} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />

                  {/* Gradient Area Fill */}
                  <path d={areaPath} fill="url(#chartGradient)" />

                  {/* Polyline */}
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#10B981' : '#F43F5E'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylineStr}
                  />

                  {/* Interactive Crosshair & Points */}
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={hoverIndex === idx ? 6 : 4}
                      className="cursor-pointer transition-all"
                      fill={hoverIndex === idx ? '#FFFFFF' : isPositive ? '#10B981' : '#F43F5E'}
                      stroke={isPositive ? '#10B981' : '#F43F5E'}
                      strokeWidth={hoverIndex === idx ? 2 : 1}
                      onMouseEnter={() => setHoverIndex(idx)}
                    />
                  ))}

                  {/* Active Hover vertical line */}
                  {hoverIndex !== null && points[hoverIndex] && (
                    <line
                      x1={points[hoverIndex].x}
                      y1={0}
                      x2={points[hoverIndex].x}
                      y2={height}
                      stroke="#94A3B8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}
                </svg>
              ) : (
                /* Candlestick view mode */
                <div className="w-full h-full flex items-center justify-between gap-1 px-4 py-2">
                  {currentChartData.map((val, idx) => {
                    const isGreen = idx === 0 || val >= currentChartData[idx - 1];
                    const open = idx === 0 ? val * 0.995 : currentChartData[idx - 1];
                    const close = val;
                    const high = Math.max(open, close) + Math.abs(open - close) * 0.4;
                    const low = Math.min(open, close) - Math.abs(open - close) * 0.4;
                    const candleHeight = Math.max(8, ((Math.abs(close - open)) / priceRange) * 160);

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoverIndex(idx)}
                        className="flex-1 flex flex-col items-center justify-center cursor-pointer group h-full relative"
                      >
                        {/* Upper wick */}
                        <div className={`w-[1.5px] h-6 ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {/* Body */}
                        <div
                          style={{ height: `${candleHeight}px` }}
                          className={`w-full max-w-[24px] rounded-xs ${
                            isGreen ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {/* Lower wick */}
                        <div className={`w-[1.5px] h-6 ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60 light:border-slate-100">
              <span>Low: {currencySymbol}{minPrice.toFixed(2)}</span>
              <span className="text-purple-400 font-sans font-semibold">Upstox Pro Real-time Feed</span>
              <span>High: {currencySymbol}{maxPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Performance: Today's Range & 52-Week Range */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Performance</h3>

            {/* Today's Low / High */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                <div>
                  <span className="text-slate-400 block text-[11px]">Today's Low</span>
                  <span className="font-bold text-slate-200 light:text-slate-800">{currencySymbol}{stock.dayLow.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Today's High</span>
                  <span className="font-bold text-slate-200 light:text-slate-800">{currencySymbol}{stock.dayHigh.toFixed(2)}</span>
                </div>
              </div>
              <div className="relative w-full h-2 rounded-full bg-slate-800 light:bg-slate-200">
                <div
                  style={{ width: `${todayPct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                />
                <div
                  style={{ left: `${todayPct}%` }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 shadow-xs"
                />
              </div>
            </div>

            {/* 52-Week Low / High */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                <div>
                  <span className="text-slate-400 block text-[11px]">52-Week Low</span>
                  <span className="font-bold text-slate-200 light:text-slate-800">{currencySymbol}{stock.yearLow.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">52-Week High</span>
                  <span className="font-bold text-slate-200 light:text-slate-800">{currencySymbol}{stock.yearHigh.toFixed(2)}</span>
                </div>
              </div>
              <div className="relative w-full h-2 rounded-full bg-slate-800 light:bg-slate-200">
                <div
                  style={{ width: `${yearPct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                />
                <div
                  style={{ left: `${yearPct}%` }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 shadow-xs"
                />
              </div>
            </div>

            {/* Key stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-800 light:border-slate-100 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[11px] font-sans">Open</span>
                <span className="font-bold text-slate-200 light:text-slate-800">{currencySymbol}{stock.open.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-sans">Prev. Close</span>
                <span className="font-bold text-slate-200 light:text-slate-800">{currencySymbol}{stock.prevClose.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-sans">Volume</span>
                <span className="font-bold text-slate-200 light:text-slate-800">{stock.volume}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px] font-sans">Lower / Upper</span>
                <span className="font-bold text-slate-200 light:text-slate-800">
                  {currencySymbol}{(stock.price * 0.9).toFixed(0)} - {(stock.price * 1.1).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Market Depth (Order Book) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Market Depth</h3>
              <span className="text-xs text-slate-400 font-mono">Total Bids: 58% · Total Asks: 42%</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {/* Buy Bids */}
              <div>
                <div className="grid grid-cols-3 text-slate-500 pb-2 border-b border-slate-800 text-[11px] font-sans">
                  <span>Bid Price</span>
                  <span className="text-right">Orders</span>
                  <span className="text-right">Qty</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {[
                    { price: stock.price - 0.20, orders: 42, qty: 12500 },
                    { price: stock.price - 0.45, orders: 38, qty: 8900 },
                    { price: stock.price - 0.80, orders: 65, qty: 24000 },
                    { price: stock.price - 1.10, orders: 29, qty: 6400 },
                    { price: stock.price - 1.50, orders: 51, qty: 15200 },
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-3 py-1.5 text-emerald-400">
                      <span>₹{row.price.toFixed(2)}</span>
                      <span className="text-right text-slate-400">{row.orders}</span>
                      <span className="text-right font-bold">{row.qty.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sell Asks */}
              <div>
                <div className="grid grid-cols-3 text-slate-500 pb-2 border-b border-slate-800 text-[11px] font-sans">
                  <span>Ask Price</span>
                  <span className="text-right">Orders</span>
                  <span className="text-right">Qty</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {[
                    { price: stock.price + 0.15, orders: 25, qty: 9800 },
                    { price: stock.price + 0.35, orders: 44, qty: 14200 },
                    { price: stock.price + 0.70, orders: 19, qty: 5400 },
                    { price: stock.price + 0.95, orders: 32, qty: 8900 },
                    { price: stock.price + 1.40, orders: 48, qty: 16800 },
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-3 py-1.5 text-rose-400">
                      <span>₹{row.price.toFixed(2)}</span>
                      <span className="text-right text-slate-400">{row.orders}</span>
                      <span className="text-right font-bold">{row.qty.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fundamentals & Key Metrics */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Fundamentals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Market Cap</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{stock.marketCap}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">P/E Ratio</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{stock.pe}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">P/B Ratio</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{stock.pb}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Industry P/E</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{stock.industryPe}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Debt to Equity</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{stock.debtToEquity}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">ROE (Return on Equity)</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{stock.roe}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">EPS (TTM)</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">₹{stock.eps}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Dividend Yield</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">{stock.dividendYield}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Book Value</span>
                <span className="font-mono tabular-nums font-bold text-slate-100 light:text-slate-900 text-sm">₹{stock.bookValue}</span>
              </div>
            </div>
          </div>

          {/* Financials (Quarterly Bar Chart) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Financials (Quarterly Revenue & Profit)</h3>
              <span className="text-xs text-slate-400">All figures in ₹ Crores</span>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-4">
              {stock.financials.quarters.map((q, idx) => {
                const rev = stock.financials.revenue[idx];
                const prof = stock.financials.profit[idx];
                const maxRev = Math.max(...stock.financials.revenue);
                const heightPct = (rev / maxRev) * 100;

                return (
                  <div key={q} className="flex flex-col items-center gap-2">
                    <div className="h-32 w-full flex items-end justify-center gap-1.5 bg-slate-900/50 light:bg-slate-100 rounded-lg p-1.5">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-4 rounded-xs bg-emerald-500/80 group-hover:bg-emerald-400 transition-all"
                        title={`Revenue: ₹${rev.toLocaleString()} Cr`}
                      />
                      {/* Profit Bar */}
                      <div
                        style={{ height: `${Math.max(6, (prof / maxRev) * 100 * 3)}%` }}
                        className="w-4 rounded-xs bg-teal-400"
                        title={`Profit: ₹${prof.toLocaleString()} Cr`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{q}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-xs bg-emerald-500" />
                <span className="text-slate-300 light:text-slate-700">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-xs bg-teal-400" />
                <span className="text-slate-300 light:text-slate-700">Net Profit</span>
              </div>
            </div>
          </div>

          {/* Shareholding Pattern */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">Shareholding Pattern</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                <span className="text-[11px] text-slate-400 block">Promoters</span>
                <span className="font-mono tabular-nums font-bold text-lg text-emerald-400">{stock.shareholding.promoters}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                <span className="text-[11px] text-slate-400 block">Foreign Inst. (FII)</span>
                <span className="font-mono tabular-nums font-bold text-lg text-cyan-400">{stock.shareholding.fii}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                <span className="text-[11px] text-slate-400 block">Domestic Inst. (DII)</span>
                <span className="font-mono tabular-nums font-bold text-lg text-purple-400">{stock.shareholding.dii}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                <span className="text-[11px] text-slate-400 block">Retail / Public</span>
                <span className="font-mono tabular-nums font-bold text-lg text-amber-400">{stock.shareholding.retail}%</span>
              </div>
            </div>
          </div>

          {/* About Company */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-100 light:text-slate-900">About {stock.name}</h3>
            <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed">
              {stock.about}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80 light:border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Managing Director / CEO</span>
                <span className="font-semibold text-slate-200 light:text-slate-800">{stock.ceo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Founded</span>
                <span className="font-semibold text-slate-200 light:text-slate-800">{stock.founded}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Parent Organization</span>
                <span className="font-semibold text-slate-200 light:text-slate-800">{stock.name}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1 col): Sticky Action Box & Quick Trade */}
        <div className="space-y-4">
          <div className="sticky top-20 p-5 rounded-2xl border border-slate-800 bg-[#161b24] light:bg-white light:border-slate-200 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 light:border-slate-100">
              <span className="text-xs font-bold text-slate-300 light:text-slate-700">Quick Trade</span>
              <span className="text-xs font-mono font-bold text-emerald-400">0 Brokerage</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Live Price ({stock.exchange})</span>
                <span className="font-mono tabular-nums text-lg font-bold text-white light:text-slate-900">
                  {currencySymbol}{stock.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openOrderModal(stock, 'BUY')}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => openOrderModal(stock, 'SELL')}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-md shadow-rose-500/20"
                >
                  SELL
                </button>
              </div>

              <div className="pt-2 text-xs text-slate-400 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span>Delivery Order</span>
                  <span className="text-emerald-400 font-medium">Free (Zero Brokerage)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Intraday Order</span>
                  <span className="text-slate-300 light:text-slate-700">₹20 or 0.05%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Regulatory Taxes & STT</span>
                  <span className="text-slate-300 light:text-slate-700">As per actuals</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-purple-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Upstox Pro Smart Execution</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Direct DMA routing to NSE & BSE high-frequency matching engines.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Quick Trade Bar (Fixed above bottom nav on mobile) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 px-4 py-2.5 bg-[#0b0e14]/95 backdrop-blur-md border-t border-purple-900/40 light:bg-white/95 light:border-slate-200 shadow-2xl flex items-center justify-between gap-3 safe-area-bottom">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Live Price</span>
          <span className="font-mono tabular-nums font-bold text-sm text-white light:text-slate-900">
            {currencySymbol}{stock.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <button
            type="button"
            onClick={() => openOrderModal(stock, 'BUY')}
            className="flex-1 py-2 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-95"
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => openOrderModal(stock, 'SELL')}
            className="flex-1 py-2 rounded-xl font-bold text-xs bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-md active:scale-95"
          >
            SELL
          </button>
        </div>
      </div>

    </div>
  );
};
