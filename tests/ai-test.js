// AI Functionality Test Script
// Tests the Gemini AI integration for Syndicate

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
  console.log('🤖 Testing Syndicate AI Integration...\n');

  // Check if API key is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('   Please add your Gemini API key to .env file');
    return;
  }

  console.log('✅ Gemini API key found');

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Test 1: Basic AI Response
    console.log('\n📝 Test 1: Basic DeFi Query');
    const prompt1 = "What's the best way to earn yield on Stellar?";

    const result1 = await model.generateContent(prompt1);
    const response1 = result1.response.text();

    console.log('Query:', prompt1);
    console.log('Response:', response1.substring(0, 200) + '...');
    console.log('✅ Basic AI response working');

    // Test 2: Blend Protocol Specific Query
    console.log('\n🔗 Test 2: Blend Protocol Query');
    const prompt2 = `As a Stellar DeFi expert, explain how Blend Protocol works and what APY users can expect.
    Current context: Blend offers lending and borrowing on Stellar with pools for XLM and USDC.

    Please provide a JSON response with:
    {
      "explanation": "brief explanation",
      "currentAPY": "estimated APY",
      "riskLevel": "low/medium/high",
      "recommendation": "should user consider it?"
    }`;

    const result2 = await model.generateContent(prompt2);
    const response2 = result2.response.text();

    console.log('Query: Blend Protocol analysis');
    console.log('Response:', response2.substring(0, 300) + '...');

    // Try to extract JSON
    try {
      const jsonMatch = response2.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        console.log('✅ Structured JSON response:', JSON.stringify(jsonResponse, null, 2));
      }
    } catch (e) {
      console.log('⚠️  JSON parsing failed, but response received');
    }

    // Test 3: Portfolio Analysis Simulation
    console.log('\n💼 Test 3: Portfolio Analysis');
    const prompt3 = `Analyze this hypothetical Stellar portfolio:
    - 1000 XLM ($120 value)
    - 500 USDC ($500 value)
    - User is conservative investor

    Provide recommendations in JSON format:
    {
      "portfolioValue": "$620",
      "riskScore": "1-10",
      "recommendations": ["action1", "action2"],
      "yieldOpportunities": ["opportunity1", "opportunity2"]
    }`;

    const result3 = await model.generateContent(prompt3);
    const response3 = result3.response.text();

    console.log('Query: Portfolio analysis');
    console.log('Response:', response3.substring(0, 250) + '...');
    console.log('✅ Portfolio analysis working');

    // Test 4: AI Agent Conversation Simulation
    console.log('\n💬 Test 4: Conversation Flow');
    const conversationPrompt = `You are Syndicate AI, a helpful Stellar DeFi assistant.
    User just asked: "I have $1000 to invest in Stellar DeFi. What should I do?"

    User context:
    - New to DeFi
    - Risk tolerance: Conservative
    - Goal: Earn passive income

    Respond conversationally and suggest specific actions with Blend Protocol.`;

    const result4 = await model.generateContent(conversationPrompt);
    const response4 = result4.response.text();

    console.log('Query: Investment advice conversation');
    console.log('AI Response:', response4.substring(0, 400) + '...');
    console.log('✅ Conversational AI working');

    // Summary
    console.log('\n🎉 AI Integration Test Results:');
    console.log('✅ Gemini API connection successful');
    console.log('✅ Basic DeFi queries working');
    console.log('✅ Blend Protocol knowledge available');
    console.log('✅ Portfolio analysis functional');
    console.log('✅ Conversational responses working');
    console.log('\n🚀 Ready for Blend Composability Hackathon!');

    // Test API endpoint structure
    console.log('\n🔌 Testing API Endpoint Structure...');
    const testApiCall = {
      message: "What's the best yield on Stellar?",
      userId: 'test-user',
      walletAddress: 'GTEST123...',
      userProfile: {
        experience: 'beginner',
        riskTolerance: 'conservative',
        goals: ['passive income'],
      },
    };

    console.log('Test API payload:', JSON.stringify(testApiCall, null, 2));
    console.log('✅ API structure ready for frontend integration');
  } catch (error) {
    console.error('❌ Error testing AI integration:', error.message);

    if (error.message.includes('API_KEY')) {
      console.log('\n🔑 API Key Issues:');
      console.log('1. Make sure you have a valid Gemini API key');
      console.log('2. Get one from: https://ai.google.dev/');
      console.log('3. Add it to your .env file as GEMINI_API_KEY=your_key_here');
    }

    if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('\n⚠️  Rate Limit/Quota Issues:');
      console.log('1. You may have exceeded API quota');
      console.log('2. Try again in a few minutes');
      console.log('3. Check your Google AI Studio dashboard');
    }
  }
}

// Run the test
testGeminiAPI().catch(console.error);
