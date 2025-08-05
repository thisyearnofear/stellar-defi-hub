import React, { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from '@chakra-ui/icons';

interface ProgressiveDisclosureProps {
  title: string;
  summary: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'simple' | 'detailed' | 'warning';
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  title,
  summary,
  badge,
  badgeColor = 'blue',
  children,
  defaultOpen = false,
  variant = 'simple',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const bgColor = useColorModeValue(
    variant === 'warning' ? 'orange.50' : 'gray.50',
    variant === 'warning' ? 'orange.900' : 'gray.800'
  );
  const borderColor = useColorModeValue(
    variant === 'warning' ? 'orange.200' : 'gray.200',
    variant === 'warning' ? 'orange.600' : 'gray.600'
  );

  return (
    <Box
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
    >
      <Button
        variant="ghost"
        w="100%"
        h="auto"
        p={4}
        justifyContent="space-between"
        onClick={() => setIsOpen(!isOpen)}
        borderRadius="none"
        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
      >
        <HStack spacing={3} flex={1}>
          {variant === 'warning' && <Icon as={InfoIcon} color="orange.500" />}
          <VStack align="start" spacing={1} flex={1}>
            <HStack>
              <Text fontWeight="semibold" textAlign="left">
                {title}
              </Text>
              {badge && (
                <Badge colorScheme={badgeColor} size="sm">
                  {badge}
                </Badge>
              )}
            </HStack>
            <Text fontSize="sm" color="gray.600" textAlign="left">
              {summary}
            </Text>
          </VStack>
        </HStack>
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />
      </Button>

      <Collapse in={isOpen}>
        <Box p={4} pt={0}>
          <Divider mb={4} />
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

// Specialized components for common use cases
export const TransactionDetails: React.FC<{
  gasEstimate: string;
  timeEstimate: string;
  steps: string[];
  risks?: string[];
}> = ({ gasEstimate, timeEstimate, steps, risks }) => (
  <ProgressiveDisclosure
    title="Transaction Details"
    summary={`Est. ${gasEstimate} XLM gas, ~${timeEstimate}`}
    badge="Advanced"
    badgeColor="purple"
  >
    <VStack align="stretch" spacing={3}>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium">
          Estimated Gas:
        </Text>
        <Text fontSize="sm">{gasEstimate} XLM</Text>
      </HStack>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium">
          Estimated Time:
        </Text>
        <Text fontSize="sm">{timeEstimate}</Text>
      </HStack>

      <Divider />

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          Transaction Steps:
        </Text>
        <VStack align="stretch" spacing={1}>
          {steps.map((step, index) => (
            <HStack key={index} spacing={2}>
              <Badge size="sm" colorScheme="blue">
                {index + 1}
              </Badge>
              <Text fontSize="xs">{step}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>

      {risks && risks.length > 0 && (
        <>
          <Divider />
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2} color="orange.600">
              Risks to Consider:
            </Text>
            <VStack align="stretch" spacing={1}>
              {risks.map((risk, index) => (
                <Text key={index} fontSize="xs" color="orange.600">
                  • {risk}
                </Text>
              ))}
            </VStack>
          </Box>
        </>
      )}
    </VStack>
  </ProgressiveDisclosure>
);

export const PoolDetails: React.FC<{
  pool: {
    collateralFactor: number;
    liquidationThreshold: number;
    utilizationRate: number;
    totalSupply: string;
    totalBorrow: string;
  };
}> = ({ pool }) => (
  <ProgressiveDisclosure
    title="Pool Analytics"
    summary={`${pool.utilizationRate.toFixed(1)}% utilization, ${(pool.collateralFactor * 100).toFixed(0)}% LTV`}
    badge="Analytics"
    badgeColor="green"
  >
    <VStack align="stretch" spacing={3}>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium">
          Total Supplied:
        </Text>
        <Text fontSize="sm">{pool.totalSupply}</Text>
      </HStack>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium">
          Total Borrowed:
        </Text>
        <Text fontSize="sm">{pool.totalBorrow}</Text>
      </HStack>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium">
          Utilization Rate:
        </Text>
        <Badge
          colorScheme={
            pool.utilizationRate > 80 ? 'red' : pool.utilizationRate > 60 ? 'yellow' : 'green'
          }
        >
          {pool.utilizationRate.toFixed(1)}%
        </Badge>
      </HStack>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium">
          Collateral Factor:
        </Text>
        <Text fontSize="sm">{(pool.collateralFactor * 100).toFixed(0)}%</Text>
      </HStack>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium">
          Liquidation Threshold:
        </Text>
        <Text fontSize="sm">{(pool.liquidationThreshold * 100).toFixed(0)}%</Text>
      </HStack>
    </VStack>
  </ProgressiveDisclosure>
);

export const RiskWarning: React.FC<{
  healthFactor?: number;
  liquidationPrice?: string;
  warnings: string[];
}> = ({ healthFactor, liquidationPrice, warnings }) => (
  <ProgressiveDisclosure
    title="Risk Assessment"
    summary={
      healthFactor ? `Health Factor: ${healthFactor.toFixed(2)}` : 'Review risks before proceeding'
    }
    variant="warning"
    badge="Important"
    badgeColor="orange"
  >
    <VStack align="stretch" spacing={3}>
      {healthFactor && (
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="medium">
            Health Factor:
          </Text>
          <Badge colorScheme={healthFactor > 2 ? 'green' : healthFactor > 1.2 ? 'yellow' : 'red'}>
            {healthFactor === 999 ? '∞' : healthFactor.toFixed(2)}
          </Badge>
        </HStack>
      )}

      {liquidationPrice && (
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="medium">
            Liquidation Price:
          </Text>
          <Text fontSize="sm" color="red.500">
            {liquidationPrice}
          </Text>
        </HStack>
      )}

      <Divider />

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2} color="orange.600">
          Risk Factors:
        </Text>
        <VStack align="stretch" spacing={1}>
          {warnings.map((warning, index) => (
            <Text key={index} fontSize="xs" color="orange.600">
              ⚠️ {warning}
            </Text>
          ))}
        </VStack>
      </Box>
    </VStack>
  </ProgressiveDisclosure>
);
