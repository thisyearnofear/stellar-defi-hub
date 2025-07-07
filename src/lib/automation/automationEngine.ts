// Automation Engine for Stellar DeFi
// Handles recurring strategies, monitoring, and execution

import { AutomationStrategy, AIAgentAction } from '../ai/stellarAIAgent';
import * as StellarSdk from '@stellar/stellar-sdk';

export interface AutomationExecution {
  id: string;
  strategyId: string;
  executedAt: Date;
  status: 'success' | 'failed' | 'pending';
  transactionHash?: string;
  error?: string;
  gasUsed?: string;
}

export interface MonitoringCondition {
  id: string;
  type: 'price' | 'portfolio' | 'time' | 'yield' | 'market';
  asset?: string;
  operator: 'above' | 'below' | 'equals' | 'changes';
  value: string | number;
  isActive: boolean;
  lastChecked: Date;
  triggeredCount: number;
}

export class AutomationEngine {
  private strategies: Map<string, AutomationStrategy> = new Map();
  private executions: AutomationExecution[] = [];
  private conditions: Map<string, MonitoringCondition> = new Map();
  private isRunning: boolean = false;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.startMonitoring();
  }

  // Strategy Management
  addStrategy(strategy: AutomationStrategy): void {
    this.strategies.set(strategy.id, strategy);
    console.log(`Added automation strategy: ${strategy.name}`);
  }

  removeStrategy(strategyId: string): void {
    this.strategies.delete(strategyId);
    console.log(`Removed automation strategy: ${strategyId}`);
  }

  getStrategy(strategyId: string): AutomationStrategy | undefined {
    return this.strategies.get(strategyId);
  }

  getAllStrategies(): AutomationStrategy[] {
    return Array.from(this.strategies.values());
  }

  // Monitoring and Execution
  startMonitoring(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Automation engine started');
    
    // Check conditions every 30 seconds
    this.intervalId = setInterval(() => {
      this.checkAllConditions();
    }, 30000);
  }

  stopMonitoring(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    console.log('Automation engine stopped');
  }

  private async checkAllConditions(): Promise<void> {
    for (const strategy of this.strategies.values()) {
      if (!strategy.isActive) continue;
      
      try {
        const shouldExecute = await this.evaluateConditions(strategy);
        if (shouldExecute) {
          await this.executeStrategy(strategy);
        }
      } catch (error) {
        console.error(`Error checking strategy ${strategy.id}:`, error);
      }
    }
  }

  private async evaluateConditions(strategy: AutomationStrategy): Promise<boolean> {
    // Check if all conditions are met
    for (const condition of strategy.conditions) {
      const isMet = await this.checkCondition(condition, strategy);
      if (!isMet) return false;
    }
    return true;
  }

  private async checkCondition(condition: string, strategy: AutomationStrategy): Promise<boolean> {
    const lowerCondition = condition.toLowerCase();
    
    // Time-based conditions
    if (lowerCondition.includes('daily')) {
      return this.checkTimeCondition('daily', strategy);
    }
    if (lowerCondition.includes('weekly')) {
      return this.checkTimeCondition('weekly', strategy);
    }
    if (lowerCondition.includes('monthly')) {
      return this.checkTimeCondition('monthly', strategy);
    }
    
    // Price conditions
    if (lowerCondition.includes('price') || lowerCondition.includes('drops') || lowerCondition.includes('rises')) {
      return await this.checkPriceCondition(condition);
    }
    
    // Portfolio conditions
    if (lowerCondition.includes('portfolio') || lowerCondition.includes('allocation')) {
      return await this.checkPortfolioCondition(condition, strategy);
    }
    
    // Market conditions
    if (lowerCondition.includes('market') || lowerCondition.includes('volatility')) {
      return await this.checkMarketCondition(condition);
    }
    
    // Default to true for unrecognized conditions
    return true;
  }

  private checkTimeCondition(frequency: 'daily' | 'weekly' | 'monthly', strategy: AutomationStrategy): boolean {
    const lastExecution = this.getLastExecution(strategy.id);
    if (!lastExecution) return true; // First execution
    
    const now = new Date();
    const lastExecutionTime = lastExecution.executedAt;
    
    switch (frequency) {
      case 'daily':
        return now.getTime() - lastExecutionTime.getTime() >= 24 * 60 * 60 * 1000;
      case 'weekly':
        return now.getTime() - lastExecutionTime.getTime() >= 7 * 24 * 60 * 60 * 1000;
      case 'monthly':
        return now.getTime() - lastExecutionTime.getTime() >= 30 * 24 * 60 * 60 * 1000;
      default:
        return false;
    }
  }

  private async checkPriceCondition(condition: string): Promise<boolean> {
    // Parse price condition: "XLM drops below $0.10"
    const assetMatch = condition.match(/xlm|usdc|btc|eth/i);
    const priceMatch = condition.match(/\$?(\d+(?:\.\d+)?)/);
    const operatorMatch = condition.match(/below|above|drops|rises/i);
    
    if (!assetMatch || !priceMatch || !operatorMatch) return false;
    
    const asset = assetMatch[0].toUpperCase();
    const targetPrice = parseFloat(priceMatch[1]);
    const operator = operatorMatch[0].toLowerCase();
    
    // Get current price (mock implementation)
    const currentPrice = await this.getCurrentPrice(asset);
    
    switch (operator) {
      case 'below':
      case 'drops':
        return currentPrice < targetPrice;
      case 'above':
      case 'rises':
        return currentPrice > targetPrice;
      default:
        return false;
    }
  }

  private async checkPortfolioCondition(condition: string, strategy: AutomationStrategy): Promise<boolean> {
    // Check portfolio drift, value changes, etc.
    const driftMatch = condition.match(/(\d+)%/);
    if (driftMatch) {
      const maxDrift = parseFloat(driftMatch[1]);
      const currentDrift = await this.calculatePortfolioDrift(strategy);
      return currentDrift > maxDrift;
    }
    return false;
  }

  private async checkMarketCondition(condition: string): Promise<boolean> {
    // Check market volatility, trends, etc.
    if (condition.includes('volatility is low')) {
      const volatility = await this.getMarketVolatility();
      return volatility < 0.3; // 30% volatility threshold
    }
    return true;
  }

  private async executeStrategy(strategy: AutomationStrategy): Promise<void> {
    console.log(`Executing strategy: ${strategy.name}`);
    
    const execution: AutomationExecution = {
      id: `exec_${Date.now()}`,
      strategyId: strategy.id,
      executedAt: new Date(),
      status: 'pending'
    };
    
    try {
      // Execute all actions in the strategy
      for (const action of strategy.actions) {
        await this.executeAction(action, execution);
      }
      
      execution.status = 'success';
      console.log(`Strategy executed successfully: ${strategy.name}`);
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Strategy execution failed: ${strategy.name}`, error);
    }
    
    this.executions.push(execution);
  }

  private async executeAction(action: AIAgentAction, execution: AutomationExecution): Promise<void> {
    switch (action.type) {
      case 'trade':
        await this.executeTrade(action.parameters, execution);
        break;
      case 'lend':
        await this.executeLend(action.parameters, execution);
        break;
      case 'rebalance':
        await this.executeRebalance(action.parameters, execution);
        break;
      case 'alert':
        await this.sendAlert(action.parameters);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private async executeTrade(params: any, execution: AutomationExecution): Promise<void> {
    // Execute trade on Stellar DEX
    console.log(`Executing trade: ${params.amount} ${params.fromAsset} -> ${params.toAsset}`);
    
    // This would integrate with actual Stellar SDK
    // For now, simulate execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    execution.transactionHash = `trade_${Date.now()}`;
  }

  private async executeLend(params: any, execution: AutomationExecution): Promise<void> {
    // Execute lending on Blend Protocol
    console.log(`Executing lend: ${params.amount} ${params.asset} to ${params.protocol}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    execution.transactionHash = `lend_${Date.now()}`;
  }

  private async executeRebalance(params: any, execution: AutomationExecution): Promise<void> {
    // Execute portfolio rebalancing
    console.log(`Executing rebalance to target allocation:`, params.targetAllocation);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    execution.transactionHash = `rebalance_${Date.now()}`;
  }

  private async sendAlert(params: any): Promise<void> {
    // Send notification/alert
    console.log(`Sending alert: ${params.message || 'Condition triggered'}`);
    
    // This would integrate with notification service
    // For now, just log
  }

  // Helper methods
  private async getCurrentPrice(asset: string): Promise<number> {
    // Mock price data - replace with real price feed
    const prices: Record<string, number> = {
      'XLM': 0.12,
      'USDC': 1.00,
      'BTC': 45000,
      'ETH': 3000
    };
    return prices[asset] || 0;
  }

  private async calculatePortfolioDrift(strategy: AutomationStrategy): Promise<number> {
    // Calculate how much portfolio has drifted from target
    // Mock implementation
    return Math.random() * 10; // 0-10% drift
  }

  private async getMarketVolatility(): Promise<number> {
    // Get current market volatility
    // Mock implementation
    return Math.random() * 0.5; // 0-50% volatility
  }

  private getLastExecution(strategyId: string): AutomationExecution | undefined {
    return this.executions
      .filter(exec => exec.strategyId === strategyId)
      .sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime())[0];
  }

  // Public methods for monitoring
  getExecutionHistory(strategyId?: string): AutomationExecution[] {
    if (strategyId) {
      return this.executions.filter(exec => exec.strategyId === strategyId);
    }
    return this.executions;
  }

  getActiveStrategiesCount(): number {
    return Array.from(this.strategies.values()).filter(s => s.isActive).length;
  }

  getTotalExecutions(): number {
    return this.executions.length;
  }

  getSuccessRate(): number {
    if (this.executions.length === 0) return 0;
    const successful = this.executions.filter(exec => exec.status === 'success').length;
    return (successful / this.executions.length) * 100;
  }
}

// Global automation engine instance
export const automationEngine = new AutomationEngine();