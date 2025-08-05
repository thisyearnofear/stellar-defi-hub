import { NextApiRequest, NextApiResponse } from 'next';
import { AutomationStrategy } from '../../../../lib/ai/stellarAIAgent';

// In-memory storage for demo - replace with database
const automationStrategies: Map<string, AutomationStrategy[]> = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { description, walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const strategy = await createAutomationStrategy(description, walletAddress);

    // Store strategy
    const userStrategies = automationStrategies.get(walletAddress) || [];
    userStrategies.push(strategy);
    automationStrategies.set(walletAddress, userStrategies);

    res.status(200).json(strategy);
  } catch (error) {
    console.error('Automation creation error:', error);
    res.status(500).json({ error: 'Automation creation failed' });
  }
}

async function createAutomationStrategy(
  description: string,
  walletAddress: string
): Promise<AutomationStrategy> {
  const lowerDesc = description.toLowerCase();

  // Parse automation intent
  let strategy: Partial<AutomationStrategy> = {
    id: `automation_${Date.now()}`,
    description,
    isActive: true,
    createdAt: new Date(),
  };

  // DCA (Dollar Cost Averaging)
  if (
    lowerDesc.includes('dca') ||
    lowerDesc.includes('dollar cost') ||
    lowerDesc.includes('weekly') ||
    lowerDesc.includes('monthly')
  ) {
    const amountMatch = description.match(/\$?(\d+(?:\.\d+)?)/);
    const assetMatch = description.match(/xlm|usdc|btc|eth/i);
    const frequencyMatch = description.match(/daily|weekly|monthly/i);

    strategy = {
      ...strategy,
      name: 'Dollar Cost Averaging',
      conditions: [
        `Every ${frequencyMatch?.[0] || 'week'}`,
        `Market is open`,
        `Wallet has sufficient balance`,
      ],
      actions: [
        {
          type: 'trade',
          description: `Buy ${amountMatch?.[1] || '100'} ${assetMatch?.[0]?.toUpperCase() || 'XLM'}`,
          parameters: {
            fromAsset: 'USDC',
            toAsset: assetMatch?.[0]?.toUpperCase() || 'XLM',
            amount: amountMatch?.[1] || '100',
          },
          riskLevel: 'low',
          expectedOutcome: 'Average purchase price over time',
        },
      ],
    };
  }

  // Rebalancing
  else if (lowerDesc.includes('rebalance') || lowerDesc.includes('allocation')) {
    strategy = {
      ...strategy,
      name: 'Portfolio Rebalancing',
      conditions: ['Portfolio drift exceeds 5%', 'Monthly check', 'Market volatility is low'],
      actions: [
        {
          type: 'rebalance',
          description: 'Rebalance to target allocation',
          parameters: {
            targetAllocation: { XLM: 60, USDC: 30, OTHER: 10 },
            threshold: 5,
          },
          riskLevel: 'low',
          expectedOutcome: 'Maintain target portfolio allocation',
        },
      ],
    };
  }

  // Yield optimization
  else if (
    lowerDesc.includes('yield') ||
    lowerDesc.includes('optimize') ||
    lowerDesc.includes('earn')
  ) {
    strategy = {
      ...strategy,
      name: 'Yield Optimization',
      conditions: [
        'Better yield opportunity available',
        'Minimum 1% APY improvement',
        'Low risk protocols only',
      ],
      actions: [
        {
          type: 'lend',
          description: 'Move funds to highest yield protocol',
          parameters: {
            asset: 'XLM',
            protocol: 'blend',
            minAPY: '8%',
          },
          riskLevel: 'low',
          expectedOutcome: 'Maximize yield while maintaining safety',
        },
      ],
    };
  }

  // Stop loss
  else if (lowerDesc.includes('stop loss') || lowerDesc.includes('protect')) {
    const percentMatch = description.match(/(\d+)%/);

    strategy = {
      ...strategy,
      name: 'Stop Loss Protection',
      conditions: [
        `Portfolio value drops ${percentMatch?.[1] || '20'}% from peak`,
        'Market is in downtrend',
        'Volatility is high',
      ],
      actions: [
        {
          type: 'trade',
          description: 'Sell risky assets, move to stablecoins',
          parameters: {
            fromAsset: 'XLM',
            toAsset: 'USDC',
            percentage: 50,
          },
          riskLevel: 'medium',
          expectedOutcome: 'Protect capital during market downturns',
        },
      ],
    };
  }

  // Take profit
  else if (lowerDesc.includes('take profit') || lowerDesc.includes('sell when')) {
    const percentMatch = description.match(/(\d+)%/);

    strategy = {
      ...strategy,
      name: 'Take Profit Strategy',
      conditions: [
        `Portfolio value increases ${percentMatch?.[1] || '50'}% from entry`,
        'Market shows signs of overheating',
        'Technical indicators suggest reversal',
      ],
      actions: [
        {
          type: 'trade',
          description: 'Take partial profits',
          parameters: {
            fromAsset: 'XLM',
            toAsset: 'USDC',
            percentage: 25,
          },
          riskLevel: 'low',
          expectedOutcome: 'Lock in gains while maintaining upside exposure',
        },
      ],
    };
  }

  // Default strategy
  else {
    strategy = {
      ...strategy,
      name: 'Custom Strategy',
      conditions: ['Custom conditions based on description'],
      actions: [
        {
          type: 'analyze',
          description: 'Analyze and suggest actions',
          parameters: { description },
          riskLevel: 'low',
          expectedOutcome: 'Personalized strategy recommendations',
        },
      ],
    };
  }

  return strategy as AutomationStrategy;
}
