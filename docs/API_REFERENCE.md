# 🔧 API Reference - Stellar Bridge Hub

## 📋 Overview

This document provides technical reference for the Stellar Bridge Hub APIs, adapters, and integration points.

## 🏗️ Architecture

### Core Adapters

```typescript
// Blend Protocol Adapter
interface BlendAdapter {
  getPools(): Promise<BlendPool[]>
  getUserPositions(userAddress: string): Promise<UserPosition[]>
  supply(poolId: string, amount: string): Promise<string>
  borrow(poolId: string, amount: string): Promise<string>
  repay(poolId: string, amount: string): Promise<string>
  withdraw(poolId: string, amount: string): Promise<string>
}

// Bridge Adapter
interface BridgeAdapter {
  getQuote(params: QuoteParams): Promise<BridgeQuote>
  executeBridge(route: BridgeRoute): Promise<string>
  trackTransaction(txId: string): Promise<TransactionStatus>
}
```

## 🌉 Bridge API

### Get Bridge Quote

```typescript
const quote = await bridgeAdapter.getQuote({
  fromChain: SupportedChains.ETHEREUM,
  toChain: SupportedChains.STELLAR,
  fromToken: 'USDC',
  toToken: 'USDC',
  amount: '1000'
});

// Response
interface BridgeQuote {
  routes: BridgeRoute[]
  bestRoute: BridgeRoute
  totalFee: string
  totalTime: string
}
```

### Execute Bridge

```typescript
const txId = await bridgeAdapter.executeBridge(route, userAddress);

// Returns transaction ID for tracking
// Example: "allbridge_1234567890_abc123"
```

### Track Transaction

```typescript
const status = await bridgeAdapter.trackTransaction(txId);

// Response
interface TransactionStatus {
  id: string
  status: 'pending' | 'confirmed' | 'failed'
  fromTxHash?: string
  toTxHash?: string
  progress: number // 0-100
}
```

## 💰 Blend Protocol API

### Get Available Pools

```typescript
const pools = await blendAdapter.getPools();

// Response
interface BlendPool {
  id: string
  name: string
  asset: string
  supplyAPY: number
  borrowAPY: number
  totalSupply: string
  totalBorrow: string
  utilizationRate: number
  liquidityAvailable: string
  collateralFactor: number
  liquidationThreshold: number
}
```

### Get User Positions

```typescript
const positions = await blendAdapter.getUserPositions(userAddress);

// Response
interface UserPosition {
  poolId: string
  supplied: string
  borrowed: string
  collateralValue: string
  borrowCapacity: string
  healthFactor: number
  liquidationRisk: 'low' | 'medium' | 'high'
}
```

### Supply to Pool

```typescript
const txId = await blendAdapter.supply('blend_fixed_v2', '1000');

// Returns Stellar transaction ID
// Example: "stellar_supply_blend_fixed_v2_1234567890"
```

## 🔗 Wallet Integration

### EVM Wallets (Wagmi)

```typescript
import { useAccount, useBalance } from 'wagmi'

// Get connected account
const { address, isConnected, chain } = useAccount()

// Get native balance
const { data: balance } = useBalance({ address })

// Get ERC-20 balance
const { data: tokenBalance } = useBalance({
  address,
  token: '0xA0b86a33E6441b8e2f7F936C1c1b5c2e1e8e8c8e' // USDC
})
```

### Stellar Wallets (Soroban React)

```typescript
import { useSorobanReact } from '@soroban-react/core'

// Get connected account
const { address, activeChain } = useSorobanReact()

// Execute contract call
const result = await contractInvoke({
  contractAddress: 'CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD',
  method: 'supply',
  args: [amount],
  signAndSend: true
})
```

## 📊 State Management

### Blend Store

```typescript
import { useBlendStore } from '@/lib/stores/blendStore'

const {
  pools,
  userPositions,
  isLoadingPools,
  loadPools,
  supply,
  borrow,
  repay,
  withdraw
} = useBlendStore()

// Load pools
await loadPools()

// Execute transactions
const txId = await supply('blend_fixed_v2', '1000')
```

### Bridge Store

```typescript
import { useBridgeStore } from '@/lib/stores/bridgeStore'

const {
  quote,
  isLoadingQuote,
  getQuote,
  executeBridge,
  trackTransaction
} = useBridgeStore()

// Get quote
await getQuote({
  fromChain: 'ethereum',
  toChain: 'stellar',
  fromToken: 'USDC',
  toToken: 'USDC',
  amount: '1000'
})
```

## 🔧 Configuration

### Environment Variables

```bash
# Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=mainnet
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-rpc.mainnet.stellar.org

# Contract Addresses
NEXT_PUBLIC_BLEND_USDC_POOL=CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD
NEXT_PUBLIC_YIELDBLOX_POOL=CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFS

# API Configuration
NEXT_PUBLIC_ALLBRIDGE_API_URL=https://core.api.allbridge.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_BLEND_INTEGRATION=true
NEXT_PUBLIC_ENABLE_REAL_BRIDGE_EXECUTION=true
```

### Contract Configuration

```typescript
// Live contract addresses
export const LIVE_CONTRACTS = {
  BLEND_FIXED_V2: 'CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD',
  YIELDBLOX_V2: 'CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFS',
  BLEND_ORACLE: 'CCVTVW2CVA7JLH4ROQGP3CU4T3EXVCK66AZGSM4MUQPXAI4QHCZPOATS'
}

// Token addresses per chain
export const TOKEN_ADDRESSES = {
  ethereum: {
    USDC: '0xA0b86a33E6441b8e2f7F936C1c1b5c2e1e8e8c8e',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  stellar: {
    USDC: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
    USDT: 'CCVQXKFHQGKJHVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJVJV'
  }
}
```

## 🧪 Testing

### Unit Tests

```typescript
// Test Blend adapter
describe('BlendAdapter', () => {
  it('should fetch pools', async () => {
    const adapter = new RealBlendProtocolAdapter()
    const pools = await adapter.getPools()
    expect(pools).toHaveLength(2)
    expect(pools[0].id).toBe('blend_fixed_v2')
  })
})

// Test Bridge adapter
describe('BridgeAdapter', () => {
  it('should get quote', async () => {
    const adapter = new AllbridgeAdapter()
    const quote = await adapter.getQuote({
      fromChain: 'ethereum',
      toChain: 'stellar',
      fromToken: 'USDC',
      toToken: 'USDC',
      amount: '1000'
    })
    expect(quote.bestRoute).toBeDefined()
  })
})
```

### Integration Tests

```typescript
// Test full bridge flow
describe('Bridge Integration', () => {
  it('should complete bridge to earn flow', async () => {
    // 1. Get quote
    const quote = await getQuote(params)
    
    // 2. Execute bridge
    const bridgeTxId = await executeBridge(quote.bestRoute)
    
    // 3. Auto-supply to Blend
    const supplyTxId = await supply('blend_fixed_v2', amount)
    
    expect(bridgeTxId).toBeDefined()
    expect(supplyTxId).toBeDefined()
  })
})
```

## 🚨 Error Handling

### Error Types

```typescript
// Bridge errors
class BridgeError extends Error {
  constructor(
    message: string,
    public code: 'INSUFFICIENT_BALANCE' | 'UNSUPPORTED_PAIR' | 'NETWORK_ERROR'
  ) {
    super(message)
  }
}

// Blend errors
class BlendError extends Error {
  constructor(
    message: string,
    public code: 'POOL_NOT_FOUND' | 'INSUFFICIENT_LIQUIDITY' | 'HEALTH_FACTOR_TOO_LOW'
  ) {
    super(message)
  }
}
```

### Error Handling Patterns

```typescript
try {
  const result = await blendAdapter.supply(poolId, amount)
  return result
} catch (error) {
  if (error instanceof BlendError) {
    switch (error.code) {
      case 'INSUFFICIENT_LIQUIDITY':
        throw new Error('Pool has insufficient liquidity')
      case 'HEALTH_FACTOR_TOO_LOW':
        throw new Error('Transaction would result in liquidation risk')
      default:
        throw new Error('Blend operation failed')
    }
  }
  throw error
}
```

## 📈 Performance

### Optimization Strategies

1. **Lazy Loading**: Components load only when needed
2. **Caching**: API responses cached for 30 seconds
3. **Batching**: Multiple operations batched when possible
4. **Debouncing**: User input debounced for quotes

### Monitoring

```typescript
// Performance tracking
const startTime = performance.now()
const result = await adapter.getPools()
const endTime = performance.now()

console.log(`Pool fetch took ${endTime - startTime} milliseconds`)
```

## 🔐 Security

### Best Practices

1. **Input Validation**: All user inputs validated
2. **Amount Limits**: Maximum transaction amounts enforced
3. **Rate Limiting**: API calls rate limited
4. **Error Sanitization**: Error messages sanitized

### Security Headers

```typescript
// Next.js security headers
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

---

## 📞 Support

- **Technical Issues**: GitHub Issues
- **API Questions**: Discord/Telegram
- **Integration Help**: Documentation team

**For more detailed examples, see the [integration tests](../tests/) and [example implementations](../examples/).**