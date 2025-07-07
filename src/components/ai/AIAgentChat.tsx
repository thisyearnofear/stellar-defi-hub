import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Flex,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FiSend, FiUser } from 'react-icons/fi';
import { RiRobotLine } from 'react-icons/ri';
import { useAIAgent } from '../../lib/ai/stellarAIAgent';

export const AIAgentChat: React.FC = () => {
  const { messages, isProcessing, sendMessage } = useAIAgent();
  const [inputValue, setInputValue] = useState('');
  const toast = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    try {
      await sendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  return (
    <Flex direction="column" h="full" maxH="70vh">
      {/* Messages */}
      <Box flex={1} overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {messages.length === 0 && (
            <Box textAlign="center" py={8}>
              <RiRobotLine size={48} color="#CBD5E0" />
              <Text color="gray.500" mt={4}>
                Hi! I&apos;m your Stellar DeFi assistant. Ask me anything about your portfolio, trading, or DeFi opportunities.
              </Text>
            </Box>
          )}

          {messages.map((message) => (
            <HStack
              key={message.id}
              align="start"
              justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
              spacing={3}
            >
              {message.type !== 'user' && (
                <Avatar size="sm" icon={<RiRobotLine />} bg="blue.500" />
              )}

              <Box
                maxW="80%"
                bg={message.type === 'user' ? 'blue.500' : 'gray.100'}
                color={message.type === 'user' ? 'white' : 'gray.800'}
                px={4}
                py={3}
                borderRadius="lg"
                borderBottomRightRadius={message.type === 'user' ? 'sm' : 'lg'}
                borderBottomLeftRadius={message.type === 'user' ? 'lg' : 'sm'}
              >
                <Text fontSize="sm">{message.content}</Text>
                <Text
                  fontSize="xs"
                  opacity={0.7}
                  mt={1}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </Box>

              {message.type === 'user' && (
                <Avatar size="sm" icon={<FiUser />} bg="gray.500" />
              )}
            </HStack>
          ))}

          {isProcessing && (
            <HStack align="start" spacing={3}>
              <Avatar size="sm" icon={<RiRobotLine />} bg="blue.500" />
              <Box bg="gray.100" px={4} py={3} borderRadius="lg" borderBottomLeftRadius="sm">
                <HStack spacing={2}>
                  <Spinner size="sm" />
                  <Text fontSize="sm" color="gray.600">Thinking...</Text>
                </HStack>
              </Box>
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Input */}
      <Box p={4} borderTop="1px" borderColor="gray.200">
        <HStack spacing={2}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your portfolio, trading, or DeFi..."
            size="md"
            isDisabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            isLoading={isProcessing}
            isDisabled={!inputValue.trim()}
            colorScheme="blue"
            size="md"
            leftIcon={<FiSend />}
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};
