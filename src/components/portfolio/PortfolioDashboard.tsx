import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Badge,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Alert,
  AlertIcon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';
import { ProductionBanner } from '../common/ProductionBanner';
import { ProgressiveDisclosure } from '../common/ProgressiveDisclosure';

interface PortfolioPosition {
  id: string;
  protocol: string;
  chain: string;
  asset: string;
  type: 'supply' | 'borrow';
  amount: string;
  value: number;
  apy: number;
  healthFactor?: number;
  liquidationRisk?: 'low' | 'medium' | 'high';
}

interface ChainBalance {
  chain: string;
  totalValue: number;
  assets: {
    symbol: string;
    balance: string;
    value: number;
  }[];
}

export const PortfolioDashboard: React.FC = () => {
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [chainBalances, setChainBalances] = useState<ChainBalance[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [totalYieldEarning, setTotalYieldEarning] = useState(0);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Mock portfolio data - would come from real integrations
    const mockPositions: PortfolioPosition[] = [
      {
        id: '1',
        protocol: 'Blend Protocol',
        chain: 'Stellar',
        asset: 'USDC',
        type: 'supply',
        amount: '5,000',
        value: 5000,
        apy: 5.2,
        healthFactor: 999,
      },
      {
        id: '2',
        protocol: 'YieldBlox',
        chain: 'Stellar',
        asset: 'XLM',
        type: 'supply',
        amount: '25,000',
        value: 2500,
        apy: 4.8,
      },
      {
        id: '3',
        protocol: 'Blend Protocol',
        chain: 'Stellar',
        asset: 'USDC',
        type: 'borrow',
        amount: '2,000',
        value: 2000,
        apy: 7.8,
        healthFactor: 2.5,
        liquidationRisk: 'low',
      },
    ];

    const mockChainBalances: ChainBalance[] = [
      {
        chain: 'Stellar',
        totalValue: 8500,
        assets: [
          { symbol: 'USDC', balance: '3,000', value: 3000 },
          { symbol: 'XLM', balance: '55,000', value: 5500 },
        ],
      },
      {
        chain: 'Ethereum',
        totalValue: 2400,
        assets: [
          { symbol: 'USDC', balance: '1,200', value: 1200 },
          { symbol: 'ETH', balance: '0.5', value: 1200 },
        ],
      },
      {
        chain: 'Avalanche',
        totalValue: 800,
        assets: [
          { symbol: 'USDC', balance: '500', value: 500 },
          { symbol: 'AVAX', balance: '10', value: 300 },
        ],
      },
    ];

    setPositions(mockPositions);
    setChainBalances(mockChainBalances);

    // Calculate totals
    const portfolioValue = mockChainBalances.reduce((sum, chain) => sum + chain.totalValue, 0);
    const yieldEarning = mockPositions
      .filter((p) => p.type === 'supply')
      .reduce((sum, p) => sum + (p.value * p.apy) / 100, 0);

    setTotalPortfolioValue(portfolioValue);
    setTotalYieldEarning(yieldEarning);
  }, []);

  const getChainColor = (chain: string) => {
    switch (chain.toLowerCase()) {
      case 'stellar':
        return 'purple';
      case 'ethereum':
        return 'blue';
      case 'avalanche':
        return 'red';
      case 'solana':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'low':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'high':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        Portfolio Dashboard
      </Text>

      <ProductionBanner />

      {/* Portfolio Overview */}
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
        <GridItem>
          <Card p={6} bg={bgColor} border="1px solid" borderColor={borderColor}>
            <Stat>
              <StatLabel>Total Portfolio Value</StatLabel>
              <StatNumber>${totalPortfolioValue.toLocaleString()}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                +12.5% this month
              </StatHelpText>
            </Stat>
          </Card>
        </GridItem>

        <GridItem>
          <Card p={6} bg={bgColor} border="1px solid" borderColor={borderColor}>
            <Stat>
              <StatLabel>Annual Yield Earning</StatLabel>
              <StatNumber color="green.500">${totalYieldEarning.toFixed(0)}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                Across all positions
              </StatHelpText>
            </Stat>
          </Card>
        </GridItem>

        <GridItem>
          <Card p={6} bg={bgColor} border="1px solid" borderColor={borderColor}>
            <Stat>
              <StatLabel>Active Positions</StatLabel>
              <StatNumber>{positions.length}</StatNumber>
              <StatHelpText>
                {positions.filter((p) => p.type === 'supply').length} supply,{' '}
                {positions.filter((p) => p.type === 'borrow').length} borrow
              </StatHelpText>
            </Stat>
          </Card>
        </GridItem>

        <GridItem>
          <Card p={6} bg={bgColor} border="1px solid" borderColor={borderColor}>
            <Stat>
              <StatLabel>Chains Connected</StatLabel>
              <StatNumber>{chainBalances.length}</StatNumber>
              <StatHelpText>Multi-chain portfolio</StatHelpText>
            </Stat>
          </Card>
        </GridItem>
      </Grid>

      {/* Chain Balances */}
      <Card p={6} bg={bgColor} border="1px solid" borderColor={borderColor}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold">
            Chain Balances
          </Text>

          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
            {chainBalances.map((chain) => (
              <Card key={chain.chain} p={4} bg="gray.50" border="1px solid" borderColor="gray.200">
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <HStack>
                      <Badge colorScheme={getChainColor(chain.chain)} size="lg">
                        {chain.chain}
                      </Badge>
                    </HStack>
                    <Text fontWeight="bold">${chain.totalValue.toLocaleString()}</Text>
                  </HStack>

                  <VStack spacing={2} align="stretch">
                    {chain.assets.map((asset) => (
                      <HStack key={asset.symbol} justify="space-between">
                        <HStack>
                          <Text fontSize="sm" fontWeight="medium">
                            {asset.symbol}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {asset.balance}
                          </Text>
                        </HStack>
                        <Text fontSize="sm">${asset.value.toLocaleString()}</Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Progress
                    value={(chain.totalValue / totalPortfolioValue) * 100}
                    colorScheme={getChainColor(chain.chain)}
                    size="sm"
                  />
                </VStack>
              </Card>
            ))}
          </Grid>
        </VStack>
      </Card>

      {/* Active Positions */}
      <Card p={6} bg={bgColor} border="1px solid" borderColor={borderColor}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Active DeFi Positions
            </Text>
            <Button size="sm" leftIcon={<RepeatIcon />} variant="outline">
              Refresh All
            </Button>
          </HStack>

          <Table>
            <Thead>
              <Tr>
                <Th>Protocol</Th>
                <Th>Chain</Th>
                <Th>Asset</Th>
                <Th>Type</Th>
                <Th>Amount</Th>
                <Th>APY</Th>
                <Th>Health Factor</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {positions.map((position) => (
                <Tr key={position.id}>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{position.protocol}</Text>
                      <Badge colorScheme={getChainColor(position.chain)} size="sm">
                        {position.chain}
                      </Badge>
                    </VStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={getChainColor(position.chain)}>{position.chain}</Badge>
                  </Td>
                  <Td>
                    <Text fontWeight="medium">{position.asset}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={position.type === 'supply' ? 'green' : 'blue'}>
                      {position.type.toUpperCase()}
                    </Badge>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{position.amount}</Text>
                      <Text fontSize="sm" color="gray.600">
                        ${position.value.toLocaleString()}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>
                    <Text
                      color={position.type === 'supply' ? 'green.500' : 'red.500'}
                      fontWeight="bold"
                    >
                      {position.apy.toFixed(1)}%
                    </Text>
                  </Td>
                  <Td>
                    {position.healthFactor ? (
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">
                          {position.healthFactor === 999 ? '∞' : position.healthFactor.toFixed(2)}
                        </Text>
                        {position.liquidationRisk && (
                          <Badge colorScheme={getRiskColor(position.liquidationRisk)} size="sm">
                            {position.liquidationRisk.toUpperCase()}
                          </Badge>
                        )}
                      </VStack>
                    ) : (
                      <Text color="gray.400">N/A</Text>
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      <Button size="xs" variant="outline">
                        Manage
                      </Button>
                      <Button size="xs" variant="ghost">
                        <ExternalLinkIcon />
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Card>

      {/* Risk Analysis */}
      <ProgressiveDisclosure
        title="Portfolio Risk Analysis"
        summary="Overall portfolio health and risk assessment"
        badge="Advanced"
        badgeColor="orange"
      >
        <VStack spacing={4} align="stretch">
          <Alert status="info" size="sm">
            <AlertIcon />
            Your portfolio is well-diversified across multiple chains and protocols
          </Alert>

          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <Card p={4} bg="green.50">
              <Stat size="sm">
                <StatLabel>Diversification Score</StatLabel>
                <StatNumber color="green.600">8.5/10</StatNumber>
                <StatHelpText>Excellent distribution</StatHelpText>
              </Stat>
            </Card>

            <Card p={4} bg="blue.50">
              <Stat size="sm">
                <StatLabel>Yield Optimization</StatLabel>
                <StatNumber color="blue.600">7.2/10</StatNumber>
                <StatHelpText>Good yield strategy</StatHelpText>
              </Stat>
            </Card>

            <Card p={4} bg="purple.50">
              <Stat size="sm">
                <StatLabel>Liquidity Score</StatLabel>
                <StatNumber color="purple.600">9.1/10</StatNumber>
                <StatHelpText>High liquidity</StatHelpText>
              </Stat>
            </Card>
          </Grid>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Recommendations:
            </Text>
            <VStack align="stretch" spacing={1}>
              <Text fontSize="xs">• Consider rebalancing to increase Stellar exposure</Text>
              <Text fontSize="xs">• Monitor health factors on borrowed positions</Text>
              <Text fontSize="xs">• Opportunity to bridge more assets for higher yields</Text>
            </VStack>
          </Box>
        </VStack>
      </ProgressiveDisclosure>
    </VStack>
  );
};
