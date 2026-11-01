export type PageType = 
  | 'stocks' 
  | 'mutual-funds' 
  | 'fno' 
  | 'ipo' 
  | 'us-stocks' 
  | 'portfolio' 
  | 'watchlist' 
  | 'calculators'
  | 'transactions'
  | 'stock-detail'
  | 'fund-detail';

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string; // e.g., "₹18.4 Lakh Cr"
  category: 'Large Cap' | 'Mid Cap' | 'Small Cap';
  sector: string;
  pe: number;
  pb: number;
  industryPe: number;
  debtToEquity: number;
  roe: number;
  eps: number;
  dividendYield: number;
  bookValue: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  volume: string;
  open: number;
  prevClose: number;
  about: string;
  ceo: string;
  founded: string;
  exchange: 'NSE' | 'BSE' | 'Both';
  chartData: {
    '1D': number[];
    '1W': number[];
    '1M': number[];
    '1Y': number[];
    '5Y': number[];
  };
  financials: {
    quarters: string[];
    revenue: number[]; // in Cr
    profit: number[];  // in Cr
  };
  shareholding: {
    promoters: number;
    retail: number;
    fii: number;
    dii: number;
  };
  isTrending?: boolean;
}

export interface MutualFund {
  id: string;
  name: string;
  category: 'Small Cap' | 'Flexi Cap' | 'Large & Mid Cap' | 'Index Fund' | 'ELSS Tax Saver' | 'Debt Fund';
  amc: string;
  nav: number;
  navChange: number;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  rating: number; // 1 to 5
  risk: 'Very High Risk' | 'High Risk' | 'Moderate Risk' | 'Low Risk';
  aum: string; // e.g. "₹58,400 Cr"
  expenseRatio: number; // e.g. 0.72%
  exitLoad: string;
  fundManager: string;
  minSip: number;
  chartData: number[];
  topHoldings: { company: string; weight: number; sector: string }[];
}

export interface OptionStrike {
  strikePrice: number;
  callOI: number;
  callChngOI: number;
  callLtp: number;
  callIv: number;
  putLtp: number;
  putIv: number;
  putChngOI: number;
  putOI: number;
}

export interface IPOItem {
  id: string;
  companyName: string;
  symbol: string;
  status: 'Open' | 'Upcoming' | 'Closed' | 'Listed';
  openDate: string;
  closeDate: string;
  priceRange: string;
  minInvestment: number;
  lotSize: number;
  issueSize: string;
  subscriptionTimes: number;
  expectedListingGain: string;
  listingPrice?: number;
  currentPrice?: number;
  listingDate?: string;
}

export interface PortfolioHolding {
  id: string;
  stockId: string;
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  type: 'Stock' | 'US Stock';
}

export interface ActiveSip {
  id: string;
  fundId: string;
  fundName: string;
  monthlyAmount: number;
  installmentsPaid: number;
  totalInvested: number;
  currentValue: number;
  nextDate: string;
  debitDay?: string; // e.g., '25th of every month'
}

export interface MFTransactionRecord {
  id: string;
  fundId: string;
  fundName: string;
  category: string;
  type: 'SIP Auto-Debit' | 'One-Time Lumpsum';
  date: string;
  timestamp: string;
  amount: number;
  nav: number; // NAV on the transaction date
  units: number; // Units allotted
  folioNumber: string;
  status: 'Completed' | 'Processing';
  mandateBank?: string;
  debitDay?: string;
}

export interface StockTransactionRecord {
  id: string;
  stockId: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  product: 'Delivery' | 'Intraday';
  shares: number;
  price: number;
  totalAmount: number;
  date: string;
  timestamp: string;
  status: 'Executed' | 'Settled';
  exchange: 'NSE' | 'BSE' | 'NASDAQ';
  orderId: string;
  brokerage: number;
  stt: number;
  settlementDate: string;
}

export interface OrderRecord {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  product: 'Delivery' | 'Intraday';
  shares: number;
  price: number;
  totalAmount: number;
  status: 'Executed' | 'Cancelled';
  timestamp: string;
}

export interface Watchlist {
  id: string;
  name: string;
  stockIds: string[];
}

export interface AccountProfile {
  name: string;
  ucc: string;
  pan: string;
  bankName: string;
  accountNumber: string;
  dpId: string;
  sipDebitDay: string;
  sipMandateStatus: 'Active' | 'Pending';
}
