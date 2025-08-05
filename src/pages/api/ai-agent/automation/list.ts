import { NextApiRequest, NextApiResponse } from 'next';
import { AutomationStrategy } from '../../../../lib/ai/stellarAIAgent';

// In-memory storage for demo - replace with database
const automationStrategies: Map<string, AutomationStrategy[]> = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { walletAddress } = req.query;

    if (!walletAddress || typeof walletAddress !== 'string') {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const userStrategies = automationStrategies.get(walletAddress) || [];

    res.status(200).json(userStrategies);
  } catch (error) {
    console.error('Automation list error:', error);
    res.status(500).json({ error: 'Failed to fetch automations' });
  }
}
