// Blend Protocol Integration Hub
// This file orchestrates the connection to live Blend contracts

import { BlendAdapter, BlendPool, UserPosition } from '../../types/blend';
import { RealBlendProtocolAdapter } from './realBlendAdapter';
import { BlendProtocolAdapter } from './blendAdapter';

export class BlendIntegrationHub {
  private realAdapter: RealBlendProtocolAdapter;
  private fallbackAdapter: BlendProtocolAdapter;
  private useRealContracts: boolean;

  constructor() {
    this.useRealContracts = process.env.NEXT_PUBLIC_ENABLE_REAL_BLEND_INTEGRATION === 'true';
    this.realAdapter = new RealBlendProtocolAdapter();
    this.fallbackAdapter = new BlendProtocolAdapter();
  }

  async getPools(): Promise<BlendPool[]> {
    if (this.useRealContracts) {
      try {
        console.log('🔴 Fetching LIVE Blend pool data...');
        const pools = await this.realAdapter.getPools();
        console.log('✅ Live pool data loaded:', pools);
        return pools;
      } catch (error) {
        console.warn('⚠️ Live pool fetch failed, using fallback:', error);
        return await this.fallbackAdapter.getPools();
      }
    }

    return await this.fallbackAdapter.getPools();
  }

  async getUserPositions(userAddress: string): Promise<UserPosition[]> {
    if (this.useRealContracts && userAddress) {
      try {
        return await this.realAdapter.getUserPositions(userAddress);
      } catch (error) {
        console.warn('Live user positions fetch failed:', error);
        return await this.fallbackAdapter.getUserPositions(userAddress);
      }
    }

    return await this.fallbackAdapter.getUserPositions(userAddress);
  }

  async supply(poolId: string, amount: string): Promise<string> {
    if (this.useRealContracts) {
      try {
        console.log(`🔴 LIVE TRANSACTION: Supplying ${amount} to ${poolId}`);
        return await this.realAdapter.supply(poolId, amount);
      } catch (error) {
        console.error('Live supply failed:', error);
        throw error;
      }
    }

    return await this.fallbackAdapter.supply(poolId, amount);
  }

  async borrow(poolId: string, amount: string): Promise<string> {
    if (this.useRealContracts) {
      try {
        console.log(`🔴 LIVE TRANSACTION: Borrowing ${amount} from ${poolId}`);
        return await this.realAdapter.borrow(poolId, amount);
      } catch (error) {
        console.error('Live borrow failed:', error);
        throw error;
      }
    }

    return await this.fallbackAdapter.borrow(poolId, amount);
  }

  async repay(poolId: string, amount: string): Promise<string> {
    if (this.useRealContracts) {
      try {
        console.log(`🔴 LIVE TRANSACTION: Repaying ${amount} to ${poolId}`);
        return await this.realAdapter.repay(poolId, amount);
      } catch (error) {
        console.error('Live repay failed:', error);
        throw error;
      }
    }

    return await this.fallbackAdapter.repay(poolId, amount);
  }

  async withdraw(poolId: string, amount: string): Promise<string> {
    if (this.useRealContracts) {
      try {
        console.log(`🔴 LIVE TRANSACTION: Withdrawing ${amount} from ${poolId}`);
        return await this.realAdapter.withdraw(poolId, amount);
      } catch (error) {
        console.error('Live withdraw failed:', error);
        throw error;
      }
    }

    return await this.fallbackAdapter.withdraw(poolId, amount);
  }

  // Contract status and debugging
  getContractInfo() {
    return {
      isLive: this.useRealContracts,
      poolContract: 'CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD',
      oracleContract: 'CCVTVW2CVA7JLH4ROQGP3CU4T3EXVCK66AZGSM4MUQPXAI4QHCZPOATS',
      adminAccount: 'GAX2VVWVHU5YQY5J3NJBXKHI3FFKZN54BE6GRJCWSIKSBZTQWJJNJMPC',
      explorerUrl:
        'https://stellar.expert/explorer/public/contract/CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD',
      dashboardUrl:
        'https://mainnet.blend.capital/dashboard/?poolId=CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD',
    };
  }
}

// Export singleton instance
export const blendIntegration = new BlendIntegrationHub();
