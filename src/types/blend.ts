export interface BlendPool {
  id: string;
  name: string;
  asset: string;
  supplyAPY: number;
  borrowAPY: number;
  totalSupply: string;
  totalBorrow: string;
  utilizationRate: number;
  liquidityAvailable: string;
  collateralFactor: number;
  liquidationThreshold: number;
}

export interface UserPosition {
  poolId: string;
  supplied: string;
  borrowed: string;
  collateralValue: string;
  borrowCapacity: string;
  healthFactor: number;
  liquidationRisk: 'low' | 'medium' | 'high';
}

export interface BlendAdapter {
  getPools(): Promise<BlendPool[]>;
  getUserPositions(userAddress: string): Promise<UserPosition[]>;
  supply(poolId: string, amount: string): Promise<string>;
  borrow(poolId: string, amount: string): Promise<string>;
  repay(poolId: string, amount: string): Promise<string>;
  withdraw(poolId: string, amount: string): Promise<string>;
}
