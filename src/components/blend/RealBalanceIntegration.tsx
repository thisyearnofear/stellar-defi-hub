import React, { useState, useEffect } from 'react';
import { Text, Badge, Spinner, HStack } from '@chakra-ui/react';
import { useAccount, useBalance } from 'wagmi';
import { useSorobanReact } from '../web3/StellarProvider';

interface RealBalanceDisplayProps {
  chain: string;
  token: string;
  onBalanceUpdate?: (balance: string) => void;
}

export const RealBalanceDisplay: React.FC<RealBalanceDisplayProps> = ({
  chain,
  token,
  onBalanceUpdate,
}) => {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);

  // EVM wallet integration
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { data: evmBalance, isLoading: isEvmLoading } = useBalance({
    address: evmAddress,
  });

  // Stellar wallet integration
  const sorobanContext = useSorobanReact();
  const stellarAddress = sorobanContext.address;

  useEffect(() => {
    const loadBalance = async () => {
      setIsLoading(true);

      try {
        if (chain.toLowerCase() === 'stellar' && stellarAddress) {
          // Load Stellar balance
          // This would integrate with Stellar SDK to get actual balances
          const mockStellarBalance = '1000'; // Placeholder
          setBalance(mockStellarBalance);
          onBalanceUpdate?.(mockStellarBalance);
        } else if (
          ['ethereum', 'avalanche', 'polygon'].includes(chain.toLowerCase()) &&
          isEvmConnected
        ) {
          // Use wagmi balance for EVM chains
          if (token === 'ETH' || token === 'AVAX' || token === 'MATIC') {
            // Native token
            const nativeBalance = evmBalance?.formatted || '0';
            setBalance(nativeBalance);
            onBalanceUpdate?.(nativeBalance);
          } else {
            // ERC-20 token - would need token contract integration
            const mockTokenBalance = '5000'; // Placeholder for USDC, USDT
            setBalance(mockTokenBalance);
            onBalanceUpdate?.(mockTokenBalance);
          }
        } else {
          setBalance('0');
          onBalanceUpdate?.('0');
        }
      } catch (error) {
        console.error('Failed to load balance:', error);
        setBalance('0');
        onBalanceUpdate?.('0');
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
  }, [chain, token, stellarAddress, isEvmConnected, evmBalance, onBalanceUpdate]);

  if (isLoading || isEvmLoading) {
    return (
      <HStack spacing={2}>
        <Spinner size="xs" />
        <Text fontSize="sm">Loading balance...</Text>
      </HStack>
    );
  }

  const formattedBalance = parseFloat(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  return (
    <Badge colorScheme="blue" size="sm">
      Balance: {formattedBalance} {token}
    </Badge>
  );
};

// Hook for getting real wallet balances
export const useWalletBalance = (chain: string, token: string) => {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // EVM integration
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const {
    data: evmBalance,
    isLoading: isEvmLoading,
    error: evmError,
  } = useBalance({
    address: evmAddress,
  });

  // Stellar integration
  const sorobanContext = useSorobanReact();
  const stellarAddress = sorobanContext.address;

  useEffect(() => {
    const loadBalance = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (chain.toLowerCase() === 'stellar' && stellarAddress) {
          // Stellar balance loading
          // In production, this would use Stellar SDK
          const stellarBalance = await loadStellarBalance(stellarAddress, token);
          setBalance(stellarBalance);
        } else if (['ethereum', 'avalanche', 'polygon'].includes(chain.toLowerCase())) {
          if (!isEvmConnected) {
            setBalance('0');
            return;
          }

          if (token === 'ETH' || token === 'AVAX' || token === 'MATIC') {
            // Native token
            setBalance(evmBalance?.formatted || '0');
          } else {
            // ERC-20 token
            const tokenBalance = await loadERC20Balance(evmAddress!, token, chain);
            setBalance(tokenBalance);
          }
        } else {
          setBalance('0');
        }
      } catch (err) {
        console.error('Balance loading error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load balance');
        setBalance('0');
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
  }, [chain, token, stellarAddress, isEvmConnected, evmAddress, evmBalance]);

  return {
    balance,
    formattedBalance: parseFloat(balance).toLocaleString(),
    isLoading: isLoading || isEvmLoading,
    error: error || evmError?.message,
    refresh: () => {
      // Trigger balance refresh
      setIsLoading(true);
    },
  };
};

// Helper functions for balance loading
async function loadStellarBalance(address: string, token: string): Promise<string> {
  // This would integrate with Stellar SDK
  // For now, return mock data
  const mockBalances: Record<string, string> = {
    XLM: '1000',
    USDC: '500',
    USDT: '300',
  };

  return mockBalances[token] || '0';
}

async function loadERC20Balance(address: string, token: string, chain: string): Promise<string> {
  // This would integrate with wagmi's useBalance for specific token contracts
  // For now, return mock data
  const mockBalances: Record<string, Record<string, string>> = {
    ethereum: {
      USDC: '5000',
      USDT: '3000',
    },
    avalanche: {
      USDC: '1200',
      USDT: '800',
    },
    polygon: {
      USDC: '800',
      USDT: '600',
    },
  };

  return mockBalances[chain.toLowerCase()]?.[token] || '0';
}
