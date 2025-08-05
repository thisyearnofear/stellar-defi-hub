import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Badge,
  Button,
  Switch,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiPlay, FiPause, FiTrash2, FiPlus, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { AutomationStrategy, useAIAgent } from '../../lib/ai/stellarAIAgent';
import { automationEngine } from '../../lib/automation/automationEngine';

export const AutomationDashboard: React.FC = () => {
  const [strategies, setStrategies] = useState<AutomationStrategy[]>([]);
  const [stats, setStats] = useState({
    activeStrategies: 0,
    totalExecutions: 0,
    successRate: 0,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newStrategyDescription, setNewStrategyDescription] = useState('');
  const { agent } = useAIAgent();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const allStrategies = automationEngine.getAllStrategies();
      setStrategies(allStrategies);

      setStats({
        activeStrategies: automationEngine.getActiveStrategiesCount(),
        totalExecutions: automationEngine.getTotalExecutions(),
        successRate: automationEngine.getSuccessRate(),
      });
    } catch (error) {
      console.error('Failed to load automation data:', error);
    }
  };

  const handleCreateStrategy = async () => {
    if (!newStrategyDescription.trim()) return;

    try {
      const strategy = await agent.createAutomation(newStrategyDescription);
      automationEngine.addStrategy(strategy);
      setNewStrategyDescription('');
      onClose();
      loadData();
    } catch (error) {
      console.error('Failed to create strategy:', error);
    }
  };

  const toggleStrategy = (strategyId: string) => {
    const strategy = automationEngine.getStrategy(strategyId);
    if (strategy) {
      strategy.isActive = !strategy.isActive;
      loadData();
    }
  };

  const deleteStrategy = (strategyId: string) => {
    automationEngine.removeStrategy(strategyId);
    loadData();
  };

  const getStrategyStatusColor = (strategy: AutomationStrategy) => {
    if (!strategy.isActive) return 'gray';

    const executions = automationEngine.getExecutionHistory(strategy.id);
    const recentExecution = executions[executions.length - 1];

    if (!recentExecution) return 'blue';
    if (recentExecution.status === 'success') return 'green';
    if (recentExecution.status === 'failed') return 'red';
    return 'yellow';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Box p={isMobile ? 4 : 6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold">
              Automation Dashboard
            </Text>
            <Text color="gray.600">Manage your DeFi strategies</Text>
          </VStack>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
            New Strategy
          </Button>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card p={4}>
            <Stat>
              <StatLabel>Active Strategies</StatLabel>
              <StatNumber>{stats.activeStrategies}</StatNumber>
              <StatHelpText>
                <HStack>
                  <FiActivity />
                  <Text>Running automatically</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </Card>

          <Card p={4}>
            <Stat>
              <StatLabel>Total Executions</StatLabel>
              <StatNumber>{stats.totalExecutions}</StatNumber>
              <StatHelpText>
                <HStack>
                  <FiTrendingUp />
                  <Text>All time</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </Card>

          <Card p={4}>
            <Stat>
              <StatLabel>Success Rate</StatLabel>
              <StatNumber>{stats.successRate.toFixed(1)}%</StatNumber>
              <StatHelpText color={stats.successRate > 90 ? 'green.500' : 'orange.500'}>
                {stats.successRate > 90 ? 'Excellent' : 'Good'}
              </StatHelpText>
            </Stat>
          </Card>
        </SimpleGrid>

        {/* Strategies List */}
        <Card>
          <Box p={4} borderBottom="1px" borderColor="gray.200">
            <Text fontSize="lg" fontWeight="semibold">
              Your Strategies
            </Text>
          </Box>

          {strategies.length === 0 ? (
            <Box p={8} textAlign="center">
              <Text color="gray.500" mb={4}>
                No automation strategies yet
              </Text>
              <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
                Create Your First Strategy
              </Button>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Strategy</Th>
                    <Th>Status</Th>
                    <Th>Created</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {strategies.map((strategy) => (
                    <Tr key={strategy.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{strategy.name}</Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {strategy.description}
                          </Text>
                          <HStack spacing={1}>
                            {strategy.conditions.slice(0, 2).map((condition, index) => (
                              <Badge key={index} size="sm" variant="outline">
                                {condition.length > 20 ? `${condition.slice(0, 20)}...` : condition}
                              </Badge>
                            ))}
                          </HStack>
                        </VStack>
                      </Td>

                      <Td>
                        <HStack>
                          <Badge colorScheme={getStrategyStatusColor(strategy)}>
                            {strategy.isActive ? 'Active' : 'Paused'}
                          </Badge>
                          <Switch
                            isChecked={strategy.isActive}
                            onChange={() => toggleStrategy(strategy.id)}
                            size="sm"
                          />
                        </HStack>
                      </Td>

                      <Td>
                        <Text fontSize="sm">{formatDate(strategy.createdAt)}</Text>
                      </Td>

                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label={strategy.isActive ? 'Pause' : 'Resume'}
                            icon={strategy.isActive ? <FiPause /> : <FiPlay />}
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStrategy(strategy.id)}
                          />
                          <IconButton
                            aria-label="Delete"
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            onClick={() => deleteStrategy(strategy.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Card>
      </VStack>

      {/* Create Strategy Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Automation Strategy</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="full">
                <Text mb={2} fontWeight="medium">
                  Describe your strategy:
                </Text>
                <Textarea
                  value={newStrategyDescription}
                  onChange={(e) => setNewStrategyDescription(e.target.value)}
                  placeholder="e.g., 'Buy $100 of XLM every week' or 'Rebalance my portfolio monthly to 60% XLM, 40% USDC'"
                  rows={4}
                />
              </Box>

              <Box w="full">
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Examples:
                </Text>
                <VStack spacing={1} align="start">
                  <Text fontSize="sm" color="gray.500">
                    • "Set up weekly DCA of $100 into XLM"
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    • "Alert me if XLM drops below $0.10"
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    • "Rebalance portfolio monthly"
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    • "Take profit if portfolio gains 50%"
                  </Text>
                </VStack>
              </Box>

              <HStack spacing={3} w="full" justify="end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleCreateStrategy}
                  isDisabled={!newStrategyDescription.trim()}
                >
                  Create Strategy
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
