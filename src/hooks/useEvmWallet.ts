import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import {
  TOKEN_ADDRESSES,
  type SupportedChainId,
  type SupportedToken,
} from '../lib/wallets/evmWalletIntegration';
import { formatUnits } from 'viem';

export interface TokenBalance {
  symbol: string;
  balance: string;
  formatted: string;
  decimals: number;
}

export function useEvmWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [tokenBalances, setTokenBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  // Get native token balance
  const { data: nativeBalance } = useBalance({
    address,
  });

  // Get token balances for current chain
  const loadTokenBalances = async () => {
    if (!address || !chain || !isConnected) {
      setTokenBalances({});
      return;
    }

    setIsLoadingBalances(true);
    const balances: Record<string, TokenBalance> = {};

    try {
      const chainId = chain.id as SupportedChainId;
      const tokens = TOKEN_ADDRESSES[chainId];

      if (!tokens) {
        setTokenBalances({});
        setIsLoadingBalances(false);
        return;
      }

      // Add native token balance
      if (nativeBalance) {
        const nativeSymbol = chain.nativeCurrency.symbol;
        balances[nativeSymbol] = {
          symbol: nativeSymbol,
          balance: nativeBalance.value.toString(),
          formatted: nativeBalance.formatted,
          decimals: nativeBalance.decimals,
        };
      }

      // For now, we'll use mock balances for ERC-20 tokens
      // In production, you'd use wagmi's useBalance with token addresses
      const mockTokenBalances = {
        USDC: { balance: '5000000000', formatted: '5000.00', decimals: 6 }, // 5000 USDC
        USDT: { balance: '3000000000', formatted: '3000.00', decimals: 6 }, // 3000 USDT
      };

      Object.entries(tokens).forEach(([symbol, address]) => {
        if (address !== '0x0000000000000000000000000000000000000000') {
          const mockBalance = mockTokenBalances[symbol as keyof typeof mockTokenBalances];
          if (mockBalance) {
            balances[symbol] = {
              symbol,
              balance: mockBalance.balance,
              formatted: mockBalance.formatted,
              decimals: mockBalance.decimals,
            };
          }
        }
      });

      setTokenBalances(balances);
    } catch (error) {
      console.error('Error loading token balances:', error);
      setTokenBalances({});
    } finally {
      setIsLoadingBalances(false);
    }
  };

  useEffect(() => {
    loadTokenBalances();
  }, [address, chain, isConnected, nativeBalance]);

  const getTokenBalance = (symbol: string): TokenBalance | null => {
    return tokenBalances[symbol] || null;
  };

  const connectWallet = async (connectorId?: string) => {
    const connector = connectorId ? connectors.find((c) => c.id === connectorId) : connectors[0];

    if (connector) {
      try {
        await connect({ connector });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        throw error;
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setTokenBalances({});
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  return {
    // Connection state
    address,
    isConnected,
    chain,

    // Balances
    tokenBalances,
    isLoadingBalances,
    getTokenBalance,
    refreshBalances: loadTokenBalances,

    // Connection methods
    connect: connectWallet,
    disconnect: disconnectWallet,
    connectors,

    // Utilities
    formatBalance: (balance: string, decimals: number) => formatUnits(BigInt(balance), decimals),
  };
}
