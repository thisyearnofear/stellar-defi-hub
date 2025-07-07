// Stellar-specific types for our DeFi Hub

export interface StellarAsset {
  code: string;
  issuer?: string;
  balance: string;
  limit?: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
}

export interface StellarDEXOffer {
  id: string;
  seller: string;
  selling: StellarAsset;
  buying: StellarAsset;
  amount: string;
  price: string;
  price_r: {
    n: number;
    d: number;
  };
}

export interface StellarPayment {
  id: string;
  from: string;
  to: string;
  asset: StellarAsset;
  amount: string;
  created_at: string;
}

export interface StellarTradingPair {
  base: StellarAsset;
  counter: StellarAsset;
  base_volume: string;
  counter_volume: string;
  trade_count: number;
  open: string;
  low: string;
  high: string;
  close: string;
  change: string;
}

export interface StellarLiquidityPool {
  id: string;
  fee_bp: number;
  type: string;
  total_trustlines: string;
  total_shares: string;
  reserves: Array<{
    asset: string;
    amount: string;
  }>;
}

export interface StellarAnchor {
  name: string;
  domain: string;
  assets: StellarAsset[];
  currencies: Array<{
    code: string;
    issuer: string;
    status: string;
    display_decimals?: number;
  }>;
}