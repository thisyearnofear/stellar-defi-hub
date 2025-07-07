# 🚀 Stellar Bridge Hub - Deployment Guide

## 📋 **Blend Pool Deployment Parameters**

When deploying your Blend pool on Stellar testnet, use these parameters to ensure optimal integration with our platform:

### **Recommended Pool Configuration:**

```rust
// Pool Initialization Parameters
pub struct PoolConfig {
    // Asset Configuration
    pub asset_symbol: String,        // "USDC", "XLM", "BTC", etc.
    pub asset_decimals: u32,         // 6 for USDC, 7 for XLM, 8 for BTC
    pub asset_address: Address,      // Stellar asset contract address
    
    // Interest Rate Model
    pub base_rate: u64,              // Base interest rate (e.g., 2% = 200 basis points)
    pub slope1: u64,                 // Rate slope below optimal utilization
    pub slope2: u64,                 // Rate slope above optimal utilization
    pub optimal_utilization: u64,    // Optimal utilization rate (e.g., 80% = 8000)
    
    // Risk Parameters
    pub collateral_factor: u64,      // Max borrowing power (e.g., 85% = 8500)
    pub liquidation_threshold: u64,  // Liquidation trigger (e.g., 90% = 9000)
    pub liquidation_bonus: u64,      // Liquidator incentive (e.g., 5% = 500)
    
    // Operational Parameters
    pub reserve_factor: u64,         // Protocol fee (e.g., 10% = 1000)
    pub flash_loan_fee: u64,         // Flash loan fee (e.g., 0.09% = 9)
}
```

### **Suggested Parameters by Asset:**

#### **USDC Pool (Stablecoin)**
```rust
PoolConfig {
    asset_symbol: "USDC".to_string(),
    asset_decimals: 6,
    base_rate: 200,                  // 2% base rate
    slope1: 400,                     // 4% slope below optimal
    slope2: 6000,                    // 60% slope above optimal
    optimal_utilization: 8000,       // 80% optimal utilization
    collateral_factor: 8500,         // 85% collateral factor
    liquidation_threshold: 9000,     // 90% liquidation threshold
    liquidation_bonus: 500,          // 5% liquidation bonus
    reserve_factor: 1000,            // 10% reserve factor
    flash_loan_fee: 9,               // 0.09% flash loan fee
}
```

#### **XLM Pool (Native Asset)**
```rust
PoolConfig {
    asset_symbol: "XLM".to_string(),
    asset_decimals: 7,
    base_rate: 100,                  // 1% base rate
    slope1: 300,                     // 3% slope below optimal
    slope2: 8000,                    // 80% slope above optimal
    optimal_utilization: 7500,       // 75% optimal utilization
    collateral_factor: 7500,         // 75% collateral factor
    liquidation_threshold: 8500,     // 85% liquidation threshold
    liquidation_bonus: 800,          // 8% liquidation bonus
    reserve_factor: 1500,            // 15% reserve factor
    flash_loan_fee: 9,               // 0.09% flash loan fee
}
```

#### **BTC Pool (Volatile Asset)**
```rust
PoolConfig {
    asset_symbol: "BTC".to_string(),
    asset_decimals: 8,
    base_rate: 50,                   // 0.5% base rate
    slope1: 200,                     // 2% slope below optimal
    slope2: 10000,                   // 100% slope above optimal
    optimal_utilization: 7000,       // 70% optimal utilization
    collateral_factor: 8000,         // 80% collateral factor
    liquidation_threshold: 8800,     // 88% liquidation threshold
    liquidation_bonus: 1000,         // 10% liquidation bonus
    reserve_factor: 2000,            // 20% reserve factor
    flash_loan_fee: 9,               // 0.09% flash loan fee
}
```

## 🔧 **Required Contract Functions**

Ensure your Blend pool contract implements these functions for full platform integration:

### **Core Pool Functions:**
```rust
// Pool Information
pub fn get_pool_info() -> PoolInfo;
pub fn get_pool_stats() -> PoolStats;

// User Operations
pub fn supply(amount: i128) -> Result<(), Error>;
pub fn borrow(amount: i128) -> Result<(), Error>;
pub fn repay(amount: i128) -> Result<(), Error>;
pub fn withdraw(amount: i128) -> Result<(), Error>;

// User Data
pub fn get_user_position(user: Address) -> UserPosition;
pub fn get_user_balance(user: Address) -> UserBalance;

// Interest Rate Calculations
pub fn get_supply_rate() -> u64;
pub fn get_borrow_rate() -> u64;
pub fn get_utilization_rate() -> u64;
```

### **Expected Return Types:**
```rust
pub struct PoolInfo {
    pub asset_symbol: String,
    pub asset_decimals: u32,
    pub total_supply: i128,
    pub total_borrow: i128,
    pub supply_apy: u64,           // Basis points (e.g., 520 = 5.20%)
    pub borrow_apy: u64,           // Basis points
    pub utilization_rate: u64,     // Basis points
    pub liquidity_available: i128,
    pub collateral_factor: u64,    // Basis points
    pub liquidation_threshold: u64, // Basis points
}

pub struct UserPosition {
    pub supplied: i128,
    pub borrowed: i128,
    pub collateral_value: i128,
    pub borrow_capacity: i128,
    pub health_factor: u64,        // Scaled by 10000 (e.g., 15000 = 1.5)
}
```

## 📝 **After Deployment:**

1. **Copy your contract address** (starts with `C...`)
2. **Update your `.env` file:**
   ```bash
   # Add your deployed pool
   NEXT_PUBLIC_BLEND_USDC_POOL=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. **Test the integration** by running the development server
4. **Verify pool data** appears correctly in the Blend section

## 🧪 **Testing Checklist:**

- [ ] Pool appears in the Blend pools list
- [ ] Pool data (APY, utilization, etc.) displays correctly
- [ ] User can connect Stellar wallet
- [ ] Supply/borrow/repay/withdraw buttons are functional
- [ ] User positions display correctly
- [ ] Health factor calculations are accurate

## 🔗 **Integration Points:**

Our platform will automatically:
- ✅ Detect your pool when the contract address is added
- ✅ Fetch real-time pool data every 30 seconds
- ✅ Display APY calculations based on your interest rate model
- ✅ Show user positions and health factors
- ✅ Enable all pool operations through the UI

## 📞 **Need Help?**

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your contract implements all required functions
3. Ensure the contract address is correctly formatted
4. Test contract functions directly using Stellar CLI

**Ready to integrate!** 🎉