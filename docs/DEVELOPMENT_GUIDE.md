# 🛠️ Development Guide - Stellar Bridge Hub

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/stellar-bridge-hub.git
cd stellar-bridge-hub

# Install dependencies (use legacy-peer-deps for NEAR compatibility)
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── blend/          # Blend Protocol components
│   ├── bridge/         # Bridge interface components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   ├── portfolio/      # Portfolio dashboard
│   └── wallets/        # Wallet integration
├── hooks/              # Custom React hooks
├── lib/                # Core business logic
│   ├── blend/          # Blend Protocol adapters
│   ├── bridges/        # Bridge adapters
│   ├── config/         # Configuration
│   ├── stores/         # State management
│   ├── utils/          # Utilities
│   └── wallets/        # Wallet adapters
├── pages/              # Next.js pages
├── styles/             # Global styles
└── types/              # TypeScript definitions
```

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Stellar Network (Mainnet)
NEXT_PUBLIC_STELLAR_NETWORK=mainnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-rpc.mainnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"

# Live Blend Protocol Pools
NEXT_PUBLIC_BLEND_USDC_POOL=CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD
NEXT_PUBLIC_BLEND_XLM_POOL=CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD
NEXT_PUBLIC_BLEND_YIELDBLOX_POOL=CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFS

# Bridge APIs
NEXT_PUBLIC_ALLBRIDGE_API_URL=https://core.api.allbridge.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_BLEND_INTEGRATION=true
NEXT_PUBLIC_ENABLE_REAL_BRIDGE_EXECUTION=true
```

## 🧩 Key Components

### Wallet Integration

```typescript
// EVM Wallets (Ethereum, Avalanche, Polygon)
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Stellar Wallet
import { useSorobanReact } from '@soroban-react/core';
```

### State Management

```typescript
// Blend Protocol State
import { useBlendStore } from '../lib/stores/blendStore';

// Bridge State  
import { useBridgeStore } from '../lib/stores/bridgeStore';

// Multi-Wallet State
import { useMultiWalletStore } from '../lib/stores/multiWalletStore';
```

### Contract Integration

```typescript
// Blend Protocol
import { blendIntegration } from '../lib/blend/blendIntegration';

// Bridge Adapters
import { AllbridgeAdapter } from '../lib/bridges/allbridgeAdapter';
```

## 🔄 Development Workflow

### 1. Adding New Chains

```typescript
// 1. Update types
export enum SupportedChains {
  STELLAR = 'stellar',
  ETHEREUM = 'ethereum',
  NEW_CHAIN = 'new_chain', // Add here
}

// 2. Add wallet integration
// src/lib/wallets/newChainAdapter.ts

// 3. Update bridge adapters
// src/lib/bridges/newChainBridge.ts

// 4. Add to UI components
// src/components/wallets/WalletConnectionManager.tsx
```

### 2. Adding New Protocols

```typescript
// 1. Create protocol adapter
// src/lib/protocols/newProtocolAdapter.ts

// 2. Add to state management
// src/lib/stores/newProtocolStore.ts

// 3. Create UI components
// src/components/newProtocol/

// 4. Add to main navigation
// src/components/layout/Navigation.tsx
```

### 3. Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build
npm run build

# Test in production mode
npm run start
```

## 🐛 Debugging

### Common Issues

1. **Wallet Connection Failures**
   ```typescript
   // Check wallet provider setup
   console.log('EVM connected:', isEvmConnected);
   console.log('Stellar connected:', !!stellarAddress);
   ```

2. **Balance Loading Issues**
   ```typescript
   // Debug balance loading
   console.log('Loading balances for:', { chain, token });
   console.log('Wallet address:', address);
   ```

3. **Contract Call Failures**
   ```typescript
   // Check contract addresses
   console.log('Contract address:', contractAddress);
   console.log('Network:', networkPassphrase);
   ```

### Development Tools

- **React DevTools** - Component debugging
- **Wagmi DevTools** - EVM wallet debugging  
- **Stellar Laboratory** - Contract testing
- **Browser DevTools** - Network requests

## 🚀 Building for Production

```bash
# Build optimized bundle
npm run build

# Test production build locally
npm run start

# Deploy to Vercel
vercel deploy

# Deploy to other platforms
npm run export
```

## 📦 Dependencies

### Core Dependencies
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety
- `@chakra-ui/react` - UI components

### Blockchain Dependencies
- `@stellar/stellar-sdk` - Stellar integration
- `@soroban-react/core` - Soroban React hooks
- `wagmi` - EVM wallet integration
- `viem` - Ethereum client
- `@rainbow-me/rainbowkit` - Wallet connection UI

### State Management
- `zustand` - State management
- `@tanstack/react-query` - Data fetching

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys
   - Use different keys for dev/prod
   - Validate all environment variables

2. **Wallet Integration**
   - Always validate user permissions
   - Handle wallet disconnections gracefully
   - Implement proper error boundaries

3. **Contract Interactions**
   - Validate all contract addresses
   - Implement transaction simulation
   - Add proper error handling

## 📈 Performance Optimization

1. **Code Splitting**
   ```typescript
   // Lazy load heavy components
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

2. **State Optimization**
   ```typescript
   // Minimize re-renders
   const memoizedValue = useMemo(() => calculation, [deps]);
   ```

3. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   npm run analyze
   ```

## 🤝 Contributing Guidelines

1. **Code Style**
   - Use TypeScript for all new code
   - Follow ESLint configuration
   - Use Prettier for formatting

2. **Component Guidelines**
   - Use functional components with hooks
   - Implement proper error boundaries
   - Add loading states for async operations

3. **Testing**
   - Write unit tests for utilities
   - Test wallet integration flows
   - Verify contract interactions

---

**Happy coding! 🚀**