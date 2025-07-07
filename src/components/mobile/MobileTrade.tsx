import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Avatar,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiArrowUpRight, FiArrowDownLeft, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { MobileCard } from './MobileCard';
import { useStellar } from '../web3/StellarProvider';

export const MobileTrade: React.FC = () => {
  const { isConnected } = useStellar();
  const [selectedAsset, setSelectedAsset] = useState('XLM');
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Mock data
  const assets = [
    { symbol: 'XLM', name: 'Stellar Lumens', price: 0.12, change: 2.4, balance: 8432.12 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.0, balance: 5000.00 },
    { symbol: 'yXLM', name: 'Yield XLM', price: 0.13, change: 5.2, balance: 2156.78 },
  ];

  const selectedAssetData = assets.find(a => a.symbol === selectedAsset) || assets[0];
  const maxAmount = selectedAssetData.balance;

  const handlePercentageChange = (value: number) => {
    setPercentage(value);
    const calculatedAmount = (maxAmount * value / 100).toFixed(2);
    setAmount(calculatedAmount);
  };

  if (!isMobile) {
    return null; // Use desktop layout
  }

  return (
    <Box p={4} pb={6}>
      <VStack spacing={4} align="stretch">
        {/* Asset Selector */}
        <MobileCard>
          <VStack spacing={3} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Select Asset</Text>
            <VStack spacing={2}>
              {assets.map((asset) => (
                <HStack
                  key={asset.symbol}
                  p={3}
                  borderRadius="12px"
                  bg={selectedAsset === asset.symbol ? 'blue.50' : 'transparent'}
                  border="1px"
                  borderColor={selectedAsset === asset.symbol ? 'blue.200' : 'gray.100'}
                  cursor="pointer"
                  onClick={() => setSelectedAsset(asset.symbol)}
                  w="full"
                  justify="space-between"
                >
                  <HStack>
                    <Avatar size="sm" name={asset.symbol} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{asset.symbol}</Text>
                      <Text fontSize="sm" color="gray.600">{asset.name}</Text>
                    </VStack>
                  </HStack>

                  <VStack align="end" spacing={0}>
                    <Text fontWeight="medium">${asset.price.toFixed(4)}</Text>
                    <Badge
                      colorScheme={asset.change >= 0 ? 'green' : 'red'}
                      variant="subtle"
                    >
                      {asset.change >= 0 ? '+' : ''}{asset.change}%
                    </Badge>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </MobileCard>

        {/* Trading Interface */}
        <MobileCard>
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList mb={4}>
              <Tab flex={1}>
                <HStack spacing={1}>
                  <FiArrowUpRight />
                  <Text>Buy</Text>
                </HStack>
              </Tab>
              <Tab flex={1}>
                <HStack spacing={1}>
                  <FiArrowDownLeft />
                  <Text>Sell</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Buy Tab */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>Amount to buy</Text>
                    <Input
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      fontSize="lg"
                      textAlign="center"
                      size="lg"
                    />
                    <Text fontSize="sm" color="gray.500" textAlign="center" mt={1}>
                      ≈ ${(parseFloat(amount || '0') * selectedAssetData.price).toFixed(2)} USD
                    </Text>
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.600">Quick Select</Text>
                      <Text fontSize="sm" color="gray.500">{percentage}%</Text>
                    </HStack>
                    <Slider
                      value={percentage}
                      onChange={handlePercentageChange}
                      colorScheme="blue"
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <HStack justify="space-between" mt={2}>
                      {[25, 50, 75, 100].map((percent) => (
                        <Button
                          key={percent}
                          size="xs"
                          variant="outline"
                          onClick={() => handlePercentageChange(percent)}
                        >
                          {percent}%
                        </Button>
                      ))}
                    </HStack>
                  </Box>

                  <Box bg="gray.50" p={3} borderRadius="8px">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Available Balance</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {selectedAssetData.balance.toLocaleString()} {selectedAsset}
                      </Text>
                    </HStack>
                  </Box>

                  <Button
                    colorScheme="green"
                    size="lg"
                    isDisabled={!isConnected || !amount}
                    leftIcon={<FiTrendingUp />}
                  >
                    {isConnected ? `Buy ${selectedAsset}` : 'Connect Wallet'}
                  </Button>
                </VStack>
              </TabPanel>

              {/* Sell Tab */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>Amount to sell</Text>
                    <Input
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      fontSize="lg"
                      textAlign="center"
                      size="lg"
                    />
                    <Text fontSize="sm" color="gray.500" textAlign="center" mt={1}>
                      ≈ ${(parseFloat(amount || '0') * selectedAssetData.price).toFixed(2)} USD
                    </Text>
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.600">Quick Select</Text>
                      <Text fontSize="sm" color="gray.500">{percentage}%</Text>
                    </HStack>
                    <Slider
                      value={percentage}
                      onChange={handlePercentageChange}
                      colorScheme="red"
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <HStack justify="space-between" mt={2}>
                      {[25, 50, 75, 100].map((percent) => (
                        <Button
                          key={percent}
                          size="xs"
                          variant="outline"
                          onClick={() => handlePercentageChange(percent)}
                        >
                          {percent}%
                        </Button>
                      ))}
                    </HStack>
                  </Box>

                  <Box bg="gray.50" p={3} borderRadius="8px">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Available Balance</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {selectedAssetData.balance.toLocaleString()} {selectedAsset}
                      </Text>
                    </HStack>
                  </Box>

                  <Button
                    colorScheme="red"
                    size="lg"
                    isDisabled={!isConnected || !amount}
                    leftIcon={<FiTrendingDown />}
                  >
                    {isConnected ? `Sell ${selectedAsset}` : 'Connect Wallet'}
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MobileCard>

        {/* Market Info */}
        <MobileCard>
          <VStack spacing={3} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Market Info</Text>
            <VStack spacing={2}>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">24h Volume</Text>
                <Text fontSize="sm" fontWeight="medium">$2.4M</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">24h High</Text>
                <Text fontSize="sm" fontWeight="medium">$0.1245</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.600">24h Low</Text>
                <Text fontSize="sm" fontWeight="medium">$0.1189</Text>
              </HStack>
            </VStack>
          </VStack>
        </MobileCard>
      </VStack>
    </Box>
  );
};
