import { getContractStatus } from '../config/contracts';

// Contract status checker and validator
export class ContractStatusChecker {
  static checkAllContracts() {
    const status = getContractStatus();

    console.log('📋 Contract Status Report:');
    console.log('==========================');

    // Blend Protocol Status
    console.log('🔵 Blend Protocol:');
    console.log(`   Enabled Pools: ${status.enabledPools}/${status.totalPools}`);

    if (status.blend.isValid) {
      console.log('   ✅ All Blend contracts configured');
    } else {
      console.log('   ❌ Missing Blend contracts:');
      status.blend.missingContracts.forEach((contract) => {
        console.log(`      - ${contract}`);
      });
    }

    // Bridge Protocol Status
    console.log('🌉 Bridge Protocol:');
    if (status.bridge.isValid) {
      console.log('   ✅ All bridge contracts configured');
    } else {
      console.log('   ❌ Missing bridge contracts:');
      status.bridge.missingContracts.forEach((contract) => {
        console.log(`      - ${contract}`);
      });
    }

    // Overall Status
    console.log('🎯 Overall Status:');
    if (status.readyForProduction) {
      console.log('   ✅ Ready for production!');
    } else {
      console.log('   ⚠️  Configuration incomplete');
      console.log('   📝 See DEPLOYMENT_GUIDE.md for setup instructions');
    }

    return status;
  }

  static getQuickStatus() {
    const status = getContractStatus();
    return {
      hasBlendPools: status.enabledPools > 0,
      hasBridgeContracts: status.bridge.isValid,
      isProductionReady: status.readyForProduction,
      enabledPoolsCount: status.enabledPools,
    };
  }

  static logMissingContracts() {
    const status = getContractStatus();

    if (!status.readyForProduction) {
      console.warn('⚠️  Missing contract configurations:');

      if (!status.blend.isValid) {
        console.warn('Blend Protocol:', status.blend.missingContracts);
      }

      if (!status.bridge.isValid) {
        console.warn('Bridge Protocol:', status.bridge.missingContracts);
      }

      console.info('💡 Add contract addresses to your .env file to enable full functionality');
    }
  }
}

// Auto-check contracts on import (development only)
if (process.env.NODE_ENV === 'development') {
  ContractStatusChecker.checkAllContracts();
}
