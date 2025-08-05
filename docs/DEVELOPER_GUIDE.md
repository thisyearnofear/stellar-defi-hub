# 🛠️ Developer Guide - Syndicate Platform

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ with npm/yarn
- Git for version control
- Stellar wallet for testing (Freighter recommended)
- Code editor (VS Code recommended)

### Quick Start
```bash
# Clone and setup
git clone https://github.com/thisyearnofear/stellar-defi-hub.git
cd stellar-defi-hub
npm install --legacy-peer-deps

# Environment configuration
cp .env.example .env
# Edit .env with your API keys

# Start development
npm run dev
# Visit http://localhost:3000
```

### Environment Variables
```bash
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Network configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet  # or 'mainnet'
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Optional integrations
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## 🏗️ Architecture Overview

### Core Components

#### AI Agent System
```typescript
// AI Agent Interface
interface StellarAIAgent {
  processMessage(params: {
    message: string;
    context: PortfolioContext;
    capabilities: AIAgentAction[];
  }): Promise<AIAgentMessage>;
  
  executeAction(action: AIAgentAction): Promise<ActionResult>;
  generateStrategy(profile: UserProfile): Promise<Strategy>;
}

// Message Processing Pipeline
class AIMessageProcessor {
  async process(input: string): Promise<AIResponse> {
    const intent = await this.classifyIntent(input);
    const context = await this.gatherContext();
    const response = await this.generateResponse(intent, context);
    return this.formatResponse(response);
  }
}
```

#### Wallet Management
```typescript
// Multi-wallet adapter pattern
interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signTransaction(tx: Transaction): Promise<string>;
  getPublicKey(): string;
  isConnected(): boolean;
}

// Supported wallets
const walletAdapters = [
  new FreighterWalletAdapter(),
  new LobstrWalletAdapter(),
  new RabetWalletAdapter(),
  new XBullWalletAdapter()
];
```

#### DeFi Protocol Integration
```typescript
// Blend Protocol Adapter
class BlendAdapter {
  async getPools(): Promise<BlendPool[]> {
    return this.stellarClient.getPools();
  }
  
  async supply(params: SupplyParams): Promise<string> {
    const tx = await this.buildSupplyTx(params);
    return this.wallet.signAndSubmit(tx);
  }
  
  async getUserPositions(address: string): Promise<Position[]> {
    return this.stellarClient.getUserPositions(address);
  }
}
```

### State Management

#### Zustand Stores
```typescript
// Wallet Store
interface WalletState {
  wallet: WalletAdapter | null;
  isConnected: boolean;
  publicKey: string | null;
  connect: (adapter: WalletAdapter) => Promise<void>;
  disconnect: () => Promise<void>;
}

// Portfolio Store
interface PortfolioState {
  assets: Asset[];
  positions: Position[];
  totalValue: string;
  loading: boolean;
  fetchPortfolio: (address: string) => Promise<void>;
  updatePosition: (position: Position) => void;
}

// AI Store
interface AIState {
  messages: ChatMessage[];
  isProcessing: boolean;
  sendMessage: (message: string) => Promise<void>;
  executeAction: (action: AIAgentAction) => Promise<void>;
}
```

## 🔧 API Development

### AI Agent Endpoints

#### Process Message API
```typescript
// pages/api/ai-agent/process.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;
    
    // Initialize AI agent
    const aiAgent = new StellarAIAgent({
      apiKey: process.env.GEMINI_API_KEY!,
      network: process.env.NEXT_PUBLIC_STELLAR_NETWORK!
    });
    
    // Process message
    const response = await aiAgent.processMessage({
      message,
      context,
      capabilities: ['trade', 'lend', 'analyze', 'automate']
    });
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('AI processing error:', error);
    return res.status(500).json({ error: 'AI processing failed' });
  }
}
```

#### Execute Action API
```typescript
// pages/api/ai-agent/execute.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action, params } = req.body;
  
  try {
    switch (action.type) {
      case 'trade':
        return await executeTrade(action.params);
      case 'lend':
        return await executeSupply(action.params);
      case 'analyze':
        return await analyzePortfolio(action.params);
      default:
        throw new Error(`Unsupported action: ${action.type}`);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### Blend Protocol Integration

#### Pool Data API
```typescript
// pages/api/blend/pools.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const blendAdapter = new BlendAdapter();
    const pools = await blendAdapter.getPools();
    
    const enrichedPools = await Promise.all(
      pools.map(async (pool) => ({
        ...pool,
        supplyAPY: await blendAdapter.getSupplyAPY(pool.id),
        borrowAPY: await blendAdapter.getBorrowAPY(pool.id),
        utilization: await blendAdapter.getUtilization(pool.id)
      }))
    );
    
    return res.status(200).json({ pools: enrichedPools });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch pools' });
  }
}
```

## 🚀 Deployment

### Environment Setup
```bash
# .env.local
NEXT_PUBLIC_STELLAR_NETWORK=testnet
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

## 🔌 Smart Contract Integration

### Soroban Contract Deployment

#### Contract Structure
```rust
// contracts/greeting/src/lib.rs
use soroban_sdk::{contract, contractimpl, Env, String, symbol_short};

#[contract]
pub struct GreetingContract;

#[contractimpl]
impl GreetingContract {
    pub fn hello(env: Env, to: String) -> String {
        format!("Hello {}", to)
    }
}
```

#### Deployment Script
```typescript
// contracts/scripts/deploy.ts
import { SorobanRpc, Keypair, Contract } from '@stellar/stellar-sdk';

async function deployContract() {
  const server = new SorobanRpc.Server(RPC_URL);
  const deployer = Keypair.fromSecret(DEPLOYER_SECRET);
  
  // Build and deploy contract
  const wasmBuffer = await fs.readFile('./target/wasm32-unknown-unknown/release/greeting.wasm');
  const contract = new Contract(CONTRACT_ADDRESS);
  
  // Deploy transaction
  const deployTx = await contract.deploy({
    wasm: wasmBuffer,
    deployer: deployer.publicKey()
  });
  
  const result = await server.sendTransaction(deployTx);
  console.log('Contract deployed:', result.hash);
}
```

### Frontend Integration

#### Contract Interaction Hook
```typescript
// hooks/useStellarContract.ts
export function useStellarContract(contractAddress: string) {
  const { wallet } = useWallet();
  
  const callContract = useCallback(async (
    method: string,
    params: any[]
  ) => {
    if (!wallet) throw new Error('Wallet not connected');
    
    const contract = new Contract(contractAddress);
    const tx = await contract.call(method, ...params);
    
    return wallet.signAndSubmit(tx);
  }, [wallet, contractAddress]);
  
  return { callContract };
}
```

## 🧪 Testing & Monitoring

### Testing Setup
```bash
# Run tests
npm test
npm run test:watch
npm run test:coverage
```

### Error Tracking
```typescript
// Sentry integration for error monitoring
import * as Sentry from '@sentry/nextjs';
Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
```

## 🤝 Contributing

### Development Workflow
1. Fork repository and create feature branch
2. Make changes following code standards
3. Add tests for new functionality
4. Run linting and type checking
5. Submit pull request with clear description

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commits for clear history
- Component-based architecture
- Comprehensive error handling

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

---

**Ready to build the future of DeFi on Stellar! 🚀**