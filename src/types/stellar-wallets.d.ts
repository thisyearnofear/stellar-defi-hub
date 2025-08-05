// Type definitions for Stellar wallet browser APIs

declare global {
  interface Window {
    freighter?: {
      isConnected(): Promise<boolean>;
      requestAccess(): Promise<void>;
      getPublicKey(): Promise<string>;
      signTransaction(xdr: string, options?: { networkPassphrase?: string }): Promise<string>;
      getNetwork(): Promise<string>;
    };

    lobstrApi?: {
      isConnected(): Promise<{ isConnected: boolean }>;
      connect(): Promise<{ publicKey: string }>;
      disconnect(): Promise<void>;
      getPublicKey(): Promise<{ publicKey: string }>;
      signTransaction(params: {
        xdr: string;
        networkPassphrase: string;
      }): Promise<{ signedXDR: string }>;
    };

    hana?: {
      isConnected(): Promise<boolean>;
      connect(): Promise<{ publicKey: string }>;
      disconnect(): Promise<void>;
      getPublicKey(): Promise<{ publicKey: string }>;
      signTransaction(params: {
        xdr: string;
        networkPassphrase: string;
      }): Promise<{ signedXDR: string }>;
    };

    rabet?: {
      isConnected(): Promise<boolean>;
      connect(): Promise<{ publicKey: string }>;
      disconnect(): Promise<void>;
      getPublicKey(): Promise<string>;
      signTransaction(xdr: string, networkPassphrase: string): Promise<string>;
    };
  }
}
