import React from 'react';
import {
  Box,
  Alert,
  AlertIcon,
  Text,
  HStack,
  Badge,
  Link,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const ProductionBanner: React.FC = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, green.50, blue.50)',
    'linear(to-r, green.900, blue.900)'
  );

  return (
    <Box
      bgGradient={bgGradient}
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={useColorModeValue('green.200', 'green.600')}
      mb={6}
    >
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Badge colorScheme="green" size="lg" px={3} py={1}>
              MAINNET
            </Badge>
            <Text fontWeight="bold" fontSize="lg">
              Stellar Network
            </Text>
          </HStack>
          <Badge colorScheme="blue" variant="outline">
            Live Protocols
          </Badge>
        </HStack>

        <Alert status="info" size="sm" bg="transparent" p={0}>
          <AlertIcon />
          <VStack align="start" spacing={1} flex={1}>
            <Text fontSize="sm" fontWeight="medium">
              Connected to Stellar mainnet protocols
            </Text>
            <HStack spacing={4} fontSize="xs">
              <Link 
                href="https://stellar.expert/explorer/public/contract/CAJJZSGMMM3PD7N33TAPHGBUGTB43OC73HVIK2L2G6BNGGGYOSSYBXBD" 
                isExternal 
                color="blue.500"
              >
                Blend Pool <ExternalLinkIcon mx="1px" />
              </Link>
              <Link 
                href="https://stellar.expert/explorer/public/contract/CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFS" 
                isExternal 
                color="blue.500"
              >
                YieldBlox Pool <ExternalLinkIcon mx="1px" />
              </Link>
              <Link 
                href="https://mainnet.blend.capital/dashboard" 
                isExternal 
                color="blue.500"
              >
                Blend Dashboard <ExternalLinkIcon mx="1px" />
              </Link>
            </HStack>
          </VStack>
        </Alert>
      </VStack>
    </Box>
  );
};