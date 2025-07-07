import { type NextPage } from 'next'
import Head from 'next/head'
import { VStack, Container, Text, Card, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Alert, AlertIcon } from '@chakra-ui/react'
import { useSorobanReact } from '../components/web3/StellarProvider'
import { useBlendStore } from '../lib/stores/blendStore'
import { useEffect } from 'react'

const PortfolioPage: NextPage = () => {
  const sorobanContext = useSorobanReact();
  const { userPositions, loadUserPositions } = useBlendStore();
  // Removed multi-wallet store - now Stellar-focused

  useEffect(() => {
    if (sorobanContext.address) {
      loadUserPositions(sorobanContext.address);
    }
  }, [sorobanContext.address]);

  const totalSupplied = userPositions.reduce((sum, pos) => sum + parseFloat(pos.supplied), 0);
  const totalBorrowed = userPositions.reduce((sum, pos) => sum + parseFloat(pos.borrowed), 0);
  const totalCollateral = userPositions.reduce((sum, pos) => sum + parseFloat(pos.collateralValue), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <Head>
        <title>Portfolio | Stellar DeFi Hub</title>
        <meta name="description" content="View your Stellar DeFi portfolio" />
      </Head>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold">
              Portfolio Overview
            </Text>
            <Text fontSize="lg" color="gray.600">
              Track your assets across all connected wallets and protocols
            </Text>
          </VStack>

          {/* Connected Wallets */}
          <Card p={6} w="100%">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Connected Wallets</Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              <Card p={4} bg={sorobanContext.address ? 'green.50' : 'gray.50'}>
                <VStack>
                  <Text fontWeight="bold">Stellar</Text>
                  <Text fontSize="sm" color={sorobanContext.address ? 'green.600' : 'gray.500'}>
                    {sorobanContext.address ? 'Connected' : 'Not Connected'}
                  </Text>
                  {sorobanContext.address && (
                    <Text fontSize="xs" fontFamily="mono">
                      {sorobanContext.address.slice(0, 8)}...{sorobanContext.address.slice(-8)}
                    </Text>
                  )}
                </VStack>
              </Card>

              {/* Stellar-focused portfolio - other chains removed */}
            </SimpleGrid>
          </Card>

          {/* Blend Protocol Positions */}
          {sorobanContext.address ? (
            <Card p={6} w="100%">
              <Text fontSize="xl" fontWeight="bold" mb={4}>Blend Protocol Positions</Text>
              
              {userPositions.length > 0 ? (
                <>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                    <Stat>
                      <StatLabel>Total Supplied</StatLabel>
                      <StatNumber>{formatCurrency(totalSupplied)}</StatNumber>
                      <StatHelpText>Earning yield</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Total Borrowed</StatLabel>
                      <StatNumber>{formatCurrency(totalBorrowed)}</StatNumber>
                      <StatHelpText>Accruing interest</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Net Position</StatLabel>
                      <StatNumber color={totalSupplied - totalBorrowed >= 0 ? 'green.500' : 'red.500'}>
                        {formatCurrency(totalSupplied - totalBorrowed)}
                      </StatNumber>
                      <StatHelpText>
                        {totalSupplied - totalBorrowed >= 0 ? 'Positive' : 'Negative'}
                      </StatHelpText>
                    </Stat>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {userPositions.map((position, index) => (
                      <Card key={index} p={4} borderLeft="4px" borderLeftColor="purple.500">
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="bold">Pool: {position.poolId.replace('pool_', '').toUpperCase()}</Text>
                          <Text fontSize="sm">Supplied: {formatCurrency(parseFloat(position.supplied))}</Text>
                          <Text fontSize="sm">Borrowed: {formatCurrency(parseFloat(position.borrowed))}</Text>
                          <Text fontSize="sm">
                            Health Factor: {position.healthFactor === 999 ? '∞' : position.healthFactor.toFixed(2)}
                          </Text>
                        </VStack>
                      </Card>
                    ))}
                  </SimpleGrid>
                </>
              ) : (
                <Alert status="info">
                  <AlertIcon />
                  No Blend positions found. Start by supplying assets to earn yield!
                </Alert>
              )}
            </Card>
          ) : (
            <Alert status="warning">
              <AlertIcon />
              Connect your Stellar wallet to view your Blend Protocol positions
            </Alert>
          )}

          {/* Bridge Transaction History */}
          <Card p={6} w="100%">
            <Text fontSize="xl" fontWeight="bold" mb={4}>Recent Bridge Transactions</Text>
            <Alert status="info">
              <AlertIcon />
              Bridge transaction history will be displayed here once you start bridging assets
            </Alert>
          </Card>
        </VStack>
      </Container>
    </>
  )
}

export default PortfolioPage