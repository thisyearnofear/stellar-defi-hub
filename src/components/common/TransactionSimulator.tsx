import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  Alert,
  AlertIcon,
  Button,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue
} from '@chakra-ui/react';
import { CheckIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons';

interface TransactionStep {
  id: string;
  name: string;
  description: string;
  estimatedTime: number; // seconds
  gasEstimate?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface TransactionSimulatorProps {
  steps: TransactionStep[];
  onComplete?: () => void;
  onError?: (error: string) => void;
  isActive: boolean;
}

export const TransactionSimulator: React.FC<TransactionSimulatorProps> = ({
  steps,
  onComplete,
  onError,
  isActive
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [simulationSteps, setSimulationSteps] = useState<TransactionStep[]>(steps);
  const [totalGasEstimate, setTotalGasEstimate] = useState<string>('0');
  const [elapsedTime, setElapsedTime] = useState(0);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const processNextStep = () => {
      if (currentStepIndex >= simulationSteps.length) {
        onComplete?.();
        return;
      }

      const currentStep = simulationSteps[currentStepIndex];

      // Update step to processing
      setSimulationSteps(prev =>
        prev.map((step, index) =>
          index === currentStepIndex
            ? { ...step, status: 'processing' }
            : step
        )
      );

      // Simulate step completion
      setTimeout(() => {
        // Random chance of failure for realistic simulation
        const shouldFail = Math.random() < 0.05; // 5% chance

        if (shouldFail) {
          setSimulationSteps(prev =>
            prev.map((step, index) =>
              index === currentStepIndex
                ? { ...step, status: 'failed' }
                : step
            )
          );
          onError?.(`Transaction failed at step: ${currentStep.name}`);
          return;
        }

        // Mark step as completed
        setSimulationSteps(prev =>
          prev.map((step, index) =>
            index === currentStepIndex
              ? { ...step, status: 'completed' }
              : step
          )
        );

        setCurrentStepIndex(prev => prev + 1);
      }, currentStep.estimatedTime * 1000);
    };

    if (currentStepIndex < simulationSteps.length) {
      processNextStep();
    }
  }, [currentStepIndex, isActive]);

  useEffect(() => {
    // Calculate total gas estimate
    const total = simulationSteps.reduce((sum, step) => {
      const gas = parseFloat(step.gasEstimate || '0');
      return sum + gas;
    }, 0);
    setTotalGasEstimate(total.toFixed(6));
  }, [simulationSteps]);

  const getStepIcon = (step: TransactionStep, index: number) => {
    if (step.status === 'completed') return <CheckIcon color="green.500" />;
    if (step.status === 'failed') return <WarningIcon color="red.500" />;
    if (step.status === 'processing') return <TimeIcon color="blue.500" />;
    if (index < currentStepIndex) return <CheckIcon color="green.500" />;
    return <Text color="gray.400" fontSize="sm" fontWeight="bold">{index + 1}</Text>;
  };

  const getStepColor = (step: TransactionStep) => {
    switch (step.status) {
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'processing': return 'blue';
      default: return 'gray';
    }
  };

  const completedSteps = simulationSteps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / simulationSteps.length) * 100;

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      maxW="500px"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Transaction Simulation
          </Text>
          <Progress
            value={progressPercentage}
            colorScheme="blue"
            size="lg"
            borderRadius="md"
          />
          <HStack justify="space-between" mt={2}>
            <Text fontSize="sm" color="gray.600">
              {completedSteps} of {simulationSteps.length} steps completed
            </Text>
            <Text fontSize="sm" color="gray.600">
              {elapsedTime}s elapsed
            </Text>
          </HStack>
        </Box>

        <Divider />

        {/* Gas Estimates */}
        <HStack spacing={4}>
          <Stat size="sm">
            <StatLabel>Estimated Gas</StatLabel>
            <StatNumber fontSize="md">{totalGasEstimate} XLM</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Network fee
            </StatHelpText>
          </Stat>
          <Stat size="sm">
            <StatLabel>Est. Time</StatLabel>
            <StatNumber fontSize="md">
              {simulationSteps.reduce((sum, step) => sum + step.estimatedTime, 0)}s
            </StatNumber>
            <StatHelpText>Total duration</StatHelpText>
          </Stat>
        </HStack>

        <Divider />

        {/* Steps */}
        <VStack spacing={3} align="stretch">
          {simulationSteps.map((step, index) => (
            <HStack key={step.id} spacing={4} p={3} borderRadius="md" bg={
              step.status === 'processing' ? 'blue.50' :
              step.status === 'completed' ? 'green.50' :
              step.status === 'failed' ? 'red.50' : 'transparent'
            }>
              <Box
                w={8}
                h={8}
                borderRadius="full"
                bg={`${getStepColor(step)}.100`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor={`${getStepColor(step)}.300`}
              >
                {getStepIcon(step, index)}
              </Box>

              <VStack align="start" spacing={0} flex={1}>
                <HStack justify="space-between" w="100%">
                  <Text fontWeight="medium" fontSize="sm">
                    {step.name}
                  </Text>
                  {step.gasEstimate && (
                    <Badge colorScheme="purple" size="sm">
                      {step.gasEstimate} XLM
                    </Badge>
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.600">
                  {step.description}
                </Text>
                {step.status === 'processing' && (
                  <Progress
                    size="xs"
                    isIndeterminate
                    colorScheme="blue"
                    w="100%"
                    mt={1}
                  />
                )}
              </VStack>
            </HStack>
          ))}
        </VStack>

        {/* Status Alert */}
        {simulationSteps.some(step => step.status === 'failed') && (
          <Alert status="error" size="sm">
            <AlertIcon />
            Transaction simulation failed. Please try again.
          </Alert>
        )}

        {completedSteps === simulationSteps.length && (
          <Alert status="success" size="sm">
            <AlertIcon />
            All transactions completed successfully!
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

// Helper function to create transaction steps
export const createTransactionSteps = (
  type: 'supply' | 'borrow' | 'repay' | 'withdraw' | 'bridge' | 'bridge-to-earn',
  amount: string,
  asset: string
): TransactionStep[] => {
  switch (type) {
    case 'supply':
      return [
        {
          id: 'approve',
          name: 'Approve Token',
          description: `Approve ${amount} ${asset} for spending`,
          estimatedTime: 3,
          gasEstimate: '0.001',
          status: 'pending'
        },
        {
          id: 'supply',
          name: 'Supply to Pool',
          description: `Supply ${amount} ${asset} to earn yield`,
          estimatedTime: 5,
          gasEstimate: '0.002',
          status: 'pending'
        }
      ];

    case 'borrow':
      return [
        {
          id: 'health-check',
          name: 'Health Factor Check',
          description: 'Verify collateral requirements',
          estimatedTime: 2,
          gasEstimate: '0.0005',
          status: 'pending'
        },
        {
          id: 'borrow',
          name: 'Execute Borrow',
          description: `Borrow ${amount} ${asset}`,
          estimatedTime: 4,
          gasEstimate: '0.0015',
          status: 'pending'
        }
      ];

    case 'repay':
      return [
        {
          id: 'approve-repay',
          name: 'Approve Repayment',
          description: `Approve ${amount} ${asset} for repayment`,
          estimatedTime: 3,
          gasEstimate: '0.001',
          status: 'pending'
        },
        {
          id: 'repay',
          name: 'Execute Repayment',
          description: `Repay ${amount} ${asset}`,
          estimatedTime: 4,
          gasEstimate: '0.0015',
          status: 'pending'
        }
      ];

    case 'withdraw':
      return [
        {
          id: 'health-check',
          name: 'Health Factor Check',
          description: 'Verify withdrawal is safe',
          estimatedTime: 2,
          gasEstimate: '0.0005',
          status: 'pending'
        },
        {
          id: 'withdraw',
          name: 'Execute Withdrawal',
          description: `Withdraw ${amount} ${asset}`,
          estimatedTime: 4,
          gasEstimate: '0.0015',
          status: 'pending'
        }
      ];

    case 'bridge':
      return [
        {
          id: 'approve-bridge',
          name: 'Approve for Bridge',
          description: `Approve ${amount} ${asset} for bridging`,
          estimatedTime: 3,
          gasEstimate: '0.001',
          status: 'pending'
        },
        {
          id: 'initiate-bridge',
          name: 'Initiate Bridge',
          description: 'Start cross-chain transfer',
          estimatedTime: 8,
          gasEstimate: '0.005',
          status: 'pending'
        },
        {
          id: 'confirm-bridge',
          name: 'Confirm on Destination',
          description: 'Confirm receipt on target chain',
          estimatedTime: 15,
          gasEstimate: '0.002',
          status: 'pending'
        }
      ];

    case 'bridge-to-earn':
      return [
        {
          id: 'approve-bridge',
          name: 'Approve for Bridge',
          description: `Approve ${amount} ${asset} for bridging`,
          estimatedTime: 3,
          gasEstimate: '0.001',
          status: 'pending'
        },
        {
          id: 'bridge-transfer',
          name: 'Bridge Assets',
          description: 'Transfer to Stellar network',
          estimatedTime: 12,
          gasEstimate: '0.005',
          status: 'pending'
        },
        {
          id: 'auto-supply',
          name: 'Auto-Supply to Pool',
          description: 'Automatically supply to earn yield',
          estimatedTime: 5,
          gasEstimate: '0.002',
          status: 'pending'
        }
      ];

    default:
      return [];
  }
};
