# 📖 User Guide - Syndicate AI DeFi Platform

## 🌟 Welcome to Syndicate

Syndicate is an AI-powered DeFi platform on Stellar that helps you optimize your portfolio, automate strategies, and maximize yields through intelligent recommendations.

## 🚀 Getting Started

### Step 1: Connect Your Wallet

1. **Visit the platform** at your deployed URL
2. **Click "Connect Wallet"** in the top navigation
3. **Choose your preferred Stellar wallet:**
   - **Freighter**: Browser extension wallet (recommended)
   - **LOBSTR**: Mobile and web wallet
   - **Rabet**: Browser extension with advanced features
   - **xBull**: Multi-platform wallet

### Step 2: Complete AI Onboarding

1. **Answer the AI questionnaire** about your:
   - Risk tolerance (Conservative, Moderate, Aggressive)
   - Investment goals (Yield, Growth, Stability)
   - Experience level (Beginner, Intermediate, Advanced)
   - Time horizon (Short, Medium, Long-term)

2. **Review AI recommendations** based on your profile
3. **Set initial portfolio allocation** with AI guidance

### Step 3: Start Earning

1. **Fund your wallet** with supported assets (XLM, USDC, etc.)
2. **Follow AI suggestions** for optimal yield strategies
3. **Monitor performance** through the intelligent dashboard

## 🤖 AI Assistant Features

### Natural Language Interactions

Chat with the AI using natural language:

**Examples:**
- "What's the best way to earn yield on my USDC?"
- "Should I stake my XLM or provide liquidity?"
- "Analyze my portfolio risk and suggest improvements"
- "Set up an alert when USDC APY drops below 5%"

### AI Actions

The AI can execute various DeFi actions:

#### Trading
- Execute trades on Stellar DEX
- Find optimal trading paths
- Set up limit orders
- Monitor price movements

#### Lending & Borrowing
- Supply assets to Blend Protocol
- Borrow against collateral
- Monitor health factors
- Optimize interest rates

#### Portfolio Management
- Analyze asset allocation
- Suggest rebalancing strategies
- Track performance metrics
- Risk assessment and alerts

#### Automation
- Set up recurring investments
- Automated rebalancing
- Yield farming strategies
- Stop-loss and take-profit orders

## 💰 DeFi Protocols

### Blend Protocol Integration

**What is Blend?**
Blend is Stellar's premier lending and borrowing protocol offering competitive yields.

**How to Use:**
1. **Navigate to Blend section**
2. **Choose a pool** (USDC, XLM, etc.)
3. **Enter amount to supply**
4. **Confirm transaction** in your wallet
5. **Start earning yield immediately**

**Current Rates (Example):**
- USDC Supply: ~5.2% APY
- XLM Supply: ~3.8% APY
- USDC Borrow: ~7.1% APY

### Stellar DEX Trading

**Features:**
- Native asset trading
- Path payments for optimal rates
- Liquidity pool participation
- Order book trading

**How to Trade:**
1. **Select trading pair** (e.g., XLM/USDC)
2. **Choose order type** (Market, Limit)
3. **Enter amount and price**
4. **Review and confirm**

### YieldBlox Integration

**Additional Opportunities:**
- Yield farming with multiple assets
- Automated strategy execution
- Enhanced APY through protocol rewards

## 📱 Mobile Experience

### Progressive Web App
- **Install on mobile** for native-like experience
- **Offline portfolio viewing** when network is unavailable
- **Touch-optimized interface** for easy navigation
- **Push notifications** for important alerts

### Mobile Features
- One-handed operation design
- Gesture-based navigation
- Quick action buttons
- Simplified transaction flows

## 🔧 API Reference

### AI Agent API

#### Process Message
```typescript
POST /api/ai-agent/process

Body:
{
  "message": "Analyze my portfolio",
  "context": {
    "walletAddress": "GABC...",
    "portfolioData": {...}
  }
}

Response:
{
  "response": "Based on your portfolio...",
  "actions": [{
    "type": "analyze",
    "data": {...}
  }],
  "metadata": {
    "confidence": 0.95,
    "action": "[{\"type\":\"analyze\"}]",
    "followUpQuestions": ["Would you like me to suggest rebalancing?"]
  }
}
```

### Blend Protocol API

#### Get Pool Information
```typescript
GET /api/blend/pools

Response:
{
  "pools": [{
    "id": "blend-usdc-pool",
    "asset": "USDC",
    "supplyAPY": "5.2",
    "borrowAPY": "7.1",
    "totalSupply": "1000000",
    "utilization": "0.75"
  }]
}
```

#### Supply Assets
```typescript
POST /api/blend/supply

Body:
{
  "poolId": "blend-usdc-pool",
  "amount": "1000",
  "userAddress": "GABC..."
}

Response:
{
  "transactionId": "abc123...",
  "status": "pending"
}
```

### Portfolio API

#### Get User Portfolio
```typescript
GET /api/portfolio?address=GABC...

Response:
{
  "totalValue": "10000",
  "assets": [{
    "symbol": "USDC",
    "balance": "5000",
    "value": "5000",
    "allocation": "50%"
  }],
  "positions": [{
    "protocol": "Blend",
    "type": "supply",
    "asset": "USDC",
    "amount": "3000",
    "apy": "5.2%"
  }]
}
```

## 🛠️ Troubleshooting

### Common Issues

#### Wallet Connection Problems
**Issue**: Wallet won't connect
**Solutions**:
- Ensure wallet extension is installed and unlocked
- Refresh the page and try again
- Check if wallet is set to correct network (Testnet/Mainnet)
- Clear browser cache and cookies

#### Transaction Failures
**Issue**: Transactions fail or get stuck
**Solutions**:
- Check wallet balance for sufficient funds
- Verify network fees are adequate
- Wait for network congestion to clear
- Try increasing gas/fee limits

#### AI Assistant Not Responding
**Issue**: AI doesn't respond or gives errors
**Solutions**:
- Check internet connection
- Verify API keys are configured
- Try refreshing the page
- Contact support if issue persists

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 1001 | Wallet not connected | Connect wallet first |
| 1002 | Insufficient balance | Add funds to wallet |
| 1003 | Network error | Check connection |
| 1004 | Invalid transaction | Review transaction details |
| 1005 | AI service unavailable | Try again later |

### Performance Optimization

#### Slow Loading
- Clear browser cache
- Disable unnecessary browser extensions
- Use latest browser version
- Check internet connection speed

#### High Memory Usage
- Close unused browser tabs
- Restart browser periodically
- Update to latest browser version

## 🔐 Security Best Practices

### Wallet Security
- **Never share** your private keys or seed phrases
- **Use hardware wallets** for large amounts
- **Enable 2FA** where available
- **Keep software updated** (wallet, browser)

### Platform Security
- **Verify URLs** before connecting wallets
- **Review transactions** carefully before signing
- **Monitor portfolio** regularly for unauthorized activity
- **Report suspicious** activity immediately

### Smart Contract Risks
- **Understand protocols** before investing
- **Start with small amounts** to test
- **Monitor health factors** for lending positions
- **Keep emergency funds** for liquidation protection

## 📞 Support

### Getting Help
- **Documentation**: Check this guide and README
- **Community**: Join Discord/Telegram discussions
- **Issues**: Report bugs via GitHub Issues
- **Email**: Contact support team directly

### Feedback
We value your feedback! Please share:
- Feature requests
- Bug reports
- User experience improvements
- Integration suggestions

---

**Happy DeFi-ing with Syndicate! 🚀**
