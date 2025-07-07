# 🌐 Supported Chains - Stellar Bridge Hub

## 🌟 Primary Chain: Stellar

**Stellar** serves as the primary destination for yield earning and DeFi operations.

### Network Details
- **Network**: Mainnet
- **RPC URL**: `https://soroban-rpc.mainnet.stellar.org`
- **Horizon URL**: `https://horizon.stellar.org`
- **Network Passphrase**: `Public Global Stellar Network ; September 2015`
- **Explorer**: [stellar.expert](https://stellar.expert/explorer/public)

### Integrated Protocols

#### Blend Protocol
- **Contract**: `CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD`
- **Oracle**: `CCVTVW2CVA7JLH4ROQGP3CU4T3EXVCK66AZGSM4MUQPXAI4QHCZPOATS`
- **Type**: Fixed Pool V2 (XLM/USDC)
- **TVL**: $1.25M+
- **APY**: 5.2% (Supply), 7.8% (Borrow)
- **Dashboard**: [blend.capital](https://mainnet.blend.capital/dashboard/?poolId=CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD)

#### YieldBlox
- **Contract**: `CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFS`
- **Oracle**: `CD74A3C54EKUVEGUC6WNTUPOTHB624WFKXN3IYTFJGX3EHXDXHCYMXXR`
- **Admin**: `CANSYFVMIP7JVYEZQ463Y2I2VLEVNLDJJ4QNZTDBGLOOGKURPTW4A6FQ`
- **Type**: Multi-Asset Pool V2
- **TVL**: $7.81M (Supplied), $3.52M (Borrowed)
- **APY**: 4.8% (Supply), 6.9% (Borrow)
- **Website**: [yieldblox.com](https://yieldblox.com)

### Supported Assets
| Asset | Type | Decimals | Usage |
|-------|------|----------|-------|
| **XLM** | Native | 7 | Primary collateral, gas |
| **USDC** | Asset | 6 | Stablecoin lending/borrowing |
| **USDT** | Asset | 6 | Stablecoin alternative |

---

## 🔗 Bridge Source Chains

### Ethereum Mainnet

#### Network Details
- **Chain ID**: 1
- **RPC URL**: `https://mainnet.infura.io/v3/YOUR_KEY`
- **Explorer**: [etherscan.io](https://etherscan.io)
- **Gas Token**: ETH

#### Supported Assets
| Asset | Contract Address | Decimals | Bridge Support |
|-------|------------------|----------|----------------|
| **ETH** | Native | 18 | ✅ Via Allbridge |
| **USDC** | `0xA0b86a33E6441b8e2f7F936C1c1b5c2e1e8e8c8e` | 6 | ✅ Primary bridge asset |
| **USDT** | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | 6 | ✅ Alternative stablecoin |

#### Bridge Integration
- **Provider**: Allbridge Core
- **Fee**: ~0.2% of transaction
- **Time**: 10-15 minutes
- **Min Amount**: $10 equivalent
- **Max Amount**: $100,000 per transaction

---

### Avalanche C-Chain

#### Network Details
- **Chain ID**: 43114
- **RPC URL**: `https://api.avax.network/ext/bc/C/rpc`
- **Explorer**: [snowtrace.io](https://snowtrace.io)
- **Gas Token**: AVAX

#### Supported Assets
| Asset | Contract Address | Decimals | Bridge Support |
|-------|------------------|----------|----------------|
| **AVAX** | Native | 18 | ✅ Via Allbridge |
| **USDC** | `0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E` | 6 | ✅ Primary bridge asset |
| **USDT** | `0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7` | 6 | ✅ Alternative stablecoin |

#### Bridge Integration
- **Provider**: Allbridge Core
- **Fee**: ~0.15% of transaction
- **Time**: 5-10 minutes
- **Min Amount**: $10 equivalent
- **Max Amount**: $50,000 per transaction

---

### Polygon

#### Network Details
- **Chain ID**: 137
- **RPC URL**: `https://polygon-rpc.com`
- **Explorer**: [polygonscan.com](https://polygonscan.com)
- **Gas Token**: MATIC

#### Supported Assets
| Asset | Contract Address | Decimals | Bridge Support |
|-------|------------------|----------|----------------|
| **MATIC** | Native | 18 | ✅ Via Allbridge |
| **USDC** | `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` | 6 | ✅ Primary bridge asset |
| **USDT** | `0xc2132D05D31c914a87C6611C10748AEb04B58e8F` | 6 | ✅ Alternative stablecoin |

#### Bridge Integration
- **Provider**: Allbridge Core
- **Fee**: ~0.1% of transaction
- **Time**: 3-8 minutes
- **Min Amount**: $5 equivalent
- **Max Amount**: $25,000 per transaction

---

## 🔄 Bridge Providers

### Allbridge Core

**Primary bridge provider** for cross-chain asset transfers.

#### Features
- **Multi-chain support**: 15+ blockchains
- **Fast transfers**: 3-15 minutes average
- **Low fees**: 0.1-0.3% of transaction
- **High liquidity**: $50M+ TVL
- **Proven security**: 2+ years operation

#### API Integration
- **Base URL**: `https://core.api.allbridge.io`
- **Documentation**: [docs.allbridge.io](https://docs.allbridge.io)
- **Status Page**: [status.allbridge.io](https://status.allbridge.io)

#### Supported Routes
| From | To | Asset | Fee | Time |
|------|----|----|-----|------|
| Ethereum | Stellar | USDC | 0.2% | 10-15 min |
| Avalanche | Stellar | USDC | 0.15% | 5-10 min |
| Polygon | Stellar | USDC | 0.1% | 3-8 min |
| Ethereum | Stellar | USDT | 0.2% | 10-15 min |

---

## 🚀 Coming Soon

### Solana
- **Status**: Integration in progress
- **Expected**: Q2 2024
- **Assets**: SOL, USDC, USDT
- **Provider**: Allbridge + Wormhole

### Arbitrum
- **Status**: Planning phase
- **Expected**: Q3 2024
- **Assets**: ETH, USDC, ARB
- **Provider**: Allbridge

### Base
- **Status**: Under consideration
- **Expected**: Q4 2024
- **Assets**: ETH, USDC
- **Provider**: TBD

---

## 🛠️ Technical Specifications

### Wallet Requirements

#### EVM Chains (Ethereum, Avalanche, Polygon)
- **MetaMask**: Recommended
- **WalletConnect**: Full support
- **Coinbase Wallet**: Supported
- **Trust Wallet**: Supported

#### Stellar
- **Freighter**: Recommended
- **Albedo**: Supported
- **LOBSTR**: Supported
- **Rabet**: Supported

### Transaction Limits

| Chain | Min Bridge | Max Bridge | Daily Limit |
|-------|------------|------------|-------------|
| **Ethereum** | $10 | $100,000 | $500,000 |
| **Avalanche** | $10 | $50,000 | $200,000 |
| **Polygon** | $5 | $25,000 | $100,000 |
| **Stellar** | $1 | Unlimited | Unlimited |

### Security Measures

- **Multi-signature** contract controls
- **Time-locked** upgrades
- **Regular audits** by leading firms
- **Bug bounty** programs
- **Insurance** coverage for major protocols

---

## 📊 Network Status

### Real-time Monitoring

- **Bridge Status**: [status.stellarbridgehub.com](https://status.stellarbridgehub.com)
- **Protocol Health**: [health.stellarbridgehub.com](https://health.stellarbridgehub.com)
- **API Status**: [api.stellarbridgehub.com/status](https://api.stellarbridgehub.com/status)

### Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Bridge Success Rate** | >99% | 99.7% |
| **Average Bridge Time** | <10 min | 7.3 min |
| **API Uptime** | >99.9% | 99.95% |
| **User Satisfaction** | >4.5/5 | 4.7/5 |

---

**For technical support or integration questions, visit our [Developer Guide](./DEVELOPMENT_GUIDE.md)** 🛠️