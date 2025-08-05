import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  Progress,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Divider,
} from '@chakra-ui/react';
import { FiArrowRight, FiCheck, FiStar, FiTrendingUp, FiShield } from 'react-icons/fi';
import { RiRobotLine } from 'react-icons/ri';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface UserProfile {
  experience: 'beginner' | 'intermediate' | 'advanced';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  goals: string[];
  investmentAmount: number;
  timeHorizon: 'short' | 'medium' | 'long';
  preferredAssets: string[];
}

// Individual Step Components
const WelcomeStep: React.FC = () => (
  <VStack spacing={6} textAlign="center">
    <Box fontSize="6xl">🤖</Box>
    <VStack spacing={4}>
      <Text fontSize="lg">
        You&apos;re about to experience the future of DeFi with AI-powered assistance!
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
        <Card p={4} textAlign="center">
          <VStack spacing={2}>
            <RiRobotLine size={24} color="#3182ce" />
            <Text fontWeight="bold">Smart Analysis</Text>
            <Text fontSize="sm" color="gray.600">
              AI analyzes your portfolio and suggests optimizations
            </Text>
          </VStack>
        </Card>

        <Card p={4} textAlign="center">
          <VStack spacing={2}>
            <FiTrendingUp size={24} color="#38a169" />
            <Text fontWeight="bold">Auto Execution</Text>
            <Text fontSize="sm" color="gray.600">
              Set up strategies that run automatically
            </Text>
          </VStack>
        </Card>

        <Card p={4} textAlign="center">
          <VStack spacing={2}>
            <FiShield size={24} color="#d69e2e" />
            <Text fontWeight="bold">Risk Management</Text>
            <Text fontSize="sm" color="gray.600">
              AI monitors and protects your investments
            </Text>
          </VStack>
        </Card>
      </SimpleGrid>
    </VStack>
  </VStack>
);

const ExperienceStep: React.FC<{
  profile: Partial<UserProfile>;
  setProfile: (profile: Partial<UserProfile>) => void;
}> = ({ profile, setProfile }) => {
  const experiences = [
    {
      level: 'beginner' as const,
      title: 'New to DeFi',
      description: "I'm just getting started with decentralized finance",
      icon: '🌱',
    },
    {
      level: 'intermediate' as const,
      title: 'Some Experience',
      description: "I've used DeFi before and understand the basics",
      icon: '🚀',
    },
    {
      level: 'advanced' as const,
      title: 'DeFi Expert',
      description: "I'm experienced with complex DeFi strategies",
      icon: '⚡',
    },
  ];

  return (
    <VStack spacing={4}>
      {experiences.map((exp) => (
        <Card
          key={exp.level}
          p={5}
          w="full"
          cursor="pointer"
          border="2px"
          borderColor={profile.experience === exp.level ? 'blue.500' : 'gray.300'}
          bg={profile.experience === exp.level ? 'blue.600' : 'gray.50'}
          onClick={() => setProfile({ ...profile, experience: exp.level })}
          _hover={{
            borderColor: 'blue.400',
            bg: profile.experience === exp.level ? 'blue.700' : 'gray.100',
          }}
        >
          <HStack spacing={4}>
            <Box
              fontSize="3xl"
              w="60px"
              h="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="white"
              borderRadius="lg"
              border="2px"
              borderColor={profile.experience === exp.level ? 'white' : 'gray.200'}
            >
              {exp.icon}
            </Box>
            <VStack align="start" spacing={1} flex={1}>
              <Text
                fontWeight="bold"
                fontSize="xl"
                color={profile.experience === exp.level ? 'white' : 'gray.800'}
              >
                {exp.title}
              </Text>
              <Text fontSize="md" color={profile.experience === exp.level ? 'white' : 'gray.600'}>
                {exp.description}
              </Text>
            </VStack>
            {profile.experience === exp.level && <FiCheck size={24} color="white" />}
          </HStack>
        </Card>
      ))}
    </VStack>
  );
};

const GoalsStep: React.FC<{
  profile: Partial<UserProfile>;
  setProfile: (profile: Partial<UserProfile>) => void;
}> = ({ profile, setProfile }) => {
  const goals = [
    { id: 'yield', label: 'Earn Passive Income', icon: '💰' },
    { id: 'growth', label: 'Long-term Growth', icon: '📈' },
    { id: 'diversify', label: 'Diversify Portfolio', icon: '🎯' },
    { id: 'learn', label: 'Learn About DeFi', icon: '📚' },
    { id: 'automate', label: 'Automate Investing', icon: '🤖' },
    { id: 'preserve', label: 'Preserve Capital', icon: '🛡️' },
  ];

  const toggleGoal = (goalId: string) => {
    const currentGoals = profile.goals ?? [];
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((g) => g !== goalId)
      : [...currentGoals, goalId];
    setProfile({ ...profile, goals: newGoals });
  };

  return (
    <VStack spacing={4}>
      <Text textAlign="center" color="gray.600">
        Select all that apply (you can choose multiple):
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="full">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            p={5}
            cursor="pointer"
            border="2px"
            borderColor={profile.goals?.includes(goal.id) ? 'blue.500' : 'gray.300'}
            bg={profile.goals?.includes(goal.id) ? 'blue.600' : 'gray.50'}
            onClick={() => toggleGoal(goal.id)}
            _hover={{
              borderColor: 'blue.400',
              bg: profile.goals?.includes(goal.id) ? 'blue.700' : 'gray.100',
            }}
          >
            <VStack spacing={3} align="start">
              <HStack spacing={4} w="full">
                <Box
                  fontSize="3xl"
                  w="50px"
                  h="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="white"
                  borderRadius="lg"
                  border="2px"
                  borderColor={profile.goals?.includes(goal.id) ? 'white' : 'gray.200'}
                >
                  {goal.icon}
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={profile.goals?.includes(goal.id) ? 'white' : 'gray.800'}
                  >
                    {goal.label}
                  </Text>
                  <Text
                    fontSize="sm"
                    color={profile.goals?.includes(goal.id) ? 'rgba(255,255,255,0.9)' : 'gray.600'}
                  >
                    {goal.id === 'yield' && 'Generate steady returns through staking and lending'}
                    {goal.id === 'growth' && 'Build wealth over time with strategic investments'}
                    {goal.id === 'diversify' && 'Spread risk across different assets and protocols'}
                    {goal.id === 'learn' && 'Understand DeFi concepts and strategies'}
                    {goal.id === 'automate' && 'Set up hands-off investment strategies'}
                    {goal.id === 'preserve' && 'Protect your capital with low-risk options'}
                  </Text>
                </VStack>
                {profile.goals?.includes(goal.id) && <FiCheck size={24} color="white" />}
              </HStack>
            </VStack>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

const RiskStep: React.FC<{
  profile: Partial<UserProfile>;
  setProfile: (profile: Partial<UserProfile>) => void;
}> = ({ profile, setProfile }) => {
  const riskLevels = [
    {
      level: 'conservative' as const,
      title: 'Conservative',
      description: 'I prefer stable returns with minimal risk',
      color: 'green',
      icon: '🛡️',
    },
    {
      level: 'moderate' as const,
      title: 'Moderate',
      description: "I'm comfortable with some risk for better returns",
      color: 'yellow',
      icon: '⚖️',
    },
    {
      level: 'aggressive' as const,
      title: 'Aggressive',
      description: "I'm willing to take high risks for high rewards",
      color: 'red',
      icon: '🚀',
    },
  ];

  return (
    <VStack spacing={4}>
      {riskLevels.map((risk) => (
        <Card
          key={risk.level}
          p={5}
          w="full"
          cursor="pointer"
          border="2px"
          borderColor={profile.riskTolerance === risk.level ? `${risk.color}.500` : 'gray.300'}
          bg={profile.riskTolerance === risk.level ? `${risk.color}.600` : 'gray.50'}
          onClick={() => setProfile({ ...profile, riskTolerance: risk.level })}
          _hover={{
            borderColor: `${risk.color}.400`,
            bg: profile.riskTolerance === risk.level ? `${risk.color}.700` : 'gray.100',
          }}
        >
          <HStack spacing={4}>
            <Box
              fontSize="3xl"
              w="60px"
              h="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={profile.riskTolerance === risk.level ? 'white' : 'white'}
              borderRadius="lg"
              border="2px"
              borderColor={profile.riskTolerance === risk.level ? 'white' : 'gray.200'}
            >
              {risk.icon}
            </Box>
            <VStack align="start" spacing={1} flex={1}>
              <Text
                fontWeight="bold"
                fontSize="xl"
                color={profile.riskTolerance === risk.level ? 'white' : 'gray.800'}
              >
                {risk.title}
              </Text>
              <Text
                fontSize="md"
                color={profile.riskTolerance === risk.level ? 'white' : 'gray.600'}
              >
                {risk.description}
              </Text>
            </VStack>
            {profile.riskTolerance === risk.level && <FiCheck size={24} color="white" />}
          </HStack>
        </Card>
      ))}
    </VStack>
  );
};

const PortfolioStep: React.FC<{
  profile: Partial<UserProfile>;
  setProfile: (profile: Partial<UserProfile>) => void;
}> = ({ profile, setProfile }) => {
  const assets = ['XLM', 'USDC', 'yXLM', 'AQUA'];

  const toggleAsset = (asset: string) => {
    const currentAssets = profile.preferredAssets ?? [];
    const newAssets = currentAssets.includes(asset)
      ? currentAssets.filter((a) => a !== asset)
      : [...currentAssets, asset];
    setProfile({ ...profile, preferredAssets: newAssets });
  };

  return (
    <VStack spacing={6}>
      <VStack spacing={4} w="full">
        <Text fontWeight="bold">Initial Investment Amount</Text>
        <VStack spacing={2} w="full">
          <Slider
            value={profile.investmentAmount ?? 1000}
            onChange={(value) => setProfile({ ...profile, investmentAmount: value })}
            min={100}
            max={10000}
            step={100}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text fontSize="lg" fontWeight="bold" color="blue.500">
            ${(profile.investmentAmount ?? 1000).toLocaleString()}
          </Text>
        </VStack>
      </VStack>

      <Divider />

      <VStack spacing={4} w="full">
        <Text fontWeight="bold">Preferred Assets</Text>
        <SimpleGrid columns={2} spacing={3} w="full">
          {assets.map((asset) => (
            <Card
              key={asset}
              p={4}
              cursor="pointer"
              border="2px"
              borderColor={profile.preferredAssets?.includes(asset) ? 'blue.500' : 'gray.300'}
              bg={profile.preferredAssets?.includes(asset) ? 'blue.600' : 'gray.50'}
              onClick={() => toggleAsset(asset)}
              _hover={{
                borderColor: 'blue.400',
                bg: profile.preferredAssets?.includes(asset) ? 'blue.700' : 'gray.100',
              }}
            >
              <HStack justify="space-between">
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color={profile.preferredAssets?.includes(asset) ? 'white' : 'gray.800'}
                >
                  {asset}
                </Text>
                {profile.preferredAssets?.includes(asset) && <FiCheck size={20} color="white" />}
              </HStack>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>

      <VStack spacing={4} w="full">
        <Text fontWeight="bold">Investment Timeline</Text>
        <VStack spacing={3} w="full">
          {[
            { value: 'short', label: 'Short-term (< 1 year)' },
            { value: 'medium', label: 'Medium-term (1-3 years)' },
            { value: 'long', label: 'Long-term (3+ years)' },
          ].map((option) => (
            <Card
              key={option.value}
              p={4}
              w="full"
              cursor="pointer"
              border="2px"
              borderColor={profile.timeHorizon === option.value ? 'blue.500' : 'gray.300'}
              bg={profile.timeHorizon === option.value ? 'blue.600' : 'gray.50'}
              onClick={() => setProfile({ ...profile, timeHorizon: option.value as any })}
              _hover={{
                borderColor: 'blue.400',
                bg: profile.timeHorizon === option.value ? 'blue.700' : 'gray.100',
              }}
            >
              <HStack justify="space-between">
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  color={profile.timeHorizon === option.value ? 'white' : 'gray.800'}
                >
                  {option.label}
                </Text>
                {profile.timeHorizon === option.value && <FiCheck size={20} color="white" />}
              </HStack>
            </Card>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
};

const AIDemoStep: React.FC<{ profile: Partial<UserProfile> }> = ({ profile }) => {
  const [demoMessages, setDemoMessages] = useState<string[]>([]);
  const [currentDemo, setCurrentDemo] = useState(0);

  const demos = [
    {
      title: 'Portfolio Analysis',
      message: 'Analyze my portfolio and suggest optimizations',
      response: `Based on your ${profile.riskTolerance} risk profile and $${profile.investmentAmount?.toLocaleString()} investment, I recommend a balanced approach with ${profile.preferredAssets?.join(', ')}. Your current allocation could be optimized for better yields.`,
    },
    {
      title: 'Yield Opportunities',
      message: "What's the best yield opportunity right now?",
      response:
        'For your conservative approach, Blend Protocol offers 8.2% APY on XLM with minimal risk. I can set up automatic lending for you.',
    },
    {
      title: 'Automation Setup',
      message: 'Set up weekly DCA of $100 into XLM',
      response:
        "Perfect! I'll create an automation strategy to purchase $100 of XLM every week. This will help you average your entry price over time.",
    },
  ];

  const runDemo = (index: number) => {
    setCurrentDemo(index);
    setDemoMessages([demos[index].message, demos[index].response]);
  };

  return (
    <VStack spacing={6}>
      <Text textAlign="center" color="gray.600">
        Here&apos;s how your AI assistant will help you based on your preferences:
      </Text>

      <SimpleGrid columns={1} spacing={3} w="full">
        {demos.map((demo, index) => (
          <Card
            key={index}
            p={4}
            cursor="pointer"
            border="2px"
            borderColor={currentDemo === index ? 'blue.500' : 'gray.200'}
            onClick={() => runDemo(index)}
            _hover={{ borderColor: 'blue.300' }}
          >
            <HStack justify="space-between">
              <Text fontWeight="medium">{demo.title}</Text>
              <Button size="sm" colorScheme="blue" variant="outline">
                Try Demo
              </Button>
            </HStack>
          </Card>
        ))}
      </SimpleGrid>

      {demoMessages.length > 0 && (
        <Card p={6} w="full" bg="white" border="2px" borderColor="blue.200" shadow="lg">
          <VStack spacing={4} align="stretch">
            <HStack>
              <Box p={2} bg="blue.100" borderRadius="full">
                <RiRobotLine color="#2B6CB0" size={20} />
              </Box>
              <Text fontWeight="bold" fontSize="lg" color="blue.700">
                AI Demo
              </Text>
            </HStack>

            <Box bg="blue.600" p={4} borderRadius="lg" border="2px" borderColor="blue.700">
              <Text fontSize="md" fontWeight="medium" color="white">
                You: {demoMessages[0]}
              </Text>
            </Box>

            <Box bg="gray.100" p={4} borderRadius="lg" border="2px" borderColor="gray.300">
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                AI: {demoMessages[1]}
              </Text>
            </Box>
          </VStack>
        </Card>
      )}

      <Card p={6} w="full" bg="green.600" border="2px" borderColor="green.700" shadow="lg">
        <HStack spacing={4}>
          <Box p={2} bg="white" borderRadius="full">
            <FiStar color="#16A34A" size={24} />
          </Box>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" color="white">
              You&apos;re all set!
            </Text>
            <Text fontSize="md" color="green.100">
              Your AI assistant is configured and ready to help you achieve your DeFi goals.
            </Text>
          </VStack>
        </HStack>
      </Card>
    </VStack>
  );
};

export const AIOnboarding: React.FC<{ onComplete: (profile: UserProfile) => void }> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AI-Powered DeFi',
      description: 'Meet your personal Stellar DeFi assistant',
      component: <WelcomeStep />,
    },
    {
      id: 'experience',
      title: 'Your DeFi Experience',
      description: 'Help us understand your background',
      component: <ExperienceStep profile={profile} setProfile={setProfile} />,
    },
    {
      id: 'goals',
      title: 'Investment Goals',
      description: 'What do you want to achieve?',
      component: <GoalsStep profile={profile} setProfile={setProfile} />,
    },
    {
      id: 'risk',
      title: 'Risk Preferences',
      description: 'How much risk are you comfortable with?',
      component: <RiskStep profile={profile} setProfile={setProfile} />,
    },
    {
      id: 'portfolio',
      title: 'Portfolio Setup',
      description: "Let's configure your initial strategy",
      component: <PortfolioStep profile={profile} setProfile={setProfile} />,
    },
    {
      id: 'ai-demo',
      title: 'AI Assistant Demo',
      description: 'See your AI assistant in action',
      component: <AIDemoStep profile={profile} />,
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile as UserProfile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStepData.id) {
      case 'welcome':
        return true;
      case 'experience':
        return !!profile.experience;
      case 'goals':
        return profile.goals && profile.goals.length > 0;
      case 'risk':
        return !!profile.riskTolerance;
      case 'portfolio':
        return (
          !!profile.investmentAmount &&
          profile.preferredAssets &&
          profile.preferredAssets.length > 0
        );
      case 'ai-demo':
        return true;
      default:
        return false;
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <VStack spacing={6}>
        {/* Progress Header */}
        <Box w="full">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.600">
              Step {currentStep + 1} of {steps.length}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {Math.round(progress)}% Complete
            </Text>
          </HStack>
          <Progress value={progress} colorScheme="blue" borderRadius="full" />
        </Box>

        {/* Step Content */}
        <Card w="full" p={8}>
          <VStack spacing={6}>
            <VStack spacing={2} textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                {currentStepData.title}
              </Text>
              <Text color="gray.600">{currentStepData.description}</Text>
            </VStack>

            <Box w="full">{currentStepData.component}</Box>

            {/* Navigation */}
            <HStack justify="space-between" w="full" pt={4}>
              <Button variant="outline" onClick={handlePrevious} isDisabled={currentStep === 0}>
                Previous
              </Button>

              <Button
                colorScheme="blue"
                onClick={handleNext}
                isDisabled={!isStepComplete()}
                rightIcon={currentStep === steps.length - 1 ? <FiCheck /> : <FiArrowRight />}
              >
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              </Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </Box>
  );
};
