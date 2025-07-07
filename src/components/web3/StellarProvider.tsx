import React, { createContext, useContext, useState, useEffect } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { StellarWallet, StellarWalletType, getAvailableWallets, getWallet, getRecommendedWallet } from '../../lib/wallets/stellarWalletAdapter';

interface StellarContextType {
  publicKey: string | null;
  isConnected: boolean;
  activeChain: 'PUBLIC' | 'TESTNET';
  currentWallet: StellarWallet | null;
  availableWallets: StellarWallet[];
  connect: (walletType?: StellarWalletType) => Promise<void>;
  disconnect: () => Promise<void>;
  sign: (xdr: string) => Promise<string>;
  server: StellarSdk.Horizon.Server;
}

const StellarContext = createContext<StellarContextType | null>(null);

interface StellarProviderProps {
  children: React.ReactNode;
  network?: 'PUBLIC' | 'TESTNET';
  appName?: string;
}

export const StellarProvider: React.FC<StellarProviderProps> = ({
  children,
  network = 'PUBLIC',
  appName = "Stellar Bridge Hub"
}) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<StellarWallet | null>(null);
  const [availableWallets, setAvailableWallets] = useState<StellarWallet[]>([]);
  const [server, setServer] = useState<StellarSdk.Horizon.Server>(
    new StellarSdk.Horizon.Server('https://horizon.stellar.org')
  );

  useEffect(() => {
    // Set up the correct Horizon server based on network
    const horizonUrl = network === 'PUBLIC' 
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org';
    
    setServer(new StellarSdk.Horizon.Server(horizonUrl));

    // Get available wallets
    const wallets = getAvailableWallets();
    setAvailableWallets(wallets);

    // Check if already connected to any wallet
    const checkConnection = async () => {
      try {
        // Check stored wallet preference
        const storedWalletType = localStorage.getItem('stellar_wallet_type') as StellarWalletType;
        if (storedWalletType) {
          const wallet = getWallet(storedWalletType);
          if (wallet.isInstalled() && await wallet.isConnected()) {
            const userPublicKey = await wallet.getPublicKey();
            setCurrentWallet(wallet);
            setPublicKey(userPublicKey);
            setIsWalletConnected(true);
            console.log(`Restored connection to ${wallet.name}:`, userPublicKey);
          }
        }
      } catch (error) {
        console.warn('Failed to restore wallet connection:', error);
        localStorage.removeItem('stellar_wallet_type');
      }
    };

    checkConnection();
  }, [network]);

  const connect = async (walletType?: StellarWalletType) => {
    try {
      let wallet: StellarWallet;
      
      if (walletType) {
        wallet = getWallet(walletType);
      } else {
        // Auto-select best available wallet
        const recommended = getRecommendedWallet();
        if (!recommended) {
          alert('No Stellar wallets found. Please install a Stellar wallet like Freighter, Lobstr, or Hana.');
          return;
        }
        wallet = recommended;
      }

      if (!wallet.isInstalled()) {
        alert(`${wallet.name} wallet not found. Please install it first.`);
        return;
      }
      
      const userPublicKey = await wallet.connect();
      
      setCurrentWallet(wallet);
      setPublicKey(userPublicKey);
      setIsWalletConnected(true);
      
      // Store wallet preference
      localStorage.setItem('stellar_wallet_type', wallet.id);
      
      console.log(`Connected to ${wallet.name}:`, { publicKey: userPublicKey });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet. Please make sure it's installed and unlocked.`);
    }
  };

  const disconnect = async () => {
    if (currentWallet) {
      try {
        await currentWallet.disconnect();
        console.log(`Disconnected from ${currentWallet.name}`);
      } catch (error) {
        console.warn('Error disconnecting wallet:', error);
      }
    }
    
    setCurrentWallet(null);
    setPublicKey(null);
    setIsWalletConnected(false);
    localStorage.removeItem('stellar_wallet_type');
  };

  const sign = async (xdr: string): Promise<string> => {
    if (!publicKey || !currentWallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const networkPassphrase = network === 'PUBLIC' 
        ? StellarSdk.Networks.PUBLIC 
        : StellarSdk.Networks.TESTNET;
      
      const signedXDR = await currentWallet.signTransaction(xdr, networkPassphrase);
      return signedXDR;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  };

  const value: StellarContextType = {
    publicKey,
    isConnected: isWalletConnected,
    activeChain: network,
    currentWallet,
    availableWallets,
    connect,
    disconnect,
    sign,
    server
  };

  return (
    <StellarContext.Provider value={value}>
      {children}
    </StellarContext.Provider>
  );
};

export const useStellar = () => {
  const context = useContext(StellarContext);
  if (!context) {
    throw new Error('useStellar must be used within a StellarProvider');
  }
  return context;
};

// Compatibility hook for existing soroban-react code
export const useSorobanReact = () => {
  const { publicKey, isConnected, connect, disconnect, activeChain, server } = useStellar();
  
  return {
    address: publicKey,
    isConnected,
    connect,
    disconnect,
    activeChain: {
      name: activeChain === 'PUBLIC' ? 'mainnet' : 'testnet',
      networkPassphrase: activeChain === 'PUBLIC' 
        ? StellarSdk.Networks.PUBLIC 
        : StellarSdk.Networks.TESTNET,
      sorobanRpcUrl: activeChain === 'PUBLIC'
        ? 'https://soroban-rpc.mainnet.stellar.gateway.fm'
        : 'https://soroban-rpc.testnet.stellar.gateway.fm',
      networkUrl: activeChain === 'PUBLIC'
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org'
    },
    server,
    // Mock properties for compatibility
    connectors: [],
    chains: [],
    setActiveConnectorAndConnect: null,
    setActiveChain: null
  };
};

// Additional compatibility exports
export const contractInvoke = async (options: any) => {
  throw new Error('contractInvoke is deprecated. Use useStellarContract hook instead.');
};

export const useRegisteredContract = (contractId: string) => {
  return {
    contractAddress: contractId,
    // Add other contract utilities as needed
  };
};