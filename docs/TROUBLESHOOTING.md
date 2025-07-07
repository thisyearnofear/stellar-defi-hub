# 🔧 Troubleshooting Guide

## 🚨 **Common Issues**

### **Compilation Errors**

#### **Duplicate Import Error**
```
Syntax error: Identifier 'useRouter' has already been declared
```
**Solution**: Remove duplicate imports in the file
```typescript
// ❌ Wrong - duplicate imports
import { useRouter } from 'next/router'
import { useRouter } from 'next/router'

// ✅ Correct - single import
import { useRouter } from 'next/router'
```

#### **Module Not Found**
```
Module not found: Can't resolve '@/components/...'
```
**Solution**: Check TypeScript path mapping in `tsconfig.json`

### **Wallet Connection Issues**

#### **MetaMask Not Detected**
```
MetaMask not installed
```
**Solutions**:
1. Install MetaMask browser extension
2. Refresh the page after installation
3. Check if MetaMask is enabled for the site

#### **Stellar Wallet Not Connecting**
```
Wallet not connected. Try again...
```
**Solutions**:
1. Install Freighter extension
2. Create/import Stellar account
3. Switch to correct network (testnet/mainnet)
4. Fund account with XLM for transaction fees

#### **Wrong Network**
```
Please switch to the correct network
```
**Solutions**:
1. Open wallet extension
2. Switch to required network (testnet for development)
3. Refresh the page

### **Contract Integration Issues**

#### **Pool Not Appearing**
```
No Blend positions found
```
**Solutions**:
1. Check contract address format (starts with `C...`)
2. Verify environment variable name matches
3. Restart development server
4. Check browser console for errors

#### **Contract Function Not Found**
```
Contract function 'get_pool_info' not found
```
**Solutions**:
1. Verify contract implements required functions
2. Check function name spelling
3. Ensure contract is deployed on correct network

#### **RPC Connection Failed**
```
Failed to connect to Soroban RPC
```
**Solutions**:
1. Check RPC URL in environment variables
2. Verify network connectivity
3. Try alternative RPC endpoints
4. Check if RPC service is operational

### **Bridge Issues**

#### **Quote Fetching Failed**
```
Failed to get bridge quote
```
**Solutions**:
1. Check internet connection
2. Verify Allbridge API is operational
3. Try different token pair
4. Check if chains are supported

#### **Transaction Failed**
```
Bridge execution failed
```
**Solutions**:
1. Ensure sufficient balance for transaction + fees
2. Check wallet is connected to correct network
3. Verify token approval (for EVM chains)
4. Try with smaller amount

### **Environment Issues**

#### **Environment Variables Not Loading**
```
process.env.NEXT_PUBLIC_... is undefined
```
**Solutions**:
1. Ensure `.env` file exists in project root
2. Restart development server after changes
3. Check variable names start with `NEXT_PUBLIC_`
4. Verify no syntax errors in `.env` file

#### **Network Configuration**
```
Network configuration error
```
**Solutions**:
1. Check RPC URLs are correct
2. Verify network passphrases
3. Ensure chain IDs match
4. Test RPC connectivity manually

## 🔍 **Debugging Steps**

### **1. Check Browser Console**
```javascript
// Open browser dev tools (F12)
// Look for error messages in Console tab
// Check Network tab for failed requests
```

### **2. Verify Environment**
```bash
# Check environment variables
cat .env

# Verify all required variables are set
yarn dev
# Look for "Contract Status Report" in console
```

### **3. Test Wallet Connection**
```javascript
// In browser console
console.log(window.ethereum); // Should show MetaMask
console.log(window.phantom);  // Should show Phantom
```

### **4. Check Contract Status**
```javascript
// In browser console after page load
// Look for contract validation messages
```

## 🛠️ **Development Tools**

### **Stellar Tools**
- **Stellar Expert**: Explore contracts and transactions
- **Stellar Laboratory**: Test contract interactions
- **Freighter**: Stellar wallet for testing

### **EVM Tools**
- **MetaMask**: Multi-chain EVM wallet
- **Etherscan**: Transaction explorer
- **Remix**: Smart contract testing

### **Debugging Commands**
```bash
# TypeScript checking
yarn type-check

# Linting
yarn lint

# Build test
yarn build

# Contract testing
cd contracts && yarn test
```

## 📞 **Getting Help**

### **1. Check Documentation**
- [Contract Integration Guide](./CONTRACT_INTEGRATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Main Documentation](./README.md)

### **2. Common Solutions**
- Restart development server
- Clear browser cache
- Check wallet extension is updated
- Verify network connectivity

### **3. Report Issues**
If you can't resolve the issue:
1. Check existing GitHub issues
2. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Browser console logs

## ✅ **Quick Fixes Checklist**

- [ ] Restart development server
- [ ] Check `.env` file exists and is correct
- [ ] Verify wallet extension is installed
- [ ] Check browser console for errors
- [ ] Ensure correct network is selected
- [ ] Clear browser cache/cookies
- [ ] Update wallet extension
- [ ] Check internet connectivity
- [ ] Verify contract addresses are correct
- [ ] Test with different browser/incognito mode

---

**Most issues are resolved by restarting the dev server and checking wallet connections!** 🔄