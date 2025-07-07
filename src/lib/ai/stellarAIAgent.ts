// Stellar DeFi AI Agent
// Combines natural language processing with automated DeFi actions

import { useState, useEffect } from 'react';

export interface AIAgentMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'agent' | 'action' | 'analysis';
  metadata?: {
    action?: string;
    parameters?: any;
    result?: any;
    confidence?: number;
    intent?: string;
  };
}

export interface AIAgentAction {
  type: 'trade' | 'stake' | 'lend' | 'borrow' | 'analyze' | 'alert' | 'rebalance';
  description: string;
  parameters: any;
  estimatedGas?: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedOutcome?: string;
}

export interface AIAgentCapabilities {
  // Analysis capabilities
  analyzePortfolio: (address: string) => Promise<string>;
  analyzeMarket: (asset: string) => Promise<string>;
  calculateRisk: (strategy: any) => Promise<number>;

  // Action capabilities
  executeTrade: (params: TradeParams) => Promise<string>;
  stakeAssets: (params: StakeParams) => Promise<string>;
  lendAssets: (params: LendParams) => Promise<string>;
  rebalancePortfolio: (params: RebalanceParams) => Promise<string>;

  // Automation capabilities
  createStrategy: (description: string) => Promise<AutomationStrategy>;
  scheduleAction: (action: AIAgentAction, schedule: string) => Promise<string>;
  monitorConditions: (conditions: string[]) => Promise<void>;
}

export interface TradeParams {
  fromAsset: string;
  toAsset: string;
  amount: string;
  slippage?: number;
  maxPrice?: string;
}

export interface StakeParams {
  asset: string;
  amount: string;
  validator?: string;
  duration?: string;
}

export interface LendParams {
  asset: string;
  amount: string;
  protocol: 'blend' | 'other';
  duration?: string;
}

export interface RebalanceParams {
  targetAllocation: Record<string, number>;
  threshold?: number;
}

export interface AutomationStrategy {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  actions: AIAgentAction[];
  isActive: boolean;
  createdAt: Date;
}

export class StellarAIAgent {
  private apiKey: string;
  private baseUrl: string;
  private walletAddress?: string;

  constructor(apiKey: string, baseUrl = '/api/ai-agent') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Natural language processing with enhanced context
  async processMessage(message: string, userProfile?: any, portfolioData?: any): Promise<AIAgentMessage> {
    const response = await fetch(`${this.baseUrl}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        message,
        walletAddress: this.walletAddress,
        userProfile,
        portfolioData,
        timestamp: new Date().toISOString()
      })
    });

    return await response.json();
  }

  // Execute actions based on AI analysis
  async executeAction(action: AIAgentAction): Promise<any> {
    const response = await fetch(`${this.baseUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        action,
        walletAddress: this.walletAddress
      })
    });

    return await response.json();
  }

  // Create automation strategies
  async createAutomation(description: string): Promise<AutomationStrategy> {
    const response = await fetch(`${this.baseUrl}/automation/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        description,
        walletAddress: this.walletAddress
      })
    });

    return await response.json();
  }

  // Monitor and execute automations
  async getActiveAutomations(): Promise<AutomationStrategy[]> {
    const response = await fetch(`${this.baseUrl}/automation/list`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    return await response.json();
  }

  // Portfolio analysis
  async analyzePortfolio(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/analyze/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        walletAddress: this.walletAddress
      })
    });

    const result = await response.json() as { analysis: string };
    return result.analysis;
  }

  // Market insights
  async getMarketInsights(asset?: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/analyze/market`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        asset: asset ?? 'XLM'
      })
    });

    const result = await response.json() as { insights: string };
    return result.insights;
  }

  // Set wallet for context
  setWallet(address: string) {
    this.walletAddress = address;
  }
}

// Example AI prompts and responses
export const AI_EXAMPLES = {
  prompts: [
    "What's the best way to earn yield on my XLM?",
    "Should I buy more XLM now or wait?",
    "Rebalance my portfolio to 60% XLM, 30% USDC, 10% other",
    "Set up automatic buying of $100 XLM every week",
    "Alert me if XLM drops below $0.10",
    "What's my portfolio risk level?",
    "Find the highest yield opportunities",
    "Explain why my portfolio lost money today"
  ],
  responses: [
    {
      analysis: "Based on current market conditions, Blend Protocol offers 8.2% APY on XLM with low risk...",
      actions: [
        {
          type: 'lend',
          description: 'Lend 1000 XLM to Blend Protocol',
          parameters: { asset: 'XLM', amount: '1000', protocol: 'blend' },
          riskLevel: 'low',
          expectedOutcome: '8.2% APY, ~82 XLM annually'
        }
      ]
    }
  ]
};

// AI Agent Hook for React components with enhanced context
export const useAIAgent = () => {
  const [agent] = useState(() => new StellarAIAgent(process.env.NEXT_PUBLIC_AI_API_KEY ?? ''));
  const [messages, setMessages] = useState<AIAgentMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('stellar_ai_conversation');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages) as Array<Omit<AIAgentMessage, 'timestamp'> & { timestamp: string }>;
        setMessages(parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.warn('Failed to load conversation history:', error);
      }
    }
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('stellar_ai_conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (content: string, userProfile?: any, portfolioData?: any) => {
    setIsProcessing(true);
    try {
      const userMessage: AIAgentMessage = {
        id: Date.now().toString(),
        content,
        timestamp: new Date(),
        type: 'user'
      };

      setMessages(prev => [...prev, userMessage]);

      // Get enhanced response with context
      const response = await agent.processMessage(content, userProfile, portfolioData);
      setMessages(prev => [...prev, response]);

      return response;
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAction = async (action: AIAgentAction) => {
    setIsProcessing(true);
    try {
      const result = await agent.executeAction(action);

      const actionMessage: AIAgentMessage = {
        id: Date.now().toString(),
        content: `Executed: ${action.description}`,
        timestamp: new Date(),
        type: 'action',
        metadata: { action: action.type, result }
      };

      setMessages(prev => [...prev, actionMessage]);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('stellar_ai_conversation');
  };

  const getLastIntent = () => {
    const lastAgentMessage = messages.filter(m => m.type === 'agent').pop();
    return lastAgentMessage?.metadata?.intent ?? null;
  };

  const getConversationSummary = () => {
    return {
      totalMessages: messages.length,
      userMessages: messages.filter(m => m.type === 'user').length,
      agentMessages: messages.filter(m => m.type === 'agent').length,
      actionsExecuted: messages.filter(m => m.type === 'action').length,
      lastActivity: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    };
  };

  return {
    agent,
    messages,
    isProcessing,
    sendMessage,
    executeAction,
    clearConversation,
    getLastIntent,
    getConversationSummary
  };
};
