import React from 'react';
import {
  Box,
  Badge,
  Text,
  VStack,
  HStack,
  Link,
  Alert,
  AlertIcon,
  Code,
  Divider,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { blendIntegration } from '../../lib/blend/blendIntegration';

export const LiveContractStatus: React.FC = () => {
  const contractInfo = blendIntegration.getContractInfo();

  return (
    <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            Protocol Status
          </Text>
          <Badge colorScheme="green" size="lg">
            ACTIVE
          </Badge>
        </HStack>

        <Alert status="success" size="sm">
          <AlertIcon />
          Connected to Blend Protocol and YieldBlox on Stellar mainnet
        </Alert>

        <Divider />

        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Pool Contract:
            </Text>
            <Link href={contractInfo.explorerUrl} isExternal fontSize="xs" color="blue.500">
              <Code>
                {contractInfo.poolContract.slice(0, 8)}...{contractInfo.poolContract.slice(-8)}
              </Code>
              <ExternalLinkIcon mx="2px" />
            </Link>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium">
              YieldBlox Pool:
            </Text>
            <Link
              href="https://stellar.expert/explorer/public/contract/CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFS"
              isExternal
              fontSize="xs"
              color="blue.500"
            >
              <Code>CCCCIQSD...IYOGYFS</Code>
              <ExternalLinkIcon mx="2px" />
            </Link>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Oracle Contract:
            </Text>
            <Code fontSize="xs">
              {contractInfo.oracleContract.slice(0, 8)}...{contractInfo.oracleContract.slice(-8)}
            </Code>
          </HStack>
        </VStack>

        <Divider />

        <HStack spacing={4}>
          <Link href={contractInfo.explorerUrl} isExternal fontSize="sm" color="blue.500">
            View on Stellar Expert <ExternalLinkIcon mx="2px" />
          </Link>
          <Link href={contractInfo.dashboardUrl} isExternal fontSize="sm" color="blue.500">
            Blend Dashboard <ExternalLinkIcon mx="2px" />
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};
