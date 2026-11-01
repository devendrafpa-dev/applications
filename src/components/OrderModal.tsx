import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Info, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const OrderModal: React.FC = () => {
  const { orderModal, closeOrderModal, executeOrder, balance, portfolio } = useApp();
  const { isOpen, stock, defaultType, defaultProduct } = orderModal;

  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>(defaultType);
  const [productType, setProductType] = useState<'Delivery' | 'Intraday'>(defaultProduct);
  const [exchange, setExchange] = useState<'NSE' | 'BSE'>('NSE');
  const [shares, setShares] = useState<number>(1);
  const [priceType, setPriceType] = useState<'Market' | 'Limit'>('Market');
  const [limitPrice, setLimitPrice] = useState<number>(stock?.price || 0);
  const [hasStopLoss, setHasStopLoss] = useState<boolean>(false);
  const [slPrice, setSlPrice] = useState<number>(0);

  useEffect(() => {
    if (stock) {
      setOrderType(defaultType);
      setProductType(defaultProduct);
      setLimitPrice(stock.price);
      setSlPrice(Number((stock.price * 0.95).toFixed(2)));
      setShares(1);
    }
  }, [stock, defaultType, defaultProduct]);

  if (!isOpen || !stock) return null;

  const currentHolding = portfolio.find(h => h.stockId === stock.id);
  const sharesOwned = currentHolding ? currentHolding.shares : 0;

  const effectivePrice = priceType === 'Market' ? stock.price : limitPrice;
  const totalAmount = shares * effectivePrice;
  const isSufficientBalance = orderType === 'BUY' ? balance >= totalAmount : true;
  const canSell = orderType === 'SELL' ? sharesOwned >= shares : true;

  const handleSharesChange = (delta: number) => {
    setShares(prev => Math.max(1, prev + delta));
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0) return;
    executeOrder(stock, orderType, productType, shares, effectivePrice);
  };

  const isUS = stock.marketCap.startsWith('$');
  const currencySymbol = isUS ? '$' : '₹';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border-t sm:border shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto bg-[#161b22] border-slate-700/80 text-slate-100 light:bg-white light:border-slate-200 light:text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Pull Indicator */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3.5 sm:py-4 border-b border-slate-800 light:border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight">{stock.symbol}</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 light:bg-slate-100 text-slate-400">
                {exchange}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[240px]">{stock.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-mono tabular-nums font-bold text-sm block">
                {currencySymbol}{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-[11px] font-mono tabular-nums font-medium ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
            <button
              onClick={closeOrderModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleExecute} className="p-5 space-y-4">
          
          {/* BUY / SELL Segmented Control */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-200">
            <button
              type="button"
              onClick={() => setOrderType('BUY')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                orderType === 'BUY'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setOrderType('SELL')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                orderType === 'SELL'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SELL
            </button>
          </div>

          {/* Delivery vs Intraday */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 font-medium">Product Type</span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-800/80 light:bg-slate-100 border border-slate-700/60 light:border-slate-200">
              <button
                type="button"
                onClick={() => setProductType('Delivery')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  productType === 'Delivery'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 light:bg-white light:text-emerald-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Delivery (Longterm)
              </button>
              <button
                type="button"
                onClick={() => setProductType('Intraday')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  productType === 'Intraday'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 light:bg-white light:text-emerald-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Intraday (Misc)
              </button>
            </div>
          </div>

          {/* Exchange selection */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Exchange</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExchange('NSE')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  exchange === 'NSE' 
                    ? 'bg-slate-700 text-white light:bg-slate-900' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                NSE
              </button>
              <button
                type="button"
                onClick={() => setExchange('BSE')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  exchange === 'BSE' 
                    ? 'bg-slate-700 text-white light:bg-slate-900' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                BSE
              </button>
            </div>
          </div>

          {/* Quantity / Shares */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="qty-input" className="text-slate-400 font-medium">Quantity (Shares)</label>
              {orderType === 'SELL' && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Available in Demat: <strong className="text-slate-200 light:text-slate-800">{sharesOwned}</strong>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSharesChange(-5)}
                className="w-9 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 light:bg-slate-100 light:hover:bg-slate-200 text-slate-200 light:text-slate-800 font-bold text-sm flex items-center justify-center transition-colors"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleSharesChange(-1)}
                className="w-9 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 light:bg-slate-100 light:hover:bg-slate-200 text-slate-200 light:text-slate-800 font-bold text-sm flex items-center justify-center transition-colors"
              >
                -1
              </button>
              <input
                id="qty-input"
                type="number"
                min="1"
                value={shares}
                onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 h-10 px-3 text-center rounded-xl font-mono tabular-nums font-bold text-base bg-slate-900 light:bg-slate-50 border border-slate-700 light:border-slate-200 focus:outline-none focus:border-emerald-500 text-white light:text-slate-900"
              />
              <button
                type="button"
                onClick={() => handleSharesChange(1)}
                className="w-9 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 light:bg-slate-100 light:hover:bg-slate-200 text-slate-200 light:text-slate-800 font-bold text-sm flex items-center justify-center transition-colors"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => handleSharesChange(5)}
                className="w-9 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 light:bg-slate-100 light:hover:bg-slate-200 text-slate-200 light:text-slate-800 font-bold text-sm flex items-center justify-center transition-colors"
              >
                +5
              </button>
            </div>
          </div>

          {/* Price: Market vs Limit */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Price</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPriceType('Market')}
                  className={`text-xs font-semibold ${
                    priceType === 'Market' ? 'text-emerald-400 underline underline-offset-4' : 'text-slate-400'
                  }`}
                >
                  Market
                </button>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={() => setPriceType('Limit')}
                  className={`text-xs font-semibold ${
                    priceType === 'Limit' ? 'text-emerald-400 underline underline-offset-4' : 'text-slate-400'
                  }`}
                >
                  Limit Price
                </button>
              </div>
            </div>

            {priceType === 'Limit' ? (
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.05"
                  value={limitPrice}
                  onChange={e => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 pl-7 pr-3 rounded-xl font-mono tabular-nums font-semibold bg-slate-900 light:bg-slate-50 border border-slate-700 light:border-slate-200 focus:outline-none focus:border-emerald-500 text-white light:text-slate-900"
                />
              </div>
            ) : (
              <div className="w-full h-10 px-3 rounded-xl font-mono tabular-nums text-xs flex items-center justify-between bg-slate-800/40 light:bg-slate-100 border border-slate-700/60 light:border-slate-200 text-slate-300 light:text-slate-700">
                <span>At Market Price:</span>
                <span className="font-bold text-sm">{currencySymbol}{stock.price.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Stop Loss Toggle */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-300 light:text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasStopLoss}
                  onChange={e => setHasStopLoss(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0 w-3.5 h-3.5 bg-slate-800 border-slate-700"
                />
                <span>Add Stop Loss (SL Trigger)</span>
              </label>
              {hasStopLoss && (
                <span className="text-[11px] text-slate-400">Trigger price</span>
              )}
            </div>

            {hasStopLoss && (
              <div className="mt-2 relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.05"
                  value={slPrice}
                  onChange={e => setSlPrice(parseFloat(e.target.value) || 0)}
                  placeholder="SL Trigger Price"
                  className="w-full h-9 pl-7 pr-3 rounded-lg font-mono tabular-nums text-xs bg-slate-900 light:bg-slate-50 border border-slate-700 light:border-slate-200 focus:outline-none focus:border-emerald-500 text-white light:text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Financial calculations & charges */}
          <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Order Value</span>
              <span className="font-mono tabular-nums font-bold text-white light:text-slate-900">
                {currencySymbol}{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                Brokerage Charges
                <Info className="w-3 h-3 text-slate-500" />
              </span>
              <span className="text-emerald-400 font-medium">₹0.00 (Free for Delivery)</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 light:border-slate-200">
              <span className="text-slate-400">Available Balance</span>
              <span className="font-mono tabular-nums text-slate-300 light:text-slate-700">
                ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Validation Warnings */}
          {orderType === 'BUY' && !isSufficientBalance && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Insufficient balance. Required: ₹{totalAmount.toFixed(0)}, Available: ₹{balance.toFixed(0)}</span>
            </div>
          )}

          {orderType === 'SELL' && !canSell && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>You only own {sharesOwned} share(s) of this stock.</span>
            </div>
          )}

          {/* Execute CTA */}
          <button
            type="submit"
            disabled={(orderType === 'BUY' && !isSufficientBalance) || (orderType === 'SELL' && !canSell)}
            className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              orderType === 'BUY'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed shadow-emerald-500/20'
                : 'bg-rose-500 hover:bg-rose-400 text-white disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed shadow-rose-500/20'
            }`}
          >
            {orderType === 'BUY' ? 'BUY' : 'SELL'} {stock.symbol} ({shares} Shares)
          </button>

          <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Upstox Pro Direct DMA • Account: Twinkle Singh (CDSL Demat)
          </p>
        </form>
      </div>
    </div>
  );
};
