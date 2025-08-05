import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useBlendStore } from '../../lib/stores/blendStore';
import { useSorobanReact } from '../web3/StellarProvider';
import { ProductionBanner } from '../common/ProductionBanner';
import { EnhancedBlendInterface } from './EnhancedBlendInterface';

export const BlendPools: React.FC = () => {
  const {
    pools,
    isLoadingPools,
    poolsError,
    userPositions,
    selectedPool,
    isTransacting,
    transactionError,
    loadPools,
    loadUserPositions,
    supply,
    borrow,
    repay,
    withdraw,
    clearErrors,
  } = useBlendStore();

  const sorobanContext = useSorobanReact();
  const userAddress = sorobanContext.address;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionAmount, setActionAmount] = useState('');
  const [actionType, setActionType] = useState<'supply' | 'borrow' | 'repay' | 'withdraw'>(
    'supply'
  );

  useEffect(() => {
    void loadPools();
  }, [loadPools]);

  useEffect(() => {
    if (userAddress) {
      void loadUserPositions(userAddress);
    }
  }, [userAddress, loadUserPositions]);

  const executeAction = async () => {
    if (!selectedPool || !actionAmount || !userAddress) return;

    try {
      let txId: string;

      switch (actionType) {
        case 'supply':
          txId = await supply(selectedPool.id, actionAmount);
          break;
        case 'borrow':
          txId = await borrow(selectedPool.id, actionAmount);
          break;
        case 'repay':
          txId = await repay(selectedPool.id, actionAmount);
          break;
        case 'withdraw':
          txId = await withdraw(selectedPool.id, actionAmount);
          break;
      }

      alert(`Transaction submitted: ${txId}`);
      onClose();
      setActionAmount('');

      // Refresh data
      setTimeout(() => {
        void loadUserPositions(userAddress);
      }, 2000);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const getUserPosition = (poolId: string) => {
    return userPositions.find((pos) => pos.poolId === poolId);
  };

  const formatNumber = (value: string | number, decimals = 2) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const getRiskColor = (risk: string) => {
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

  if (isLoadingPools) {
    return (
      <VStack spacing={4}>
        <Spinner size="lg" />
        <Text>Loading Blend pools...</Text>
      </VStack>
    );
  }

  if (poolsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        {poolsError}
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        Stellar Bridge Hub - Lending
      </Text>

      <ProductionBanner />

      {!userAddress && (
        <Alert status="info">
          <AlertIcon />
          Connect your Stellar wallet to view your positions and interact with pools
        </Alert>
      )}

      {transactionError && (
        <Alert status="error">
          <AlertIcon />
          {transactionError}
          <Button ml={2} size="sm" onClick={clearErrors}>
            Dismiss
          </Button>
        </Alert>
      )}

      {/* User Positions */}
      {userAddress && userPositions.length > 0 && (
        <Card p={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Your Positions
          </Text>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Asset</Th>
                <Th>Supplied</Th>
                <Th>Borrowed</Th>
                <Th>Health Factor</Th>
                <Th>Risk</Th>
              </Tr>
            </Thead>
            <Tbody>
              {userPositions.map((position) => {
                const pool = pools.find((p) => p.id === position.poolId);
                return (
                  <Tr key={position.poolId}>
                    <Td>{pool?.asset ?? 'Unknown'}</Td>
                    <Td>{formatNumber(position.supplied)}</Td>
                    <Td>{formatNumber(position.borrowed)}</Td>
                    <Td>
                      {position.healthFactor === 999 ? '∞' : formatNumber(position.healthFactor)}
                    </Td>
                    <Td>
                      <Badge colorScheme={getRiskColor(position.liquidationRisk)}>
                        {position.liquidationRisk.toUpperCase()}
                      </Badge>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Card>
      )}

      {/* Enhanced Pool Interfaces */}
      <VStack spacing={6} align="stretch">
        {pools.map((pool) => {
          const userPosition = getUserPosition(pool.id);
          return (
            <EnhancedBlendInterface
              key={pool.id}
              pool={pool}
              userBalance="1000" // This would come from wallet integration
              userPosition={
                userPosition
                  ? {
                      supplied: userPosition.supplied,
                      borrowed: userPosition.borrowed,
                      healthFactor: userPosition.healthFactor,
                    }
                  : undefined
              }
              onTransaction={async (type, amount) => {
                switch (type) {
                  case 'supply':
                    await supply(pool.id, amount);
                    break;
                  case 'borrow':
                    await borrow(pool.id, amount);
                    break;
                  case 'repay':
                    await repay(pool.id, amount);
                    break;
                  case 'withdraw':
                    await withdraw(pool.id, amount);
                    break;
                }
                // Refresh positions
                if (userAddress) {
                  setTimeout(() => loadUserPositions(userAddress), 2000);
                }
              }}
            />
          );
        })}
      </VStack>

      {/* Action Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {actionType.charAt(0).toUpperCase() + actionType.slice(1)} {selectedPool?.asset}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input
                  placeholder={`Enter amount to ${actionType}`}
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  type="number"
                />
              </FormControl>

              {selectedPool && (
                <Box w="100%" p={3} bg="gray.50" borderRadius="md">
                  <VStack spacing={2} align="start">
                    <Text fontSize="sm">
                      <strong>Pool:</strong> {selectedPool.name}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Available Liquidity:</strong>{' '}
                      {formatNumber(selectedPool.liquidityAvailable)}
                    </Text>
                    {actionType === 'supply' && (
                      <Text fontSize="sm">
                        <strong>Supply APY:</strong> {selectedPool.supplyAPY.toFixed(2)}%
                      </Text>
                    )}
                    {actionType === 'borrow' && (
                      <Text fontSize="sm">
                        <strong>Borrow APY:</strong> {selectedPool.borrowAPY.toFixed(2)}%
                      </Text>
                    )}
                  </VStack>
                </Box>
              )}

              <Button
                onClick={executeAction}
                isDisabled={!actionAmount || parseFloat(actionAmount) <= 0}
                isLoading={isTransacting}
                loadingText={`${actionType.charAt(0).toUpperCase() + actionType.slice(1)}ing...`}
                colorScheme="purple"
                w="100%"
              >
                {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
