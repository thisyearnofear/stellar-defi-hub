# 🤖 Syndicate

**AI-Powered DeFi Platform** - Your intelligent assistant for Stellar DeFi investments

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black)](https://nextjs.org/)
[![Stellar](https://img.shields.io/badge/Stellar-Mainnet-purple)](https://stellar.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org/)
[![AI](https://img.shields.io/badge/AI-Powered-green)](https://ai.google.dev/)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/syndicate.git
cd syndicate

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🎯 What is Syndicate?

Syndicate is an AI-powered DeFi platform that makes Stellar DeFi accessible to everyone. Whether you're a beginner or expert, our intelligent assistant guides you through:

- **Smart Portfolio Analysis** - AI analyzes your holdings and suggests optimizations
- **Automated Strategy Execution** - Set up hands-off investment strategies
- **Risk Management** - AI monitors and protects your investments
- **Yield Optimization** - Automatically find and capture the best yields

## ✨ Key Features

### 🤖 AI Assistant
- **Natural Language Interface** - Chat with your DeFi assistant
- **Personalized Recommendations** - Tailored advice based on your profile
- **Strategy Automation** - Set up DCA, yield farming, and rebalancing
- **Risk Analysis** - Real-time portfolio health monitoring

### 🌟 DeFi Integration
- **Blend Protocol** - Lending and borrowing optimization
- **YieldBlox** - Multi-asset yield farming
- **Stellar DEX** - Automated market making
- **Portfolio Tracking** - Cross-protocol position monitoring

### 📱 User Experience
- **Smart Onboarding** - AI-guided setup process
- **Mobile-First Design** - Optimized for mobile DeFi
- **Multi-Wallet Support** - Freighter, Albedo, and more
- **Real-Time Updates** - Live balances and transaction status

## 🏗️ Architecture

### Frontend Stack
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Chakra UI** - Component library and design system
- **Twin.macro** - CSS-in-JS with Tailwind
- **Framer Motion** - Smooth animations

### Blockchain Integration
- **Stellar SDK** - Core blockchain interactions
- **Soroban** - Smart contract integration
- **Multi-protocol SDKs** - Blend, YieldBlox integrations

### AI & Backend
- **Google Gemini AI** - Natural language processing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Hot Toast** - User notifications

## 🎮 User Journey

### 1. AI-Powered Onboarding
```
📝 Experience Assessment → 🎯 Goal Setting → ⚖️ Risk Profiling → 💼 Portfolio Setup → 🤖 AI Demo
```

### 2. Intelligent Dashboard
```
📊 Portfolio Overview → 💡 AI Recommendations → 🔄 Auto-Execute → 📈 Track Performance
```

### 3. Continuous Optimization
```
🔍 Monitor Markets → 🎯 Identify Opportunities → ⚡ Execute Strategies → 📊 Report Results
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Stellar/Freighter wallet for testing

### Environment Setup
```bash
# Required environment variables
NEXT_PUBLIC_STELLAR_NETWORK=testnet  # or mainnet
NEXT_PUBLIC_GEMINI_API_KEY=your_key
NEXT_PUBLIC_RPC_URL=your_rpc_endpoint
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking
```

### Project Structure
```
src/
├── components/
│   ├── ai/              # AI chat and interactions
│   ├── mobile/          # Mobile-specific components
│   ├── onboarding/      # AI-powered onboarding flow
│   ├── web3/            # Blockchain integrations
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── ai/              # AI agent logic
│   └── stellar/         # Stellar/Soroban utilities
├── pages/               # Next.js pages
├── styles/              # Global styles
└── types/               # TypeScript definitions
```

## 🌟 Core Components

### AI Agent (`src/lib/ai/stellarAIAgent.ts`)
- Natural language processing for DeFi queries
- Portfolio analysis and recommendations
- Strategy automation and execution
- Risk assessment and monitoring

### Onboarding (`src/components/onboarding/AIOnboarding.tsx`)
- Experience-based user profiling
- Goal setting and risk tolerance assessment
- Personalized portfolio recommendations
- Interactive AI demo

### Mobile Dashboard (`src/components/mobile/MobileDashboard.tsx`)
- Touch-optimized DeFi interface
- Quick actions and portfolio overview
- AI chat widget integration
- Real-time notifications

## 🔗 Integrations

### Stellar Protocols
- **Blend Protocol** - Lending/borrowing via `@blend-capital/blend-sdk`
- **Stellar DEX** - Trading via `@stellar/stellar-sdk`
- **Soroban** - Smart contract interactions

### AI Services
- **Google Gemini** - Natural language understanding
- **Custom AI Logic** - DeFi-specific intelligence
- **Strategy Engine** - Automated decision making

### Wallet Connections
- **Freighter** - Primary Stellar wallet
- **Albedo** - Alternative Stellar wallet
- **WalletConnect** - Multi-chain support

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Environment variables required:
# - NEXT_PUBLIC_STELLAR_NETWORK
# - NEXT_PUBLIC_GEMINI_API_KEY
# - NEXT_PUBLIC_RPC_URL
```

### Docker
```bash
# Build and run with Docker
docker build -t syndicate .
docker run -p 3000:3000 syndicate
```

## 🧪 Testing

The platform is designed for both testnet and mainnet environments:

- **Testnet**: Safe testing with test tokens
- **Mainnet**: Production trading with real assets
- **AI Simulation**: Test AI recommendations without execution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/ai-enhancement`)
3. Commit your changes (`git commit -m 'Add AI enhancement'`)
4. Push to the branch (`git push origin feature/ai-enhancement`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for AI logic components
- Ensure mobile responsiveness
- Test with both Freighter and Albedo wallets

## 🔒 Security

- Environment variables for sensitive data
- Client-side wallet integration only
- No private key storage
- AI recommendations are suggestions only

## 📚 Documentation

- **User Guide**: How to use the AI assistant
- **Developer Guide**: Technical implementation details
- **AI Documentation**: Understanding the recommendation engine
- **API Reference**: Integration endpoints

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Stellar Network**: [stellar.org](https://stellar.org)
- **Blend Protocol**: [blend.capital](https://blend.capital)
- **YieldBlox**: [yieldblox.com](https://yieldblox.com)
- **Soroban Docs**: [soroban.stellar.org](https://soroban.stellar.org)

---

**🤖 Built with AI for the future of DeFi** ⭐