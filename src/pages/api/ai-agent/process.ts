import { NextApiRequest, NextApiResponse } from 'next';
import { AIAgentMessage } from '../../../lib/ai/stellarAIAgent';
import { GeminiService } from '../../../lib/ai/geminiService';

// Initialize Gemini service
const geminiService = new GeminiService(process.env.GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, walletAddress, timestamp, userProfile, portfolioData } = req.body;

    // Generate unique user ID (in production, use proper user authentication)
    const userId = walletAddress || `anonymous_${Date.now()}`;

    // Process the message with Gemini AI
    const aiResponse = await geminiService.processMessage(
      message,
      userId,
      walletAddress,
      userProfile,
      portfolioData
    );

    // Convert to our message format
    const response: AIAgentMessage = {
      id: Date.now().toString(),
      content: aiResponse.content,
      timestamp: new Date(),
      type: 'agent',
      metadata: {
        confidence: aiResponse.confidence,
        action: aiResponse.actions,
        intent: aiResponse.intent,
        followUpQuestions: aiResponse.followUpQuestions
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('AI processing error:', error);

    // Fallback response if Gemini fails
    const fallbackResponse: AIAgentMessage = {
      id: Date.now().toString(),
      content: "I'm having trouble processing your request right now. Please try again or ask me something else about Stellar DeFi!",
      timestamp: new Date(),
      type: 'agent',
      metadata: {
        confidence: 0.5,
        action: '',
        intent: 'error'
      }
    };

    res.status(200).json(fallbackResponse);
  }
}

async function processAIMessage(message: string, walletAddress?: string): Promise<AIAgentMessage> {
  const lowerMessage = message.toLowerCase();

  // Intent detection patterns
  const intents = {
    portfolio_analysis: /analyze|portfolio|performance|risk|holdings/,
    yield_opportunity: /yield|earn|apy|interest|stake|lend/,
    trade_execution: /buy|sell|trade|swap|exchange/,
    price_inquiry: /price|cost|value|worth/,
    automation: /automate|schedule|recurring|dca|dollar.cost/,
    market_insight: /market|trend|forecast|prediction/,
    rebalance: /rebalance|allocate|distribute/,
    alert: /alert|notify|watch|monitor/
  };

  // Detect primary intent
  let detectedIntent = 'general';
  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(lowerMessage)) {
      detectedIntent = intent;
      break;
    }
  }

  // Generate response based on intent
  const response = await generateResponse(detectedIntent, message, walletAddress);

  return {
    id: Date.now().toString(),
    content: response.content,
    timestamp: new Date(),
    type: 'agent',
    metadata: {
      confidence: response.confidence,
      action: response.actions
    }
  };
}

async function generateResponse(intent: string, message: string, walletAddress?: string) {
  switch (intent) {
    case 'portfolio_analysis':
      return {
        content: `I've analyzed your portfolio. You currently hold assets worth approximately $12,543. Your allocation is 65% XLM, 25% USDC, 10% other assets. Your risk score is 6/10 (moderate). Consider diversifying into yield-earning positions.`,
        confidence: 0.9,
        actions: [
          {
            type: 'analyze',
            description: 'Get detailed portfolio breakdown',
            parameters: { walletAddress },
            riskLevel: 'low',
            expectedOutcome: 'Detailed risk and performance analysis'
          }
        ]
      };

    case 'yield_opportunity':
      return {
        content: `Best yield opportunities right now: Blend Protocol offers 8.2% APY on XLM lending with low risk. Stellar DEX liquidity pools offer 12-15% but with higher impermanent loss risk. I recommend starting with Blend for safer yields.`,
        confidence: 0.95,
        actions: [
          {
            type: 'lend',
            description: 'Lend 1000 XLM to Blend Protocol (8.2% APY)',
            parameters: { asset: 'XLM', amount: '1000', protocol: 'blend' },
            riskLevel: 'low',
            expectedOutcome: '~82 XLM annually, low risk'
          },
          {
            type: 'stake',
            description: 'Add liquidity to XLM/USDC pool (12% APY)',
            parameters: { asset1: 'XLM', asset2: 'USDC', amount: '500' },
            riskLevel: 'medium',
            expectedOutcome: '~12% APY with impermanent loss risk'
          }
        ]
      };

    case 'trade_execution':
      const tradeMatch = message.match(/buy|sell/);
      const amountMatch = message.match(/\$?(\d+(?:\.\d+)?)/);
      const assetMatch = message.match(/xlm|usdc|btc|eth/i);

      return {
        content: `I can help you ${tradeMatch?.[0] || 'trade'} ${assetMatch?.[0]?.toUpperCase() || 'assets'}. Current XLM price is $0.12. ${amountMatch ? `For $${amountMatch[1]}, you'd get approximately ${(parseFloat(amountMatch[1]) / 0.12).toFixed(2)} XLM.` : ''}`,
        confidence: 0.8,
        actions: [
          {
            type: 'trade',
            description: `${tradeMatch?.[0] || 'Buy'} ${amountMatch?.[1] ? `$${amountMatch[1]} of ` : ''}${assetMatch?.[0]?.toUpperCase() || 'XLM'}`,
            parameters: {
              fromAsset: 'USDC',
              toAsset: assetMatch?.[0]?.toUpperCase() || 'XLM',
              amount: amountMatch?.[1] || '100'
            },
            riskLevel: 'low',
            expectedOutcome: `Acquire ${assetMatch?.[0]?.toUpperCase() || 'XLM'} at current market price`
          }
        ]
      };

    case 'automation':
      return {
        content: `I can set up automated strategies for you! Popular options include dollar-cost averaging (DCA), automatic rebalancing, and yield optimization. What would you like to automate?`,
        confidence: 0.85,
        actions: [
          {
            type: 'automation',
            description: 'Set up weekly $100 XLM purchase (DCA)',
            parameters: { asset: 'XLM', amount: '100', frequency: 'weekly' },
            riskLevel: 'low',
            expectedOutcome: 'Automated weekly purchases to average price'
          },
          {
            type: 'automation',
            description: 'Auto-rebalance portfolio monthly',
            parameters: { frequency: 'monthly', threshold: '5%' },
            riskLevel: 'low',
            expectedOutcome: 'Maintain target allocation automatically'
          }
        ]
      };

    case 'market_insight':
      return {
        content: `XLM is currently trading at $0.12, up 2.4% today. Technical indicators suggest neutral momentum. The Stellar ecosystem is growing with increased Soroban adoption. Consider DCA strategy in this sideways market.`,
        confidence: 0.75,
        actions: [
          {
            type: 'analyze',
            description: 'Get detailed market analysis',
            parameters: { asset: 'XLM', timeframe: '1d' },
            riskLevel: 'low',
            expectedOutcome: 'Comprehensive market insights and trends'
          }
        ]
      };

    case 'rebalance':
      return {
        content: `I can rebalance your portfolio to your target allocation. Current allocation: 65% XLM, 25% USDC, 10% other. What's your target allocation?`,
        confidence: 0.9,
        actions: [
          {
            type: 'rebalance',
            description: 'Rebalance to 60% XLM, 30% USDC, 10% other',
            parameters: {
              targetAllocation: { XLM: 60, USDC: 30, OTHER: 10 },
              threshold: 5
            },
            riskLevel: 'low',
            expectedOutcome: 'Portfolio rebalanced to target allocation'
          }
        ]
      };

    case 'alert':
      return {
        content: `I can set up price alerts and monitoring for you. What conditions would you like me to watch for?`,
        confidence: 0.8,
        actions: [
          {
            type: 'alert',
            description: 'Alert when XLM drops below $0.10',
            parameters: { asset: 'XLM', condition: 'below', price: '0.10' },
            riskLevel: 'low',
            expectedOutcome: 'Instant notification when condition is met'
          }
        ]
      };

    default:
      return {
        content: `I'm your Stellar DeFi AI assistant! I can help you analyze your portfolio, find yield opportunities, execute trades, set up automation, and monitor markets. What would you like to do?`,
        confidence: 0.6,
        actions: []
      };
  }
}
