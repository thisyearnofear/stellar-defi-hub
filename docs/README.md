# 🌟 Syndicate - AI-Powered Stellar DeFi Hub

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
git clone https://github.com/thisyearnofear/stellar-defi-hub.git
cd stellar-defi-hub
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```

### Environment Variables
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_STELLAR_NETWORK=testnet

# Optional
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── ai/             # AI assistant components
│   ├── blend/          # Blend Protocol integration
│   ├── mobile/         # Mobile-optimized UI
│   ├── onboarding/     # User onboarding flow
│   ├── portfolio/      # Portfolio dashboard
│   └── wallet/         # Wallet connections
├── lib/                # Core business logic
│   ├── ai/             # AI agent and processing
│   ├── automation/     # Strategy automation
│   ├── blend/          # Blend Protocol adapters
│   ├── stores/         # Zustand state management
│   └── wallets/        # Multi-wallet support
├── pages/              # Next.js pages and API routes
└── types/              # TypeScript definitions
```

### Tech Stack
- **Frontend**: Next.js 13, TypeScript, Chakra UI, Twin.macro
- **Blockchain**: Stellar SDK, Soroban smart contracts
- **AI**: Google Gemini AI integration
- **State**: Zustand for global state management
- **Styling**: Tailwind CSS with Emotion

## 🤖 AI Features

### AI Assistant
- Portfolio analysis and recommendations
- DeFi strategy suggestions
- Risk assessment and alerts
- Natural language DeFi interactions

### Supported Actions
```typescript
type AIAgentAction = 
  | 'trade'      // Execute trades on Stellar DEX
  | 'stake'      // Stake assets for rewards
  | 'lend'       // Supply to lending protocols
  | 'borrow'     // Borrow against collateral
  | 'analyze'    // Portfolio analysis
  | 'alert'      // Set up monitoring alerts
  | 'rebalance'  // Rebalance portfolio
  | 'automate';  // Set up automation strategies
```

## 💰 DeFi Integrations

### Blend Protocol
- Lending and borrowing on Stellar
- Automated yield optimization
- Real-time APY tracking
- Health factor monitoring

### Stellar DEX
- Native asset trading
- Liquidity pool participation
- Path payment optimization
- Multi-hop trading routes

### YieldBlox
- Additional yield farming opportunities
- Automated strategy execution
- Risk-adjusted returns

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking
```

### Key Components

#### AI Agent Integration
```typescript
// AI message processing
const response = await stellarAIAgent.processMessage({
  message: userInput,
  context: portfolioData,
  capabilities: ['trade', 'analyze', 'lend']
});
```

#### Wallet Management
```typescript
// Multi-wallet support
const wallets = [
  new FreighterWalletAdapter(),
  new LobstrWalletAdapter(),
  new RabetWalletAdapter(),
  new XBullWalletAdapter()
];
```

#### Blend Protocol Integration
```typescript
// Supply assets to earn yield
const result = await blendAdapter.supply({
  poolId: 'blend-usdc-pool',
  amount: '1000',
  userAddress: wallet.publicKey
});
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Docker
```bash
docker build -t syndicate .
docker run -p 3000:3000 syndicate
```

### Environment Configuration
- **Development**: Uses Stellar testnet
- **Production**: Configure for Stellar mainnet
- **API Keys**: Secure storage required for AI features

## 🔐 Security

### Best Practices
- Private keys never leave the browser
- All transactions require user approval
- Smart contract interactions are audited
- AI responses are sanitized and validated

### Wallet Security
- Hardware wallet support via WalletConnect
- Session management with automatic timeouts
- Secure key derivation for multi-account support

## 📱 Mobile Experience

### Progressive Web App
- Installable on mobile devices
- Offline capability for portfolio viewing
- Touch-optimized interface
- Native-like navigation

### Mobile-First Design
- Responsive layouts for all screen sizes
- Gesture-based interactions
- Optimized for one-handed use
- Fast loading on mobile networks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for clear history
- Component-based architecture

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions
- **Security**: Report vulnerabilities privately

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for the Stellar ecosystem**
