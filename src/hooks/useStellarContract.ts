import { useState, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { useStellar } from '../components/web3/StellarProvider';

export interface ContractInvokeOptions {
  contractAddress: string;
  method: string;
  args?: any[];
  fee?: string;
}

export const useStellarContract = () => {
  const { publicKey, sign, server, activeChain } = useStellar();
  const [isLoading, setIsLoading] = useState(false);

  const invoke = useCallback(
    async (options: ContractInvokeOptions) => {
      if (!publicKey) throw new Error('Wallet not connected');

      setIsLoading(true);
      try {
        const account = await server.loadAccount(publicKey);

        // Build the contract invocation transaction
        const contract = new StellarSdk.Contract(options.contractAddress);
        const operation = contract.call(options.method, ...(options.args || []));

        const transaction = new StellarSdk.TransactionBuilder(account, {
          fee: options.fee || StellarSdk.BASE_FEE,
          networkPassphrase:
            activeChain === 'PUBLIC' ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET,
        })
          .addOperation(operation)
          .setTimeout(30)
          .build();

        // Sign the transaction
        const signedXDR = await sign(transaction.toXDR());
        const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
          signedXDR,
          activeChain === 'PUBLIC' ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET
        );

        // Submit the transaction
        const result = await server.submitTransaction(signedTransaction);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, sign, server, activeChain]
  );

  return {
    invoke,
    isLoading,
  };
};
