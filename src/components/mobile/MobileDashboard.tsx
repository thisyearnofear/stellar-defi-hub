import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  Divider,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiArrowUp, FiArrowDown, FiTrendingUp } from 'react-icons/fi';
import { MobileCard } from './MobileCard';
import { MobileAIWidget } from './MobileAIWidget';
import { useStellar } from '../web3/StellarProvider';

export const MobileDashboard: React.FC = () => {
  const { publicKey, isConnected } = useStellar();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Mock data - replace with real data
  const totalBalance = 12543.67;
  const dayChange = 234.56;
  const dayChangePercent = 1.92;

  const quickActions = [
    { label: 'Buy', icon: FiArrowDown, color: 'green', path: '/trade?action=buy' },
    { label: 'Sell', icon: FiArrowUp, color: 'red', path: '/trade?action=sell' },
    { label: 'Earn', icon: FiTrendingUp, color: 'blue', path: '/blend' },
  ];

  const assets = [
    {
      symbol: 'XLM',
      name: 'Stellar Lumens',
      balance: '8,432.12',
      value: '$1,686.42',
      change: '+2.4%',
      positive: true,
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '5,000.00',
      value: '$5,000.00',
      change: '0.0%',
      positive: true,
    },
    {
      symbol: 'yXLM',
      name: 'Yield XLM',
      balance: '2,156.78',
      value: '$431.36',
      change: '+5.2%',
      positive: true,
    },
  ];

  if (!isMobile) {
    return null; // Use desktop layout
  }

  return (
    <Box p={4} pb={6} position="relative">
      <VStack spacing={4} align="stretch">
        {/* Greeting & Balance */}
        <MobileCard>
          <VStack align="start" spacing={3}>
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.600">
                  Good morning
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  {isConnected
                    ? `${publicKey?.slice(0, 6)}...${publicKey?.slice(-4)}`
                    : 'Connect Wallet'}
                </Text>
              </VStack>
              <Avatar size="sm" />
            </HStack>

            <Divider />

            <VStack align="start" spacing={1} w="full">
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">
                  Total Balance
                </Text>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  leftIcon={balanceVisible ? <FiEyeOff /> : <FiEye />}
                >
                  {balanceVisible ? 'Hide' : 'Show'}
                </Button>
              </HStack>

              <Text fontSize="3xl" fontWeight="bold">
                {balanceVisible ? `$${totalBalance.toLocaleString()}` : '••••••'}
              </Text>

              <HStack>
                <Text
                  fontSize="sm"
                  color={dayChange >= 0 ? 'green.500' : 'red.500'}
                  fontWeight="medium"
                >
                  {dayChange >= 0 ? '+' : ''}${dayChange.toFixed(2)} (
                  {dayChangePercent >= 0 ? '+' : ''}
                  {dayChangePercent}%)
                </Text>
                <Text fontSize="sm" color="gray.500">
                  today
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </MobileCard>

        {/* Quick Actions */}
        <MobileCard>
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="semibold">
              Quick Actions
            </Text>
            <SimpleGrid columns={3} spacing={3} w="full">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="lg"
                  height="80px"
                  flexDirection="column"
                  gap={2}
                  colorScheme={action.color}
                  isDisabled={!isConnected}
                >
                  <action.icon size={24} />
                  <Text fontSize="sm">{action.label}</Text>
                </Button>
              ))}
            </SimpleGrid>
          </VStack>
        </MobileCard>

        {/* Assets */}
        <MobileCard>
          <VStack align="start" spacing={3}>
            <HStack justify="space-between" w="full">
              <Text fontSize="lg" fontWeight="semibold">
                Your Assets
              </Text>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </HStack>

            <VStack spacing={3} w="full">
              {assets.map((asset) => (
                <HStack key={asset.symbol} justify="space-between" w="full" p={2}>
                  <HStack>
                    <Avatar size="sm" name={asset.symbol} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{asset.symbol}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {asset.name}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack align="end" spacing={0}>
                    <Text fontWeight="medium">{asset.value}</Text>
                    <HStack spacing={1}>
                      <Text fontSize="sm" color="gray.600">
                        {asset.balance}
                      </Text>
                      <Badge
                        colorScheme={asset.positive ? 'green' : 'red'}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {asset.change}
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </MobileCard>

        {/* Recent Activity */}
        <MobileCard>
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="semibold">
              Recent Activity
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
              No recent activity
            </Text>
          </VStack>
        </MobileCard>
      </VStack>

      {/* AI Widget */}
      <MobileAIWidget />
    </Box>
  );
};
