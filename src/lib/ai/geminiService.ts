// Gemini AI Service for Stellar DeFi
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ConversationContext {
  userId: string;
  walletAddress?: string;
  userProfile?: {
    experience: string;
    riskTolerance: string;
    goals: string[];
    preferredAssets: string[];
  };
  portfolioData?: {
    totalValue: number;
    assets: Array<{ symbol: string; balance: number; value: number }>;
    riskScore: number;
  };
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    actions?: any[];
  }>;
}

export interface AIResponse {
  content: string;
  confidence: number;
  intent: string;
  actions: Array<{
    type: string;
    description: string;
    parameters: any;
    riskLevel: 'low' | 'medium' | 'high';
    expectedOutcome: string;
  }>;
  followUpQuestions?: string[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private conversationContexts: Map<string, ConversationContext> = new Map();

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async processMessage(
    message: string, 
    userId: string, 
    walletAddress?: string,
    userProfile?: any,
    portfolioData?: any
  ): Promise<AIResponse> {
    // Get or create conversation context
    let context = this.conversationContexts.get(userId);
    if (!context) {
      context = {
        userId,
        walletAddress,
        userProfile,
        portfolioData,
        conversationHistory: []
      };
      this.conversationContexts.set(userId, context);
    }

    // Update context with latest data
    context.walletAddress = walletAddress || context.walletAddress;
    context.userProfile = userProfile || context.userProfile;
    context.portfolioData = portfolioData || context.portfolioData;

    // Add user message to history
    context.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Generate AI response
    const response = await this.generateResponse(message, context);

    // Add AI response to history
    context.conversationHistory.push({
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      actions: response.actions
    });

    // Keep only last 20 messages to manage memory
    if (context.conversationHistory.length > 20) {
      context.conversationHistory = context.conversationHistory.slice(-20);
    }

    return response;
  }

  private async generateResponse(message: string, context: ConversationContext): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(context);
    const conversationHistory = this.buildConversationHistory(context);
    
    const fullPrompt = `${systemPrompt}

${conversationHistory}

User: ${message}

Please respond as a helpful Stellar DeFi AI assistant. Analyze the user's message and provide:
1. A helpful, conversational response
2. Specific actionable recommendations
3. Risk assessment for any suggested actions
4. Follow-up questions if appropriate

Format your response as JSON with this structure:
{
  "content": "Your conversational response",
  "confidence": 0.95,
  "intent": "detected_intent",
  "actions": [
    {
      "type": "trade|lend|stake|analyze|alert|automation",
      "description": "Human readable description",
      "parameters": {...},
      "riskLevel": "low|medium|high",
      "expectedOutcome": "What the user can expect"
    }
  ],
  "followUpQuestions": ["Optional follow-up questions"]
}`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const responseText = result.response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          return this.validateAndEnhanceResponse(parsedResponse, message, context);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, using fallback');
      }

      // Fallback to rule-based response if JSON parsing fails
      return this.generateFallbackResponse(message, context, responseText);
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.generateFallbackResponse(message, context);
    }
  }

  private buildSystemPrompt(context: ConversationContext): string {
    const { userProfile, portfolioData, walletAddress } = context;
    
    return `You are an expert Stellar DeFi AI assistant. Your role is to help users navigate the Stellar ecosystem, make informed decisions, and execute DeFi strategies.

CONTEXT:
- User Experience: ${userProfile?.experience || 'unknown'}
- Risk Tolerance: ${userProfile?.riskTolerance || 'unknown'}
- Goals: ${userProfile?.goals?.join(', ') || 'unknown'}
- Preferred Assets: ${userProfile?.preferredAssets?.join(', ') || 'XLM, USDC'}
- Wallet Connected: ${walletAddress ? 'Yes' : 'No'}
- Portfolio Value: ${portfolioData?.totalValue ? `$${portfolioData.totalValue.toLocaleString()}` : 'Unknown'}

STELLAR ECOSYSTEM KNOWLEDGE:
- XLM: Native Stellar token, used for fees and as base currency
- USDC: USD Coin on Stellar, stable and widely used
- Blend Protocol: Leading lending/borrowing platform (8-12% APY)
- Stellar DEX: Built-in decentralized exchange
- Soroban: Smart contract platform
- Anchors: Bridges to traditional finance

CURRENT MARKET CONDITIONS:
- XLM Price: ~$0.12 (use for calculations)
- USDC Price: $1.00
- Blend Protocol APY: 8.2% for XLM lending
- DEX Liquidity: Good for major pairs

CAPABILITIES:
- Portfolio analysis and optimization
- Yield farming strategies
- Automated DeFi strategies (DCA, rebalancing)
- Risk assessment and management
- Market insights and alerts
- Transaction execution

Always consider the user's risk tolerance and experience level. Provide clear explanations for beginners, and more advanced strategies for experienced users.`;
  }

  private buildConversationHistory(context: ConversationContext): string {
    const recentHistory = context.conversationHistory.slice(-6); // Last 6 messages
    return recentHistory.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');
  }

  private validateAndEnhanceResponse(response: any, message: string, context: ConversationContext): AIResponse {
    // Ensure required fields exist
    const validatedResponse: AIResponse = {
      content: response.content || "I'm here to help with your Stellar DeFi needs!",
      confidence: Math.min(Math.max(response.confidence || 0.7, 0), 1),
      intent: response.intent || this.detectIntent(message),
      actions: Array.isArray(response.actions) ? response.actions : [],
      followUpQuestions: Array.isArray(response.followUpQuestions) ? response.followUpQuestions : undefined
    };

    // Enhance actions with Stellar-specific validation
    validatedResponse.actions = validatedResponse.actions.map(action => ({
      ...action,
      type: this.validateActionType(action.type),
      riskLevel: this.validateRiskLevel(action.riskLevel, context.userProfile?.riskTolerance),
      parameters: this.enhanceActionParameters(action.parameters, action.type)
    }));

    return validatedResponse;
  }

  private generateFallbackResponse(message: string, context: ConversationContext, aiText?: string): AIResponse {
    const intent = this.detectIntent(message);
    const lowerMessage = message.toLowerCase();

    // Use AI text if available, otherwise generate based on intent
    let content = aiText || this.generateIntentBasedResponse(intent, lowerMessage, context);
    
    // Generate appropriate actions based on intent
    const actions = this.generateActionsForIntent(intent, message, context);

    return {
      content,
      confidence: aiText ? 0.8 : 0.6,
      intent,
      actions
    };
  }

  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    const intents = {
      portfolio_analysis: /analyze|portfolio|performance|risk|holdings|balance/,
      yield_opportunity: /yield|earn|apy|interest|stake|lend|farming/,
      trade_execution: /buy|sell|trade|swap|exchange|purchase/,
      price_inquiry: /price|cost|value|worth|how much/,
      automation: /automate|schedule|recurring|dca|dollar.cost|weekly|monthly/,
      market_insight: /market|trend|forecast|prediction|news/,
      rebalance: /rebalance|allocate|distribute|allocation/,
      alert: /alert|notify|watch|monitor|tell me when/,
      education: /how|what|why|explain|learn|tutorial/,
      blend_protocol: /blend|lending|borrowing|supply|borrow/
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(lowerMessage)) {
        return intent;
      }
    }

    return 'general';
  }

  private generateIntentBasedResponse(intent: string, message: string, context: ConversationContext): string {
    const { userProfile, portfolioData } = context;
    
    switch (intent) {
      case 'portfolio_analysis':
        return `I'll analyze your portfolio for you. ${portfolioData ? `Your current portfolio is worth $${portfolioData.totalValue.toLocaleString()} with a risk score of ${portfolioData.riskScore}/10.` : 'Connect your wallet to see detailed analysis.'} Based on your ${userProfile?.riskTolerance || 'moderate'} risk tolerance, I can suggest optimizations.`;
      
      case 'yield_opportunity':
        return `For ${userProfile?.riskTolerance || 'moderate'} risk tolerance, I recommend Blend Protocol offering 8.2% APY on XLM lending. It's currently the safest yield option in the Stellar ecosystem.`;
      
      case 'trade_execution':
        return `I can help you execute trades on the Stellar DEX. Current XLM price is around $0.12. What would you like to trade?`;
      
      case 'automation':
        return `I can set up automated strategies like dollar-cost averaging, portfolio rebalancing, or yield optimization. What type of automation interests you?`;
      
      case 'blend_protocol':
        return `Blend Protocol is Stellar's leading DeFi platform. You can lend XLM for 8.2% APY or borrow against your assets. It's audited and considered low-risk.`;
      
      default:
        return `I'm your Stellar DeFi assistant! I can help with portfolio analysis, yield farming, trading, automation, and more. What would you like to explore?`;
    }
  }

  private generateActionsForIntent(intent: string, message: string, context: ConversationContext): any[] {
    switch (intent) {
      case 'portfolio_analysis':
        return [{
          type: 'analyze',
          description: 'Analyze portfolio and suggest optimizations',
          parameters: { walletAddress: context.walletAddress },
          riskLevel: 'low',
          expectedOutcome: 'Detailed portfolio breakdown and recommendations'
        }];
      
      case 'yield_opportunity':
        return [{
          type: 'lend',
          description: 'Lend XLM to Blend Protocol (8.2% APY)',
          parameters: { asset: 'XLM', protocol: 'blend', amount: '1000' },
          riskLevel: 'low',
          expectedOutcome: '8.2% annual yield on deposited XLM'
        }];
      
      case 'automation':
        return [{
          type: 'automation',
          description: 'Set up weekly DCA strategy',
          parameters: { asset: 'XLM', amount: '100', frequency: 'weekly' },
          riskLevel: 'low',
          expectedOutcome: 'Automated weekly purchases to average price'
        }];
      
      default:
        return [];
    }
  }

  private validateActionType(type: string): string {
    const validTypes = ['trade', 'lend', 'stake', 'analyze', 'alert', 'automation', 'rebalance'];
    return validTypes.includes(type) ? type : 'analyze';
  }

  private validateRiskLevel(riskLevel: string, userRiskTolerance?: string): 'low' | 'medium' | 'high' {
    const validLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    if (validLevels.includes(riskLevel as any)) {
      return riskLevel as 'low' | 'medium' | 'high';
    }
    
    // Default based on user's risk tolerance
    switch (userRiskTolerance) {
      case 'conservative': return 'low';
      case 'aggressive': return 'high';
      default: return 'medium';
    }
  }

  private enhanceActionParameters(parameters: any, actionType: string): any {
    if (!parameters) return {};
    
    // Add Stellar-specific enhancements
    switch (actionType) {
      case 'trade':
        return {
          ...parameters,
          network: 'stellar',
          slippage: parameters.slippage || 0.5
        };
      case 'lend':
        return {
          ...parameters,
          protocol: parameters.protocol || 'blend',
          network: 'stellar'
        };
      default:
        return parameters;
    }
  }

  // Get conversation context for a user
  getConversationContext(userId: string): ConversationContext | undefined {
    return this.conversationContexts.get(userId);
  }

  // Clear conversation history for a user
  clearConversationHistory(userId: string): void {
    const context = this.conversationContexts.get(userId);
    if (context) {
      context.conversationHistory = [];
    }
  }

  // Update user context
  updateUserContext(userId: string, updates: Partial<ConversationContext>): void {
    const context = this.conversationContexts.get(userId);
    if (context) {
      Object.assign(context, updates);
    }
  }
}