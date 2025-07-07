# 📚 Stellar Bridge Hub Documentation

## 📖 **Documentation Index**

### **🚀 Getting Started**
- [Quick Start Guide](#quick-start)
- [Environment Setup](#environment-setup)
- [Development Guide](#development)

### **🔧 Integration Guides**
- [Contract Integration](./CONTRACT_INTEGRATION.md) - How to integrate with existing Blend pools
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Parameters for deploying new pools (if needed)

### **🏗️ Architecture**
- [System Architecture](#system-architecture)
- [Multi-Chain Support](#multi-chain-support)
- [State Management](#state-management)

### **🌉 Bridge Integration**
- [Supported Chains](#supported-chains)
- [Bridge Protocols](#bridge-protocols)
- [Transaction Flow](#transaction-flow)

### **💰 Blend Protocol**
- [Live Pool Integration](#live-pool-integration)
- [Yield Optimization](#yield-optimization)
- [User Positions](#user-positions)

---

## 🚀 **Quick Start**

### **1. Clone and Install**
```bash
git clone <repository>
cd stellar-bridge-hub
yarn install
```

### **2. Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

### **3. Start Development**
```bash
yarn dev
```

### **4. Visit the Platform**
- **Homepage**: http://localhost:3000
- **Bridge**: http://localhost:3000/bridge
- **Blend**: http://localhost:3000/blend
- **Portfolio**: http://localhost:3000/portfolio

---

## 🏗️ **System Architecture**

### **Multi-Chain Wallet Support**
- **Stellar**: Freighter, xBull, Hana, Lobstr
- **Ethereum**: MetaMask (+ all EVM chains)
- **Solana**: Phantom
- **NEAR**: NEAR Wallet Selector
- **Cosmos**: Keplr

### **Bridge Protocols**
- **Allbridge Core**: Live API integration
- **NEAR Intents**: Cross-chain messaging
- **Custom Adapters**: Extensible bridge system

### **Blend Integration**
- **Live Pools**: Integrated with existing mainnet pools
- **Real-time Data**: Live APYs, utilization, liquidity
- **User Positions**: Real position tracking

---

## 🌉 **Supported Chains**

| Chain | Network | RPC | Explorer |
|-------|---------|-----|----------|
| Stellar | Mainnet | soroban-rpc.mainnet.stellar.org | stellar.expert |
| Ethereum | Sepolia | sepolia.infura.io | sepolia.etherscan.io |
| Avalanche | Fuji | api.avax-test.network | testnet.snowtrace.io |
| Base | Sepolia | sepolia.base.org | sepolia-explorer.base.org |
| Arbitrum | Sepolia | sepolia-rollup.arbitrum.io | sepolia.arbiscan.io |
| Optimism | Sepolia | sepolia.optimism.io | sepolia-optimism.etherscan.io |
| Lens | Testnet | rpc.testnet.lens.dev | block-explorer.testnet.lens.dev |
| Solana | Devnet | api.devnet.solana.com | explorer.solana.com |
| NEAR | Testnet | rpc.testnet.near.org | explorer.testnet.near.org |

---

## 💰 **Live Pool Integration**

### **Blend Fixed Pool V2**
- **Contract**: `CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD`
- **Assets**: USDC/XLM
- **Type**: Fixed rate lending
- **Dashboard**: [View Pool](https://mainnet.blend.capital/dashboard/?poolId=CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD)

### **YieldBlox Pool V2**
- **Contract**: `CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFSYou have used 0 iterations.`
- **Assets**: Multi-Asset
- **Type**: Variable rate lending
- **Explorer**: [View Contract](https://stellar.expert/explorer/public/contract/CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFSYou have used 0 iterations.)

---

## 🔧 **Development**

### **Project Structure**
```
src/
├── components/          # React components
│   ├── bridge/         # Bridge interface
│   ├── blend/          # Blend protocol UI
│   └── wallet/         # Wallet connections
├── lib/                # Core logic
│   ├── bridges/        # Bridge adapters
│   ├── blend/          # Blend integration
│   ├── wallets/        # Wallet adapters
│   └── stores/         # State management
├── pages/              # Next.js pages
└── types/              # TypeScript definitions
```

### **Key Technologies**
- **Framework**: Next.js 13 + TypeScript
- **UI**: Chakra UI + Twin.macro (Tailwind)
- **State**: Zustand stores
- **Stellar**: Soroban React ecosystem
- **Multi-chain**: ethers.js, @solana/web3.js, near-api-js

### **Environment Variables**
See `.env.example` for all configuration options.

---

## 🧪 **Testing**

### **Local Development**
```bash
yarn dev                 # Start development server
yarn build              # Build for production
yarn type-check         # TypeScript validation
yarn lint               # Code linting
```

### **Contract Testing**
```bash
cd contracts
yarn test               # Run contract tests
```

---

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

---

## 📞 **Support**

- **Documentation**: Check the guides in this `/docs` folder
- **Issues**: Open GitHub issues for bugs/features
- **Discussions**: Use GitHub discussions for questions

---

## 🎯 **Roadmap**

### **Phase 1: Core Platform** ✅
- Multi-chain wallet integration
- Bridge protocol integration
- Blend pool integration
- Basic UI/UX

### **Phase 2: Advanced Features** 🚧
- Automated yield optimization
- Cross-chain arbitrage
- Advanced portfolio analytics
- Mobile app

### **Phase 3: Ecosystem** 📋
- Additional bridge protocols
- More lending protocols
- Governance token
- DAO structure

---

**Built with ❤️ for the multi-chain future** 🌉