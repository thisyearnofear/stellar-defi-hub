import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Card,
  Badge,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react';
import { BlendPool } from '../../types/blend';
import { TransactionSimulator, createTransactionSteps } from '../common/TransactionSimulator';
import { ProgressiveDisclosure, TransactionDetails, PoolDetails, RiskWarning } from '../common/ProgressiveDisclosure';

interface EnhancedBlendInterfaceProps {
  pool: BlendPool;
  userBalance?: string;
  userPosition?: {
    supplied: string;
    borrowed: string;
    healthFactor: number;
  };
  onTransaction: (type: 'supply' | 'borrow' | 'repay' | 'withdraw', amount: string) => Promise<void>;
}

export const EnhancedBlendInterface: React.FC<EnhancedBlendInterfaceProps> = ({
  pool,
  userBalance = '0',
  userPosition,
  onTransaction
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<any[]>([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const tabActions = ['supply', 'borrow', 'repay', 'withdraw'] as const;
  const currentAction = tabActions[activeTab];

  // Calculate maximum amounts for each action
  const getMaxAmount = () => {
    switch (currentAction) {
      case 'supply':
        return parseFloat(userBalance);
      case 'borrow':
        // Simplified: 80% of collateral value
        const collateralValue = parseFloat(userPosition?.supplied || '0') * pool.collateralFactor;
        const currentBorrowed = parseFloat(userPosition?.borrowed || '0');
        return Math.max(0, collateralValue - currentBorrowed);
      case 'repay':
        return Math.min(parseFloat(userPosition?.borrowed || '0'), parseFloat(userBalance));
      case 'withdraw':
        // Simplified: consider health factor
        return parseFloat(userPosition?.supplied || '0') * 0.8; // Conservative estimate
      default:
        return 0;
    }
  };

  const maxAmount = getMaxAmount();

  // Update amount when slider changes
  useEffect(() => {
    if (sliderValue === 0) {
      setAmount('');
    } else {
      const calculatedAmount = (maxAmount * sliderValue / 100).toFixed(6);
      setAmount(calculatedAmount);
    }
  }, [sliderValue, maxAmount]);

  // Update slider when amount changes
  useEffect(() => {
    if (amount && maxAmount > 0) {
      const percentage = (parseFloat(amount) / maxAmount) * 100;
      setSliderValue(Math.min(100, Math.max(0, percentage)));
    }
  }, [amount, maxAmount]);

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Create simulation steps
    const steps = createTransactionSteps(currentAction, amount, pool.asset);
    setSimulationSteps(steps);
    setIsSimulating(true);

    try {
      await onTransaction(currentAction, amount);
    } catch (error) {
      console.error('Transaction failed:', error);
      setIsSimulating(false);
    }
  };

  const calculateNewHealthFactor = () => {
    if (!userPosition) return null;

    const currentSupplied = parseFloat(userPosition.supplied);
    const currentBorrowed = parseFloat(userPosition.borrowed);
    const amountNum = parseFloat(amount || '0');

    let newSupplied = currentSupplied;
    let newBorrowed = currentBorrowed;

    switch (currentAction) {
      case 'supply':
        newSupplied += amountNum;
        break;
      case 'borrow':
        newBorrowed += amountNum;
        break;
      case 'repay':
        newBorrowed -= amountNum;
        break;
      case 'withdraw':
        newSupplied -= amountNum;
        break;
    }

    if (newBorrowed <= 0) return 999;
    return (newSupplied * pool.liquidationThreshold) / newBorrowed;
  };

  const newHealthFactor = calculateNewHealthFactor();

  const getActionColor = () => {
    switch (currentAction) {
      case 'supply': return 'green';
      case 'borrow': return 'blue';
      case 'repay': return 'purple';
      case 'withdraw': return 'orange';
      default: return 'gray';
    }
  };

  const getActionDescription = () => {
    switch (currentAction) {
      case 'supply': return `Supply ${pool.asset} to earn ${pool.supplyAPY.toFixed(2)}% APY`;
      case 'borrow': return `Borrow ${pool.asset} at ${pool.borrowAPY.toFixed(2)}% APY`;
      case 'repay': return `Repay your ${pool.asset} loan`;
      case 'withdraw': return `Withdraw your supplied ${pool.asset}`;
      default: return '';
    }
  };

  const getRiskWarnings = () => {
    const warnings: string[] = [];
    
    if (currentAction === 'borrow' && newHealthFactor && newHealthFactor < 1.5) {
      warnings.push('Low health factor increases liquidation risk');
    }
    
    if (currentAction === 'withdraw' && newHealthFactor && newHealthFactor < 2) {
      warnings.push('Withdrawing may reduce your borrowing capacity');
    }
    
    if (pool.utilizationRate > 90) {
      warnings.push('High pool utilization may affect transaction success');
    }

    return warnings;
  };

  return (
    <Card p={6} bg={bgColor} border="1px solid" borderColor={borderColor}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="xl" fontWeight="bold">{pool.name}</Text>
            <Badge colorScheme="blue" size="lg">{pool.asset}</Badge>
          </HStack>
          <Text color="gray.600" fontSize="sm">{getActionDescription()}</Text>
        </Box>

        {/* Pool Stats */}
        <HStack spacing={4}>
          <Stat size="sm">
            <StatLabel>Supply APY</StatLabel>
            <StatNumber color="green.500">{pool.supplyAPY.toFixed(2)}%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Earn yield
            </StatHelpText>
          </Stat>
          <Stat size="sm">
            <StatLabel>Borrow APY</StatLabel>
            <StatNumber color="red.500">{pool.borrowAPY.toFixed(2)}%</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              Interest rate
            </StatHelpText>
          </Stat>
          <Stat size="sm">
            <StatLabel>Available</StatLabel>
            <StatNumber fontSize="md">{pool.liquidityAvailable}</StatNumber>
            <StatHelpText>Liquidity</StatHelpText>
          </Stat>
        </HStack>

        {/* Action Tabs */}
        <Tabs index={activeTab} onChange={setActiveTab} colorScheme={getActionColor()}>
          <TabList>
            <Tab>Supply</Tab>
            <Tab>Borrow</Tab>
            <Tab isDisabled={!userPosition || parseFloat(userPosition.borrowed) === 0}>Repay</Tab>
            <Tab isDisabled={!userPosition || parseFloat(userPosition.supplied) === 0}>Withdraw</Tab>
          </TabList>

          <TabPanels>
            {tabActions.map((action, index) => (
              <TabPanel key={action} px={0}>
                <VStack spacing={4} align="stretch">
                  {/* Amount Input */}
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <HStack>
                      <Input
                        type="number"
                        placeholder={`Enter ${pool.asset} amount`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        max={maxAmount}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAmount(maxAmount.toString())}
                        isDisabled={maxAmount === 0}
                      >
                        Max
                      </Button>
                    </HStack>
                  </FormControl>

                  {/* Amount Slider */}
                  {maxAmount > 0 && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Quick Select: {sliderValue.toFixed(0)}% of available
                      </Text>
                      <Slider
                        value={sliderValue}
                        onChange={setSliderValue}
                        colorScheme={getActionColor()}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <HStack justify="space-between" mt={1}>
                        <Text fontSize="xs" color="gray.500">0</Text>
                        <Text fontSize="xs" color="gray.500">Max: {maxAmount.toFixed(4)}</Text>
                      </HStack>
                    </Box>
                  )}

                  {/* Health Factor Preview */}
                  {userPosition && newHealthFactor && (
                    <Alert status={newHealthFactor < 1.5 ? 'warning' : 'info'} size="sm">
                      <AlertIcon />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          Health Factor: {userPosition.healthFactor.toFixed(2)} → {newHealthFactor === 999 ? '∞' : newHealthFactor.toFixed(2)}
                        </Text>
                        <Text fontSize="xs">
                          {newHealthFactor < 1.5 ? 'High liquidation risk' : 'Safe position'}
                        </Text>
                      </VStack>
                    </Alert>
                  )}
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* Progressive Disclosure Sections */}
        <VStack spacing={3} align="stretch">
          <TransactionDetails
            gasEstimate="0.002"
            timeEstimate="5-8 seconds"
            steps={[
              `Approve ${pool.asset} for ${currentAction}`,
              `Execute ${currentAction} transaction`,
              'Update pool state and user position'
            ]}
            risks={getRiskWarnings()}
          />

          <PoolDetails pool={pool} />

          {getRiskWarnings().length > 0 && (
            <RiskWarning
              healthFactor={newHealthFactor || undefined}
              warnings={getRiskWarnings()}
            />
          )}
        </VStack>

        {/* Transaction Simulator */}
        {isSimulating && (
          <TransactionSimulator
            steps={simulationSteps}
            isActive={isSimulating}
            onComplete={() => {
              setIsSimulating(false);
              setAmount('');
              setSliderValue(0);
            }}
            onError={() => setIsSimulating(false)}
          />
        )}

        {/* Action Button */}
        <Button
          colorScheme={getActionColor()}
          size="lg"
          onClick={handleTransaction}
          isDisabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount || isSimulating}
          isLoading={isSimulating}
          loadingText={`${currentAction.charAt(0).toUpperCase() + currentAction.slice(1)}ing...`}
        >
          {currentAction.charAt(0).toUpperCase() + currentAction.slice(1)} {amount && `${amount} ${pool.asset}`}
        </Button>
      </VStack>
    </Card>
  );
};