// Universal Stellar Wallet Adapter
// Supports: Freighter, Lobstr, Hana, Rabet, Albedo

export enum StellarWalletType {
  FREIGHTER = 'freighter',
  LOBSTR = 'lobstr', 
  HANA = 'hana',
  RABET = 'rabet',
  ALBEDO = 'albedo'
}

export interface StellarWallet {
  id: StellarWalletType;
  name: string;
  icon: string;
  isInstalled: () => boolean;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  signTransaction: (xdr: string, networkPassphrase: string) => Promise<string>;
  getPublicKey: () => Promise<string>;
  isConnected: () => Promise<boolean>;
}

// Freighter Wallet Implementation
class FreighterWallet implements StellarWallet {
  id = StellarWalletType.FREIGHTER;
  name = 'Freighter';
  icon = '/icons/freighter.svg';

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.freighter;
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInstalled()) return false;
    try {
      return await window.freighter.isConnected();
    } catch {
      return false;
    }
  }

  async connect(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Freighter wallet not installed');
    }
    await window.freighter.requestAccess();
    return await window.freighter.getPublicKey();
  }

  async disconnect(): Promise<void> {
    // Freighter doesn't have programmatic disconnect
    // Users disconnect through the extension
  }

  async getPublicKey(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Freighter wallet not installed');
    }
    return await window.freighter.getPublicKey();
  }

  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Freighter wallet not installed');
    }
    return await window.freighter.signTransaction(xdr, { networkPassphrase });
  }
}

// Lobstr Wallet Implementation
class LobstrWallet implements StellarWallet {
  id = StellarWalletType.LOBSTR;
  name = 'Lobstr';
  icon = '/icons/lobstr.svg';

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.lobstrApi;
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInstalled()) return false;
    try {
      const result = await window.lobstrApi.isConnected();
      return result.isConnected;
    } catch {
      return false;
    }
  }

  async connect(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Lobstr wallet not installed');
    }
    const result = await window.lobstrApi.connect();
    return result.publicKey;
  }

  async disconnect(): Promise<void> {
    if (this.isInstalled()) {
      await window.lobstrApi.disconnect();
    }
  }

  async getPublicKey(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Lobstr wallet not installed');
    }
    const result = await window.lobstrApi.getPublicKey();
    return result.publicKey;
  }

  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Lobstr wallet not installed');
    }
    const result = await window.lobstrApi.signTransaction({
      xdr,
      networkPassphrase
    });
    return result.signedXDR;
  }
}

// Hana Wallet Implementation
class HanaWallet implements StellarWallet {
  id = StellarWalletType.HANA;
  name = 'Hana';
  icon = '/icons/hana.svg';

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.hana;
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInstalled()) return false;
    try {
      return await window.hana.isConnected();
    } catch {
      return false;
    }
  }

  async connect(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Hana wallet not installed');
    }
    const result = await window.hana.connect();
    return result.publicKey;
  }

  async disconnect(): Promise<void> {
    if (this.isInstalled()) {
      await window.hana.disconnect();
    }
  }

  async getPublicKey(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Hana wallet not installed');
    }
    const result = await window.hana.getPublicKey();
    return result.publicKey;
  }

  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Hana wallet not installed');
    }
    const result = await window.hana.signTransaction({
      xdr,
      networkPassphrase
    });
    return result.signedXDR;
  }
}

// Rabet Wallet Implementation
class RabetWallet implements StellarWallet {
  id = StellarWalletType.RABET;
  name = 'Rabet';
  icon = '/icons/rabet.svg';

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.rabet;
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInstalled()) return false;
    try {
      return await window.rabet.isConnected();
    } catch {
      return false;
    }
  }

  async connect(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Rabet wallet not installed');
    }
    const result = await window.rabet.connect();
    return result.publicKey;
  }

  async disconnect(): Promise<void> {
    if (this.isInstalled()) {
      await window.rabet.disconnect();
    }
  }

  async getPublicKey(): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Rabet wallet not installed');
    }
    return await window.rabet.getPublicKey();
  }

  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('Rabet wallet not installed');
    }
    return await window.rabet.signTransaction(xdr, networkPassphrase);
  }
}

// Albedo Wallet Implementation (Web-based)
class AlbedoWallet implements StellarWallet {
  id = StellarWalletType.ALBEDO;
  name = 'Albedo';
  icon = '/icons/albedo.svg';

  isInstalled(): boolean {
    // Albedo is web-based, always "available"
    return true;
  }

  async isConnected(): Promise<boolean> {
    // Check if we have stored Albedo session
    return !!localStorage.getItem('albedo_public_key');
  }

  async connect(): Promise<string> {
    // Albedo uses popup-based connection
    const albedoUrl = `https://albedo.link/confirm?intent=public_key&pubkey=&callback=${encodeURIComponent(window.location.origin)}`;
    
    return new Promise((resolve, reject) => {
      const popup = window.open(albedoUrl, 'albedo', 'width=400,height=600');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://albedo.link') return;
        
        if (event.data.type === 'albedo_intent_result') {
          window.removeEventListener('message', handleMessage);
          popup?.close();
          
          if (event.data.result) {
            const publicKey = event.data.result.pubkey;
            localStorage.setItem('albedo_public_key', publicKey);
            resolve(publicKey);
          } else {
            reject(new Error('Albedo connection cancelled'));
          }
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Timeout after 5 minutes
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        popup?.close();
        reject(new Error('Albedo connection timeout'));
      }, 300000);
    });
  }

  async disconnect(): Promise<void> {
    localStorage.removeItem('albedo_public_key');
  }

  async getPublicKey(): Promise<string> {
    const publicKey = localStorage.getItem('albedo_public_key');
    if (!publicKey) {
      throw new Error('Albedo wallet not connected');
    }
    return publicKey;
  }

  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    const publicKey = await this.getPublicKey();
    const albedoUrl = `https://albedo.link/confirm?intent=tx&xdr=${encodeURIComponent(xdr)}&pubkey=${publicKey}&network=${encodeURIComponent(networkPassphrase)}&callback=${encodeURIComponent(window.location.origin)}`;
    
    return new Promise((resolve, reject) => {
      const popup = window.open(albedoUrl, 'albedo', 'width=400,height=600');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://albedo.link') return;
        
        if (event.data.type === 'albedo_intent_result') {
          window.removeEventListener('message', handleMessage);
          popup?.close();
          
          if (event.data.result) {
            resolve(event.data.result.xdr);
          } else {
            reject(new Error('Transaction signing cancelled'));
          }
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        popup?.close();
        reject(new Error('Transaction signing timeout'));
      }, 300000);
    });
  }
}

// Wallet Registry
export const STELLAR_WALLETS: Record<StellarWalletType, StellarWallet> = {
  [StellarWalletType.FREIGHTER]: new FreighterWallet(),
  [StellarWalletType.LOBSTR]: new LobstrWallet(),
  [StellarWalletType.HANA]: new HanaWallet(),
  [StellarWalletType.RABET]: new RabetWallet(),
  [StellarWalletType.ALBEDO]: new AlbedoWallet(),
};

// Get all available wallets
export function getAvailableWallets(): StellarWallet[] {
  return Object.values(STELLAR_WALLETS).filter(wallet => wallet.isInstalled());
}

// Get wallet by type
export function getWallet(type: StellarWalletType): StellarWallet {
  return STELLAR_WALLETS[type];
}

// Auto-detect best available wallet
export function getRecommendedWallet(): StellarWallet | null {
  const available = getAvailableWallets();
  if (available.length === 0) return null;
  
  // Priority order: Freighter > Lobstr > Hana > Rabet > Albedo
  const priority = [
    StellarWalletType.FREIGHTER,
    StellarWalletType.LOBSTR,
    StellarWalletType.HANA,
    StellarWalletType.RABET,
    StellarWalletType.ALBEDO
  ];
  
  for (const type of priority) {
    const wallet = available.find(w => w.id === type);
    if (wallet) return wallet;
  }
  
  return available[0];
}