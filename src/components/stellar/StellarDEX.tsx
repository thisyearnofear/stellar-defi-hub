import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useStellar } from '../web3/StellarProvider';
import * as StellarSdk from '@stellar/stellar-sdk';

interface TradingPair {
  base: string;
  counter: string;
  baseIssuer?: string;
  counterIssuer?: string;
}

const POPULAR_PAIRS: TradingPair[] = [
  { base: 'XLM', counter: 'USDC', counterIssuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN' },
  { base: 'XLM', counter: 'yXLM', counterIssuer: 'GARDNV3Q7YGT4AKSDF25LT32YSCCW67UUQRWHAT7QHYPX7XQXQX7XQXQ' },
  { base: 'USDC', counter: 'AQUA', baseIssuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', counterIssuer: 'GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA' },
];

export const StellarDEX: React.FC = () => {
  const { publicKey, isConnected, server } = useStellar();
  const [selectedPair, setSelectedPair] = useState<TradingPair>(POPULAR_PAIRS[0]);
  const [orderbook, setOrderbook] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  useEffect(() => {
    if (selectedPair) {
      fetchOrderbook();
      fetchRecentTrades();
    }
  }, [selectedPair]);

  const fetchOrderbook = async () => {
    setLoading(true);
    try {
      const baseAsset = selectedPair.base === 'XLM'
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(selectedPair.base, selectedPair.baseIssuer!);

      const counterAsset = selectedPair.counter === 'XLM'
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(selectedPair.counter, selectedPair.counterIssuer!);

      const orderbook = await server.orderbook(baseAsset, counterAsset).call();
      setOrderbook(orderbook);
    } catch (error) {
      console.error('Failed to fetch orderbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTrades = async () => {
    try {
      const baseAsset = selectedPair.base === 'XLM'
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(selectedPair.base, selectedPair.baseIssuer!);

      const counterAsset = selectedPair.counter === 'XLM'
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(selectedPair.counter, selectedPair.counterIssuer!);

      const trades = await server.trades()
        .forAssetPair(baseAsset, counterAsset)
        .limit(20)
        .order('desc')
        .call();

      setTrades(trades.records);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    }
  };

  const handleTrade = async (side: 'buy' | 'sell') => {
    if (!isConnected || !publicKey) {
      alert('Please connect your Stellar wallet first');
      return;
    }

    // Implementation for creating trade offers
    console.log(`Creating ${side} order:`, {
      amount: side === 'buy' ? buyAmount : sellAmount,
      price: side === 'buy' ? buyPrice : sellPrice,
      pair: selectedPair
    });
  };

  return (
    <Box maxW="1200px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardHeader>
            <Heading size="lg">Stellar DEX Trading</Heading>
            <Text color="gray.600">Trade assets on the Stellar Decentralized Exchange</Text>
          </CardHeader>
        </Card>

        {!isConnected && (
          <Alert status="warning">
            <AlertIcon />
            Connect your Stellar wallet to start trading
          </Alert>
        )}

        <HStack spacing={6} align="start">
          {/* Trading Interface */}
          <Card flex="1">
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Trade</Heading>
                <Select
                  value={`${selectedPair.base}-${selectedPair.counter}`}
                  onChange={(e) => {
                    const [base, counter] = e.target.value.split('-');
                    const pair = POPULAR_PAIRS.find(p => p.base === base && p.counter === counter);
                    if (pair) setSelectedPair(pair);
                  }}
                  maxW="200px"
                >
                  {POPULAR_PAIRS.map((pair) => (
                    <option key={`${pair.base}-${pair.counter}`} value={`${pair.base}-${pair.counter}`}>
                      {pair.base}/{pair.counter}
                    </option>
                  ))}
                </Select>
              </HStack>
            </CardHeader>
            <CardBody>
              <Tabs>
                <TabList>
                  <Tab>Buy {selectedPair.base}</Tab>
                  <Tab>Sell {selectedPair.base}</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4}>
                      <Input
                        placeholder={`Amount (${selectedPair.base})`}
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                      />
                      <Input
                        placeholder={`Price (${selectedPair.counter})`}
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                      />
                      <Button
                        colorScheme="green"
                        width="100%"
                        onClick={() => handleTrade('buy')}
                        isDisabled={!isConnected}
                      >
                        Buy {selectedPair.base}
                      </Button>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack spacing={4}>
                      <Input
                        placeholder={`Amount (${selectedPair.base})`}
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                      />
                      <Input
                        placeholder={`Price (${selectedPair.counter})`}
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                      />
                      <Button
                        colorScheme="red"
                        width="100%"
                        onClick={() => handleTrade('sell')}
                        isDisabled={!isConnected}
                      >
                        Sell {selectedPair.base}
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>

          {/* Orderbook */}
          <Card flex="1">
            <CardHeader>
              <Heading size="md">Order Book</Heading>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Spinner />
              ) : orderbook ? (
                <VStack spacing={4}>
                  <Box>
                    <Text fontWeight="bold" color="red.500" mb={2}>Asks (Sell Orders)</Text>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Price</Th>
                          <Th>Amount</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {orderbook.asks.slice(0, 5).map((ask: any, i: number) => (
                          <Tr key={i}>
                            <Td color="red.500">{parseFloat(ask.price).toFixed(6)}</Td>
                            <Td>{parseFloat(ask.amount).toFixed(2)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" color="green.500" mb={2}>Bids (Buy Orders)</Text>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Price</Th>
                          <Th>Amount</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {orderbook.bids.slice(0, 5).map((bid: any, i: number) => (
                          <Tr key={i}>
                            <Td color="green.500">{parseFloat(bid.price).toFixed(6)}</Td>
                            <Td>{parseFloat(bid.amount).toFixed(2)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </VStack>
              ) : (
                <Text>No orderbook data</Text>
              )}
            </CardBody>
          </Card>
        </HStack>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <Heading size="md">Recent Trades</Heading>
          </CardHeader>
          <CardBody>
            {trades.length > 0 ? (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Time</Th>
                    <Th>Side</Th>
                    <Th>Price</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {trades.map((trade: any) => (
                    <Tr key={trade.id}>
                      <Td>{new Date(trade.ledger_close_time).toLocaleTimeString()}</Td>
                      <Td>
                        <Badge colorScheme={trade.base_is_seller ? 'red' : 'green'}>
                          {trade.base_is_seller ? 'Sell' : 'Buy'}
                        </Badge>
                      </Td>
                      <Td>{((trade.price.n / trade.price.d)).toFixed(6)}</Td>
                      <Td>{parseFloat(trade.base_amount).toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No recent trades</Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};
