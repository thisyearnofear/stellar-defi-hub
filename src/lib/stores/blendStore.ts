import { create } from 'zustand';
import { BlendPool, UserPosition } from '../../types/blend';
import { blendIntegration } from '../blend/blendIntegration';

interface BlendState {
  // Pools data
  pools: BlendPool[];
  isLoadingPools: boolean;
  poolsError: string | null;

  // User positions
  userPositions: UserPosition[];
  isLoadingPositions: boolean;
  positionsError: string | null;

  // Transaction state
  isTransacting: boolean;
  transactionError: string | null;

  // Selected pool for actions
  selectedPool: BlendPool | null;

  // Adapter
  blendAdapter: typeof blendIntegration;

  // Actions
  loadPools: () => Promise<void>;
  loadUserPositions: (userAddress: string) => Promise<void>;
  selectPool: (pool: BlendPool) => void;

  supply: (poolId: string, amount: string) => Promise<string>;
  borrow: (poolId: string, amount: string) => Promise<string>;
  repay: (poolId: string, amount: string) => Promise<string>;
  withdraw: (poolId: string, amount: string) => Promise<string>;

  clearErrors: () => void;
}

export const useBlendStore = create<BlendState>((set, get) => ({
  // Initial state
  pools: [],
  isLoadingPools: false,
  poolsError: null,

  userPositions: [],
  isLoadingPositions: false,
  positionsError: null,

  isTransacting: false,
  transactionError: null,

  selectedPool: null,

  // Initialize adapter
  blendAdapter: blendIntegration,

  // Actions
  loadPools: async () => {
    set({ isLoadingPools: true, poolsError: null });

    try {
      const pools = await get().blendAdapter.getPools();
      set({ pools, isLoadingPools: false });
    } catch (error) {
      console.error('Error loading pools:', error);
      set({
        poolsError: error instanceof Error ? error.message : 'Failed to load pools',
        isLoadingPools: false,
      });
    }
  },

  loadUserPositions: async (userAddress: string) => {
    if (!userAddress) {
      set({ userPositions: [] });
      return;
    }

    set({ isLoadingPositions: true, positionsError: null });

    try {
      const positions = await get().blendAdapter.getUserPositions(userAddress);
      set({ userPositions: positions, isLoadingPositions: false });
    } catch (error) {
      console.error('Error loading user positions:', error);
      set({
        positionsError: error instanceof Error ? error.message : 'Failed to load positions',
        isLoadingPositions: false,
      });
    }
  },

  selectPool: (pool: BlendPool) => set({ selectedPool: pool }),

  supply: async (poolId: string, amount: string) => {
    set({ isTransacting: true, transactionError: null });

    try {
      const txId = await get().blendAdapter.supply(poolId, amount);
      set({ isTransacting: false });

      // Refresh user positions after successful transaction
      // This would typically be done after transaction confirmation
      setTimeout(() => {
        // Would get current user address from wallet store
        // get().loadUserPositions(userAddress);
      }, 2000);

      return txId;
    } catch (error) {
      console.error('Supply error:', error);
      set({
        transactionError: error instanceof Error ? error.message : 'Supply failed',
        isTransacting: false,
      });
      throw error;
    }
  },

  borrow: async (poolId: string, amount: string) => {
    set({ isTransacting: true, transactionError: null });

    try {
      const txId = await get().blendAdapter.borrow(poolId, amount);
      set({ isTransacting: false });
      return txId;
    } catch (error) {
      console.error('Borrow error:', error);
      set({
        transactionError: error instanceof Error ? error.message : 'Borrow failed',
        isTransacting: false,
      });
      throw error;
    }
  },

  repay: async (poolId: string, amount: string) => {
    set({ isTransacting: true, transactionError: null });

    try {
      const txId = await get().blendAdapter.repay(poolId, amount);
      set({ isTransacting: false });
      return txId;
    } catch (error) {
      console.error('Repay error:', error);
      set({
        transactionError: error instanceof Error ? error.message : 'Repay failed',
        isTransacting: false,
      });
      throw error;
    }
  },

  withdraw: async (poolId: string, amount: string) => {
    set({ isTransacting: true, transactionError: null });

    try {
      const txId = await get().blendAdapter.withdraw(poolId, amount);
      set({ isTransacting: false });
      return txId;
    } catch (error) {
      console.error('Withdraw error:', error);
      set({
        transactionError: error instanceof Error ? error.message : 'Withdraw failed',
        isTransacting: false,
      });
      throw error;
    }
  },

  clearErrors: () => set({ poolsError: null, positionsError: null, transactionError: null }),
}));
