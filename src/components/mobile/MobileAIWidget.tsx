import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  VStack,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import { RiRobotLine } from 'react-icons/ri';
import { AIAgentChat } from '../ai/AIAgentChat';
import { useAIAgent } from '../../lib/ai/stellarAIAgent';

export const MobileAIWidget: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { messages } = useAIAgent();
  const [_hasNewMessage] = useState(false);

  // Quick AI suggestions for mobile
  const quickSuggestions = [
    "What's my portfolio worth?",
    "Best yield opportunity?",
    "Should I buy XLM now?",
    "Set up weekly DCA"
  ];

  const handleQuickSuggestion = (_suggestion: string) => {
    onOpen();
    // The suggestion will be auto-filled when the chat opens
  };

  return (
    <>
      {/* Floating AI Button */}
      <Box
        position="fixed"
        bottom="90px" // Above bottom navigation
        right="16px"
        zIndex={1000}
      >
        <IconButton
          aria-label="AI Assistant"
          icon={
            <Box position="relative">
              <RiRobotLine size={24} />
              {_hasNewMessage && (
                <Badge
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  colorScheme="red"
                  borderRadius="full"
                  boxSize="8px"
                  p={0}
                />
              )}
            </Box>
          }
          onClick={onOpen}
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          shadow="lg"
          _hover={{ transform: 'scale(1.05)' }}
          transition="all 0.2s"
        />
      </Box>

      {/* AI Chat Drawer */}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px" maxH="90vh">
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack>
              <RiRobotLine size={24} color="#3182ce" />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">AI Assistant</Text>
                <Text fontSize="sm" color="gray.600">
                  Your Stellar DeFi helper
                </Text>
              </VStack>
            </HStack>
          </DrawerHeader>

          <DrawerBody p={0}>
            {messages.length === 0 && (
              <VStack spacing={4} p={4}>
                <Text color="gray.600" textAlign="center">
                  Quick suggestions to get started:
                </Text>
                <VStack spacing={2} w="full">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      w="full"
                      onClick={() => handleQuickSuggestion(suggestion)}
                      leftIcon={<FiMessageCircle />}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </VStack>
              </VStack>
            )}
            <AIAgentChat />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
