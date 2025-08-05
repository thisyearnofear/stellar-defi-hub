import React from 'react';
import { Box, Text, Card } from '@chakra-ui/react';
import 'twin.macro';

export interface GreeterContractInteractionsProps {}

export const GreeterContractInteractions: React.FC<GreeterContractInteractionsProps> = () => {
  return (
    <Box tw="flex w-full flex-col items-center justify-center space-y-8 max-w-[22rem]">
      <Card tw="p-6 text-center">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Smart Contract Integration
        </Text>
        <Text fontSize="sm" color="gray.600">
          This feature is currently being updated for the new Syndicate AI platform. Contract
          interactions will be available in a future update.
        </Text>
      </Card>
    </Box>
  );
};
