// Context Manager for AI Agent
// Manages user context, portfolio data, and conversation state

import { useStellar } from '../../components/web3/StellarProvider';
import { useOnboarding } from '../../hooks/useOnboarding';

export interface AIContext {
  user: {
    walletAddress?: string;
    isConnected: boolean;
    profile?: any;
  };
  portfolio: {
    totalValue?: number;
    assets?: Array<{
      symbol: string;
      balance: number;
      value: number;
      change24h?: number;
    }>;
    riskScore?: number;
    allocation?: Record<string, number>;
  };
  market: {
    xlmPrice?: number;
    usdcPrice?: number;
    blendAPY?: number;
    volatility?: number;
  };
  preferences: {
    riskTolerance?: string;
    goals?: string[];
    experience?: string;
    preferredAssets?: string[];
  };
}

export const useAIContext = (): AIContext => {
  const { publicKey, isConnected } = useStellar();
  const { userProfile } = useOnboarding();

  // Mock portfolio data - replace with real data fetching
  const portfolioData = {
    totalValue: 12543,
    assets: [
      { symbol: 'XLM', balance: 8432.12, value: 1686.42, change24h: 2.4 },
      { symbol: 'USDC', balance: 5000.00, value: 5000.00, change24h: 0.0 },
      { symbol: 'yXLM', balance: 2156.78, value: 431.36, change24h: 5.2 }
    ],
    riskScore: 6,
    allocation: {
      XLM: 65,
      USDC: 25,
      OTHER: 10
    }
  };

  // Mock market data - replace with real market data
  const marketData = {
    xlmPrice: 0.12,
    usdcPrice: 1.00,
    blendAPY: 8.2,
    volatility: 0.25
  };

  return {
    user: {
      walletAddress: publicKey || undefined,
      isConnected,
      profile: userProfile
    },
    portfolio: isConnected ? portfolioData : {},
    market: marketData,
    preferences: {
      riskTolerance: userProfile?.riskTolerance,
      goals: userProfile?.goals,
      experience: userProfile?.experience,
      preferredAssets: userProfile?.preferredAssets
    }
  };
};

// Enhanced AI Agent Hook with Context
export const useEnhancedAIAgent = () => {
  const context = useAIContext();
  
  const sendContextualMessage = async (message: string, useAIAgent: any) => {
    return await useAIAgent.sendMessage(
      message,
      context.preferences,
      context.portfolio
    );
  };

  const getContextSummary = () => {
    const { user, portfolio, preferences } = context;
    
    return {
      hasWallet: user.isConnected,
      portfolioValue: portfolio.totalValue,
      riskProfile: preferences.riskTolerance,
      experience: preferences.experience,
      primaryGoals: preferences.goals?.slice(0, 3),
      topAssets: portfolio.assets?.slice(0, 3).map(a => a.symbol)
    };
  };

  const getPersonalizedGreeting = () => {
    const { user, preferences, portfolio } = context;
    
    if (!user.isConnected) {
      return "👋 Hi! I'm your Stellar DeFi AI assistant. Connect your wallet to get personalized insights!";
    }

    const greeting = `👋 Welcome back! `;
    const portfolioInfo = portfolio.totalValue 
      ? `Your portfolio is worth $${portfolio.totalValue.toLocaleString()}. `
      : '';
    
    const suggestion = preferences.experience === 'beginner'
      ? "I can help you learn about safe yield opportunities."
      : preferences.riskTolerance === 'aggressive'
      ? "Ready to explore some high-yield strategies?"
      : "Let's optimize your portfolio for steady returns.";

    return greeting + portfolioInfo + suggestion;
  };

  return {
    context,
    sendContextualMessage,
    getContextSummary,
    getPersonalizedGreeting
  };
};